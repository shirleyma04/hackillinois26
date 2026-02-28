import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import TextBox from "../components/ui/Textbox.jsx";
import TranscriptBox from "../components/ui/TranscriptBox.jsx";

function InputSection() {
  const [target, setTarget] = useState(null);
  const [mode, setMode] = useState(null);
  const [transcript, setTranscript] = useState("");

  const handleStartRecording = () => {
    // Placeholder: You can integrate with /api/stt here
    // Simulate a recording transcript update
    setTranscript("Recording... speak now!");
  };

  return (
    <section>
      <h2>Who are you mad at?</h2>
      {["Family", "Friend", "Partner", "Coworker/Classmate", "Stranger"].map(
        (person) => (
          <Button
            key={person}
            onClick={() => setTarget(person)}
            variant={target === person ? "primary" : "default"}
          >
            {person}
          </Button>
        ),
      )}

      <h2>What are you mad about?</h2>
      {[
        { label: "Let me write it", value: "write" },
        { label: "Let me say it", value: "voice" },
      ].map(({ label, value }) => (
        <Button
          key={value}
          onClick={() => setMode(value)}
          variant={mode === value ? "primary" : "default"}
        >
          {label}
        </Button>
      ))}
      <TextBox transcript={transcript} />

      {mode === "voice" && (
        <div>
          <h3>Record your voice message:</h3>
          <Button onClick={handleStartRecording}>Start recording 🎤</Button>
          <TranscriptBox transcript={transcript} />
        </div>
      )}
    </section>
  );
}

export default InputSection;
