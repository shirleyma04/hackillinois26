import { useEffect, useRef, useState } from "react";

const MAX_BUBBLES = 40;

function BubbleLayer({ mood, theme, intensity = 0.5, burstSignal, palette = [] }) {
	const [bubbles, setBubbles] = useState([]);
	const reducedMotionRef = useRef(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		reducedMotionRef.current = mediaQuery.matches;

		const onChange = (event) => {
			reducedMotionRef.current = event.matches;
		};

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	const spawnBubbles = (currentMood, count = 6) => {
		if (reducedMotionRef.current) {
			return;
		}

		const clampedIntensity = Math.max(0, Math.min(1, intensity));
		const themeOpacityBoost = theme === "dark" ? 0.04 : 0;

		const now = Date.now();
		const nextBubbles = Array.from({ length: count }).map((_, index) => {
			const duration = Math.round(3600 + (1 - clampedIntensity) * 2800 + Math.random() * 900);
			const x = Math.round(Math.random() * 100);
			const size = 14 + Math.round(Math.random() * 34);
			const opacity = Number(
				(0.1 + clampedIntensity * 0.1 + themeOpacityBoost + Math.random() * 0.08).toFixed(2),
			);
			const color = palette[Math.floor(Math.random() * Math.max(1, palette.length))] || "var(--color-accent)";
			const drift = -28 + Math.round(Math.random() * (56 + clampedIntensity * 38));
			const delay = Math.round(Math.random() * 220);
			const id = `${now}-${currentMood}-${index}-${Math.random().toString(36).slice(2, 8)}`;

			setTimeout(() => {
				setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
			}, duration + delay + 120);

			return {
				id,
				x,
				size,
				opacity,
				color,
				duration,
				drift,
				delay,
				createdAt: now,
			};
		});

		setBubbles((prev) => [...prev, ...nextBubbles].slice(-MAX_BUBBLES));
	};

	useEffect(() => {
		if (burstSignal <= 0) {
			return;
		}
		const bubbleCount = Math.round(
			4 + Math.max(0, Math.min(1, intensity)) * 5 + (theme === "dark" ? 1 : 0),
		);
		spawnBubbles(mood, bubbleCount);
	}, [burstSignal, mood, intensity, theme]);

	return (
		<div className="bubble-layer" aria-hidden="true">
			{bubbles.map((bubble) => (
				<span
					key={bubble.id}
					className="bubble"
					style={{
						left: `${bubble.x}%`,
						width: `${bubble.size}px`,
						height: `${bubble.size}px`,
						opacity: bubble.opacity,
						"--bubble-color": bubble.color,
						"--bubble-duration": `${bubble.duration}ms`,
						"--bubble-drift": `${bubble.drift}px`,
						"--bubble-delay": `${bubble.delay}ms`,
					}}
				/>
			))}
		</div>
	);
}

export default BubbleLayer;
