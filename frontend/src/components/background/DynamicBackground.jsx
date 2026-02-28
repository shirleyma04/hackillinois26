import { useMemo } from "react";
import { useCrashOutStore } from "../../store/useCrashOutStore";

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

  return (
    <div className="dynbg" style={style} aria-hidden="true">
      <div className="dynbg__gradient" />
      <div className="dynbg__blob dynbg__blob--a" />
      <div className="dynbg__blob dynbg__blob--b" />
    </div>
  );
}

export default DynamicBackground;
