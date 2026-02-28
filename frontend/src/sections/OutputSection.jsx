import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";
function OutputSection() {
  return (
    <section>
      <h2>Change the kindness of my message.</h2>
      <KindnessSlider />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Button>Make the change</Button>
        <Button>Send it</Button>
        <Button>Copy</Button>
      </div>
    </section>
  );
}

export default OutputSection;
