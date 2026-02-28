import React, { useState, useEffect, useRef } from "react";

function InputTextArea() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // NEW: persistent transcript
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptChunk + " ";
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      setText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          finalTranscriptRef.current = e.target.value; // keep edits
        }}
        placeholder="Type or speak your message..."
        rows={5}
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />
      <button onClick={toggleListening} style={{ width: "150px", padding: "8px" }}>
        {listening ? "Stop Listening" : "Start Speaking"}
      </button>
    </div>
  );
}

export default InputTextArea;