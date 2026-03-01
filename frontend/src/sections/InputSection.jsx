import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import "./InputSection.css";
import InputTextArea from "../components/input/InputTextArea.jsx";

function InputSection() {
  const [target, setTarget] = useState(null);

  return (
    <section>
      <h2 className="input-text">Who is making you crash out?</h2>
      <div className="button-group">
        {["Family", "Friend", "Partner", "Coworker/Classmate", "Stranger"].map(
          (person) => (
            <Button key={person} onClick={() => setTarget(person)}>
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
