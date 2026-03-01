import { create } from "zustand";

export const useCrashOutStore = create((set) => ({
    // Input fields
    message: "",
    angry_at: "",
    tone: "",
    format: "",
    profanity_check: "censored",
    kindness: 3,
    kindnessRaw: 3,

    // Output
    transformedMessage: "",
    profanityDetected: false,
    audioFilePath: "",

    // UI state
    isLoading: false,
    error: null,

    // Input setters
    setMessage: (message) => set({ message }),
    setAngryAt: (angry_at) => set({ angry_at }),
    setTone: (tone) => set({ tone }),
    setFormat: (format) => set({ format }),
    setProfanityCheck: (profanity_check) => set({ profanity_check }),
    setKindness: (kindness) => {
      const numeric = Number(kindness);
      const raw = Number.isFinite(numeric) ? Math.min(5, Math.max(1, numeric)) : 3;
      const rounded = Math.round(raw);
      set({ kindness: rounded, kindnessRaw: raw });
    },

    // Output setters
    setTransformedMessage: (transformedMessage) => set({ transformedMessage }),
    setProfanityDetected: (profanityDetected) => set({ profanityDetected }),
    setAudioFilePath: (audioFilePath) => set({ audioFilePath }),

    // UI state setters
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Reset everything
    reset: () => set({
      message: "",
      angry_at: "",
      tone: "",
      format: "",
      profanity_check: "censored",
      kindness: 3,
      transformedMessage: "",
      profanityDetected: false,
      isLoading: false,
      error: null,
    }),
  }));
