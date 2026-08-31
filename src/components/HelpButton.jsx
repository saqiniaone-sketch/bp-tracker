import { useState } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { FAQ_CONTENT, FAQ_LABELS } from "../utils/faqContent";

// A floating help button (bottom-right) that opens a simple FAQ panel.
// No AI, no API cost — just an accordion of common questions, bilingual.
export function HelpButton({ uiLanguage }) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const lang = uiLanguage === "ur" ? "ur" : "en";
  const isRTL = lang === "ur";
  const faqs = FAQ_CONTENT[lang];
  const labels = FAQ_LABELS[lang];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={labels.title}
        style={{
          position: "fixed",
          bottom: 24,
          insetInlineEnd: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#3E7FDB",
          border: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 150,
        }}
      >
        <HelpCircle size={26} color="#fff" />
      </button>

      {/* Panel */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 250, display: "flex", alignItems: "flex-end" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              background: "#1B2B44",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "20px 20px 0 0",
              padding: "18px 18px 32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: 0 }}>{labels.title}</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={22} color="#fff" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faqs.map((item, i) => {
                const isExpanded = expandedIdx === i;
                return (
                  <div key={i} style={{ background: "#2B3B54", borderRadius: 14, overflow: "hidden" }}>
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        background: "none",
                        border: "none",
                        padding: "14px 16px",
                        cursor: "pointer",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <span style={{ color: "#fff", fontSize: 14.5, fontWeight: 600 }}>{item.q}</span>
                      {isExpanded ? <ChevronUp size={18} color="#8C9A94" /> : <ChevronDown size={18} color="#8C9A94" />}
                    </button>
                    {isExpanded && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <p style={{ color: "#C6CFE0", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
