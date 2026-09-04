import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX, HeartPulse } from "lucide-react";
import { INFO_CONTENT, INFO_DISCLAIMER } from "../utils/infoContent";

// Full detail page for an Info & Knowledge card: a colored header banner
// (matching the card's color from Home) plus numbered, accent-bar
// section cards on a dark body — in English or Urdu, with a Listen button.
export function InfoDetail({ title, color = "#3E9E8F", onClose, uiLanguage, speak }) {
  const [speaking, setSpeaking] = useState(false);
  const lang = uiLanguage === "ur" ? "ur" : uiLanguage === "hi" ? "hi" : "en";
  const entry = INFO_CONTENT[title];
  const content = entry?.[lang];
  const disclaimer = INFO_DISCLAIMER[lang];
  const isRTL = lang === "ur";

  const handleListen = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    if (!content) return;
    setSpeaking(true);
    speak(content.spoken, lang === "ur" ? "ur-PK" : lang === "hi" ? "hi-IN" : "en-US");
    const check = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setSpeaking(false);
        clearInterval(check);
      }
    }, 300);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Colored header banner */}
      <div style={{ background: color, padding: "18px 20px 40px", position: "relative", borderRadius: "0 0 28px 28px" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginBottom: 20 }}>
          <ArrowLeft size={22} color="#fff" style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.25, maxWidth: "75%" }}>
            {title}
          </h1>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <HeartPulse size={28} color={color} />
          </div>
        </div>
      </div>

      {/* Listen button, floating just under the header */}
      {content && (
        <div style={{ display: "flex", justifyContent: isRTL ? "flex-start" : "flex-end", padding: "14px 20px 0" }}>
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
            {speaking
              ? lang === "ur" ? "روکیں" : lang === "hi" ? "रोकें" : "Stop"
              : lang === "ur" ? "سنیں" : lang === "hi" ? "सुनें" : "Listen"}
          </button>
        </div>
      )}

      {/* Numbered section cards */}
      <div style={{ padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        {content ? (
          content.sections.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#2B3B54",
                borderRadius: 16,
                padding: "18px 18px 18px 20px",
                borderInlineStart: `4px solid ${color}`,
              }}
            >
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.heading}</div>
              <p style={{ color: "#C6CFE0", fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#B7C3D6", fontSize: 15, lineHeight: 1.6 }}>
            Content for this article hasn't been written yet — add your own copy for "{title}" in src/utils/infoContent.js.
          </p>
        )}

        <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid #2B3B54", fontSize: 12, color: "#7A8AA0", lineHeight: 1.5 }}>
          {disclaimer}
        </div>
      </div>
    </div>
  );
}
