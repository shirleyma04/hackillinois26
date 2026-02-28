import React, { useRef, useEffect } from "react";
import "./TranscriptBox.css";

function TranscriptBox({ transcript }) {
  const divRef = useRef(null);

  useEffect(() => {
    const el = divRef.current;
    if (el) {
      const lineHeight = parseInt(getComputedStyle(el).lineHeight); // px per line
      const minHeight = lineHeight * 2; // 2 lines
      const maxHeight = lineHeight * 6; // 6 lines

      // Temporarily reset height to measure scroll
      el.style.height = "auto";

      // Clamp height between min and max
      const newHeight = Math.min(
        Math.max(el.scrollHeight, minHeight),
        maxHeight,
      );
      el.style.height = newHeight + "px";
    }
  }, [transcript]);

  return (
    <div ref={divRef} className="transcript-box" contentEditable={false}>
      {transcript || "Your transcript will appear here..."}
    </div>
  );
}

export default TranscriptBox;
