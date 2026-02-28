import { useCrashOutStore } from '../../store/useCrashOutStore'

function KindnessSlider() {
  const kindness = useCrashOutStore((s) => s.kindness)
  const setKindness = useCrashOutStore((s) => s.setKindness)

  return (
    <div>
      <label htmlFor="kindnessSlider">Kindness: {kindness}</label>
      <input
        id="kindnessSlider"
        type="range"
        min="1"
        max="5"
        step="1"
        value={kindness}
        onChange={(e) => setKindness(Number(e.target.value))}
        style={{ width: '100%', marginTop: 8 }}
      />
    </div>
  )
}

export default KindnessSlider