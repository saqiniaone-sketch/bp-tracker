import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, Fingerprint, RotateCcw } from "lucide-react";
import { classifyPulse } from "../utils/classifyPulse";

const SCAN_DURATION_MS = 15000;

// Full-screen camera-based pulse (heart rate) scanner.
// Method: cover the rear camera + flash with a fingertip. Blood flowing
// through the fingertip subtly changes how much light passes through,
// which shows up as a rhythmic brightness change in the video feed —
// that rhythm IS the pulse. This estimates heart rate only — it does
// NOT and CANNOT measure blood pressure.
export function PulseScanner({ onSave, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const samplesRef = useRef([]); // { t, brightness }
  const startTimeRef = useRef(null);

  const [phase, setPhase] = useState("intro"); // intro | scanning | result | error
  const [progress, setProgress] = useState(0);
  const [bpm, setBpm] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [torchSupported, setTorchSupported] = useState(true);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const sampleFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(sampleFrame);
      return;
    }
    const ctx = canvas.getContext("2d");
    const size = 24; // small central sample region, cheap to read
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(video, 0, 0, size, size);
    const frame = ctx.getImageData(0, 0, size, size).data;

    let sum = 0;
    for (let i = 0; i < frame.length; i += 4) {
      sum += frame[i]; // red channel — most sensitive to blood volume changes
    }
    const brightness = sum / (frame.length / 4);
    const now = performance.now();
    samplesRef.current.push({ t: now, brightness });

    const elapsed = now - startTimeRef.current;
    setProgress(Math.min(100, (elapsed / SCAN_DURATION_MS) * 100));

    if (elapsed >= SCAN_DURATION_MS) {
      finishScan();
      return;
    }
    rafRef.current = requestAnimationFrame(sampleFrame);
  }, []);

  const finishScan = () => {
    stopCamera();
    const samples = samplesRef.current;
    if (samples.length < 30) {
      setErrorMsg("Not enough signal was captured. Make sure your fingertip fully covers the camera and flash, then try again.");
      setPhase("error");
      return;
    }

    // Detrend: subtract a rolling average to remove slow lighting drift,
    // leaving just the fast pulsatile component.
    const windowSize = Math.max(5, Math.round(samples.length / 20));
    const detrended = samples.map((s, i) => {
      const start = Math.max(0, i - windowSize);
      const end = Math.min(samples.length, i + windowSize);
      const slice = samples.slice(start, end);
      const avg = slice.reduce((a, b) => a + b.brightness, 0) / slice.length;
      return { t: s.t, v: s.brightness - avg };
    });

    // Peak detection with a minimum distance (caps detection at 200bpm)
    const minPeakDistanceMs = 300;
    const peaks = [];
    for (let i = 2; i < detrended.length - 2; i++) {
      const p = detrended[i];
      if (
        p.v > detrended[i - 1].v &&
        p.v > detrended[i - 2].v &&
        p.v > detrended[i + 1].v &&
        p.v > detrended[i + 2].v &&
        p.v > 0.5 // small noise threshold
      ) {
        const last = peaks[peaks.length - 1];
        if (!last || p.t - last.t >= minPeakDistanceMs) {
          peaks.push(p);
        }
      }
    }

    if (peaks.length < 4) {
      setErrorMsg("Couldn't detect a clear pulse. Try holding still with steady, gentle pressure and good lighting.");
      setPhase("error");
      return;
    }

    // Median inter-beat interval is more robust to outliers than a simple average
    const intervals = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i].t - peaks[i - 1].t);
    }
    intervals.sort((a, b) => a - b);
    const median = intervals[Math.floor(intervals.length / 2)];
    const estimatedBpm = Math.round(60000 / median);

    if (estimatedBpm < 35 || estimatedBpm > 220) {
      setErrorMsg("The reading looked unreliable. Please try again in good lighting, holding your finger steady.");
      setPhase("error");
      return;
    }

    setBpm(estimatedBpm);
    setPhase("result");
  };

  const startScan = async () => {
    setErrorMsg("");
    samplesRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("This browser doesn't support camera access. Try opening this app in Chrome instead.");
      setPhase("error");
      return;
    }

    let stream;
    try {
      // First choice: rear camera specifically (has the flash)
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg(
          "Camera permission is blocked for this site. Tap the icon next to the address bar, open Permissions, set Camera to Allow, then reload the page and try again."
        );
        setPhase("error");
        return;
      }
      // Fall back to any available camera (e.g. devices that don't
      // support the "environment" facing mode constraint)
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (err2) {
        if (err2.name === "NotFoundError" || err2.name === "DevicesNotFoundError") {
          setErrorMsg("No camera was found on this device.");
        } else if (err2.name === "NotReadableError") {
          setErrorMsg("Your camera is currently in use by another app. Close other camera apps and try again.");
        } else {
          setErrorMsg("Couldn't access your camera. Check camera permissions for this app and try again.");
        }
        setPhase("error");
        return;
      }
    }

    try {
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() || {};
      if (capabilities.torch) {
        try {
          await track.applyConstraints({ advanced: [{ torch: true }] });
        } catch {
          setTorchSupported(false);
        }
      } else {
        setTorchSupported(false);
      }

      startTimeRef.current = performance.now();
      setPhase("scanning");
      rafRef.current = requestAnimationFrame(sampleFrame);
    } catch (err) {
      setErrorMsg("The camera opened but couldn't start streaming. Please try again.");
      setPhase("error");
    }
  };

  const retry = () => {
    setPhase("intro");
    setProgress(0);
    setBpm(null);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const cat = bpm ? classifyPulse(bpm) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#1B2B44", zIndex: 200, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px" }}>
        <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ArrowLeft size={22} color="#fff" />
        </button>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginInlineStart: 12 }}>Pulse scan</div>
      </div>

      {/* Hidden video/canvas used only for sampling — not shown to the user */}
      <video ref={videoRef} playsInline muted style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        {phase === "intro" && (
          <>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "#2B3B54",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 22,
              }}
            >
              <Fingerprint size={52} color="#C75146" />
            </div>
            <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 10px" }}>Cover the camera and flash</h2>
            <p style={{ color: "#B7C3D6", fontSize: 14.5, lineHeight: 1.6, maxWidth: 320, marginBottom: 8 }}>
              Gently place your fingertip over the rear camera lens and flash so it's fully covered. Hold still for about 15 seconds once it starts.
            </p>
            <p style={{ color: "#7A8AA0", fontSize: 12.5, lineHeight: 1.5, maxWidth: 320, marginBottom: 28 }}>
              This estimates your pulse (heart rate) only. It does not measure blood pressure.
            </p>
            <button
              onClick={startScan}
              style={{ background: "#3E7FDB", color: "#fff", border: "none", borderRadius: 999, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Start scan
            </button>
          </>
        )}

        {phase === "scanning" && (
          <>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: `conic-gradient(#C75146 ${progress * 3.6}deg, #2B3B54 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <div style={{ width: 116, height: 116, borderRadius: "50%", background: "#1B2B44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Fingerprint size={44} color="#C75146" />
              </div>
            </div>
            <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 8px" }}>Hold still…</h2>
            <p style={{ color: "#B7C3D6", fontSize: 14, marginBottom: 6 }}>Keep your fingertip steady over the camera and flash.</p>
            {!torchSupported && (
              <p style={{ color: "#D9A544", fontSize: 12.5, marginTop: 8, maxWidth: 300 }}>
                Your device's flash couldn't be turned on automatically — for best results, try in a well-lit room instead.
              </p>
            )}
          </>
        )}

        {phase === "result" && bpm && (
          <>
            <div style={{ fontSize: 56, fontWeight: 800, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{bpm}</div>
            <div style={{ color: "#B7C3D6", fontSize: 14, marginBottom: 10 }}>beats per minute</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#2B3B54",
                borderRadius: 999,
                padding: "8px 16px",
                marginBottom: 28,
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: 999, background: cat.color }} />
              <span style={{ color: "#fff", fontSize: 13.5, fontWeight: 600 }}>{cat.label}</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={retry}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#2B3B54", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                <RotateCcw size={15} /> Retry
              </button>
              <button
                onClick={() => onSave(bpm)}
                style={{ background: "#3E7FDB", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Save
              </button>
            </div>
            <p style={{ color: "#7A8AA0", fontSize: 11.5, lineHeight: 1.5, maxWidth: 300, marginTop: 24 }}>
              This is an estimate from your camera, not a medical device. If it seems off, retry in better lighting or with a fingertip pulse oximeter for a more reliable reading.
            </p>
          </>
        )}

        {phase === "error" && (
          <>
            <h2 style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 10px" }}>Couldn't get a reading</h2>
            <p style={{ color: "#B7C3D6", fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>{errorMsg}</p>
            <button
              onClick={retry}
              style={{ background: "#3E7FDB", color: "#fff", border: "none", borderRadius: 999, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
