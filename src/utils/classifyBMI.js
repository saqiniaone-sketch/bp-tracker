// Standard WHO BMI categories. BMI = weight(kg) / (height(m))^2
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function classifyBMI(bmi) {
  if (bmi == null) return { key: "unknown", label: "--", color: "#8C9A94" };
  if (bmi < 18.5) return { key: "under", label: "Underweight", color: "#3E7C8C" };
  if (bmi < 25) return { key: "normal", label: "Normal", color: "#4C8C6B" };
  if (bmi < 30) return { key: "over", label: "Overweight", color: "#D9A544" };
  return { key: "obese", label: "Obese", color: "#C75146" };
}
