import { useState, useEffect, useRef } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";
import Button from "../ui/Button.jsx";
import "./InputTextArea.css";

function InputTextArea() {
  const message = useCrashOutStore((state) => state.message);
  const setMessage = useCrashOutStore((state) => state.setMessage);
const [listening, setListening] = useState(false);
const recognitionRef = useRef(null);
const finalTranscriptRef = useRef("");

const [isRecording, setIsRecording] = useState(false);
const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
const mediaRecorderRef = useRef(null);
const chunksRef = useRef([]);
const streamRef = useRef(null);

const textareaRef = useRef(null);
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recordedAudioUrl]);

  // Auto-resize logic (2 → 6 lines max)
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
  }, [message]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Your browser does not support audio recording");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      streamRef.current = stream;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        setRecordedAudioUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }
          return URL.createObjectURL(blob);
        });

        chunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Audio recording failed:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleRemoveAudio = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
  };

  return (
    <div className="input-wrapper">
      <div className="input-row">
        <div className="textbox-wrapper">
          <textarea
            ref={textareaRef}
            className="textbox"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type your message..."
            rows={2}
          />
        </div>
      </div>

      <div className="controls-row">
        <Button
          className={`record-btn compact-record-btn ${isRecording ? "recording" : ""}`}
          onClick={toggleRecording}
        >
          <span className="record-emoji" aria-hidden="true">🎤</span>
          <span className="record-text">
            {isRecording ? "Stop" : "Record"}
          </span>
        </Button>

        {recordedAudioUrl ? (
          <audio controls src={recordedAudioUrl} className="recorded-audio-player">
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="audio-player-placeholder" aria-hidden="true"></div>
        )}

        {recordedAudioUrl ? (
          <Button
            className="trash-audio-btn"
            onClick={handleRemoveAudio}
            aria-label="Remove audio"
            title="Remove audio"
          >
            <span className="trash-icon" aria-hidden="true">🗑</span>
          </Button>
        ) : (
          <div className="trash-placeholder" aria-hidden="true"></div>
        )}
      </div>
    </div>
  );
}

export default InputTextArea;
