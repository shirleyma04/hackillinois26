import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

function Dropdown({ label: defaultLabel, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(""); // track chosen option
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown-container">
      <button
        className={`dropdown-button ${open ? "open" : ""} ${
          selected ? "chosen" : "default"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected || defaultLabel} <span className="caret">▼</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
