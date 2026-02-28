import { useCrashOutStore } from "../../store/useCrashOutStore";

function KindnessSlider() {
  const kindness = useCrashOutStore((state) => state.kindness);
  const setKindness = useCrashOutStore((state) => state.setKindness);

  return (
    <div>
      <label htmlFor="kindness-range">Kindness: {kindness}</label>
      <input
        id="kindness-range"
        type="range"
        min="1"
        max="5"
        step="1"
        value={kindness}
        onChange={(event) => setKindness(event.target.value)}
      />
    </div>
  );
}

export default KindnessSlider;