import { useState } from "react";
import "./KindnessSlider.css";
import { useCrashOutStore } from "../../store/useCrashOutStore";

const MOOD_EMOJIS = {
  1: "😡",
  2: "😠",
  3: "😐",
  4: "🙂",
  5: "😊",
};

function KindnessSlider({ value, onChange }) {
  const kindness = useCrashOutStore((state) => state.kindness);
  const kindnessRaw = useCrashOutStore((state) => state.kindnessRaw);
  const setKindness = useCrashOutStore((state) => state.setKindness);
  const [sliderValue, setSliderValue] = useState(value || 3);

  const resolvedRawValue = value ?? kindnessRaw ?? kindness ?? sliderValue;
  const resolvedBucket = Math.min(5, Math.max(1, Math.round(resolvedRawValue)));

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    setKindness(val);
    if (onChange) onChange(Math.min(5, Math.max(1, Math.round(val))));
  };

  const thumbLeft = ((resolvedRawValue - 1) / 4) * 100;
  const moodEmoji = MOOD_EMOJIS[resolvedBucket] || MOOD_EMOJIS[3];

  return (
    <div className="kindness-slider kindnessSlider">
      <div className="slider-wrap">
        <span className="emoji-thumb" style={{ left: `${thumbLeft}%` }} aria-hidden="true">
          {moodEmoji}
        </span>
        <input
          type="range"
          min="1"
          max="5"
          step="0.01"
          value={resolvedRawValue}
          onChange={handleChange}
          className="slider"
          aria-label="Kindness level"
        />
      </div>

      <div className="kindness-inline-row">
        <span className="kindness-inline-item">Kindness: {resolvedBucket}/5</span>
        <span className="kindness-inline-item">Make it meaner</span>
        <span className="kindness-inline-item">Make it nicer</span>
      </div>
    </div>
  );
}

export default KindnessSlider;
