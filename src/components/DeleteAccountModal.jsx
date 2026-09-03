import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { supabase } from "../supabaseClient";

// Deletes all of the user's data across every tracker table, then signs
// them out. Requires typing DELETE to confirm, to prevent accidental taps.
export function DeleteAccountModal({ session, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    setError("");

    const userId = session.user.id;
    const tables = ["readings", "sugar_readings", "weight_readings", "pulse_readings", "walks"];

    try {
      for (const table of tables) {
        const { error: delErr } = await supabase.from(table).delete().eq("user_id", userId);
        if (delErr) throw delErr;
      }
      await supabase.auth.signOut();
      // signOut triggers the app's auth listener, which will redirect to
      // the sign-in screen automatically — no further action needed here.
    } catch (err) {
      setError("Something went wrong deleting your data: " + err.message);
      setDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: "#fff", borderRadius: 20, padding: "26px 24px", width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#FBEAEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={24} color="#C75146" />
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color="#4A5C6E" />
          </button>
        </div>

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#1B2B44", margin: "0 0 8px" }}>Delete your account data</h2>
        <p style={{ fontSize: 13.5, color: "#4A5C6E", lineHeight: 1.6, marginBottom: 4 }}>
          This permanently deletes all your blood pressure, blood sugar, weight, pulse, and walk records. This cannot be undone.
        </p>
        <p style={{ fontSize: 13.5, color: "#4A5C6E", lineHeight: 1.6, marginBottom: 18 }}>
          Your login itself will also be signed out. To fully remove your account credentials (email/password) from our system, email us afterward — see the Delete Account page for details.
        </p>

        <label style={{ display: "block", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#4A5C6E", marginBottom: 6 }}>Type DELETE to confirm</div>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: "1px solid #DCE3DF", fontSize: 14 }}
          />
        </label>

        {error && <div style={{ color: "#C75146", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#EEF2F0", color: "#1B2B44", border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            style={{
              flex: 1,
              background: canDelete ? "#C75146" : "#E8B9B4",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: canDelete && !deleting ? "pointer" : "default",
            }}
          >
            {deleting ? "Deleting…" : "Delete everything"}
          </button>
        </div>
      </div>
    </div>
  );
}
