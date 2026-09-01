import { HeartPulse, Droplet, ChevronRight, Gauge, Search, Home as HomeIcon, Footprints, Baby, UtensilsCrossed, Ban, Salad, ClipboardList } from "lucide-react";

// Matches the "HOME" screen you shared: two record cards side by side,
// then a scrollable list of colorful "Info & Knowledge" cards, each with
// a small circular icon illustrating the topic.
// Pass in latestBP ({sys, dia} or null) and latestSugar ({value} or null).

const INFO_CARDS = [
  { title: "Normal Range of Blood Pressure", color: "#3E9E8F", icon: Gauge },
  { title: "What is Blood Pressure?", color: "#E0B02E", icon: HeartPulse },
  { title: "Find Your Blood Pressure Type", color: "#C7405A", icon: Search },
  { title: "Measure BP at Home", color: "#C7405A", icon: HomeIcon },
  { title: "Change Lifestyle to Fight Hypotension", color: "#3E9E5C", icon: Footprints },
  { title: "Know & Treat Gestational Hypertension", color: "#3E7FDB", icon: Baby },
  { title: "Avoid 9 Foods for Hypertension", color: "#E0B02E", icon: UtensilsCrossed },
  { title: "Avoid 5 Foods for Hypotension", color: "#3E9E8F", icon: Ban },
  { title: "Control Hypotension via Diet", color: "#C7405A", icon: Salad },
  { title: "Get Tests to Diagnose Hypertension", color: "#3E9E5C", icon: ClipboardList },
];

export function Home({ latestBP, latestSugar, onRecordBP, onRecordSugar, onOpenInfo }) {
  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>
        HOME
      </h1>

      {/* Two record cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <RecordCard
          icon={<HeartPulse size={30} color="#3E7C8C" />}
          title="Blood Pressure"
          value={latestBP ? `${latestBP.sys}/${latestBP.dia}` : "--/--"}
          unit="mmHg"
          onRecord={onRecordBP}
        />
        <RecordCard
          icon={<Droplet size={30} color="#3E7C8C" />}
          title="Blood Sugar"
          value={latestSugar ? latestSugar.value : "--"}
          unit="mg/dL"
          onRecord={onRecordSugar}
        />
      </div>

      {/* Info & Knowledge */}
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Info & Knowledge</div>
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
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>{card.title}</span>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
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

function RecordCard({ icon, title, value, unit, onRecord }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#2B3B54",
        borderRadius: 18,
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#3A4C68",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center" }}>{title}</div>
      <div style={{ fontSize: 15, color: "#B7C3D6" }}>
        {value} <span style={{ fontSize: 12 }}>{unit}</span>
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
        }}
      >
        Record
      </button>
    </div>
  );
}
