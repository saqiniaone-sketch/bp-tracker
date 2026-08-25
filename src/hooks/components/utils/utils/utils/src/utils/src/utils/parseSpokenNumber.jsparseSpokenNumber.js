// Extracts a plain numeric string from a speech transcript,
// e.g. "one hundred twenty" or "120" -> "120".
// Most STT engines already return digits for numeric input,
// so the digit match below covers the large majority of cases.
const wordsToNumbers = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  // Urdu number words (extend as needed)
  "صفر": 0, "ایک": 1, "دو": 2, "تین": 3, "چار": 4,
  "پانچ": 5, "چھ": 6, "سات": 7, "آٹھ": 8, "نو": 9, "دس": 10,
};

export function parseSpokenNumber(transcript) {
  const digitMatch = transcript.match(/\d+/);
  if (digitMatch) return digitMatch[0];

  const word = transcript.trim().toLowerCase();
  if (wordsToNumbers[word] !== undefined) {
    return String(wordsToNumbers[word]);
  }
  return transcript.trim();
}
