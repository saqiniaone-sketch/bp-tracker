import { ChevronRight, Gauge, Search, Home as HomeIcon, Footprints, Baby, UtensilsCrossed, Ban, Salad, ClipboardList } from "lucide-react";

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

// Simple heart icon used inline (avoids a second lucide import name clash)
function HeartIcon({ size = 22, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

// Original illustration of a wrist/arm BP cuff monitor
function BPCuffIllustration() {
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
      <rect x="2" y="14" width="26" height="22" rx="6" fill="#B7C0BC" />
      <rect x="6" y="18" width="18" height="14" rx="3" fill="#8C9A94" />
      <rect x="26" y="8" width="34" height="34" rx="8" fill="#fff" />
      <rect x="26" y="8" width="34" height="34" rx="8" fill="none" stroke="#DCE3DF" strokeWidth="1.5" />
      <rect x="32" y="14" width="22" height="14" rx="3" fill="#1B2B44" />
      <text x="43" y="24" textAnchor="middle" fontSize="8" fill="#4C8C6B" fontFamily="monospace" fontWeight="700">120/80</text>
      <circle cx="34" cy="35" r="3" fill="#C75146" />
      <path d="M28 22 C22 20, 18 24, 16 28" stroke="#8C9A94" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Original illustration of a glucometer with a drop
function GlucometerIllustration() {
  return (
    <svg width="46" height="58" viewBox="0 0 46 58" fill="none">
      <path d="M23 4 C18 12, 8 24, 8 34 a15 15 0 0 0 30 0 c0 -10 -10 -22 -15 -30z" fill="#3E7C8C" opacity="0.25" />
      <rect x="10" y="16" width="26" height="34" rx="8" fill="#fff" />
      <rect x="10" y="16" width="26" height="34" rx="8" fill="none" stroke="#DCE3DF" strokeWidth="1.5" />
      <rect x="14" y="22" width="18" height="12" rx="2" fill="#1B2B44" />
      <text x="23" y="31" textAnchor="middle" fontSize="7.5" fill="#4C8C6B" fontFamily="monospace" fontWeight="700">100</text>
      <circle cx="23" cy="42" r="3" fill="#C75146" />
      <path d="M28 6 C25 10, 22 14, 22 17 a4 4 0 0 0 8 0 c0 -3 -3 -7 -6 -11z" fill="#C75146" />
    </svg>
  );
}

export function Home({ latestBP, latestSugar, onRecordBP, onRecordSugar, onOpenInfo }) {
  return (
    <div style={{ padding: "4px 0 90px" }}>
      {/* Two record cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <RecordCard
          illustration={<BPCuffIllustration />}
          title="Blood Pressure"
          value={latestBP ? `${latestBP.sys}/${latestBP.dia}` : "--/--"}
          unit="mmHg"
          onRecord={onRecordBP}
        />
        <RecordCard
          illustration={<GlucometerIllustration />}
          title="Blood Sugar"
          value={latestSugar ? latestSugar.value : "--"}
          unit="mg/dL"
          onRecord={onRecordSugar}
        />
      </div>

      {/* Info & Knowledge */}
      <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", marginBottom: 12, fontFamily: "'Fraunces', 'Georgia', serif" }}>
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
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

function RecordCard({ illustration, title, value, unit, onRecord }) {
  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(160deg, #2B3B54 0%, #223349 100%)",
        borderRadius: 20,
        padding: "22px 14px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
        border: "1px solid #33455F",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: "rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {illustration}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textAlign: "center" }}>{title}</div>
      <div style={{ fontSize: 15, color: "#B7C3D6", fontWeight: 600 }}>
        {value} <span style={{ fontSize: 12, fontWeight: 400 }}>{unit}</span>
      </div>
      <button
        onClick={onRecord}
        style={{
          width: "100%",
          background: "#3E7FDB",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "10px 0",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 3px 10px rgba(62,127,219,0.4)",
        }}
      >
        Record
      </button>
    </div>
  );
}
