import { useState } from "react";
import Dropdown from "../components/ui/Dropdown.jsx";
import Button from "../components/ui/Button.jsx";
import "./GenerateSection.css";

function GenerateSection() {
  const [mode, setMode] = useState(null); // "text", "voice", or null (initial)
  const [textFormat, setTextFormat] = useState("Select format...");
  const [tone, setTone] = useState("Select tone...");
  const [voiceFormat, setVoiceFormat] = useState("Select format...");
  const [voice, setVoice] = useState("Select voice...");

  const handleBack = () => setMode(null);

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
          <Button>Generate!</Button>
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
          <Button>Generate!</Button>
        </div>
      )}
    </section>
  );
}

export default GenerateSection;
