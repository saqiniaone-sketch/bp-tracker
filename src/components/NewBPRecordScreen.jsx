import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ScrollNumberPicker } from "./ScrollNumberPicker";

// Full-screen "New record" view for blood pressure, matching the
// screenshot style: three scroll wheels (Systolic/Diastolic/Pulse),
// a live category badge, date/time, note, and a Save button.
// classify: your existing classify(sys, dia) function from App.jsx
export function NewBPRecordScreen({ onSave, onClose, classify }) {
  const [sys, setSys] = useState(120);
  const [dia, setDia] = useState(80);
  const [pulse, setPulse] = useState(72);
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState("");

  const cat = classify(sys, dia);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px" }}>
        <button onClick={onClose} style={iconBtnStyle}>
          <ArrowLeft size={22} color="#fff" />
        </button>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>New record</div>
        <button
          onClick={() => onSave({ sys, dia, pulse, when, note })}
          style={{ background: "#3E7FDB", color: "#fff", border: "none", borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Save
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 8px 20px" }}>
        <ScrollNumberPicker value={sys} onChange={setSys} min={50} max={260} label="Systolic" unit="mmHg" accentColor={cat.color} />
        <ScrollNumberPicker value={dia} onChange={setDia} min={30} max={200} label="Diastolic" unit="mmHg" accentColor={cat.color} />
        <ScrollNumberPicker value={pulse} onChange={setPulse} min={30} max={220} label="Pulse" unit="BPM" accentColor={cat.color} />
      </div>

      <div style={{ margin: "0 16px 16px", background: "#2B3B54", borderRadius: 16, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: cat.color }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{cat.label}</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#3A4C68", overflow: "hidden", display: "flex" }}>
          {["#4C8C6B", "#D9A544", "#D97B4F", "#C75146", "#8B2E3C"].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>

      <div style={{ margin: "0 16px 16px", background: "#2B3B54", borderRadius: 16, padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 700, marginBottom: 10 }}>
          <span>Date & Time</span>
        </div>
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", background: "#1B2B44", border: "1px solid #3A4C68", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 14 }}
        />
      </div>

      <div style={{ margin: "0 16px 32px", background: "#2B3B54", borderRadius: 16, padding: "16px" }}>
        <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>Note (optional)</div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. after a walk, before medication"
          style={{ width: "100%", boxSizing: "border-box", background: "#1B2B44", border: "1px solid #3A4C68", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 14 }}
        />
      </div>
    </div>
  );
}

const iconBtnStyle = { background: "none", border: "none", cursor: "pointer", padding: 4 };
