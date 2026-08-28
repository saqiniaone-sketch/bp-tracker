// General-purpose blood sugar ranges (mg/dL), not tied to fasting/post-meal
// timing since this is a simple personal log, not a clinical diagnosis.
export function classifySugar(value) {
  if (value < 70) {
    return { key: "low", label: "Low", color: "#3E7C8C", advice: "Have a fast-acting carb (juice, glucose tablet) and recheck in 15 minutes." };
  }
  if (value <= 99) {
    return { key: "normal", label: "Normal", color: "#4C8C6B", advice: "Within a healthy range." };
  }
  if (value <= 125) {
    return { key: "elevated", label: "Elevated", color: "#D9A544", advice: "Slightly high — worth keeping an eye on, especially if fasting." };
  }
  return { key: "high", label: "High", color: "#C75146", advice: "Consider rechecking and discussing with a clinician if this repeats." };
}
