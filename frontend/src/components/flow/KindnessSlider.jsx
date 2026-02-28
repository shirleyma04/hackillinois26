import { useState } from "react";
import "./KindnessSlider.css";

function KindnessSlider({ value, onChange }) {
  const [sliderValue, setSliderValue] = useState(value || 3);

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (onChange) onChange(val);
  };

  const emojis = ["😡", "😠", "😐", "🙂", "😊"]; // left=mean, right=nice

  return (
    <div className="kindness-slider">
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={sliderValue}
        onChange={handleChange}
        className="slider"
      />

      <div className="slider-labels">
        {emojis.map((emoji, index) => (
          <div key={index} className="slider-point">
            <span className="emoji">{emoji}</span>
            {index === 0 && <span className="label">Make it meaner</span>}
            {index === emojis.length - 1 && (
              <span className="label">Make it nicer</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KindnessSlider;
