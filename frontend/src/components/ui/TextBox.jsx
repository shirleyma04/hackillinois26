import React from "react";
import "./TextBox.css";

function TextBox({ value, onChange, placeholder }) {
  return (
    <textarea
      className="textbox"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default TextBox;
