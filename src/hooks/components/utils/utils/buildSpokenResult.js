import { bpCategoriesUrdu } from "./bpCategoriesUrdu";

// Builds the sentence read aloud in the AdviceModal.
// `cat` is the object returned by classify(sys, dia) in App.jsx
// (has .key, .label, .advice, .steps, .color, .urgent)
export function buildSpokenResult(sys, dia, cat, lang) {
  if (lang === "ur") {
    const numbers = `آپ کا بلڈ پریشر ${sys} بٹا ${dia} ہے۔`;
    const categoryText = bpCategoriesUrdu[cat.key]?.spoken ?? "";
    return `${numbers} ${categoryText}`;
  }
  return `Your blood pressure is ${sys} over ${dia}. ${cat.label}. ${cat.advice}`;
}
