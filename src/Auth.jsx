import { useState } from "react";
import { supabase } from "./supabaseClient";
import { HeartPulse } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on its way. Check your inbox.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Account created. Check your email if confirmation is required, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#EEF2F0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <HeartPulse size={22} color="#C75146" />
          <span style={{ fontSize: 13, letterSpacing: "0.14em", color: "#4A5C6E", fontWeight: 600 }}>PRESSURE LOG</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, margin: "4px 0 20px", color: "#1B2B44" }}>
          {mode === "signin" ? "Welcome back" : mode === "forgot" ? "Reset your password" : "Create your account"}
        </h1>

        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: mode === "forgot" ? 16 : 12 }}>
            <div style={{ fontSize: 11, color: "#4A5C6E", marginBottom: 5 }}>Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>

          {mode !== "forgot" && (
            <label style={{ display: "block", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#4A5C6E", marginBottom: 5 }}>Password</div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="At least 6 characters"
              />
            </label>
          )}

          {mode === "signin" && (
            <div style={{ textAlign: "right", marginTop: -8, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => { setMode("forgot"); setError(""); setInfo(""); }}
                style={{ ...linkStyle, fontSize: 12 }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && <div style={{ color: "#C75146", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {info && <div style={{ color: "#4C8C6B", fontSize: 13, marginBottom: 12 }}>{info}</div>}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: "100%",
              background: "#1B2B44",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "forgot" ? "Send reset link" : "Sign up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#4A5C6E" }}>
          {mode === "signin" && (
            <>
              Don't have an account?{" "}
              <button onClick={() => { setMode("signup"); setError(""); setInfo(""); }} style={linkStyle}>
                Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("signin"); setError(""); setInfo(""); }} style={linkStyle}>
                Sign in
              </button>
            </>
          )}
          {mode === "forgot" && (
            <button onClick={() => { setMode("signin"); setError(""); setInfo(""); }} style={linkStyle}>
              Back to sign in
            </button>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#8C9A94" }}>
          Use the same email and password on your other devices to see the same readings everywhere.
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #DCE3DF",
  fontSize: 14,
  color: "#1B2B44",
  outline: "none",
  background: "#FBFCFB",
};

const linkStyle = {
  background: "none",
  border: "none",
  color: "#3E7C8C",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
};
