import { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { classifySugar } from "../utils/classifySugar";
import { NewSugarRecordScreen } from "./NewSugarRecordScreen";

function fmtDateFull(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// Renders the Sugar detail page (history list) and owns the full-screen
// "New record" flow. `session` is your existing Supabase auth session.
export function SugarTracker({ session, showNewRecord, onCloseNewRecord, onSaved }) {
  const [readings, setReadings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("sugar_readings")
      .select("*")
      .order("when_at", { ascending: false });
    if (!error) setReadings(data);
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async ({ value, condition, when, note }) => {
    const { error } = await supabase.from("sugar_readings").insert({
      user_id: session.user.id,
      value_mgdl: value,
      condition,
      when_at: new Date(when).toISOString(),
      note: note.trim(),
    });
    if (!error) {
      await load();
      onSaved?.({ value });
    }
    onCloseNewRecord();
  };

  const deleteReading = async (id) => {
    await supabase.from("sugar_readings").delete().eq("id", id);
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      {showNewRecord && <NewSugarRecordScreen onSave={handleSave} onClose={onCloseNewRecord} />}

      <div style={{ padding: "20px 16px 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Calendar size={17} color="#fff" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>Blood sugar history</span>
        </div>
        {!loaded ? (
          <div style={{ color: "#B7C3D6", fontSize: 14 }}>Loading…</div>
        ) : readings.length === 0 ? (
          <div style={{ color: "#B7C3D6", fontSize: 14 }}>No readings yet. Tap Record on the Home screen to add one.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {readings.map((r) => {
              const cat = classifySugar(r.value_mgdl);
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 6px", borderBottom: "1px solid #2B3B54" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: cat.color, flex: "0 0 auto" }} />
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 700, width: 70, color: "#fff", flex: "0 0 auto" }}>
                    {r.value_mgdl}
                  </div>
                  <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#fff" }}>{fmtDateFull(r.when_at)}</div>
                    <div style={{ fontSize: 12, color: "#8C9A94" }}>
                      {cat.label} · {r.condition}
                      {r.note ? ` · ${r.note}` : ""}
                    </div>
                  </div>
                  <button onClick={() => deleteReading(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#7A8AA0", padding: 6 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
