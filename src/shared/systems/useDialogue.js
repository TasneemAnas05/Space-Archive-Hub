import { useState, useCallback, useRef } from 'react'

// Manages a single active conversation.
// dialogueActiveRef is a stable ref safe to read inside a game loop without
// creating stale-closure bugs.
export function useDialogue() {
  const [dialogue, setDialogue] = useState(null)
  const dialogueActiveRef = useRef(false)

  const startDialogue = useCallback((conversation, onComplete) => {
    if (!conversation) return
    setDialogue({ ...conversation, index: 0, onComplete: onComplete ?? null })
    dialogueActiveRef.current = true
  }, [])

  const advanceDialogue = useCallback(() => {
    setDialogue(prev => {
      if (!prev) return null
      const nextIndex = prev.index + 1
      if (nextIndex >= prev.lines.length) {
        prev.onComplete?.()
        dialogueActiveRef.current = false
        return null
      }
      return { ...prev, index: nextIndex }
    })
  }, [])

  const dismissDialogue = useCallback(() => {
    setDialogue(prev => {
      prev?.onComplete?.()
      dialogueActiveRef.current = false
      return null
    })
  }, [])

  return { dialogue, dialogueActiveRef, startDialogue, advanceDialogue, dismissDialogue }
}
