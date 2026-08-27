import { useState, useEffect, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Plus, Trash2, Activity, HeartPulse, Calendar, TrendingUp, LogOut, Info, Copy, Check, Footprints, Play, Square, Wind, Volume2, VolumeX } from "lucide-react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import { buildSpokenResult } from "./utils/buildSpokenResult";
import { VoiceInputButton } from "./components/VoiceInputButton";
import { InstallAppButton } from "./components/InstallAppButton";
// --- Clinical classification (AHA guidelines) ---
function classify(sys, dia) {
  if (sys >= 180 || dia >= 120) {
    return {
      key: "crisis",
      label: "Hypertensive Crisis",
      color: "#8B2E3C",
      advice: "Seek medical attention promptly.",
      urgent: true,
      steps: [
        "Sit down and rest calmly — don't drive yourself anywhere.",
        "Wait 5 minutes and take a second reading to confirm.",
        "If it's still this high, or you have chest pain, shortness of breath, a severe headache, vision changes, or numbness/weakness, call emergency services or go to the ER immediately.",
        "Do not take an extra dose of any medication without a doctor's instruction.",
      ],
    };
  }
  if (sys >= 140 || dia >= 90) {
    return {
      key: "stage2",
      label: "High Blood Pressure — Stage 2",
      color: "#C75146",
      advice: "Talk with a clinician about treatment.",
      urgent: false,
      steps: [
        "Rest quietly for a few minutes, then recheck to rule out a one-off spike.",
        "Note any symptoms — headache, dizziness, chest discomfort.",
        "If readings are repeatedly in this range, contact a doctor soon to discuss treatment.",
        "Cut back on salt, caffeine, and alcohol for the rest of the day.",
      ],
    };
  }
  if (sys >= 130 || dia >= 80) {
    return {
      key: "stage1",
      label: "High Blood Pressure — Stage 1",
      color: "#D97B4F",
      advice: "Lifestyle changes recommended; monitor closely.",
      urgent: false,
      steps: [
        "Recheck after a short rest to confirm the reading.",
        "Cut back on salt, caffeine, and alcohol today.",
        "Get some light movement in if you haven't already — a short walk can help.",
        "Keep logging readings so you and your doctor can spot a pattern.",
      ],
    };
  }
  if (sys >= 120 && dia < 80) {
    return {
      key: "elevated",
      label: "Elevated",
      color: "#D9A544",
      advice: "A good time to focus on healthy habits.",
      urgent: false,
      steps: [
        "No action needed right now.",
        "Keep an eye on salt intake and stay active.",
        "Continue logging so you can track the trend over time.",
      ],
    };
  }
  if (sys < 90 || dia < 60) {
    return {
      key: "low",
      label: "Low Blood Pressure",
      color: "#3E7C8C",
      advice: "Take it easy and recheck shortly.",
      urgent: sys < 80 || dia < 50,
      steps: [
        "Sit or lie down right away, especially if you feel lightheaded or dizzy.",
        "If lying down, raise your legs slightly to help blood flow to your head.",
        "Sip water — dehydration is a common cause of low readings.",
        "Stand up slowly next time you get up to avoid a dizzy spell.",
        "If you feel faint, confused, have cold/clammy skin, or chest pain, seek medical help right away.",
      ],
    };
  }
  return {
    key: "normal",
    label: "Normal",
    color: "#4C8C6B",
    advice: "Keep up the good work.",
    urgent: false,
    steps: ["No action needed — this reading is in the normal range.", "Keep up your current habits."],
  };
}

