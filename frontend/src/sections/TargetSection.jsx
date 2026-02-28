import { useCrashOutStore } from '../store/useCrashOutStore'

function TargetSection() {
  const target = useCrashOutStore((s) => s.target)
  const setTarget = useCrashOutStore((s) => s.setTarget)

  return (
    <section className="cardSurface">
      <h2>Target</h2>
      <select value={target || ''} onChange={(e) => setTarget(e.target.value || null)}>
        <option value="">Select target</option>
        <option value="friend">Friend</option>
        <option value="coworker">Coworker</option>
        <option value="team">Team</option>
      </select>
    </section>
  )
}

export default TargetSection