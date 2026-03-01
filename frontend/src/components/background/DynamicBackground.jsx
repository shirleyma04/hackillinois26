import { useEffect, useMemo, useState } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";
import BubbleLayer from "./BubbleLayer";
import "./DynamicBackground.css";

const interpolate = (start, end, t) => start + (end - start) * t;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function DynamicBackground() {
  const kindness = useCrashOutStore((state) => state.kindness);
  const kindnessRaw = useCrashOutStore((state) => state.kindnessRaw);
  const theme = useCrashOutStore((state) => state.theme);
  const setTheme = useCrashOutStore((state) => state.setTheme);
  const [burstSignal, setBurstSignal] = useState(0);

  const kindnessRatio = useMemo(() => {
    const rawValue = Number.isFinite(Number(kindnessRaw))
      ? Number(kindnessRaw)
      : Number(kindness);
    return clamp((rawValue - 1) / 4, 0, 1);
  }, [kindness, kindnessRaw]);

  const gradientColors = useMemo(() => {
    const interpolateColor = (start, end, t) =>
      start.map((s, i) => Math.round(s + (end[i] - s) * t));

    if (theme === "dark") {
      // Dark mode: meaner → dark reds & deep brown, nicer → softer reddish-cream
      const darkTertiary = [21, 8, 8]; // --color-tertiary
      const primary = [114, 17, 33]; // --color-primary
      const accent = [217, 123, 73]; // --color-accent
      const softCream = [246, 216, 174]; // --color-secondary

      const startColor = interpolateColor(darkTertiary, primary, kindnessRatio); // darkest → primary
      const midColor = interpolateColor(primary, accent, kindnessRatio); // primary → accent
      const endColor = interpolateColor(accent, softCream, kindnessRatio); // accent → soft cream

      return [
        `rgba(${startColor.join(",")}, 1)`,
        `rgba(${midColor.join(",")}, 1)`,
        `rgba(${endColor.join(",")}, 1)`,
      ];
    } else {
      // Light mode: meaner → red+cream, nicer → soft cream
      const redStart = [114, 17, 33]; // --color-primary
      const creamStart = [246, 216, 174]; // --color-secondary
      const softCream = [236, 230, 221]; // off-white

      const startColor = interpolateColor(redStart, softCream, kindnessRatio);
      const midColor = interpolateColor(creamStart, softCream, kindnessRatio);
      const endColor = interpolateColor(
        [217, 123, 73],
        softCream,
        kindnessRatio,
      ); // accent → soft cream

      return [
        `rgba(${startColor.join(",")},1)`,
        `rgba(${midColor.join(",")},1)`,
        `rgba(${endColor.join(",")},1)`,
      ];
    }
  }, [kindnessRatio, theme]);

  const style = {
    "--kindness-bg-mix": `${Math.round(kindnessRatio * 100)}%`,
    "--kindness-bg-shadow": `${100 - Math.round(kindnessRatio * 100)}%`,
    "--bg-speed": `${interpolate(24, 30, kindnessRatio).toFixed(2)}s`,
    "--bg-gradient-opacity": interpolate(0.8, 1, kindnessRatio).toFixed(3),
    "--bg-blob-opacity": interpolate(0.1, 0.3, kindnessRatio).toFixed(3),
    "--bg-blur": `${interpolate(16, 24, kindnessRatio).toFixed(2)}px`,
    "--dynbg-start": gradientColors[0],
    "--dynbg-mid": gradientColors[1],
    "--dynbg-end": gradientColors[2],
  };

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme === "dark" ? "dark" : "light";
  }, [theme]);

  useEffect(() => {
    setBurstSignal((value) => value + 1);
  }, [kindness]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Theme toggle slider */}
      <div className="theme-switch-wrapper">
        <label className="theme-slider">
          <input
            type="checkbox"
            checked={theme === "light"}
            onChange={toggleTheme}
          />
          <span className="slider-track">
            <span className="emoji emoji-sun">☀️</span>
            <span className="emoji emoji-moon">🌒</span>
          </span>
        </label>
      </div>

      {/* Dynamic background behind everything */}
      <div className="dynbg" style={style} aria-hidden="true">
        <BubbleLayer
          mood={kindness}
          theme={theme}
          intensity={kindnessRatio}
          burstSignal={burstSignal}
          palette={[gradientColors[0], gradientColors[1], gradientColors[2]]}
        />
        <div className="dynbg__gradient" />
        <div className="dynbg__blob dynbg__blob--a" />
        <div className="dynbg__blob dynbg__blob--b" />
      </div>
    </>
  );
}

export default DynamicBackground;
