// General resting heart-rate ranges (not personalized — athletes and
// some medications shift what's "normal" for a given person).
export function classifyPulse(bpm) {
  if (bpm < 60) return { key: "low", label: "Below typical resting range", color: "#3E7C8C" };
  if (bpm <= 100) return { key: "normal", label: "Typical resting range", color: "#4C8C6B" };
  return { key: "high", label: "Above typical resting range", color: "#C75146" };
}
