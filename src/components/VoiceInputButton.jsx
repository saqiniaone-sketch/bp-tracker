import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { parseSpokenNumber } from "../utils/parseSpokenNumber";

// lang: 'en-US' or 'ur-PK'. onValue receives the parsed numeric string.
export function VoiceInputButton({ lang, onValue }) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceInput();

  if (!isSupported) return null; // hide silently on unsupported browsers (e.g. Firefox)

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(lang, (transcript) => {
        onValue(parseSpokenNumber(transcript));
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Listening…" : "Speak this value"}
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 10,
        border: "1px solid #DCE3DF",
        background: isListening ? "#FBEAEA" : "#FBFCFB",
        color: isListening ? "#C75146" : "#4A5C6E",
        cursor: "pointer",
      }}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
}
