import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useCrashOutStore = create((set) => ({
    // Input fields
    message: "",
    angry_at: "",
    tone: "",
    format: "",
    selectedFormat: "",
    theme: getInitialTheme(),
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

    // Add TTS file path
    ttsFilePath: "",                  // <- new state
    setTtsFilePath: (ttsFilePath) => set({ ttsFilePath }), // <- setter

    clonedVoiceId: null,
    setClonedVoiceId: (clonedVoiceId) => set({ clonedVoiceId }),

    // Input setters
    setMessage: (message) => set({ message }),
    setAngryAt: (angry_at) => set({ angry_at }),
    setTone: (tone) => set({ tone }),
    setFormat: (format) => set({ format }),
    setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
    setTheme: (theme) =>
      set(() => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("theme", theme);
        }
        return { theme };
      }),
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
      selectedFormat: "",
      theme: getInitialTheme(),
      profanity_check: "censored",
      kindness: 3,
      kindnessRaw: 3,
      transformedMessage: "",
      profanityDetected: false,
      isLoading: false,
      error: null,
      ttsFilePath: "",
    }),
  }));
