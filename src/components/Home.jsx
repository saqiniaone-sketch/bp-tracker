import { ChevronRight, Gauge, Search, Home as HomeIcon, Footprints, Baby, UtensilsCrossed, Ban, Salad, ClipboardList, Heart } from "lucide-react";

const INFO_CARDS = [
  { title: "Normal Range of Blood Pressure", color: "#3E9E8F", icon: Gauge },
  { title: "What is Blood Pressure?", color: "#E0B02E", icon: HeartIcon },
  { title: "Find Your Blood Pressure Type", color: "#C7405A", icon: Search },
  { title: "Measure BP at Home", color: "#C7405A", icon: HomeIcon },
  { title: "Change Lifestyle to Fight Hypotension", color: "#3E9E5C", icon: Footprints },
  { title: "Know & Treat Gestational Hypertension", color: "#3E7FDB", icon: Baby },
  { title: "Avoid 9 Foods for Hypertension", color: "#E0B02E", icon: UtensilsCrossed },
  { title: "Avoid 5 Foods for Hypotension", color: "#3E9E8F", icon: Ban },
  { title: "Control Hypotension via Diet", color: "#C7405A", icon: Salad },
  { title: "Get Tests to Diagnose Hypertension", color: "#3E9E5C", icon: ClipboardList },
];

