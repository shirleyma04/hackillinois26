import { useState, useEffect } from "react";
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
  const [customTextFormat, setCustomTextFormat] = useState("");
  const [customTone, setCustomTone] = useState("");
  const [customVoiceFormat, setCustomVoiceFormat] = useState("");
  const [customVoice, setCustomVoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0); // trigger re-render for flash animation

  // Zustand state
  const message = useCrashOutStore((state) => state.message);
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const kindness = useCrashOutStore((state) => state.kindness);
  const error = useCrashOutStore((state) => state.error); // subscribe to error changes
  const setTtsFilePath = useCrashOutStore((state) => state.setTtsFilePath);

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
  const mapTone = (label) =>
    ({
      Professional: "professional",
      Intimidating: "intimidating",
      Sarcastic: "sarcastic",
      Condescending: "condescending",
      Disappointed: "disappointed",
    })[label] || label.toLowerCase();

  const mapFormat = (label) =>
    ({
      Email: "email",
      "Text Message": "text",
      "Social Media Post": "social_media",
      Review: "review",
      Custom: "custom",
    })[label] || label.toLowerCase();

  // Flash error with slight animation
  const flashError = (msg) => {
    setError(msg);
    setErrorKey((k) => k + 1); // trigger animation re-render
    setTimeout(() => setError(null), 1500);
  };

  // Validate fields on button click only
  const validateTextFields = () => {
    if (
      !message ||
      !angry_at ||
      textFormat === "Select format..." ||
      toneLabel === "Select tone..."
    ) {
      flashError("!! FILL OUT ALL FIELDS !!");
      return false;
    }
    return true;
  };

  const validateVoiceFields = () => {
    if (
      !message ||
      !angry_at ||
      voiceFormat === "Select format..." ||
      voice === "Select voice..."
    ) {
      flashError("!! FILL OUT ALL FIELDS !!");
      return false;
    }
    return true;
  };

  // Handle TEXT generation
  const handleGenerateText = async () => {
    if (!validateTextFields()) return;

    setLoading(true);
    setTransformedMessage("");
    try {
      const payload = {
        message,
        angry_at,
        tone: mapTone(toneLabel),
        format: mapFormat(textFormat),
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      setFormat(mapFormat(textFormat));
      setTone(mapTone(toneLabel));

      const result = await transformService(payload);
      setTransformedMessage(result.transformed_message);
      setProfanityDetected(result.profanity_detected);
    } catch (err) {
      flashError(err.message || "Failed to transform message");
    } finally {
      setLoading(false);
    }
  };

  // Handle VOICE generation
  const voiceIdMap = {
    "British": "P4DhdyNCB4Nl6MA0sL45",
    "Wise Old Wizard": "0rEo3eAjssGDUCXHYENf",
    "Teenage Girl": "SaxQmcnUVUYw2AfMaRkL",
    "Corporate Executive": "cW9TKFZZUF6RNR1xt00R",
    "Cocky Villain": "zYcjlYFOd3taleS0gkk3",
  };

  // Handle VOICE generation (TEXT transform + TTS)
  const handleGenerateVoice = async () => {
    if (!validateVoiceFields()) return;

    setLoading(true);
    setTransformedMessage("");
    try {
      const transformPayload = {
        message,
        angry_at,
        tone: "professional",
        format: "text",
        kindness_scale: kindness,
        profanity_check: "censored",
      };
      const transformResult = await transformService(transformPayload);
      setTransformedMessage(transformResult.transformed_message);
      setProfanityDetected(transformResult.profanity_detected);

      flashError(
        "Voice generated! (Audio playback coming soon - TTS integration needed)",
      );
      // Step 2: Generate speech from transformed message
      console.log("VOICE - Step 2: Generating speech (TTS)...");

      // Step 2: Generate speech from transformed message
      const selectedVoiceId = voiceIdMap[voice];

      if (!selectedVoiceId) {
        setError("Invalid voice selected");
        return;
      }

      const ttsResponse = await fetch("http://127.0.0.1:8000/tts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transformResult.transformed_message,
          voice_id: selectedVoiceId,
          model_id: "eleven_multilingual_v2",
        }),
      });

      if (!ttsResponse.ok) {
        throw new Error("TTS generation failed");
      }

      const ttsData = await ttsResponse.json();
      console.log("VOICE - TTS result:", ttsData);

      setTtsFilePath(ttsData.file_path);

      // 🎧 Play audio automatically
      const audioUrl = `http://127.0.0.1:8000/${ttsData.file_path}`;
      const audio = new Audio(audioUrl);
      audio.play();

      // Optional: store audio URL in Zustand later
      // setAudioUrl(audioUrl);

      setError("Voice generated! You can now download the MP3.");

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

      // console.log("VOICE - TTS integration pending (your friend's work)");
      // setError("Voice generated! (Audio playback coming soon - TTS integration needed)");

    } catch (err) {
      flashError(err.message || "Failed to generate voice message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="generate-section">
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

      {mode === "text" && (
        <div className="generator-container fade-in">
          <h2>Generate A Text Message</h2>
          <h3>Message Format</h3>
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
          {textFormat === "Custom..." && (
            <input
              className="custom-input"
              type="text"
              placeholder="Enter custom format..."
              value={customTextFormat}
              onChange={(e) => setCustomTextFormat(e.target.value)}
            />
          )}
          <h3>Message Tone</h3>
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
          {toneLabel === "Custom..." && (
            <input
              className="custom-input"
              type="text"
              placeholder="Enter custom tone..."
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
            />
          )}
          {error && (
            <div key={errorKey} className="error-alert flash">
              {error}
            </div>
          )}
          <Button onClick={handleGenerateText} disabled={loading}>
            {loading ? "Generating..." : "Generate!"}
          </Button>
          <Button className="back-button" onClick={handleBack}>
            ← Back to selection
          </Button>
        </div>
      )}

      {mode === "voice" && (
        <div className="generator-container fade-in">
          <h2>Generate A Voice Message</h2>
          <h3>Message Format</h3>
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
          {voiceFormat === "Custom..." && (
            <input
              className="custom-input"
              type="text"
              placeholder="Enter custom voice format..."
              value={customVoiceFormat}
              onChange={(e) => setCustomVoiceFormat(e.target.value)}
            />
          )}
          <h3>Voice</h3>
          <Dropdown
            label={voice}
            options={[
              "My Own Voice",
              "British",
              "Wise Old Wizard",
              "Teenage Girl",
              "Corporate Executive",
              "Cocky Villain",
              "Custom...",
            ]}
            onSelect={setVoice}
          />
          {voice === "Custom..." && (
            <input
              className="custom-input"
              type="text"
              placeholder="Enter custom voice..."
              value={customVoice}
              onChange={(e) => setCustomVoice(e.target.value)}
            />
          )}
          {error && (
            <div key={errorKey} className="error-alert flash">
              {error}
            </div>
          )}
          <Button onClick={handleGenerateVoice} disabled={loading}>
            {loading ? "Generating..." : "Generate!"}
          </Button>
          <Button className="back-button" onClick={handleBack}>
            ← Back
          </Button>
        </div>
      )}
    </section>
  );
}

export default GenerateSection;
