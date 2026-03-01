import { useState } from "react";
import { useCrashOutStore } from "../store/useCrashOutStore";
import { transformService } from "../services/transformService";
import Dropdown from "../components/ui/Dropdown.jsx";
import Button from "../components/ui/Button.jsx";
import "./GenerateSection.css";

function GenerateSection() {
  const [mode, setMode] = useState(null); // "text", "voice", or null (initial)
  const [textFormat, setTextFormat] = useState("Select format...");
  const [toneLabel, setToneLabel] = useState("Select tone...");
  const [voiceFormat, setVoiceFormat] = useState("Select format...");
  const [voice, setVoice] = useState("Select voice...");

  // Get state from Zustand store
  const message = useCrashOutStore((state) => state.message);
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const kindness = useCrashOutStore((state) => state.kindness);

  // Get setters
  const setFormat = useCrashOutStore((state) => state.setFormat);
  const setTone = useCrashOutStore((state) => state.setTone);
  const setError = useCrashOutStore((state) => state.setError);
  const setTransformedMessage = useCrashOutStore(
    (state) => state.setTransformedMessage,
  );
  const setProfanityDetected = useCrashOutStore(
    (state) => state.setProfanityDetected,
  );

  const handleBack = () => setMode(null);

  // Map UI labels to backend values
  const mapTone = (label) => {
    const mapping = {
      Professional: "professional",
      Intimidating: "intimidating",
      Sarcastic: "sarcastic",
      Condescending: "condescending",
      Disappointed: "disappointed",
    };
    return mapping[label] || label.toLowerCase();
  };

  const mapFormat = (label) => {
    const mapping = {
      Email: "email",
      "Text Message": "text",
      "Social Media Post": "social_media",
      Review: "review",
      Custom: "custom",
    };
    return mapping[label] || label.toLowerCase();
  };

  // Handle TEXT generation
  const handleGenerateText = async () => {
    // Validation
    if (
      !message ||
      !angry_at ||
      textFormat === "Select format..." ||
      toneLabel === "Select tone..."
    ) {
      setError("Please fill in all fields (message, target, format, tone)");
      return;
    }

    setError(null);

    try {
      const payload = {
        message,
        angry_at,
        tone: mapTone(toneLabel),
        format: mapFormat(textFormat),
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      console.log("TEXT - Sending payload:", payload);

      // Store format and tone in global state
      setFormat(mapFormat(textFormat));
      setTone(mapTone(toneLabel));

      const result = await transformService(payload);

      console.log("TEXT - Received result:", result);

      setTransformedMessage(result.transformed_message);
      setProfanityDetected(result.profanity_detected);
    } catch (err) {
      console.error("TEXT - Transform error:", err);
      setError(err.message || "Failed to transform message");
    }
  };

  // Handle VOICE generation (TEXT transform + TTS)
  const handleGenerateVoice = async () => {
    // Validation
    if (
      !message ||
      !angry_at ||
      voiceFormat === "Select format..." ||
      voice === "Select voice..."
    ) {
      setError(
        "Please fill in all fields (message, target, voice format, voice)",
      );
      return;
    }

    setError(null);

    try {
      // Step 1: Transform the message first (using text format "text" for voice)
      const transformPayload = {
        message,
        angry_at,
        tone: "professional", // Default tone for voice (can be customized later)
        format: "text", // Use text format for voice output
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      console.log("VOICE - Step 1: Transforming message:", transformPayload);

      const transformResult = await transformService(transformPayload);

      console.log("VOICE - Step 1 Complete:", transformResult);

      // Store the transformed message
      setTransformedMessage(transformResult.transformed_message);
      setProfanityDetected(transformResult.profanity_detected);

      // Step 2: Generate speech from transformed message
      console.log("VOICE - Step 2: Generating speech (TTS)...");

      // TODO: Call TTS service
      // const ttsResult = await fetch('http://localhost:8000/tts/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     text: transformResult.transformed_message,
      //     voice_id: "JBFqnCBsd6RMkjVDRZzb", // Default voice (map from dropdown later)
      //     model_id: "eleven_multilingual_v2"
      //   })
      // });
      // const audioData = await ttsResult.json();
      // Store audio file path and play it

      console.log("VOICE - TTS integration pending (your friend's work)");
      setError(
        "Voice generated! (Audio playback coming soon - TTS integration needed)",
      );
    } catch (err) {
      console.error("VOICE - Error:", err);
      setError(err.message || "Failed to generate voice message");
    }
  };

  return (
    <section className="generate-section">
      {/* Choice buttons */}
      {!mode && (
        <div className="choice-buttons">
          <Button onClick={() => setMode("text")}>
            Generate a text message for me.
          </Button>
          <Button onClick={() => setMode("voice")}>
            Generate a voice message for me.
          </Button>
        </div>
      )}

      {/* Text message generator */}
      {mode === "text" && (
        <div className="generator-container fade-in">
          <h2>Generate A Text Message</h2>
          <h3>What should the message format be?</h3>
          <Dropdown
            label={textFormat}
            options={[
              "Email",
              "Text Message",
              "Social Media Post",
              "Review",
              "Custom...",
            ]}
            onSelect={setTextFormat}
          />
          <h3>What should the message tone be?</h3>
          <Dropdown
            label={toneLabel}
            options={[
              "Professional",
              "Intimidating",
              "Sarcastic",
              "Condescending",
              "Disappointed",
              "Custom...",
            ]}
            onSelect={setToneLabel}
          />
          <Button onClick={handleGenerateText}>Generate!</Button>
          <Button className="back-button" onClick={handleBack}>
            ← Back to selection
          </Button>
        </div>
      )}

      {/* Voice message generator */}
      {mode === "voice" && (
        <div className="generator-container fade-in">
          <h2>Generate A Voice Message</h2>
          <h3>What should the message format be?</h3>
          <Dropdown
            label={voiceFormat}
            options={[
              "Rap",
              "Cursed Spell",
              "Shakespearean Monologue",
              "Sports Announcement",
              "Villain Monologue",
              "Custom...",
            ]}
            onSelect={setVoiceFormat}
          />
          <h3>What should the voice be?</h3>
          <Dropdown
            label={voice}
            options={[
              "British",
              "Wise Old Wizard",
              "Teenage Girl",
              "Corporate Executive",
              "Cocky Villain",
              "Custom...",
            ]}
            onSelect={setVoice}
          />
          <Button onClick={handleGenerateVoice}>Generate!</Button>
          <Button className="back-button" onClick={handleBack}>
            ← Back
          </Button>
        </div>
      )}
    </section>
  );
}

export default GenerateSection;
