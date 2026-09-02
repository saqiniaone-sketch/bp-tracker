import { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { classifyPulse } from "../utils/classifyPulse";
import { PulseScanner } from "./PulseScanner";

function fmtDateFull(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function PulseTracker({ session, showNewRecord, onCloseNewRecord, onSaved, showList = true }) {
  const [readings, setReadings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("pulse_readings")
      .select("*")
      .order("when_at", { ascending: false });
    if (!error) setReadings(data);
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (bpm) => {
    const { error } = await supabase.from("pulse_readings").insert({
      user_id: session.user.id,
      bpm,
      when_at: new Date().toISOString(),
    });
    if (!error) {
      await load();
      onSaved?.({ bpm });
    }
    onCloseNewRecord();
  };

  const deleteReading = async (id) => {
    await supabase.from("pulse_readings").delete().eq("id", id);
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      {showNewRecord && <PulseScanner onSave={handleSave} onClose={onCloseNewRecord} />}

      {showList && (
        <div style={{ padding: "20px 16px 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Calendar size={17} color="#fff" />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>Pulse history</span>
          </div>
          {!loaded ? (
            <div style={{ color: "#B7C3D6", fontSize: 14 }}>Loading…</div>
          ) : readings.length === 0 ? (
            <div style={{ color: "#B7C3D6", fontSize: 14 }}>No readings yet. Tap Record on the Home screen to scan your pulse.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {readings.map((r) => {
                const cat = classifyPulse(r.bpm);
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 6px", borderBottom: "1px solid #2B3B54" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: cat.color, flex: "0 0 auto" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 700, width: 70, color: "#fff", flex: "0 0 auto" }}>
                      {r.bpm} bpm
                    </div>
                    <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#fff" }}>{fmtDateFull(r.when_at)}</div>
                      <div style={{ fontSize: 12, color: "#8C9A94" }}>{cat.label}</div>
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
      )}
    </>
  );
}
