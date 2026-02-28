import AudioPlayer from "../components/output/AudioPlayer";
import OutputActions from "../components/output/OutputActions";
import OutputEditor from "../components/output/OutputEditor";
import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import { safetyCopy } from "../lib/safetyCopy";
import { useCrashOutStore } from "../store/useCrashOutStore";

function OutputSection() {
  const { status, outputText, audioUrl, blockedReason, error } = useCrashOutStore();

  return (
    <section className="cardSurface">
      <h2>Output</h2>

      {/* Shirley’s UI element, but keep your real logic */}
      <div style={{ marginBottom: 12 }}>
        <p className="muted">Change the kindness of my message.</p>
        <KindnessSlider />
      </div>

      {(status === "TRANSFORMING" || status === "REGENERATING") && (
        <div className="cardSurface" style={{ padding: "12px" }}>
          <p className="muted">Generating...</p>
          <div
            style={{
              height: 12,
              marginTop: 8,
              background: "rgba(148,163,184,0.2)",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              height: 12,
              marginTop: 8,
              background: "rgba(148,163,184,0.2)",
              borderRadius: 8,
              width: "82%",
            }}
          />
        </div>
      )}

      {status === "HAS_OUTPUT" && (
        <>
          <OutputEditor value={outputText} />
          <OutputActions />
          {audioUrl && <AudioPlayer src={audioUrl} />}
        </>
      )}

      {status === "BLOCKED" && (
        <div className="cardSurface" style={{ padding: "12px" }}>
          <p>{safetyCopy?.title || "We cannot generate this request right now."}</p>
          <p className="muted">
            {blockedReason || safetyCopy?.note || "Try rephrasing with safer wording."}
          </p>
        </div>
      )}

      {status === "ERROR" && (
        <div className="cardSurface" style={{ padding: "12px" }}>
          <p>Something went wrong while transforming.</p>
          <p className="muted">{error || "Please try again."}</p>
        </div>
      )}

      {status === "IDLE" && <p className="muted">Enter text and select target, format, and tone.</p>}
      {status === "READY" && <p className="muted">Ready to transform.</p>}
    </section>
  );
}

export default OutputSection;