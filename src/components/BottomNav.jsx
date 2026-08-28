import { Home, BookOpen, Settings } from "lucide-react";

export function BottomNav({ active, onChange }) {
  const items = [
    { key: "home", label: "HOME", icon: Home },
    { key: "info", label: "INFO", icon: BookOpen },
    { key: "settings", label: "SETTINGS", icon: Settings },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "#2B3B54",
        borderTop: "1px solid #3A4C68",
        padding: "10px 0 14px",
        zIndex: 100,
      }}
    >
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              color: isActive ? "#fff" : "#7A8AA0",
              cursor: "pointer",
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
