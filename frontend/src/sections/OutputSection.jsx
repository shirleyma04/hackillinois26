import { useState, useEffect } from "react";
import { useCrashOutStore } from "../store/useCrashOutStore";
import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";
import "./OutputSection.css";

function OutputSection() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const format = useCrashOutStore((state) => state.format);
  const selectedFormat = useCrashOutStore((state) => state.selectedFormat);
  const transformedMessage = useCrashOutStore(
    (state) => state.transformedMessage,
  );
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const effectiveSelectedFormat =
    selectedFormat || (format === "email" ? "email" : "");
  const isEmailSend = effectiveSelectedFormat === "email";

  // Animate the dots while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Add a dot every 0.5s

    return () => clearInterval(interval);
  }, [loading]);

  const handleMakeChange = async () => {
    if (!message || !angry_at || !tone || !format) return;
    setLoading(true);
    // setTransformedMessage("");

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
      setTransformedMessage("Failed to generate message.");
    } finally {
      setLoading(false);
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

  const handleSend = async () => {
    if (!transformedMessage || !isEmailSend) return;

    try {
      setLoading(true);
      const subject = "Message";
      const body = encodeURIComponent(transformedMessage);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const ttsFilePath = useCrashOutStore((state) => state.ttsFilePath);

  // const handleDownload = () => {
  //   if (!ttsFilePath) return;

  //   const link = document.createElement("a");
  //   link.href = `http://127.0.0.1:8000/${ttsFilePath}`;
  //   link.download = ttsFilePath.split("/").pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = async () => {
    if (!ttsFilePath) return;

    try {
      const response = await fetch(`${API_BASE}${ttsFilePath}`);
      if (!response.ok) throw new Error("Failed to fetch audio file");

      const blob = await response.blob(); // get the file as a blob
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "VoiceMessage.mp3"; // filename only
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url); // clean up
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Only show if there's a transformed message
  if (!transformedMessage) {
    return null;
  }

  return (
    <section>
      <h2 className="header2">Your Transformed Message</h2>
      <div className="transformed-message">
        {loading
          ? `Generating your message${dots}`
          : transformedMessage || "Your message will appear here."}
      </div>

      <h3>Want to change the kindness of your message?</h3>
      <KindnessSlider />
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div className="output-button-group">
          <Button onClick={handleMakeChange} disabled={loading}>
            Make the change
          </Button>

          <div className="next-steps-button-group">
            <Button onClick={handleSend} disabled={loading || !isEmailSend}>
              {isEmailSend ? "Send It" : "Send It (Coming Soon)"}
            </Button>
            <Button onClick={handleCopy} disabled={loading}>
              Copy
            </Button>
            {ttsFilePath && (
              <Button onClick={handleDownload} disabled={loading}>
                Download Voice Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OutputSection;
