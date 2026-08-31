import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { INFO_CONTENT, INFO_DISCLAIMER } from "../utils/infoContent";

// Full detail page for an Info & Knowledge card, in English or Urdu.
// `speak` is passed in from App.jsx (the same function used elsewhere
// for BP result read-aloud) so voice behaves consistently app-wide.
export function InfoDetail({ title, onClose, uiLanguage, speak }) {
  const [speaking, setSpeaking] = useState(false);
  const lang = uiLanguage === "ur" ? "ur" : "en";
  const entry = INFO_CONTENT[title];
  const content = entry?.[lang];
  const disclaimer = INFO_DISCLAIMER[lang];

  const handleListen = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    if (!content) return;
    setSpeaking(true);
    speak(content.spoken, lang === "ur" ? "ur-PK" : "en-US");
    const check = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setSpeaking(false);
        clearInterval(check);
      }
    }, 300);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto", padding: "18px 16px 40px" }}
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ArrowLeft size={22} color="#fff" style={{ transform: lang === "ur" ? "scaleX(-1)" : "none" }} />
        </button>
        {content && (
          <button
            onClick={handleListen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#2B3B54",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {speaking ? (lang === "ur" ? "روکیں" : "Stop") : lang === "ur" ? "سنیں" : "Listen"}
          </button>
        )}
      </div>

      <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 16, lineHeight: 1.3 }}>{title}</h2>

      {content ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {content.paragraphs.map((p, i) => (
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
        {disclaimer}
      </div>
    </div>
  );
}
