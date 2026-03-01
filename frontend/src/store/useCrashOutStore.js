import { create } from "zustand";

export const useCrashOutStore = create((set) => ({
    // Input fields
    message: "",
    angry_at: "",
    tone: "",
    format: "",
    selectedFormat: "",
    profanity_check: "censored",
    kindness: 3,
    kindnessRaw: 3,
    voice_format: "",
    voice_personality: "",

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

    // Add audio reference for controlling playback
    currentAudio: null,
    setCurrentAudio: (audio) => set({ currentAudio: audio }),
    stopAudio: () => set((state) => {
      if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio.currentTime = 0;
      }
      return { currentAudio: null };
    }),

    // Track last generation parameters to detect changes
    lastGenerationParams: null,
    setLastGenerationParams: (params) => set({ lastGenerationParams: params }),
    clearLastGenerationParams: () => set({ lastGenerationParams: null }),

    // Input setters
    setMessage: (message) => set({ message }),
    setAngryAt: (angry_at) => set({ angry_at }),
    setTone: (tone) => set({ tone }),
    setFormat: (format) => set({ format }),
    setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
    setProfanityCheck: (profanity_check) => set({ profanity_check }),
    setKindness: (kindness) => {
      const numeric = Number(kindness);
      const raw = Number.isFinite(numeric) ? Math.min(5, Math.max(1, numeric)) : 3;
      const rounded = Math.round(raw);
      set({ kindness: rounded, kindnessRaw: raw });
    },
    setVoiceFormat: (voice_format) => set({ voice_format }),
    setVoicePersonality: (voice_personality) => set({ voice_personality }),

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
      profanity_check: "censored",
      kindness: 3,
      voice_format: "",
      voice_personality: "",
      transformedMessage: "",
      profanityDetected: false,
      isLoading: false,
      error: null,
      ttsFilePath: "",
    }),
  }));
