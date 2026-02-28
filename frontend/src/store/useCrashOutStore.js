import { create } from "zustand";

export const useCrashOutStore = create((set) => ({
  kindness: 3,
  setKindness: (kindness) => {
    const numeric = Number(kindness);
    const bounded = Number.isFinite(numeric)
      ? Math.min(5, Math.max(1, Math.round(numeric)))
      : 3;
    set({ kindness: bounded });
  },
}));