import React from "react";
import "./TranscriptBox.css";

function TranscriptBox({ transcript }) {
  return (
    <div className="transcript-box">
      {transcript || "Your transcript will appear here..."}
    </div>
  );
}

export default TranscriptBox;
