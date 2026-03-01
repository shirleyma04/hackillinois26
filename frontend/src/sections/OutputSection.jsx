import { useCrashOutStore } from "../store/useCrashOutStore";
import { transformService } from "../services/transformService";
import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";

function OutputSection() {
  const message = useCrashOutStore((state) => state.message);
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const tone = useCrashOutStore((state) => state.tone);
  const format = useCrashOutStore((state) => state.format);
  const kindness = useCrashOutStore((state) => state.kindness);
  const transformedMessage = useCrashOutStore((state) => state.transformedMessage);
  const setTransformedMessage = useCrashOutStore((state) => state.setTransformedMessage);
  const setProfanityDetected = useCrashOutStore((state) => state.setProfanityDetected);

  const handleMakeChange = async () => {
    if (!message || !angry_at || !tone || !format) return;

    try {
      const payload = {
        message,
        angry_at,
        tone,
        format,
        kindness_scale: kindness,
        profanity_check: "censored",
      };

      const result = await transformService(payload);
      setTransformedMessage(result.transformed_message);
      setProfanityDetected(result.profanity_detected);
    } catch (err) {
      console.error("Re-transform error:", err);
    }
  };

  const handleCopy = async () => {
    if (!transformedMessage) return;

    try {
      await navigator.clipboard.writeText(transformedMessage);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSend = () => {
    if (!transformedMessage) return;

    const subject = "Message";
    const body = encodeURIComponent(transformedMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Only show if there's a transformed message
  if (!transformedMessage) {
    return null;
  }

  return (
    <section>
      <h2>Your Transformed Message</h2>
      <div style={{
        padding: "20px",
        margin: "20px 0",
        background: "#f5f5f5",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
        minHeight: "60px"
      }}>
        {transformedMessage}
      </div>

      <h2>Change the kindness of my message.</h2>
      <KindnessSlider />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={handleMakeChange}>Make the change</Button>
        <Button onClick={handleSend}>Send it</Button>
        <Button onClick={handleCopy}>Copy</Button>
      </div>
    </section>
  );
}

export default OutputSection;
