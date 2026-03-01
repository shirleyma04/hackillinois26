  import { useCrashOutStore } from "../store/useCrashOutStore";
  import Button from "../components/ui/Button.jsx";
  import "./InputSection.css";
  import InputTextArea from "../components/input/InputTextArea.jsx";

function InputSection() {
  const angry_at = useCrashOutStore((state) => state.angry_at);
  const setAngryAt = useCrashOutStore((state) => state.setAngryAt);

  const mapTarget = (label) => {
      const mapping = {
        "Family": "family",
        "Friend": "friend",
        "Partner": "partner",
        "Coworker/Classmate": "coworker",
        "Stranger": "stranger",
      };
      return mapping[label];
    };
  return (
    <section>
      <h2 className="input-text">Who is making you crash out?</h2>
      <div className="button-group">
        {["Family", "Friend", "Partner", "Coworker/Classmate", "Stranger"].map(
          (person) => (
            <Button key={person} onClick={() => setAngryAt(mapTarget(person))}>
              {person}
            </Button>
          ),
        )}
      </div>

      <h2 className="input-text">Why are you crashing out?</h2>
      <InputTextArea />
    </section>
  );
}

export default InputSection;
