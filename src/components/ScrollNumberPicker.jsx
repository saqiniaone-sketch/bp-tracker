import { useRef, useCallback } from "react";

// Synthesizes a short, soft tick sound with the Web Audio API — no audio
// file needed. Reuses one AudioContext across all pickers on the page.
let sharedAudioCtx = null;
function playTick() {
  try {
    if (!sharedAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      sharedAudioCtx = new Ctx();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (err) {
    // Audio isn't critical to the picker working — fail silently.
  }
}

// A vertical scroll-wheel number picker, like the "New record" screens
// in health apps: drag/scroll up-down to change the value, with faded
// preview numbers above and below the selected one.
//
// value: current number (integer or float)
// step: increment per row (1 for whole numbers, 0.1 for decimals)
// min/max: bounds
// label: shown above the wheel (e.g. "Systolic")
// unit: shown after the value (e.g. "mmHg")
// accentColor: highlight color for the selected row background
export function ScrollNumberPicker({ value, onChange, step = 1, min = 0, max = 300, label, unit, accentColor = "#4C8C6B" }) {
  const containerRef = useRef(null);
  const dragState = useRef({ dragging: false, startY: 0, startVal: value });
  const lastTickedValue = useRef(value);

  const decimals = step < 1 ? 1 : 0;
  const fmt = (v) => (decimals ? v.toFixed(1) : String(Math.round(v)));

  const clamp = useCallback((v) => Math.min(max, Math.max(min, v)), [min, max]);

  const rowHeight = 46;

  const commitChange = (next) => {
    if (next !== lastTickedValue.current) {
      playTick();
      lastTickedValue.current = next;
    }
    onChange(next);
  };

  const handlePointerDown = (e) => {
    dragState.current = {
      dragging: true,
      startY: e.touches ? e.touches[0].clientY : e.clientY,
      startVal: value,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaRows = (y - dragState.current.startY) / rowHeight;
    const next = clamp(dragState.current.startVal + deltaRows * step);
    commitChange(Number(next.toFixed(decimals)));
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    commitChange(clamp(Number((value + direction * step).toFixed(decimals))));
  };

  // Build 5 visible rows: 2 above, selected, 2 below
  const rows = [-2, -1, 0, 1, 2].map((offset) => clamp(Number((value + offset * step).toFixed(decimals))));

  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      {label && <div style={{ fontSize: 12, color: "#8C9A94", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</div>}
      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onWheel={handleWheel}
        style={{
          position: "relative",
          height: rowHeight * 5,
          width: 120,
          margin: "0 auto",
          overflow: "hidden",
          cursor: "ns-resize",
          touchAction: "none",
        }}
      >
        {/* Selected-row highlight band */}
        <div
          style={{
            position: "absolute",
            top: rowHeight * 2,
            left: 0,
            right: 0,
            height: rowHeight,
            borderTop: `1px solid ${accentColor}55`,
            borderBottom: `1px solid ${accentColor}55`,
            pointerEvents: "none",
          }}
        />
        {rows.map((v, i) => {
          const isCenter = i === 2;
          const distance = Math.abs(i - 2);
          return (
            <div
              key={i}
              style={{
                height: rowHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: isCenter ? 700 : 500,
                fontSize: isCenter ? 30 : 20,
                color: isCenter ? "#fff" : "#5A6C88",
                opacity: isCenter ? 1 : 1 - distance * 0.28,
              }}
            >
              {fmt(v)}
            </div>
          );
        })}
        {/* Up/down step buttons for accessibility (tap instead of drag) */}
        <button
          type="button"
          aria-label={`Increase ${label || "value"}`}
          onClick={() => commitChange(clamp(Number((value + step).toFixed(decimals))))}
          style={pickerBtnStyle("top")}
        >
          ▲
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label || "value"}`}
          onClick={() => commitChange(clamp(Number((value - step).toFixed(decimals))))}
          style={pickerBtnStyle("bottom")}
        >
          ▼
        </button>
      </div>
      {unit && <div style={{ fontSize: 11, color: "#8C9A94", marginTop: 4 }}>{unit}</div>}
    </div>
  );
}

function pickerBtnStyle(pos) {
  return {
    position: "absolute",
    [pos]: 0,
    left: "50%",
    transform: "translateX(-50%)",
    background: "none",
    border: "none",
    color: "#DCE3DF",
    fontSize: 10,
    cursor: "pointer",
    padding: 2,
  };
}
