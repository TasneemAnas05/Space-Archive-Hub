import { useEffect, useRef } from 'react'

// Runs `callback(dt)` every animation frame.
// dt is a normalised delta — 1.0 at 60 fps, 2.0 at 30 fps.
// callback is always read from a ref so callers can use it without
// listing it as a dependency (safe for closures over state).
export function useGameLoop(callback) {
  const rafRef      = useRef(null)
  const prevRef     = useRef(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    function loop(ts) {
      const dt = prevRef.current
        ? Math.min((ts - prevRef.current) / 16.667, 4) // cap at 4× slow-down
        : 1
      prevRef.current = ts
      callbackRef.current(dt)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      prevRef.current = null
    }
  }, [])
}
