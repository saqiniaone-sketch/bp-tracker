import { ArrowLeft } from "lucide-react";
import { INFO_CONTENT, INFO_DISCLAIMER } from "../utils/infoContent";

// Full detail page for an Info & Knowledge card. Looks up real content by
// title from infoContent.js; falls back to a placeholder for any topic
// that hasn't been written yet.
export function InfoDetail({ title, onClose }) {
  const paragraphs = INFO_CONTENT[title];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto", padding: "18px 16px 40px" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginBottom: 16 }}>
        <ArrowLeft size={22} color="#fff" />
      </button>
      <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 16, lineHeight: 1.3 }}>{title}</h2>

      {paragraphs ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ color: "#D7DEEA", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              {p}
            </p>
          ))}
        </div>
      ) : (
        <p style={{ color: "#B7C3D6", fontSize: 15, lineHeight: 1.6 }}>
          Content for this article hasn't been written yet — add your own copy for "{title}" in src/utils/infoContent.js.
        </p>
      )}

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #2B3B54", fontSize: 12, color: "#7A8AA0", lineHeight: 1.5 }}>
        {INFO_DISCLAIMER}
      </div>
    </div>
  );
}
