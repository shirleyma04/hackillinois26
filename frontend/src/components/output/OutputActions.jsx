import { useCrashOutStore } from '../../store/useCrashOutStore'

function OutputActions() {
  const outputText = useCrashOutStore((s) => s.outputText)

  const onCopy = async () => {
    if (!outputText?.trim()) {
      return
    }
    await navigator.clipboard.writeText(outputText)
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button type="button" onClick={onCopy}>
        Copy output
      </button>
    </div>
  )
}

export default OutputActions