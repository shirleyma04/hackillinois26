import { useState, useEffect, useRef } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";
import Button from "../ui/Button.jsx";
import "./InputTextArea.css";

function InputTextArea() {
  const message = useCrashOutStore((state) => state.message);
  const setMessage = useCrashOutStore((state) => state.setMessage);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const mediaRecorderRef = useRef(null);
  const currentChunksRef = useRef([]);
  const recordedSegmentsRef = useRef([]);
  const streamRef = useRef(null);
  const audioMimeTypeRef = useRef("audio/webm");
  const audioRef = useRef(null);

  const textareaRef = useRef(null);

  const getPreferredMimeType = () => {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
      return "";
    }

    const preferredTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
    ];

    return preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  };

  const buildMergedAudio = () => {
    const segments = recordedSegmentsRef.current;
    if (!segments.length) {
      return;
    }

    const mergedType = segments[0]?.type || audioMimeTypeRef.current || "audio/webm";
    const mergedBlob = new Blob(segments, { type: mergedType });

    setRecordedAudioUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return URL.createObjectURL(mergedBlob);
    });

    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    });
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const transcriptChunk = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          finalTranscriptRef.current += `${transcriptChunk} `;
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      setMessage(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsSpeaking(false);
    };

    recognition.onend = () => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        setIsSpeaking(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setMessage]);

  useEffect(() => {
    finalTranscriptRef.current = message;
  }, [message]);

  useEffect(() => {
    if (!textareaRef.current) return;

    const el = textareaRef.current;
    el.style.height = "auto";

    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10);
    const minHeight = lineHeight * 2;
    const maxHeight = lineHeight * 6;

    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = Math.max(newHeight, minHeight) + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [message]);

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recordedAudioUrl]);

  const startSpeaking = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Your browser does not support audio recording");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = getPreferredMimeType();
      const mediaRecorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      audioMimeTypeRef.current = preferredMimeType || mediaRecorder.mimeType || "audio/webm";
      streamRef.current = stream;
      currentChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          currentChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (currentChunksRef.current.length > 0) {
          const segmentType =
            audioMimeTypeRef.current || currentChunksRef.current[0]?.type || "audio/webm";
          const segmentBlob = new Blob(currentChunksRef.current, {
            type: segmentType,
          });

          if (segmentBlob.size > 0) {
            recordedSegmentsRef.current.push(segmentBlob);
            buildMergedAudio();
          }
        }

        currentChunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        setIsSpeaking(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsSpeaking(true);
    } catch (error) {
      console.error("Speak start failed:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      setIsSpeaking(false);
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  const handleRemoveAudio = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    recordedSegmentsRef.current = [];
    currentChunksRef.current = [];
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
              finalTranscriptRef.current = e.target.value;
            }}
            placeholder="Type your message..."
            rows={2}
          />
        </div>
      </div>

      <div className="controls-row">
        <Button
          className={`record-btn compact-record-btn ${isSpeaking ? "recording" : ""}`}
          onClick={toggleSpeaking}
        >
          <span className="record-emoji" aria-hidden="true">🗣️</span>
          <span className="record-text">{isSpeaking ? "Stop" : "Speak"}</span>
        </Button>

        {recordedAudioUrl ? (
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={recordedAudioUrl}
            className="recorded-audio-player"
          >
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
