import { useState } from "react";
import Dropdown from "../components/ui/Dropdown.jsx";
import Button from "../components/ui/Button.jsx";
function GenerateSection() {
  const [textFormat, setTextFormat] = useState("Select format");
  const [tone, setTone] = useState("Select tone");
  const [voiceFormat, setVoiceFormat] = useState("Select format");
  const [voice, setVoice] = useState("Select voice");

  return (
    <section>
      <h2>Generate a text message</h2>
      <h3>How do you want to format your message?</h3>
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
      <h3>Choose a tone.</h3>
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

      <h2>Generate a voice message</h2>
      <h3>How do you want to format your message?</h3>
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
      <h3>Choose a voice.</h3>
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

      <Button>Generate it!</Button>
    </section>
  );
}

export default GenerateSection;
