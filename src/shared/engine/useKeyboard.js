import { useEffect, useRef } from 'react'

// Returns a stable ref whose .current is a Set of currently-pressed KeyboardEvent.code values.
export function useKeyboard() {
  const keys = useRef(new Set())

  useEffect(() => {
    const down = e => keys.current.add(e.code)
    const up   = e => keys.current.delete(e.code)
    const blur = ()  => keys.current.clear()   // release all when window loses focus
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    window.addEventListener('blur',    blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
      window.removeEventListener('blur',    blur)
    }
  }, [])

  return keys
}
