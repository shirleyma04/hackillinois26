import { useCrashOutStore } from "../../store/useCrashOutStore";
import "./InputTextArea.css";

function InputTextArea() {
	const inputText = useCrashOutStore((state) => state.inputText);
	const setInputText = useCrashOutStore((state) => state.setInputText);

	return (
		<div className="input-wrapper">
			<textarea
				className="textbox"
				value={inputText}
				onChange={(event) => setInputText(event.target.value)}
				placeholder="Type your message..."
				rows={2}
			/>
		</div>
	);
}

export default InputTextArea;
