import { useState, useRef, useCallback } from "react";

// Wraps the browser's SpeechRecognition API for a single field.
// lang: 'en-US' or 'ur-PK'
export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = useCallback(
    (lang, onResult) => {
      if (!isSupported) {
        setError("Voice input not supported in this browser");
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isListening, isSupported, error, startListening, stopListening };
}
