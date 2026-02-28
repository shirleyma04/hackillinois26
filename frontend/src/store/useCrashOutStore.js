import { create } from "zustand";

export const useCrashOutStore = create((set) => ({
  kindness: 3,
  setKindness: (kindness) => {
    const parsed = Number(kindness);
    const safeKindness = Number.isFinite(parsed)
      ? Math.min(5, Math.max(1, Math.round(parsed)))
      : 3;

    set({ kindness: safeKindness });
  },
}));