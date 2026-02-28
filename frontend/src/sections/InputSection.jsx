import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import TextBox from "../components/ui/Textbox.jsx";
import TranscriptBox from "../components/ui/TranscriptBox.jsx";
import "./InputSection.css";

function InputSection() {
  const [target, setTarget] = useState(null);
  const [mode, setMode] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartPause = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
      setTranscript("Recording... speak now!");
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    setTranscript("Recording stopped.");
  };

  return (
    <section>
      <h2>Who is making you crash out?</h2>
      <div className="button-group">
        {["Family", "Friend", "Partner", "Coworker/Classmate", "Stranger"].map(
          (person) => (
            <Button key={person} onClick={() => setTarget(person)}>
              {person}
            </Button>
          ),
        )}
      </div>

      <h2>Why are you crashing out?</h2>
      <div className="button-group">
        {[
          { label: "I'll write about it.", value: "write" },
          { label: "I'll talk about it.", value: "voice" },
        ].map(({ label, value }) => (
          <Button key={value} onClick={() => setMode(value)}>
            {label}
          </Button>
        ))}
      </div>

      {mode === "write" && (
        <TextBox
          value={transcript}
          onChange={setTranscript}
          placeholder="Write your angry message..."
        />
      )}

      {mode === "voice" && (
        <div className="voice-container">
          <div className="transcript-wrapper">
            <div className="record-controls">
              <Button className="record-btn" onClick={handleStartPause}>
                {!isRecording ? (
                  <>
                    <span className="icon">▶</span>
                    Start Recording
                  </>
                ) : isPaused ? (
                  <>
                    <span className="icon">▶</span>
                    Resume Recording
                  </>
                ) : (
                  <>
                    <span className="icon">⏸</span>
                    Pause Recording
                  </>
                )}
              </Button>

              {isRecording && (
                <Button className="stop-btn" onClick={handleStop}>
                  <span className="icon">⏹</span>
                  Stop Recording
                </Button>
              )}
            </div>

            <TranscriptBox transcript={transcript} />
          </div>
        </div>
      )}
    </section>
  );
}

export default InputSection;