function HeartIcon({ size = 22, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

// Original illustration of a bathroom scale
function ScaleIllustration() {
  return (
    <svg width="52" height="46" viewBox="0 0 56 50" fill="none">
      <rect x="2" y="8" width="52" height="40" rx="10" fill="#fff" />
      <rect x="2" y="8" width="52" height="40" rx="10" fill="none" stroke="#CFE0F2" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="13" fill="#EAF4FB" stroke="#8FB4DC" strokeWidth="1.5" />
      <line x1="28" y1="28" x2="34" y2="21" stroke="#3E7FDB" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2" fill="#3E7FDB" />
      <rect x="20" y="4" width="16" height="6" rx="2" fill="#B9D4EC" />
    </svg>
  );
}

function BPCuffIllustration() {
  return (
    <svg width="60" height="48" viewBox="0 0 64 52" fill="none">
      <rect x="2" y="14" width="26" height="22" rx="6" fill="#B9D4EC" />
      <rect x="6" y="18" width="18" height="14" rx="3" fill="#8FB4DC" />
      <rect x="26" y="8" width="34" height="34" rx="8" fill="#fff" />
      <rect x="26" y="8" width="34" height="34" rx="8" fill="none" stroke="#CFE0F2" strokeWidth="1.5" />
      <rect x="32" y="14" width="22" height="14" rx="3" fill="#1B2B44" />
      <text x="43" y="24" textAnchor="middle" fontSize="8" fill="#4C8C6B" fontFamily="monospace" fontWeight="700">120/80</text>
      <circle cx="34" cy="35" r="3" fill="#C75146" />
      <path d="M28 22 C22 20, 18 24, 16 28" stroke="#8FB4DC" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function GlucometerIllustration() {
  return (
    <svg width="42" height="52" viewBox="0 0 46 58" fill="none">
      <path d="M23 4 C18 12, 8 24, 8 34 a15 15 0 0 0 30 0 c0 -10 -10 -22 -15 -30z" fill="#3E7FDB" opacity="0.2" />
      <rect x="10" y="16" width="26" height="34" rx="8" fill="#fff" />
      <rect x="10" y="16" width="26" height="34" rx="8" fill="none" stroke="#CFE0F2" strokeWidth="1.5" />
      <rect x="14" y="22" width="18" height="12" rx="2" fill="#1B2B44" />
      <text x="23" y="31" textAnchor="middle" fontSize="7.5" fill="#4C8C6B" fontFamily="monospace" fontWeight="700">100</text>
      <circle cx="23" cy="42" r="3" fill="#C75146" />
      <path d="M28 6 C25 10, 22 14, 22 17 a4 4 0 0 0 8 0 c0 -3 -3 -7 -6 -11z" fill="#C75146" />
    </svg>
  );
}

// Injects the pulse keyframe once per page (safe to call multiple times)
function ensurePulseKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("pulse-keyframes")) return;
  const style = document.createElement("style");
  style.id = "pulse-keyframes";
  style.textContent = `
    @keyframes heartbeat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.28); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 60% { transform: scale(1); } }
    @keyframes ecgmove { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }
  `;
  document.head.appendChild(style);
}

export function Home({ latestBP, latestSugar, latestWeight, onRecordBP, onRecordSugar, onRecordWeight, onOpenInfo }) {
  ensurePulseKeyframes();

  return (
    <div style={{ padding: "4px 0 90px" }}>
      {/* Current Focus hero card, live heartbeat */}
      <div
        style={{
          background: "linear-gradient(135deg, #4A9BE0 0%, #3E7FDB 100%)",
          borderRadius: 22,
          padding: "20px 20px 18px",
          marginBottom: 18,
          position: "relative",
          overflow: "hidden",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", opacity: 0.85, marginBottom: 4 }}>CURRENT FOCUS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Heart size={22} color="#fff" fill="#fff" style={{ animation: "heartbeat 1.1s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>Blood Pressure</span>
        </div>

        {/* Live ECG line */}
        <svg width="100%" height="34" viewBox="0 0 300 34" style={{ display: "block", marginBottom: 10, opacity: 0.9 }}>
          <polyline
            points="0,17 60,17 75,4 90,30 105,17 300,17"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="400"
            style={{ animation: "ecgmove 2.4s linear infinite" }}
          />
        </svg>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginBottom: 2 }}>LAST READING</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {latestBP ? `${latestBP.sys}/${latestBP.dia}` : "--/--"} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>mmHg</span>
            </div>
          </div>
          <button
            onClick={onRecordBP}
            style={{
              background: "#fff",
              color: "#2E6FCB",
              border: "none",
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Measure Now →
          </button>
        </div>
      </div>

      {/* Summary blocks */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <SummaryCard
          illustration={<BPCuffIllustration />}
          title="Blood Pressure"
          value={latestBP ? `${latestBP.sys}/${latestBP.dia}` : "--/--"}
          unit="mmHg"
          onRecord={onRecordBP}
          accent="#3E7FDB"
        />
        <SummaryCard
          illustration={<GlucometerIllustration />}
          title="Blood Sugar"
          value={latestSugar ? latestSugar.value : "--"}
          unit="mg/dL"
          onRecord={onRecordSugar}
          accent="#3E9E8F"
        />
        <SummaryCard
          illustration={<ScaleIllustration />}
          title="Weight & BMI"
          value={latestWeight ? `${latestWeight.weight} kg` : "--"}
          unit={latestWeight?.bmi ? `BMI ${latestWeight.bmi.toFixed(1)}` : ""}
          onRecord={onRecordWeight}
          accent="#D9A544"
        />
      </div>

      {/* Info & Knowledge */}
      <div style={{ fontSize: 19, fontWeight: 800, color: "#1B2B44", marginBottom: 12, fontFamily: "'Fraunces', 'Georgia', serif" }}>
        Info & Knowledge
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {INFO_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => onOpenInfo?.(card.title, card.color)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: card.color,
                border: "none",
                borderRadius: 16,
                padding: "16px 16px 16px 18px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(27,43,68,0.12)",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>{card.title}</span>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                <Icon size={22} color="#fff" />
              </div>
              <ChevronRight size={20} color="#fff" style={{ flex: "0 0 auto" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({ illustration, title, value, unit, onRecord, accent }) {
  return (
    <div
      style={{
        flex: "1 1 150px",
        background: "#fff",
        borderRadius: 20,
        padding: "20px 14px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 2px 10px rgba(62,127,219,0.12)",
        border: "1px solid #E3EEF9",
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 16,
          background: "#EAF4FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {illustration}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1B2B44", textAlign: "center" }}>{title}</div>
      <div style={{ fontSize: 15, color: accent, fontWeight: 700 }}>
        {value} <span style={{ fontSize: 12, fontWeight: 500, color: "#7C8CA6" }}>{unit}</span>
      </div>
      <button
        onClick={onRecord}
        style={{
          width: "100%",
          background: accent,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "10px 0",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Record
      </button>
    </div>
  );
}
