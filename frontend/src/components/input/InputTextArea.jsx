import React, { useState, useEffect, useRef } from "react";
import "./InputTextArea.css";
import Button from "../ui/Button.jsx";

function InputTextArea() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const textareaRef = useRef(null);

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

  // 🔥 Auto-resize logic (2 → 6 lines max)
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";

      const lineHeight = parseInt(getComputedStyle(el).lineHeight);
      const minHeight = lineHeight * 2;
      const maxHeight = lineHeight * 6;

      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = Math.max(newHeight, minHeight) + "px";

      // Enable scroll only after max height reached
      el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [text]);

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
    <div className="input-wrapper">
      <textarea
        ref={textareaRef}
        className="textbox"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          finalTranscriptRef.current = e.target.value;
        }}
        placeholder="Type your message..."
        rows={2}
      />

      <div className="speaking-button-wrapper">
        <Button
          className={`record-btn ${listening ? "recording" : ""}`}
          onClick={toggleListening}
        >
          <span
            className={`record-icon ${listening ? "pause" : "play"}`}
          ></span>
          <span className="record-text">
            {listening ? "Stop recording" : "Say your message..."}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default InputTextArea;
