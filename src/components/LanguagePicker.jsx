import { useState } from "react";
import { Heart } from "lucide-react";

// Shown once, the first time someone opens the app after install/signup.
// Calls onSelect("en" | "ur") and the parent should persist the choice
// (e.g. localStorage or a user profile field) so this doesn't show again.
export function LanguagePicker({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#EAF4FB",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 4px 14px rgba(62,127,219,0.2)",
        }}
      >
        <Heart size={34} color="#C75146" fill="#C75146" />
      </div>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#1B2B44", margin: "0 0 6px", textAlign: "center" }}>
        Choose your language
      </h1>
      <p style={{ color: "#4A5C6E", fontSize: 14, marginBottom: 32, textAlign: "center" }}>اپنی زبان منتخب کریں</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        {[
          { key: "en", label: "English" },
          { key: "ur", label: "اردو" },
          { key: "hi", label: "हिन्दी" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: 14,
              border: selected === opt.key ? "2px solid #3E7FDB" : "2px solid #DCE9F5",
              background: selected === opt.key ? "#DCEAFB" : "#fff",
              color: "#1B2B44",
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        style={{
          marginTop: 32,
          width: "100%",
          maxWidth: 320,
          background: selected ? "#3E7FDB" : "#B7CBE8",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: "15px 0",
          fontSize: 16,
          fontWeight: 700,
          cursor: selected ? "pointer" : "default",
        }}
      >
        Continue
      </button>
    </div>
  );
}
