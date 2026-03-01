import KindnessSlider from "../flow/KindnessSlider.jsx";
import Button from "../ui/Button.jsx";
import "./KindnessOutputCard.css";

function KindnessOutputCard({
  mode,
  isLoading,
  error,
  generatedText,
  audioUrl,
  onMakeChange,
  onCopyMessage,
  onDownloadVoice,
}) {
  const isText = mode === "text";

  return (
    <section className="kindness-output-card" aria-live="polite">
      <h2>Change the kindness of my message.</h2>
      <KindnessSlider />

      {isText ? (
        <div className="output-preview text-preview">
          {isLoading ? "Generating..." : generatedText || "No message generated yet."}
        </div>
      ) : (
        <div className="output-preview voice-preview">
          {audioUrl ? (
            <audio controls src={audioUrl} className="voice-player">
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>{isLoading ? "Generating..." : "Voice ready"}</p>
          )}
        </div>
      )}

      {error ? <p className="output-error">{error}</p> : null}

      <div className="output-card-actions">
        <Button onClick={onMakeChange} disabled={isLoading}>
          {isLoading ? "Generating..." : "Make the Change"}
        </Button>
        {isText ? (
          <Button onClick={onCopyMessage} disabled={isLoading || !generatedText}>
            Copy Message
          </Button>
        ) : (
          <Button onClick={onDownloadVoice} disabled={isLoading || !audioUrl}>
            Download Voice Message
          </Button>
        )}
      </div>
    </section>
  );
}

export default KindnessOutputCard;
