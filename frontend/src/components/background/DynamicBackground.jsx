import { useEffect, useMemo, useState } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";
import BubbleLayer from "./BubbleLayer";

const interpolate = (start, end, t) => start + (end - start) * t;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function DynamicBackground() {
	const kindness = useCrashOutStore((state) => state.kindness);
	const kindnessRaw = useCrashOutStore((state) => state.kindnessRaw);
	const theme = useCrashOutStore((state) => state.theme);
	const setTheme = useCrashOutStore((state) => state.setTheme);
	const [open, setOpen] = useState(false);
	const [burstSignal, setBurstSignal] = useState(0);

	const kindnessRatio = useMemo(() => {
		const rawValue = Number.isFinite(Number(kindnessRaw)) ? Number(kindnessRaw) : Number(kindness);
		const normalized = (clamp(rawValue, 1, 5) - 1) / 4;
		return clamp(normalized, 0, 1);
	}, [kindness, kindnessRaw]);

	const kindnessMix = Math.round(kindnessRatio * 100);
	const kindnessShadow = 100 - kindnessMix;

	const style = {
		"--kindness-bg-mix": `${kindnessMix}%`,
		"--kindness-bg-shadow": `${kindnessShadow}%`,
		"--bg-speed": `${interpolate(24, 30, kindnessRatio).toFixed(2)}s`,
		"--bg-gradient-opacity": interpolate(0.94, 0.82, kindnessRatio).toFixed(3),
		"--bg-blob-opacity": interpolate(0.16, 0.09, kindnessRatio).toFixed(3),
		"--bg-blur": `${interpolate(22, 16, kindnessRatio).toFixed(2)}px`,
	};

	useEffect(() => {
		document.documentElement.dataset.theme = theme === "dark" ? "dark" : "";
	}, [theme]);

	useEffect(() => {
		setBurstSignal((value) => value + 1);
	}, [kindness]);

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
						<p className="bgControl__title">Theme</p>
						<div className="bgControl__row">
							<button
								type="button"
								onClick={() => setTheme("light")}
								className={`bgControl__chip ${theme === "light" ? "bgControl__chip--active" : ""}`}
							>
								☀️ Light
							</button>
							<button
								type="button"
								onClick={() => setTheme("dark")}
								className={`bgControl__chip ${theme === "dark" ? "bgControl__chip--active" : ""}`}
							>
								🌙 Dark
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="dynbg" style={style} aria-hidden="true">
				<div className="dynbg__gradient" />
				<div className="dynbg__blob dynbg__blob--a" />
				<div className="dynbg__blob dynbg__blob--b" />
				<BubbleLayer
					mood={kindness}
					theme={theme}
					intensity={kindnessRatio}
					burstSignal={burstSignal}
					palette={["var(--dynbg-start)", "var(--dynbg-mid)", "var(--dynbg-end)"]}
				/>
			</div>
		</>
	);
}

export default DynamicBackground;
