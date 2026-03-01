import { create } from "zustand";

  export const useCrashOutStore = create((set) => ({
    // Input fields
    message: "",
    angry_at: "",
    tone: "",
    format: "",
    profanity_check: "censored",
    kindness: 3,

    // Output
    transformedMessage: "",
    profanityDetected: false,

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
      const bounded = Number.isFinite(numeric)
        ? Math.min(5, Math.max(1, Math.round(numeric)))
        : 3;
      set({ kindness: bounded });
    },

    // Output setters
    setTransformedMessage: (transformedMessage) => set({ transformedMessage }),
    setProfanityDetected: (profanityDetected) => set({ profanityDetected }),

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
