import KindnessSlider from '../components/flow/KindnessSlider'
import { useCrashOutStore } from '../store/useCrashOutStore'

function StyleSection() {
  const tone = useCrashOutStore((s) => s.tone)
  const format = useCrashOutStore((s) => s.format)
  const profanityMode = useCrashOutStore((s) => s.profanityMode)
  const setTone = useCrashOutStore((s) => s.setTone)
  const setFormat = useCrashOutStore((s) => s.setFormat)
  const setProfanityMode = useCrashOutStore((s) => s.setProfanityMode)

  return (
    <section className="cardSurface">
      <h2>Style</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        <KindnessSlider />
        <div>
          <label htmlFor="toneSelect">Tone</label>
          <select id="toneSelect" value={tone || ''} onChange={(e) => setTone(e.target.value || null)}>
            <option value="">Select tone</option>
            <option value="calm">Calm</option>
            <option value="direct">Direct</option>
            <option value="supportive">Supportive</option>
          </select>
        </div>
        <div>
          <label htmlFor="formatSelect">Format</label>
          <select id="formatSelect" value={format || ''} onChange={(e) => setFormat(e.target.value || null)}>
            <option value="">Select format</option>
            <option value="message">Message</option>
            <option value="bullet-points">Bullet points</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div>
          <label htmlFor="profanitySelect">Profanity mode</label>
          <select
            id="profanitySelect"
            value={profanityMode}
            onChange={(e) => setProfanityMode(e.target.value || 'clean')}
          >
            <option value="clean">Clean</option>
            <option value="soften">Soften</option>
            <option value="allow">Allow</option>
          </select>
        </div>
      </div>
    </section>
  )
}

export default StyleSection