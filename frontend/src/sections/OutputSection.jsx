import { useState, useEffect, useRef } from "react";
import { useCrashOutStore } from "../store/useCrashOutStore";
import { transformService } from "../services/transformService";
import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";

function OutputSection() {
  const message = useCrashOutStore((state) => state.message);
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const tone = useCrashOutStore((state) => state.tone);
  const format = useCrashOutStore((state) => state.format);
  const selectedFormat = useCrashOutStore((state) => state.selectedFormat);
  const kindness = useCrashOutStore((state) => state.kindness);
  const voice_format = useCrashOutStore((state) => state.voice_format);
  const voice_personality = useCrashOutStore((state) => state.voice_personality);
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
  const lastGenerationParams = useCrashOutStore((state) => state.lastGenerationParams);
  const setLastGenerationParams = useCrashOutStore((state) => state.setLastGenerationParams);

  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [cachedVoiceId, setCachedVoiceId] = useState(null);

  const effectiveSelectedFormat =
    selectedFormat || (format === "email" ? "email" : "");
  const isEmailSend = effectiveSelectedFormat === "email";
  const isVoiceMode = voice_format && voice_personality;

  // Animate the dots while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Add a dot every 0.5s

    return () => clearInterval(interval);
  }, [loading]);

  // Voice ID mapping using the stored personality keys (british, wise_wizard, etc.)
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

  const handleMakeChange = async () => {
    if (!message || !angry_at) return;

    // Stop any playing audio
    stopAudio();

    // Detect if ANY parameters have changed from last generation
    const currentParams = {
      message,
      angry_at,
      voice_format,
      voice_personality,
      kindness,
    };

    const hasParamsChanged = lastGenerationParams && (
      lastGenerationParams.message !== currentParams.message ||
      lastGenerationParams.angry_at !== currentParams.angry_at ||
      lastGenerationParams.voice_format !== currentParams.voice_format ||
      lastGenerationParams.voice_personality !== currentParams.voice_personality ||
      lastGenerationParams.kindness !== currentParams.kindness
    );

    // If parameters changed for voice mode, clear voice cache to force fresh generation
    if (hasParamsChanged && isVoiceMode) {
      setCachedVoiceId(null);
    }

    setLoading(true);

    try {
      // Determine tone dynamically based on kindness for voice mode
      let effectiveTone = tone;
      if (isVoiceMode) {
        if (kindness <= 2) {
          effectiveTone = "intimidating";
        } else if (kindness === 3) {
          effectiveTone = "disappointed";
        } else {
          effectiveTone = "professional";
        }
      }

      const payload = {
        message,
        angry_at,
        tone: effectiveTone,
        format: isVoiceMode ? "text" : format,
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      // Add voice-specific parameters if in voice mode
      if (isVoiceMode) {
        payload.voice_format = voice_format;
        payload.voice_personality = voice_personality;
      }

      const result = await transformService(payload);
      setTransformedMessage(result.transformed_message);
      setProfanityDetected(result.profanity_detected);

      // If voice mode, regenerate TTS
      if (isVoiceMode) {
        // Determine voice ID - directly look up using the stored personality value
        let selectedVoiceId = voiceIdMap[voice_personality];

        // If not a standard voice, it must be custom - use cached ID
        if (!selectedVoiceId) {
          selectedVoiceId = cachedVoiceId;
        }

        // Debug logging
        console.log("Voice personality:", voice_personality);
        console.log("Selected voice ID:", selectedVoiceId);
        console.log("Cached voice ID:", cachedVoiceId);

        if (!selectedVoiceId) {
          flashError("Invalid voice selected. Custom voices require initial generation.");
          return;
        }

        const ttsResponse = await fetch("http://127.0.0.1:8000/tts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: result.transformed_message,
            voice_id: selectedVoiceId,
            model_id: "eleven_multilingual_v2",
          }),
        });

        if (!ttsResponse.ok) {
          throw new Error("TTS generation failed");
        }

        const ttsData = await ttsResponse.json();
        setTtsFilePath(ttsData.file_path);

        const audioUrl = `http://127.0.0.1:8000/${ttsData.file_path}`;
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio); // Save to store so it can be stopped later
        audio.play();

        flashError("Voice regenerated! You can download the updated MP3.");
      }

      // Update last generation parameters after successful regeneration
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

  const handleCopy = async () => {
    if (!transformedMessage) return;

    try {
      await navigator.clipboard.writeText(transformedMessage);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

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

  // const handleDownload = () => {
  //   if (!ttsFilePath) return;

  //   const link = document.createElement("a");
  //   link.href = `http://127.0.0.1:8000/${ttsFilePath}`;
  //   link.download = ttsFilePath.split("/").pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = async () => {
    if (!ttsFilePath) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/${ttsFilePath}`);
      if (!response.ok) throw new Error("Failed to fetch audio file");

      const blob = await response.blob(); // get the file as a blob
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "VoiceMessage.mp3"; // filename only
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url); // clean up
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Only show if there's a transformed message
  if (!transformedMessage) {
    return null;
  }

  return (
    <section>
      <h2>Your Transformed Message</h2>
      <div
        style={{
          padding: "20px",
          margin: "20px 0",
          background: "#f5f5f5",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontStyle: loading ? "italic" : "normal",
          color: loading ? "#666" : "#000",
        }}
      >
        {loading
          ? `Generating your message${dots}`
          : transformedMessage || "Your message will appear here."}
      </div>

      <h3>Want to make changes?</h3>
      <p style={{ fontSize: "0.9em", color: "#666", marginTop: "-10px", marginBottom: "15px" }}>
        {isVoiceMode
          ? "Adjust the kindness slider below, or go back to change your message, angry at, voice format, or voice personality. Then click 'Make the change'."
          : "Adjust the kindness slider below, or go back to change your message, angry at, tone, or format. Then click 'Make the change'."}
      </p>
      <KindnessSlider />
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button onClick={handleMakeChange} disabled={loading}>
          Make the change
        </Button>
        <Button onClick={handleSend} disabled={loading || !isEmailSend}>
          {isEmailSend ? "Send It" : "Send It — Coming Soon 🚀"}
        </Button>
        <Button onClick={handleCopy} disabled={loading}>
          Copy
        </Button>
        {ttsFilePath && <Button onClick={handleDownload} disabled={loading}>Download Voice Message</Button>}
      </div>
    </section>
  );
}

export default OutputSection;
