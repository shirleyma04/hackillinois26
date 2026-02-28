import KindnessSlider from "../components/flow/KindnessSlider.jsx";
import Button from "../components/ui/Button.jsx";
function OutputSection() {
  return (
    <section>
      <h2>Change the kindness of my message.</h2>
      <KindnessSlider />
      <Button>Make the change</Button>
      <Button>Send it</Button>
      <Button>Copy</Button>
    </section>
  );
}

export default OutputSection;
