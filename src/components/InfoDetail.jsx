import { ArrowLeft } from "lucide-react";

// Simple placeholder detail page for an Info & Knowledge card.
// Replace `body` with real article content per title as you write it —
// this just gives you a working tap-through target for now.
export function InfoDetail({ title, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto", padding: "18px 16px" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginBottom: 16 }}>
        <ArrowLeft size={22} color="#fff" />
      </button>
      <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: "#B7C3D6", fontSize: 15, lineHeight: 1.6 }}>
        Content for this article hasn't been written yet — add your own copy here for "{title}".
      </p>
    </div>
  );
}
