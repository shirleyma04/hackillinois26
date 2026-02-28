import { useEffect, useMemo, useState } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";
import BubbleLayer from "./BubbleLayer";

const KINDNESS_PRESETS = {
	1: {
		start: "var(--color-tertiary, var(--color-dark))",
		mid: "var(--color-primary)",
		end: "var(--color-tertiary, var(--color-dark))",
		speed: "25s",
	},
	2: {
		start: "var(--color-primary)",
		mid: "var(--color-accent)",
		end: "var(--color-tertiary, var(--color-dark))",
		speed: "26s",
	},
	3: {
		start: "var(--color-accent)",
		mid: "var(--color-secondary)",
		end: "var(--color-primary)",
		speed: "27s",
	},
	4: {
		start: "var(--color-secondary)",
		mid: "var(--color-accent)",
		end: "var(--bg-main)",
		speed: "29s",
	},
	5: {
		start: "var(--color-secondary)",
		mid: "var(--bg-main)",
		end: "var(--bg-main)",
		speed: "30s",
	},
};

function DynamicBackground() {
	const kindness = useCrashOutStore((state) => state.kindness);
	const setKindness = useCrashOutStore((state) => state.setKindness);
	const [open, setOpen] = useState(false);
	const [burstSignal, setBurstSignal] = useState(0);

	const preset = useMemo(
		() => KINDNESS_PRESETS[kindness] || KINDNESS_PRESETS[3],
		[kindness],
	);

	const style = {
		"--bg-start": preset.start,
		"--bg-mid": preset.mid,
		"--bg-end": preset.end,
		"--bg-speed": preset.speed,
	};

	useEffect(() => {
		setBurstSignal((value) => value + 1);
	}, [kindness]);

	const onMoodSelect = (value) => {
		setKindness(value);
		setBurstSignal((signal) => signal + 1);
	};

	return (
		<>
			<div className="bgControl" role="group" aria-label="Background controls">
				<button
					type="button"
					className="bgControl__trigger"
					onClick={() => setOpen((value) => !value)}
					aria-expanded={open}
					aria-controls="bg-control-panel"
					title="Background settings"
				>
					⚙️
				</button>

				{open && (
					<div id="bg-control-panel" className="bgControl__panel">
						<p className="bgControl__title">Background mood</p>
						<div className="bgControl__row">
							<button type="button" onClick={() => onMoodSelect(1)} className="bgControl__chip">
								😡 Meaner
							</button>
							<button type="button" onClick={() => onMoodSelect(3)} className="bgControl__chip">
								😐 Neutral
							</button>
							<button type="button" onClick={() => onMoodSelect(5)} className="bgControl__chip">
								😊 Kinder
							</button>
						</div>
						<p className="bgControl__hint">Only changes animated background, not white card content.</p>
					</div>
				)}
			</div>

			<div className="dynbg" style={style} aria-hidden="true">
				<div className="dynbg__gradient" />
				<div className="dynbg__blob dynbg__blob--a" />
				<div className="dynbg__blob dynbg__blob--b" />
				<BubbleLayer
					mood={kindness}
					burstSignal={burstSignal}
					palette={[preset.start, preset.mid, preset.end]}
				/>
			</div>
		</>
	);
}

export default DynamicBackground;
