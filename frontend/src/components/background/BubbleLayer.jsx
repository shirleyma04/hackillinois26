import { useEffect, useRef, useState } from "react";

const MAX_BUBBLES = 40;

function BubbleLayer({ mood, burstSignal, palette = [] }) {
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

		const now = Date.now();
		const nextBubbles = Array.from({ length: count }).map((_, index) => {
			const duration = 4200 + Math.round(Math.random() * 2600);
			const x = Math.round(Math.random() * 100);
			const size = 14 + Math.round(Math.random() * 34);
			const opacity = Number((0.12 + Math.random() * 0.13).toFixed(2));
			const color = palette[Math.floor(Math.random() * Math.max(1, palette.length))] || "var(--color-accent)";
			const drift = -36 + Math.round(Math.random() * 72);
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
		spawnBubbles(mood, 6);
	}, [burstSignal, mood]);

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
