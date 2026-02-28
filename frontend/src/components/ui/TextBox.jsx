import React, { useRef, useEffect } from "react";
import "./TextBox.css";

function TextBox({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto"; // reset height to measure scroll
      const lineHeight = parseInt(getComputedStyle(el).lineHeight); // px per line
      const minHeight = lineHeight * 1; // 2 lines
      const maxHeight = lineHeight * 6; // 6 lines
      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px"; // grow dynamically
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="textbox"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2} // start with 2 lines
    />
  );
}

export default TextBox;
