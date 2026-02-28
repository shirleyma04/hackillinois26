import { useCrashOutStore } from '../store/useCrashOutStore'

function InputSection() {
  const baseInputText = useCrashOutStore((s) => s.baseInputText)
  const setBaseInputText = useCrashOutStore((s) => s.setBaseInputText)

  return (
    <section className="cardSurface">
      <h2>Input</h2>
      <textarea
        rows={6}
        value={baseInputText}
        placeholder="Paste or type your original text"
        onChange={(e) => setBaseInputText(e.target.value)}
      />
    </section>
  )
}

export default InputSection