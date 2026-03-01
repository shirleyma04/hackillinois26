import { useState, useEffect } from "react";
import { useCrashOutStore } from "../store/useCrashOutStore";
import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";
import "./OutputSection.css";

function OutputSection() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Store state
  const message = useCrashOutStore((state) => state.message);
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const tone = useCrashOutStore((state) => state.tone);
  const kindness = useCrashOutStore((state) => state.kindness);
  const voice_format = useCrashOutStore((state) => state.voice_format);
  const voice_personality = useCrashOutStore(
    (state) => state.voice_personality,
  );
  const format = useCrashOutStore((state) => state.format);
  const selectedFormat = useCrashOutStore((state) => state.selectedFormat);
  const transformedMessage = useCrashOutStore(
    (state) => state.transformedMessage,
  );
  const setTransformedMessage = useCrashOutStore(
    (state) => state.setTransformedMessage,
  );
  const setProfanityDetected = useCrashOutStore(
    (state) => state.setProfanityDetected,
  );
  const ttsFilePath = useCrashOutStore((state) => state.ttsFilePath);
  const setTtsFilePath = useCrashOutStore((state) => state.setTtsFilePath);
  const setError = useCrashOutStore((state) => state.setError);
  const stopAudio = useCrashOutStore((state) => state.stopAudio);
  const setCurrentAudio = useCrashOutStore((state) => state.setCurrentAudio);
  const lastGenerationParams = useCrashOutStore(
    (state) => state.lastGenerationParams,
  );
  const setLastGenerationParams = useCrashOutStore(
    (state) => state.setLastGenerationParams,
  );

  // Local state
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [cachedVoiceId, setCachedVoiceId] = useState(null);
  const isVoiceMode = voice_format && voice_personality;
  const effectiveSelectedFormat =
    selectedFormat || (format === "email" ? "email" : "");
  const isEmailSend = effectiveSelectedFormat === "email";

  // Animate dots while loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  // Voice personality → TTS voice ID map
  const voiceIdMap = {
    british: "P4DhdyNCB4Nl6MA0sL45",
    wise_wizard: "0rEo3eAjssGDUCXHYENf",
    teenage_girl: "SaxQmcnUVUYw2AfMaRkL",
    corporate_executive: "cW9TKFZZUF6RNR1xt00R",
    cocky_villain: "zYcjlYFOd3taleS0gkk3",
  };

  const flashError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 1500);
  };

  // Handle regenerating/transformation of message
  const handleMakeChange = async () => {
    if (!message || !angry_at || !tone || !format) return;
    setLoading(true);
    stopAudio();

    try {
      // Determine tone dynamically if in voice mode
      let effectiveTone = tone;
      if (isVoiceMode) {
        if (kindness <= 2) effectiveTone = "intimidating";
        else if (kindness === 3) effectiveTone = "disappointed";
        else effectiveTone = "professional";
      }

      const payload = {
        message,
        angry_at,
        tone: effectiveTone,
        format: isVoiceMode ? "text" : format,
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      if (isVoiceMode) {
        payload.voice_format = voice_format;
        payload.voice_personality = voice_personality;
      }

      // Call your transformation API
      const result = await transformService(payload);

      setTransformedMessage(result.transformed_message);
      setProfanityDetected(result.profanity_detected);

      // Voice mode: generate TTS
      if (isVoiceMode) {
        let selectedVoiceId = voiceIdMap[voice_personality] || cachedVoiceId;
        if (!selectedVoiceId) {
          flashError(
            "Invalid voice selected. Custom voices require initial generation.",
          );
          return;
        }

        const ttsResponse = await fetch(`${API_BASE}/tts/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: result.transformed_message,
            voice_id: selectedVoiceId,
            model_id: "eleven_multilingual_v2",
          }),
        });

        if (!ttsResponse.ok) throw new Error("TTS generation failed");

        const ttsData = await ttsResponse.json();
        setTtsFilePath(ttsData.file_path);

        const audioUrl = `${API_BASE}/${ttsData.file_path}`;
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.play();

        flashError("Voice regenerated! You can download the updated MP3.");
      }

      // Update last generation params
      if (isVoiceMode) {
        setLastGenerationParams({
          message,
          angry_at,
          voice_format,
          voice_personality,
          kindness,
        });
      }
    } catch (err) {
      console.error("Re-transform error:", err);
      setTransformedMessage("Failed to generate message.");
    } finally {
      setLoading(false);
    }
  };

  // Copy message to clipboard
  const handleCopy = async () => {
    if (!transformedMessage) return;
    try {
      await navigator.clipboard.writeText(transformedMessage);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Send email
  const handleSend = async () => {
    if (!transformedMessage || !isEmailSend) return;
    try {
      setLoading(true);
      const subject = "Message";
      const body = encodeURIComponent(transformedMessage);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Download TTS audio
  const handleDownload = async () => {
    if (!ttsFilePath) return;

    try {
      const response = await fetch(`${API_BASE}/${ttsFilePath}`);
      if (!response.ok) throw new Error("Failed to fetch audio file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "VoiceMessage.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <section>
      <h2 className="header2">Your Transformed Message</h2>
      <div className="transformed-message">
        {loading
          ? `Generating your message${dots}`
          : transformedMessage || "Your message will appear here."}
      </div>

      <h3>Want to change the kindness of your message?</h3>
      <KindnessSlider />

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div className="output-button-group">
          <Button onClick={handleMakeChange} disabled={loading}>
            Make the change
          </Button>

          <div className="next-steps-button-group">
            <Button onClick={handleSend} disabled={loading || !isEmailSend}>
              {isEmailSend ? "Send It" : "Send It (Coming Soon)"}
            </Button>
            <Button onClick={handleCopy} disabled={loading}>
              Copy
            </Button>
            {ttsFilePath && (
              <Button onClick={handleDownload} disabled={loading}>
                Download Voice Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OutputSection;
