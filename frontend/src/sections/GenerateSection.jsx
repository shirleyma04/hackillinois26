 import { useState, useEffect, useRef } from "react";
  import { useCrashOutStore } from "../store/useCrashOutStore";
  import { transformService } from "../services/transformService";
  import Dropdown from "../components/ui/Dropdown.jsx";
  import Button from "../components/ui/Button.jsx";
  import "./GenerateSection.css";

  function GenerateSection() {
    const [mode, setMode] = useState(null);
    const [textFormat, setTextFormat] = useState("Select format...");
    const [toneLabel, setToneLabel] = useState("Select tone...");
    const [voiceFormat, setVoiceFormat] = useState("Select format...");
    const [voice, setVoice] = useState("Select voice...");
    const [customTextFormat, setCustomTextFormat] = useState("");
    const [customTone, setCustomTone] = useState("");
    const [customVoiceFormat, setCustomVoiceFormat] = useState("");
    const [customVoice, setCustomVoice] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorKey, setErrorKey] = useState(0);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [cachedVoiceId, setCachedVoiceId] = useState(null);

    const message = useCrashOutStore((state) => state.message);
    const angry_at = useCrashOutStore((state) => state.angry_at);
    const kindness = useCrashOutStore((state) => state.kindness);
    const error = useCrashOutStore((state) => state.error);

    const setTtsFilePath = useCrashOutStore((state) => state.setTtsFilePath);
    const setFormat = useCrashOutStore((state) => state.setFormat);
    const setSelectedFormat = useCrashOutStore((state) => state.setSelectedFormat);
    const setTone = useCrashOutStore((state) => state.setTone);
    const setError = useCrashOutStore((state) => state.setError);
    const setTransformedMessage = useCrashOutStore(
      (state) => state.setTransformedMessage,
    );
    const setProfanityDetected = useCrashOutStore(
      (state) => state.setProfanityDetected,
    );
    const setStoreVoiceFormat = useCrashOutStore((state) => state.setVoiceFormat);
    const setStoreVoicePersonality = useCrashOutStore((state) => state.setVoicePersonality);
    const setKindness = useCrashOutStore((state) => state.setKindness);
    const stopAudio = useCrashOutStore((state) => state.stopAudio);
    const setCurrentAudio = useCrashOutStore((state) => state.setCurrentAudio);
    const setLastGenerationParams = useCrashOutStore((state) => state.setLastGenerationParams);

    const handleBack = () => {
      setMode(null);
      setHasGenerated(false);
      setCachedVoiceId(null);
    };
    return mapping[label] || label.toLowerCase();
  };

  const mapVoicePersonality = (label) => {
    const mapping = {
      British: "british",
      "Wise Old Wizard": "wise_wizard",
      "Teenage Girl": "teenage_girl",
      "Corporate Executive": "corporate_executive",
      "Cocky Villain": "cocky_villain",
      "My Own Voice": "my_own_voice",
    };
    return mapping[label] || label.toLowerCase();
  };

  const handleTextFormatSelect = (selected) => {
    setTextFormat(selected);
    setSelectedFormat(mapSelectedFormat(selected));
  };

  const getFormatComingSoonMessage = () => {
    if (textFormat === "Select format..." || textFormat === "Email") {
      return null;
    }
    const label = textFormat === "Custom..." ? "Custom" : textFormat;
    return `Feature to send '${label}' is coming soon...`;
  };

  const flashError = (msg) => {
    setError(msg);
    setErrorKey((key) => key + 1);
    setTimeout(() => setError(null), 1500);
  };

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

  const handleGenerateText = async () => {
    if (!validateTextFields()) return;

    setLoading(true);
    setTransformedMessage("");
    try {
      const payload = {
        message,
        angry_at,
        tone: toneLabel === "Custom..." ? customTone : mapTone(toneLabel),
        format:
          textFormat === "Custom..." ? customTextFormat : mapFormat(textFormat),
        kindness_scale: kindness,
        profanity_check: "censored",

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
        "Custom...": "custom",
      })[label] || label.toLowerCase();

    const mapSelectedFormat = (label) =>
      ({
        Email: "email",
        "Text Message": "text_message",
        "Social Media Post": "social_post",
        Review: "review",
        "Custom...": "custom",
      })[label] || label.toLowerCase();

    const mapVoiceFormat = (label) => {
      const mapping = {
        Rap: "rap",
        "Cursed Spell": "cursed_spell",
        "Shakespearean Monologue": "shakespearean",
        "Sports Announcement": "sports_announcement",
        "Villain Monologue": "villain_monologue",
      };
      return mapping[label] || label.toLowerCase();
    };

    const mapVoicePersonality = (label) => {
      const mapping = {
        British: "british",
        "Wise Old Wizard": "wise_wizard",
        "Teenage Girl": "teenage_girl",
        "Corporate Executive": "corporate_executive",
        "Cocky Villain": "cocky_villain",
        "My Own Voice": "my_own_voice",
      };
      return mapping[label] || label.toLowerCase();
    };

    const handleTextFormatSelect = (selected) => {
      setTextFormat(selected);
      setSelectedFormat(mapSelectedFormat(selected));
    };

    const getFormatComingSoonMessage = () => {
      if (textFormat === "Select format..." || textFormat === "Email") {
        return null;
      }
      const label = textFormat === "Custom..." ? "Custom" : textFormat;
      return `${label} is coming soon 🚀`;
    };

    const flashError = (msg) => {
      setError(msg);
      setErrorKey((key) => key + 1);
      setTimeout(() => setError(null), 1500);
    };

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

    const handleGenerateText = async () => {
      if (!validateTextFields()) return;

      // Reset kindness to default when generating new message
      setKindness(3);

      setLoading(true);
      setTransformedMessage("");
      try {
        const payload = {
          message,
          angry_at,
          tone: toneLabel === "Custom..." ? customTone : mapTone(toneLabel),
          format:
            textFormat === "Custom..." ? customTextFormat : mapFormat(textFormat),
          kindness_scale: 3, // Use default kindness for initial generation
          profanity_check: "censored",
        };

        setFormat(mapFormat(textFormat));
        setSelectedFormat(mapSelectedFormat(textFormat));
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

    // Voice ID mapping using the stored personality keys (british, wise_wizard, etc.)
    const voiceIdMap = {
      british: "P4DhdyNCB4Nl6MA0sL45",
      wise_wizard: "0rEo3eAjssGDUCXHYENf",
      teenage_girl: "SaxQmcnUVUYw2AfMaRkL",
      corporate_executive: "cW9TKFZZUF6RNR1xt00R",
      cocky_villain: "zYcjlYFOd3taleS0gkk3",
    };

    const handleGenerateVoice = async () => {
      if (!validateVoiceFields()) return;

      // Additional validation for custom voice
      if (voice === "Custom..." && customVoice && customVoice.length < 20) {
        flashError("Custom voice description must be at least 20 characters");
        return;
      }

      // Stop any currently playing audio
      stopAudio();

      // Reset kindness to default when generating new message
      setKindness(3);

      setLoading(true);
      setTransformedMessage("");
      try {
        // Determine tone based on default kindness (3) for initial generation
        let dynamicTone = "disappointed"; // kindness 3 = disappointed tone

        const mappedVoiceFormat = voiceFormat === "Custom..." ? customVoiceFormat : mapVoiceFormat(voiceFormat);
        const mappedVoicePersonality = voice === "Custom..." ? customVoice : mapVoicePersonality(voice);

        // Save voice settings to store for regeneration
        setStoreVoiceFormat(mappedVoiceFormat);
        setStoreVoicePersonality(mappedVoicePersonality);
        setTone(dynamicTone);

        const transformPayload = {
          message,
          angry_at,
          tone: dynamicTone, // Use dynamic tone based on kindness
          format: "text",
          kindness_scale: 3, // Use default kindness for initial generation
          profanity_check: "censored",
          voice_format: mappedVoiceFormat,
          voice_personality: mappedVoicePersonality,
        };

        const transformResult = await transformService(transformPayload);
        setTransformedMessage(transformResult.transformed_message);
        setProfanityDetected(transformResult.profanity_detected);

        // Handle voice ID selection
        let selectedVoiceId;

        // Check if "My Own Voice" - use cloned voice ID
        if (voice === "My Own Voice") {
          const clonedVoiceId = useCrashOutStore.getState().clonedVoiceId;
          selectedVoiceId = clonedVoiceId || "KZccS6E7T0Hp7OtFcE8A"; // Fallback to default
        } else if (voice === "Custom..." && customVoice) {
          // Custom voice generation with ElevenLabs
          selectedVoiceId = cachedVoiceId;

          if (!cachedVoiceId) {
            try {
              // ElevenLabs requires text to be at least 100 characters for voice design
              let textForVoiceDesign = transformResult.transformed_message;
              if (textForVoiceDesign.length < 100) {
                textForVoiceDesign = `${textForVoiceDesign} This is a sample demonstration message created for the purpose of voice generation and preview.`;
              }

              const designResponse = await fetch("http://127.0.0.1:8000/voices/design", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  voice_description: customVoice,
                  text: textForVoiceDesign,
                  model_id: "eleven_multilingual_ttv_v2",
                }),
              });

              if (!designResponse.ok) {
                throw new Error("Voice design failed");
              }

              const designData = await designResponse.json();

              if (!designData.previews || designData.previews.length === 0) {
                throw new Error("No voice previews generated");
              }

              const randomPreview = designData.previews[Math.floor(Math.random() * designData.previews.length)];

              const createResponse = await fetch("http://127.0.0.1:8000/voices/design/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  voice_name: `Custom: ${customVoice.substring(0, 30)}`,
                  voice_description: customVoice,
                  generated_voice_id: randomPreview.generated_voice_id,
                }),
              });

              if (!createResponse.ok) {
                throw new Error("Voice creation failed");
              }

              const createData = await createResponse.json();
              selectedVoiceId = createData.voice_id;
              setCachedVoiceId(selectedVoiceId);
            } catch (voiceError) {
              console.error("Custom voice generation error:", voiceError);
              flashError("Failed to generate custom voice: " + voiceError.message);
              return;
            }
          }
        } else {
          // Standard voice - use mapped personality
          selectedVoiceId = cachedVoiceId || voiceIdMap[mappedVoicePersonality];
        }

        console.log("Initial generation - Voice:", voice);
        console.log("Mapped personality:", mappedVoicePersonality);
        console.log("Selected voice ID:", selectedVoiceId);

        if (!selectedVoiceId) {
          flashError("Invalid voice selected");
          return;
        }

        // Cache the selected voice ID for regenerations
        if (!cachedVoiceId) {
          setCachedVoiceId(selectedVoiceId);
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
        setTtsFilePath(ttsData.file_path);

        const audioUrl = `http://127.0.0.1:8000/${ttsData.file_path}`;
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio); // Save to store so it can be stopped later
        audio.play();

        // Save generation parameters for change detection
        setLastGenerationParams({
          message,
          angry_at,
          voice_format: mappedVoiceFormat,
          voice_personality: mappedVoicePersonality,
          kindness: 3, // Initial generation uses default kindness
        });

        setHasGenerated(true); // Mark that we've generated once
        flashError("Voice generated! You can now download the MP3.");
      } catch (err) {
        flashError(err.message || "Failed to generate voice message");
      } finally {
        setLoading(false);
      }
    };

      const ttsData = await ttsResponse.json();
      setTtsFilePath(ttsData.file_path);

      const audioUrl = `http://127.0.0.1:8000/${ttsData.file_path}`;
      const audio = new Audio(audioUrl);
      audio.play();

      flashError("Voice generated! You can now download the MP3.");
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
          <h3>What should the message format be?</h3>
          {getFormatComingSoonMessage() ? (
            <p className="format-helper-text">{getFormatComingSoonMessage()}</p>
          ) : null}
          <Dropdown
            label={textFormat}
            options={[
              "Email",
              "Text Message",
              "Social Media Post",
              "Review",
              "Custom...",
            ]}
            onSelect={handleTextFormatSelect}
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
          {voiceFormat === "Custom..." && (
            <input
              className="custom-input"
              type="text"
              placeholder="Enter custom voice format..."
              value={customVoiceFormat}
              onChange={(e) => setCustomVoiceFormat(e.target.value)}
            />
          )}
          <h3>What should the voice be?</h3>
          <Dropdown
            label={voice}
            options={[
              "My Own Voice",
              "British",
              "Wise Old Wizard",
              "Teenage Girl",
              "Corporate Executive",
              "Cocky Villain",
              "My Own Voice",
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
