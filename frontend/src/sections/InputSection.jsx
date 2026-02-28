import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import TextBox from "../components/ui/Textbox.jsx";
import TranscriptBox from "../components/ui/TranscriptBox.jsx";
import "./InputSection.css";

function InputSection() {
  const [target, setTarget] = useState(null);
  const [mode, setMode] = useState(null);
  const [transcript, setTranscript] = useState("");

  const handleStartRecording = () => {
    setTranscript("Recording... speak now!");
  };

  return (
    <section>
      <h2>Who are you mad at?</h2>
      <div className="button-group">
        {["Family", "Friend", "Partner", "Coworker/Classmate", "Stranger"].map(
          (person) => (
            <Button key={person} onClick={() => setTarget(person)}>
              {person}
            </Button>
          ),
        )}
      </div>

      <h2>What are you mad about?</h2>
      <div className="button-group">
        {[
          { label: "Let me write it.", value: "write" },
          { label: "Let me say it.", value: "voice" },
        ].map(({ label, value }) => (
          <Button key={value} onClick={() => setMode(value)}>
            {label}
          </Button>
        ))}
      </div>

      {mode === "write" && (
        <div>
          <TextBox
            value={transcript}
            onChange={setTranscript}
            placeholder="Write your angry message..."
          />
        </div>
      )}

      {mode === "voice" && (
        <div>
          <Button onClick={handleStartRecording}>Start recording 🎤</Button>
          <TranscriptBox transcript={transcript} />
        </div>
      )}
    </section>
  );
}

export default InputSection;
