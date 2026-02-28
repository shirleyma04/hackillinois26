import { create } from 'zustand'

const initialState = {
  status: 'IDLE',
  baseInputText: '',
  kindness: 3,
  target: null,
  format: null,
  tone: null,
  profanityMode: 'clean',
  outputText: '',
  audioUrl: null,
  transcript: null,
  error: null,
  blockedReason: null,
  versions: [],
  dirty: false,
}

function isReady(s) {
  return Boolean(s.baseInputText?.trim()) && Boolean(s.target) && Boolean(s.format) && Boolean(s.tone)
}

export const useCrashOutStore = create((set) => ({
  ...initialState,

  setBaseInputText: (text) =>
    set((s) => {
      const next = { ...s, baseInputText: text }
      const nowReady = isReady(next)

      if (!text?.trim()) {
        return {
          ...next,
          status: 'IDLE',
          outputText: '',
          audioUrl: null,
          transcript: null,
          versions: [],
          dirty: false,
          error: null,
          blockedReason: null,
        }
      }

      if (s.status === 'HAS_OUTPUT') {
        return { ...next, dirty: true }
      }

      return {
        ...next,
        status: nowReady ? 'READY' : 'IDLE',
      }
    }),

  setKindness: (kindness) =>
    set((s) => ({ ...s, kindness, dirty: s.status === 'HAS_OUTPUT' ? true : s.dirty })),

  setTarget: (target) =>
    set((s) => {
      const next = { ...s, target }
      if (!next.baseInputText?.trim()) {
        return { ...next, status: 'IDLE' }
      }
      if (s.status === 'HAS_OUTPUT') {
        return { ...next, dirty: true }
      }
      return { ...next, status: isReady(next) ? 'READY' : 'IDLE' }
    }),

  setFormat: (format) =>
    set((s) => {
      const next = { ...s, format }
      if (!next.baseInputText?.trim()) {
        return { ...next, status: 'IDLE' }
      }
      if (s.status === 'HAS_OUTPUT') {
        return { ...next, dirty: true }
      }
      return { ...next, status: isReady(next) ? 'READY' : 'IDLE' }
    }),

  setTone: (tone) =>
    set((s) => {
      const next = { ...s, tone }
      if (!next.baseInputText?.trim()) {
        return { ...next, status: 'IDLE' }
      }
      if (s.status === 'HAS_OUTPUT') {
        return { ...next, dirty: true }
      }
      return { ...next, status: isReady(next) ? 'READY' : 'IDLE' }
    }),

  setProfanityMode: (profanityMode) => set((s) => ({ ...s, profanityMode })),

  setOutputText: (outputText) => set((s) => ({ ...s, outputText })),

  startTransform: () => set((s) => ({ ...s, status: 'TRANSFORMING', error: null, blockedReason: null })),

  startRegen: () => set((s) => ({ ...s, status: 'REGENERATING', error: null, blockedReason: null })),

  transformSuccess: (payload) =>
    set((s) => ({
      ...s,
      status: 'HAS_OUTPUT',
      outputText: payload.outputText ?? '',
      audioUrl: payload.audioUrl ?? null,
      transcript: payload.transcript ?? null,
      versions: [{ outputText: payload.outputText ?? '', ts: Date.now() }, ...s.versions],
      dirty: false,
      error: null,
      blockedReason: null,
    })),

  transformBlocked: (reason) =>
    set((s) => ({
      ...s,
      status: 'BLOCKED',
      blockedReason: reason || 'blocked',
      outputText: '',
      audioUrl: null,
      transcript: null,
      dirty: false,
      error: null,
    })),

  transformError: (error) => set((s) => ({ ...s, status: 'ERROR', error: error || 'Network error' })),

  resetAll: () => set(() => ({ ...initialState })),
}))