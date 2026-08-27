import { useState, useEffect } from "react";
import { Download } from "lucide-react";

// Shows a real "Install App" button on Chrome/Android (and other browsers
// that support the beforeinstallprompt event). Hides itself automatically
// if the app is already installed/running standalone, or on browsers
// that don't support the prompt (e.g. iOS Safari, which needs manual
// "Add to Home Screen" instructions instead).
export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (installed || !deferredPrompt) return null;

  const handleInstallClick = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <button
      onClick={handleInstallClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#1B2B44",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <Download size={14} /> Install App
    </button>
  );
}
