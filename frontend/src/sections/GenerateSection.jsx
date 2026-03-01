import { useEffect, useState } from "react";
import Dropdown from "../components/ui/Dropdown.jsx";
import Button from "../components/ui/Button.jsx";
import KindnessOutputCard from "../components/output/KindnessOutputCard.jsx";
import { textGenerateService } from "../services/textGenerateService";
import { voiceGenerateService } from "../services/voiceGenerateService";
import { useCrashOutStore } from "../store/useCrashOutStore";
import "./GenerateSection.css";

function GenerateSection() {
  const inputText = useCrashOutStore((state) => state.inputText);
  const kindness = useCrashOutStore((state) => state.kindness);

  const [mode, setMode] = useState(null); // "text", "voice", or null (initial)
  const [textFormat, setTextFormat] = useState("Select format...");
  const [tone, setTone] = useState("Select tone...");
  const [voiceFormat, setVoiceFormat] = useState("Select format...");
  const [voice, setVoice] = useState("Select voice...");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const clearOutput = () => {
    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
    }
    setHasGenerated(false);
    setGeneratedText("");
    setAudioUrl("");
    setError("");
  };

  const handleBack = () => {
    setMode(null);
    clearOutput();
  };

  const handleModeSelect = (nextMode) => {
    setMode(nextMode);
    clearOutput();
  };

  const normalizeOption = (option) =>
    option && !option.startsWith("Select ") ? option : "";

  const toBlobUrlFromBase64 = (value) => {
    const base64 = value.includes(",") ? value.split(",")[1] : value;
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
  };

  const toBlobUrlFromBytes = (audioBytes) => {
    const bytes = Array.isArray(audioBytes) ? new Uint8Array(audioBytes) : audioBytes;
    return URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
  };

  const runTextGenerate = async () => {
    const response = await textGenerateService({
      inputText,
      format: normalizeOption(textFormat),
      tone: normalizeOption(tone),
      kindness,
    });

    const nextText =
      response?.generatedText || response?.text || response?.message || "";
    if (!nextText) {
      throw new Error("No text was returned from the backend.");
    }
    setGeneratedText(nextText);
  };

  const runVoiceGenerate = async () => {
    const response = await voiceGenerateService({
      inputText,
      format: normalizeOption(voiceFormat),
      voiceStyle: normalizeOption(voice),
      kindness,
    });

    const nextUrl = response?.audioUrl || response?.url || response?.downloadUrl || "";
    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
    }

    if (nextUrl) {
      setAudioUrl(nextUrl);
      return;
    }

    const base64 = response?.audioBase64 || response?.base64 || response?.audio || "";
    if (base64) {
      setAudioUrl(toBlobUrlFromBase64(base64));
      return;
    }

    const bytes = response?.audioBytes || response?.bytes;
    if (bytes) {
      setAudioUrl(toBlobUrlFromBytes(bytes));
      return;
    }

    throw new Error("No MP3 audio was returned from the backend.");
  };

  const handleGenerate = async () => {
    setHasGenerated(true);
    setIsLoading(true);
    setError("");

    try {
      if (!inputText.trim()) {
        throw new Error("Please enter a message first.");
      }

      if (mode === "text") {
        await runTextGenerate();
      }
      if (mode === "voice") {
        await runVoiceGenerate();
      }
    } catch (requestError) {
      setError(requestError.message || "Generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setError("");
    } catch {
      setError("Could not copy message to clipboard.");
    }
  };

  const handleDownloadVoice = () => {
    if (!audioUrl) return;
    const anchor = document.createElement("a");
    anchor.href = audioUrl;
    anchor.download = "message.mp3";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <section className="generate-section">
      {/* Choice buttons */}
      {!mode && (
        <div className="choice-buttons">
          <Button onClick={() => handleModeSelect("text")}>
            Generate a text message for me.
          </Button>
          <Button onClick={() => handleModeSelect("voice")}>
            Generate a voice message for me.
          </Button>
        </div>
      )}

      {/* Text message generator */}
      {mode === "text" && (
        <div className="generator-container fade-in">
          <Button className="back-button" onClick={handleBack}>
            ← Back
          </Button>
          <h2>Generate a Text Message</h2>
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
            label={tone}
            options={[
              "Professional",
              "Intimidating",
              "Sarcastic",
              "Condescending",
              "Disappointed",
              "Custom...",
            ]}
            onSelect={setTone}
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate!"}
          </Button>

          {hasGenerated ? (
            <KindnessOutputCard
              mode={mode}
              isLoading={isLoading}
              error={error}
              generatedText={generatedText}
              audioUrl={audioUrl}
              onMakeChange={handleGenerate}
              onCopyMessage={handleCopyMessage}
              onDownloadVoice={handleDownloadVoice}
            />
          ) : null}
        </div>
      )}

      {/* Voice message generator */}
      {mode === "voice" && (
        <div className="generator-container fade-in">
          <Button className="back-button" onClick={handleBack}>
            ← Back
          </Button>
          <h2>Generate a Voice Message</h2>
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
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate!"}
          </Button>

          {hasGenerated ? (
            <KindnessOutputCard
              mode={mode}
              isLoading={isLoading}
              error={error}
              generatedText={generatedText}
              audioUrl={audioUrl}
              onMakeChange={handleGenerate}
              onCopyMessage={handleCopyMessage}
              onDownloadVoice={handleDownloadVoice}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}

export default GenerateSection;
