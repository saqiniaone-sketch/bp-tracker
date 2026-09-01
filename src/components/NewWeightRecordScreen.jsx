import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ScrollNumberPicker } from "./ScrollNumberPicker";
import { calculateBMI, classifyBMI } from "../utils/classifyBMI";

// Full-screen "New record" view for weight, matching the BP/Sugar record
// screens. Height is asked once and reused as the default next time
// (passed in as `lastHeightCm`), but can still be adjusted per entry.
export function NewWeightRecordScreen({ onSave, onClose, lastHeightCm }) {
  const [weight, setWeight] = useState(70.0);
  const [height, setHeight] = useState(lastHeightCm || 170);
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState("");

  const bmi = calculateBMI(weight, height);
  const cat = classifyBMI(bmi);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ArrowLeft size={22} color="#fff" />
        </button>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>New record</div>
        <button
          onClick={() => onSave({ weight, height, when, note })}
          style={{ background: "#3E7FDB", color: "#fff", border: "none", borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Save
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 8px 20px" }}>
        <ScrollNumberPicker value={weight} onChange={setWeight} step={0.1} min={20} max={250} label="Weight" unit="kg" accentColor={cat.color} />
        <ScrollNumberPicker value={height} onChange={setHeight} min={100} max={230} label="Height" unit="cm" accentColor={cat.color} />
      </div>

      <div style={{ margin: "0 16px 16px", background: "#2B3B54", borderRadius: 16, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: cat.color }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            BMI {bmi ? bmi.toFixed(1) : "--"} · {cat.label}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#3A4C68", overflow: "hidden", display: "flex" }}>
          {["#3E7C8C", "#4C8C6B", "#D9A544", "#C75146"].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>

      <div style={{ margin: "0 16px 16px", background: "#2B3B54", borderRadius: 16, padding: "16px" }}>
        <div style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>Date & Time</div>
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
          placeholder="e.g. morning weigh-in"
          style={{ width: "100%", boxSizing: "border-box", background: "#1B2B44", border: "1px solid #3A4C68", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 14 }}
        />
      </div>
    </div>
  );
}
