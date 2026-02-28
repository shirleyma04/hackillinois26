import { useCrashOutStore } from '../../store/useCrashOutStore'

function OutputEditor({ value }) {
  const setOutputText = useCrashOutStore((s) => s.setOutputText)

  return (
    <div>
      <label htmlFor="outputText">Generated output</label>
      <textarea
        id="outputText"
        rows={8}
        value={value}
        onChange={(e) => setOutputText(e.target.value)}
        style={{ marginTop: 8 }}
      />
    </div>
  )
}

export default OutputEditor