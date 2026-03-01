import { create } from "zustand";

export const useCrashOutStore = create((set) => ({
  inputText: "",
  kindness: 3,
  kindnessRaw: 3,
  setInputText: (inputText) => set({ inputText }),
  setKindness: (kindness) => {
    const numeric = Number(kindness);
    const boundedRaw = Number.isFinite(numeric)
      ? Math.min(5, Math.max(1, numeric))
      : 3;
    const bucket = Math.min(5, Math.max(1, Math.round(boundedRaw)));
    set({ kindnessRaw: boundedRaw, kindness: bucket });
  },
}));