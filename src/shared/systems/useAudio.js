import { useRef, useCallback } from 'react'

// Thin wrapper around Web Audio API.
// Games call play(id) / stop(id) using registered sound entries.
// Gracefully no-ops when AudioContext is blocked (autoplay policy).
export function useAudio() {
  const ctxRef    = useRef(null)
  const nodesRef  = useRef({})

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {})
    }
    return ctxRef.current
  }

  // Synthesise a simple beep tone (useful as a placeholder for real audio assets).
  const playTone = useCallback((frequency = 440, duration = 0.15, type = 'sine', gain = 0.08) => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      osc.connect(env)
      env.connect(ctx.destination)
      osc.frequency.value = frequency
      osc.type = type
      env.gain.setValueAtTime(gain, ctx.currentTime)
      env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration + 0.05)
    } catch (_) {}
  }, [])

  const playInteract  = useCallback(() => playTone(660, 0.08, 'sine',    0.06), [playTone])
  const playCollect   = useCallback(() => { playTone(880, 0.07); playTone(1100, 0.07) }, [playTone])
  const playQuestDone = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.18, 'triangle', 0.07), i * 90))
  }, [playTone])

  return { playInteract, playCollect, playQuestDone }
}