function fmtDateShort(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function fmtDateFull(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// --- Gauge dial: arc from -120deg to +120deg mapped to systolic 80-200 ---
function Gauge({ sys, dia }) {
  const cat = classify(sys, dia);
  const min = 80, max = 200;
  const clamped = Math.max(min, Math.min(max, sys || min));
  const pct = (clamped - min) / (max - min);
  const angle = -120 + pct * 240; // degrees

  const cx = 140, cy = 140, r = 108;
  const toXY = (deg) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arcPath = (startDeg, endDeg) => {
    const [x1, y1] = toXY(startDeg);
    const [x2, y2] = toXY(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  // segments proportional to sys thresholds 80-120-130-140-180-200 mapped over -120..120
  const segStops = [80, 120, 130, 140, 180, 200];
  const segColors = ["#4C8C6B", "#D9A544", "#D97B4F", "#C75146", "#8B2E3C"];
  const segAngles = segStops.map((v) => -120 + ((v - min) / (max - min)) * 240);

  const [needleX, needleY] = toXY(angle);

  return (
    <svg viewBox="0 0 280 190" width="100%" height="auto" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      {segAngles.slice(0, -1).map((a, i) => (
        <path
          key={i}
          d={arcPath(a, segAngles[i + 1])}
          fill="none"
          stroke={segColors[i]}
          strokeWidth="14"
          strokeLinecap="butt"
          opacity="0.85"
        />
      ))}
      {/* needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#1B2B44" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="7" fill="#1B2B44" />
      <circle cx={cx} cy={cy} r="3" fill="#EEF2F0" />
      <text x={cx} y={cy + 42} textAnchor="middle" fontFamily="Fraunces, serif" fontSize="34" fontWeight="600" fill="#1B2B44">
        {sys || "--"}/{dia || "--"}
      </text>
      <text x={cx} y={cy + 62} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="0.08em" fill="#4A5C6E">
        {cat.label.toUpperCase()}
      </text>
    </svg>
  );
}

const RANGE_OPTIONS = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "all", label: "All time" },
];

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = signed out
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5C6E", fontFamily: "'Inter', sans-serif" }}>
        Loading…
      </div>
    );
  }

  if (recovery) return <ResetPassword onDone={() => setRecovery(false)} />;
  if (!session) return <Auth />;

  return <Dashboard session={session} />;
}

function Dashboard({ session }) {
  const [section, setSection] = useState("bp"); // "bp" | "walk" | "breathe"
  const [uiLanguage, setUiLanguage] = useState("en"); // "en" | "ur"

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#EEF2F0",
        minHeight: "100%",
        color: "#1B2B44",
        padding: "28px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HeartPulse size={22} color="#C75146" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: "0.14em", color: "#4A5C6E", fontWeight: 600 }}>
              PRESSURE LOG
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setUiLanguage((l) => (l === "en" ? "ur" : "en"))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "1px solid #DCE3DF",
                borderRadius: 999,
                color: "#4A5C6E",
                fontSize: 12,
                cursor: "pointer",
                padding: "4px 10px",
              }}
            >
              {uiLanguage === "en" ? "اردو" : "English"}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: "#4A5C6E",
                fontSize: 12,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 600,
            margin: "4px 0 20px",
            color: "#1B2B44",
          }}
        >
          {section === "bp" ? "Your blood pressure, over time" : section === "walk" ? "Track a walk" : "Guided breathing"}
        </h1>

        {/* Section switcher */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <SectionCard
            icon={<HeartPulse size={22} color={section === "bp" ? "#fff" : "#C75146"} />}
            label="BP Log"
            active={section === "bp"}
            onClick={() => setSection("bp")}
          />
          <SectionCard
            icon={<Footprints size={22} color={section === "walk" ? "#fff" : "#3E7C8C"} />}
            label="Walk"
            active={section === "walk"}
            onClick={() => setSection("walk")}
          />
          <SectionCard
            icon={<Wind size={22} color={section === "breathe" ? "#fff" : "#4C8C6B"} />}
            label="Breathe"
            active={section === "breathe"}
            onClick={() => setSection("breathe")}
          />
        </div>

        {section === "bp" ? (
          <BPTracker session={session} uiLanguage={uiLanguage} />
        ) : section === "walk" ? (
          <WalkTracker session={session} />
        ) : (
          <BreathingExercise />
        )}
      </div>
    </div>
  );
}

function SectionCard({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "16px 10px",
        borderRadius: 16,
        border: active ? "1px solid #1B2B44" : "1px solid #DCE3DF",
        background: active ? "#1B2B44" : "#FFFFFF",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active ? "rgba(255,255,255,0.15)" : "#EEF2F0",
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#fff" : "#1B2B44" }}>{label}</span>
    </button>
  );
}

function ResetPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message || "Something went wrong.");
      return;
    }
    setDone(true);
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#EEF2F0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <HeartPulse size={22} color="#C75146" />
          <span style={{ fontSize: 13, letterSpacing: "0.14em", color: "#4A5C6E", fontWeight: 600 }}>PRESSURE LOG</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, margin: "4px 0 20px", color: "#1B2B44" }}>
          Set a new password
        </h1>

        {done ? (
          <>
            <div style={{ color: "#4C8C6B", fontSize: 14, marginBottom: 18 }}>
              Your password has been updated.
            </div>
            <button
              onClick={onDone}
              style={{
                width: "100%",
                background: "#1B2B44",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "11px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </>
        ) : (
          <form onSubmit={submit}>
            <label style={{ display: "block", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#4A5C6E", marginBottom: 5 }}>New password</div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #DCE3DF",
                  fontSize: 14,
                  color: "#1B2B44",
                  outline: "none",
                  background: "#FBFCFB",
                }}
                placeholder="At least 6 characters"
              />
            </label>
            {error && <div style={{ color: "#C75146", fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                background: "#1B2B44",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "11px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? "Please wait…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function BPTracker({ session, uiLanguage }) {
  const [readings, setReadings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [range, setRange] = useState("30");
  const [form, setForm] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    when: new Date().toISOString().slice(0, 16),
    note: "",
  });
  const [error, setError] = useState("");
  const [alertReading, setAlertReading] = useState(null);

  const loadReadings = async () => {
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .order("when_at", { ascending: false });
    if (error) {
      console.error("Failed to load readings", error);
    } else {
      setReadings(data.map((r) => ({ id: r.id, sys: r.sys, dia: r.dia, pulse: r.pulse, when: r.when_at, note: r.note || "" })));
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const addReading = async () => {
    const sys = parseInt(form.systolic, 10);
    const dia = parseInt(form.diastolic, 10);
    const pulse = form.pulse ? parseInt(form.pulse, 10) : null;
    if (!sys || !dia || sys < 50 || sys > 260 || dia < 30 || dia > 200) {
      setError("Enter a valid systolic (50–260) and diastolic (30–200) reading.");
      return;
    }
    setError("");
    const { error } = await supabase.from("readings").insert({
      user_id: session.user.id,
      sys,
      dia,
      pulse,
      when_at: new Date(form.when).toISOString(),
      note: form.note.trim(),
    });
    if (error) {
      setError(error.message);
      return;
    }
    setForm({ ...form, systolic: "", diastolic: "", pulse: "", note: "" });
    loadReadings();

    const cat = classify(sys, dia);
    if (cat.key !== "normal" && cat.key !== "elevated") {
      setAlertReading({ sys, dia, cat });
    }
  };

  const deleteReading = async (id) => {
    const { error } = await supabase.from("readings").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete reading", error);
      return;
    }
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = useMemo(() => {
    if (range === "all") return readings;
    const days = parseInt(range, 10);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return readings.filter((r) => new Date(r.when).getTime() >= cutoff);
  }, [readings, range]);

  const chartData = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => new Date(a.when) - new Date(b.when))
        .map((r) => ({ date: fmtDateShort(r.when), sys: r.sys, dia: r.dia, full: fmtDateFull(r.when) })),
    [filtered]
  );

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const sysVals = filtered.map((r) => r.sys);
    const diaVals = filtered.map((r) => r.dia);
    const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    return {
      avgSys: avg(sysVals),
      avgDia: avg(diaVals),
      maxSys: Math.max(...sysVals),
      minSys: Math.min(...sysVals),
      count: filtered.length,
    };
  }, [filtered]);

  const latest = readings[0];
  const latestCat = latest ? classify(latest.sys, latest.dia) : null;

  const voiceLang = uiLanguage === "ur" ? "ur-PK" : "en-US";

  return (
    <>
        {/* Hero: Gauge + latest */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "24px 20px",
            boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <Gauge sys={latest?.sys} dia={latest?.dia} />
          </div>
          <div style={{ flex: "1 1 220px", minWidth: 220 }}>
            {latest ? (
              <>
                <div style={{ fontSize: 12, color: "#4A5C6E", marginBottom: 6 }}>Latest reading — {fmtDateFull(latest.when)}</div>
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 999,
                    color: "#fff",
                    background: latestCat.color,
                    marginBottom: 10,
                  }}
                >
                  {latestCat.label}
                </div>
                <div style={{ fontSize: 13, color: "#4A5C6E", lineHeight: 1.5 }}>{latestCat.advice}</div>
                {latest.pulse && (
                  <div style={{ marginTop: 10, fontSize: 13, color: "#4A5C6E", display: "flex", alignItems: "center", gap: 6 }}>
                    <Activity size={14} /> Pulse {latest.pulse} bpm
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: "#4A5C6E", fontSize: 14 }}>No readings yet. Log your first one below.</div>
            )}
          </div>
        </div>

        {/* Add reading form */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "22px 20px",
            boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Add a reading</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            <Field label="Systolic">
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="120"
                  value={form.systolic}
                  onChange={(e) => setForm({ ...form, systolic: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <VoiceInputButton lang={voiceLang} onValue={(v) => setForm((f) => ({ ...f, systolic: v }))} />
              </div>
            </Field>
            <Field label="Diastolic">
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="80"
                  value={form.diastolic}
                  onChange={(e) => setForm({ ...form, diastolic: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <VoiceInputButton lang={voiceLang} onValue={(v) => setForm((f) => ({ ...f, diastolic: v }))} />
              </div>
            </Field>
            <Field label="Pulse (optional)">
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="72"
                  value={form.pulse}
                  onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <VoiceInputButton lang={voiceLang} onValue={(v) => setForm((f) => ({ ...f, pulse: v }))} />
              </div>
            </Field>
            <Field label="When">
              <input
                type="datetime-local"
                value={form.when}
                onChange={(e) => setForm({ ...form, when: e.target.value })}
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Note (optional)">
              <input
                type="text"
                placeholder="e.g. after a walk, before medication"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                style={{ ...inputStyle, width: "100%" }}
              />
            </Field>
          </div>
          {error && <div style={{ color: "#C75146", fontSize: 13, marginTop: 10 }}>{error}</div>}
          <button
            onClick={addReading}
            style={{
              marginTop: 16,
              background: "#1B2B44",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Plus size={16} /> Save reading
          </button>
        </div>

        {/* Trend chart */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "22px 20px",
            boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={17} color="#3E7C8C" />
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>Trend</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRange(opt.key)}
                  style={{
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "1px solid " + (range === opt.key ? "#1B2B44" : "#DCE3DF"),
                    background: range === opt.key ? "#1B2B44" : "transparent",
                    color: range === opt.key ? "#fff" : "#4A5C6E",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {stats ? (
            <>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                <Stat label="Avg" value={`${stats.avgSys}/${stats.avgDia}`} />
                <Stat label="Highest sys." value={stats.maxSys} />
                <Stat label="Lowest sys." value={stats.minSys} />
                <Stat label="Readings" value={stats.count} />
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#E4E9E6" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#4A5C6E" }} axisLine={{ stroke: "#DCE3DF" }} tickLine={false} />
                    <YAxis domain={[40, 200]} tick={{ fontSize: 11, fill: "#4A5C6E" }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={120} stroke="#D9A544" strokeDasharray="4 4" strokeWidth={1} />
                    <ReferenceLine y={80} stroke="#3E7C8C" strokeDasharray="4 4" strokeWidth={1} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid #E4E9E6", fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                      labelFormatter={(_, payload) => (payload && payload[0] ? payload[0].payload.full : "")}
                    />
                    <Line type="monotone" dataKey="sys" stroke="#C75146" strokeWidth={2.5} dot={{ r: 3 }} name="Systolic" />
                    <Line type="monotone" dataKey="dia" stroke="#3E7C8C" strokeWidth={2.5} dot={{ r: 3 }} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div style={{ color: "#4A5C6E", fontSize: 14, padding: "20px 0" }}>Nothing to chart yet for this range.</div>
          )}
        </div>

        {/* History */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "22px 20px",
            boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Calendar size={17} color="#1B2B44" />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>History</span>
          </div>
          {!loaded ? (
            <div style={{ color: "#4A5C6E", fontSize: 14 }}>Loading…</div>
          ) : readings.length === 0 ? (
            <div style={{ color: "#4A5C6E", fontSize: 14 }}>Your logged readings will appear here.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {readings.map((r) => {
                const cat = classify(r.sys, r.dia);
                return (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 6px",
                      borderBottom: "1px solid #EEF1EF",
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: cat.color, flex: "0 0 auto" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, width: 90, flex: "0 0 auto" }}>
                      {r.sys}/{r.dia}
                    </div>
                    <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#1B2B44" }}>{fmtDateFull(r.when)}</div>
                      <div style={{ fontSize: 12, color: "#4A5C6E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.label}
                        {r.pulse ? ` · pulse ${r.pulse}` : ""}
                        {r.note ? ` · ${r.note}` : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, flex: "0 0 auto" }}>
                      {cat.key !== "normal" && cat.key !== "elevated" && (
                        <button
                          onClick={() => setAlertReading({ sys: r.sys, dia: r.dia, cat, when: r.when })}
                          aria-label="View advice for this reading"
                          title="View advice"
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#8C9A94", padding: 6, display: "flex" }}
                        >
                          <Info size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReading(r.id)}
                        aria-label="Delete reading"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#B7C0BC", padding: 6, display: "flex" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "#8C9A94", marginTop: 24 }}>
          Categories follow American Heart Association guidelines. This is a personal log, not medical advice.
        </div>

      {alertReading && (
        <AdviceModal reading={alertReading} onClose={() => setAlertReading(null)} uiLanguage={uiLanguage} />
      )}
    </>
  );
}

function AdviceModal({ reading, onClose, uiLanguage }) {
  const { sys, dia, cat, when } = reading;
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const copyText = async () => {
    const lines = [
      `${sys}/${dia} — ${cat.label}${when ? ` (${fmtDateFull(when)})` : ""}`,
      cat.advice,
      "",
      ...cat.steps.map((s, i) => `${i + 1}. ${s}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const speakResult = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = buildSpokenResult(sys, dia, cat, uiLanguage);
    const langCode = uiLanguage === "ur" ? "ur-PK" : "en-US";
    setSpeaking(true);
    speak(text, langCode);
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(check);
      }
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(27,43,68,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "26px 24px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 12px 40px rgba(27,43,68,0.25)",
          border: cat.urgent ? `2px solid ${cat.color}` : "none",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 999,
            color: "#fff",
            background: cat.color,
            marginBottom: 12,
          }}
        >
          {cat.label}
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, margin: "0 0 4px", color: "#1B2B44" }}>
          {sys}/{dia} — {cat.urgent ? "Please take action now" : "What to do"}
        </h2>
        {when && <div style={{ fontSize: 12, color: "#8C9A94", marginBottom: 4 }}>{fmtDateFull(when)}</div>}
        <p style={{ fontSize: 13, color: "#4A5C6E", margin: "0 0 16px" }}>{cat.advice}</p>

        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {cat.steps.map((step, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1B2B44", lineHeight: 1.4 }}>
              <span
                style={{
                  flex: "0 0 auto",
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: cat.urgent ? cat.color : "#EEF2F0",
                  color: cat.urgent ? "#fff" : "#4A5C6E",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>

        {cat.urgent && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#FBEAEA",
              color: "#8B2E3C",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            If symptoms are severe, don't wait — call emergency services now.
          </div>
        )}

        <div style={{ marginTop: 18, fontSize: 11, color: "#8C9A94" }}>
          This is general guidance, not medical advice. When in doubt, contact a clinician.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button
            onClick={speakResult}
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#FFFFFF",
              color: "#1B2B44",
              border: "1px solid #DCE3DF",
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {speaking ? "Stop" : "Listen"}
          </button>
          <button
            onClick={copyText}
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#FFFFFF",
              color: "#1B2B44",
              border: "1px solid #DCE3DF",
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={15} color="#4C8C6B" /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: "1 1 auto",
              background: "#1B2B44",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Haversine distance in km between two lat/lng points ---
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function fmtDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function speak(text, lang) {
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    if (lang) u.lang = lang;
    window.speechSynthesis.speak(u);
  } catch (err) {
    console.error("Speech synthesis failed", err);
  }
}

function WalkTracker({ session }) {
  const [tracking, setTracking] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gpsError, setGpsError] = useState("");
  const [walks, setWalks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const watchIdRef = useRef(null);
  const lastPosRef = useRef(null);
  const nextAnnounceRef = useRef(0.5);
  const timerRef = useRef(null);
  const startedAtRef = useRef(null);

  const loadWalks = async () => {
    const { data, error } = await supabase
      .from("walks")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(20);
    if (error) {
      console.error("Failed to load walks", error);
    } else {
      setWalks(data);
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadWalks();
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWalk = () => {
    if (!("geolocation" in navigator)) {
      setGpsError("Your browser doesn't support GPS location.");
      return;
    }
    setGpsError("");
    setDistanceKm(0);
    setSeconds(0);
    lastPosRef.current = null;
    nextAnnounceRef.current = 0.5;
    startedAtRef.current = new Date();
    setTracking(true);

    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const cur = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (lastPosRef.current) {
          // Ignore jumps from poor-accuracy GPS noise while stationary
          if (!pos.coords.accuracy || pos.coords.accuracy < 30) {
            const d = haversineKm(lastPosRef.current, cur);
            if (d > 0.002) {
              setDistanceKm((prev) => {
                const next = prev + d;
                if (next >= nextAnnounceRef.current) {
                  speak(`${nextAnnounceRef.current.toFixed(1)} kilometers`);
                  nextAnnounceRef.current += 0.5;
                }
                return next;
              });
              lastPosRef.current = cur;
            }
          }
        } else {
          lastPosRef.current = cur;
        }
      },
      (err) => {
        console.error("GPS error", err);
        setGpsError(err.message || "Couldn't access your location. Check location permissions.");
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
  };

  const stopWalk = async () => {
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTracking(false);
    speak(`Walk finished. ${distanceKm.toFixed(2)} kilometers.`);

    if (distanceKm > 0.01) {
      setSaving(true);
      const { error } = await supabase.from("walks").insert({
        user_id: session.user.id,
        distance_km: Number(distanceKm.toFixed(3)),
        duration_s: seconds,
        started_at: startedAtRef.current.toISOString(),
        ended_at: new Date().toISOString(),
      });
      setSaving(false);
      if (error) {
        console.error("Failed to save walk", error);
        setGpsError("Walk finished but couldn't be saved: " + error.message);
      } else {
        loadWalks();
      }
    }
  };

  const paceMinPerKm = distanceKm > 0.01 ? seconds / 60 / distanceKm : null;

  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <Footprints size={18} color="#3E7C8C" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>Walking session</span>
        </div>

        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 600, margin: "18px 0 2px", color: "#1B2B44" }}>
          {distanceKm.toFixed(2)} <span style={{ fontSize: 18, fontWeight: 500, color: "#4A5C6E" }}>km</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
          <Stat label="Time" value={fmtDuration(seconds)} />
          <Stat label="Pace" value={paceMinPerKm ? `${paceMinPerKm.toFixed(1)} min/km` : "--"} />
        </div>

        {gpsError && <div style={{ color: "#C75146", fontSize: 13, marginBottom: 14 }}>{gpsError}</div>}

        {!tracking ? (
          <button
            onClick={startWalk}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1B2B44",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "13px 28px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Play size={16} /> Start walk
          </button>
        ) : (
          <button
            onClick={stopWalk}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#C75146",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "13px 28px",
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? "default" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Square size={16} /> {saving ? "Saving…" : "Stop walk"}
          </button>
        )}

        <div style={{ fontSize: 11, color: "#8C9A94", marginTop: 16 }}>
          Uses your phone's GPS while this page is open. Distance is announced every 0.5 km. Keep this tab open and your screen on for the most accurate tracking.
        </div>
      </div>

      {/* History */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "22px 20px",
          boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Calendar size={17} color="#1B2B44" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>Walk history</span>
        </div>
        {!loaded ? (
          <div style={{ color: "#4A5C6E", fontSize: 14 }}>Loading…</div>
        ) : walks.length === 0 ? (
          <div style={{ color: "#4A5C6E", fontSize: 14 }}>Your walks will appear here.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {walks.map((w) => (
              <div
                key={w.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 6px",
                  borderBottom: "1px solid #EEF1EF",
                }}
              >
                <Footprints size={16} color="#3E7C8C" style={{ flex: "0 0 auto" }} />
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, width: 80, flex: "0 0 auto" }}>
                  {Number(w.distance_km).toFixed(2)} km
                </div>
                <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#1B2B44" }}>{fmtDateFull(w.started_at)}</div>
                  <div style={{ fontSize: 12, color: "#4A5C6E" }}>{fmtDuration(w.duration_s)} min</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// --- Breathing patterns: [phase label, seconds] ---
const BREATH_PATTERNS = {
  box: { label: "Box breathing (4-4-4-4)", phases: [["Inhale", 4], ["Hold", 4], ["Exhale", 4], ["Hold", 4]] },
  calm: { label: "4-7-8 relaxing breath", phases: [["Inhale", 4], ["Hold", 7], ["Exhale", 8]] },
  simple: { label: "Simple 4-6", phases: [["Inhale", 4], ["Exhale", 6]] },
};

function BreathingExercise() {
  const [patternKey, setPatternKey] = useState("box");
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PATTERNS.box.phases[0][1]);
  const [cycles, setCycles] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);

  const timerRef = useRef(null);
  const phaseIdxRef = useRef(0);
  const pattern = BREATH_PATTERNS[patternKey];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const announcePhase = (label) => {
    if (voiceOn) speak(label);
  };

  const start = () => {
    setRunning(true);
    phaseIdxRef.current = 0;
    setPhaseIdx(0);
    setCycles(0);
    setSecondsLeft(pattern.phases[0][1]);
    announcePhase(pattern.phases[0][0]);

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        const nextIdx = (phaseIdxRef.current + 1) % pattern.phases.length;
        phaseIdxRef.current = nextIdx;
        setPhaseIdx(nextIdx);
        if (nextIdx === 0) setCycles((c) => c + 1);
        announcePhase(pattern.phases[nextIdx][0]);
        return pattern.phases[nextIdx][1];
      });
    }, 1000);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    setRunning(false);
  };

  const changePattern = (key) => {
    stop();
    setPatternKey(key);
    phaseIdxRef.current = 0;
    setPhaseIdx(0);
    setSecondsLeft(BREATH_PATTERNS[key].phases[0][1]);
    setCycles(0);
  };

  const currentPhase = pattern.phases[phaseIdx];
  const scale = currentPhase[0] === "Inhale" ? 1.15 : currentPhase[0] === "Exhale" ? 0.85 : 1;

  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "0 1px 3px rgba(27,43,68,0.08)",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <Wind size={18} color="#4C8C6B" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>Guided breathing</span>
        </div>
        <div style={{ fontSize: 12, color: "#4A5C6E", marginBottom: 18 }}>
          A relaxation exercise, not a lung function test — for an actual breathing or lung assessment, see a clinician (spirometry).
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {Object.entries(BREATH_PATTERNS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => changePattern(key)}
              disabled={running}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid " + (patternKey === key ? "#1B2B44" : "#DCE3DF"),
                background: patternKey === key ? "#1B2B44" : "transparent",
                color: patternKey === key ? "#fff" : "#4A5C6E",
                cursor: running ? "default" : "pointer",
                opacity: running && patternKey !== key ? 0.5 : 1,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div
          style={{
            width: 180,
            height: 180,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#EAF3EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${running ? scale : 1})`,
            transition: "transform 3.5s ease-in-out",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1B2B44" }}>
              {running ? currentPhase[0] : "Ready"}
            </div>
            {running && <div style={{ fontSize: 28, fontWeight: 600, color: "#4C8C6B", marginTop: 4 }}>{secondsLeft}</div>}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#4A5C6E", marginBottom: 18 }}>Cycles completed: {cycles}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {!running ? (
            <button
              onClick={start}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#1B2B44",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "13px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Play size={16} /> Start
            </button>
          ) : (
            <button
              onClick={stop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#C75146",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "13px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Square size={16} /> Stop
            </button>
          )}
          <button
            onClick={() => setVoiceOn((v) => !v)}
            style={{
              fontSize: 13,
              padding: "13px 16px",
              borderRadius: 999,
              border: "1px solid #DCE3DF",
              background: voiceOn ? "#EEF2F0" : "transparent",
              color: "#4A5C6E",
              cursor: "pointer",
            }}
          >
            {voiceOn ? "Voice: on" : "Voice: off"}
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 11, color: "#4A5C6E", marginBottom: 5, letterSpacing: "0.02em" }}>{label}</div>
      {children}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#4A5C6E", letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#1B2B44" }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid #DCE3DF",
  fontSize: 14,
  fontFamily: "'IBM Plex Mono', monospace",
  color: "#1B2B44",
  outline: "none",
  background: "#FBFCFB",
};
