import { transformService } from '../services/transformService'
import { useCrashOutStore } from '../store/useCrashOutStore'

function mapTransformResponse(data) {
  if (data?.blocked === true || data?.status === 'blocked') {
    return {
      blocked: true,
      reason: data?.reason || data?.blockedReason || data?.message,
    }
  }

  return {
    blocked: false,
    payload: {
      outputText:
        data?.outputText ?? data?.output ?? data?.text ?? data?.transformedText ?? data?.transformed_text ?? '',
      audioUrl: data?.audioUrl ?? data?.audio_url ?? null,
      transcript: data?.transcript ?? null,
    },
  }
}

function TransformSection() {
  const {
    status,
    dirty,
    baseInputText,
    kindness,
    target,
    format,
    tone,
    profanityMode,
    startTransform,
    startRegen,
    transformSuccess,
    transformBlocked,
    transformError,
  } = useCrashOutStore()

  const isBusy = status === 'TRANSFORMING' || status === 'REGENERATING'

  const buildPayload = () => ({
    inputText: baseInputText,
    text: baseInputText,
    kindness,
    target,
    format,
    tone,
    profanityMode,
  })

  const runTransform = async (isRegen) => {
    try {
      if (isRegen) {
        startRegen()
      } else {
        startTransform()
      }

      const result = await transformService(buildPayload())
      const mapped = mapTransformResponse(result)

      if (mapped.blocked) {
        transformBlocked(mapped.reason)
        return
      }

      transformSuccess(mapped.payload)
    } catch (error) {
      transformError(error?.message || 'Network error')
    }
  }

  const showRegen = status === 'HAS_OUTPUT'
  const canTransform = status === 'READY' || status === 'ERROR' || status === 'BLOCKED'
  const canRegen = showRegen && dirty

  return (
    <section className="cardSurface">
      <h2>Transform</h2>
      {showRegen ? (
        <button disabled={!canRegen || isBusy} onClick={() => runTransform(true)}>
          {status === 'REGENERATING' ? 'Making the change...' : 'Make the change'}
        </button>
      ) : (
        <button disabled={!canTransform || isBusy} onClick={() => runTransform(false)}>
          {status === 'TRANSFORMING' ? 'Transforming...' : 'Transform'}
        </button>
      )}
      {showRegen && !dirty && <p className="muted">Adjust input/style/target to enable regeneration.</p>}
    </section>
  )
}

export default TransformSection