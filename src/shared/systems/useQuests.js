import { useState, useCallback, useMemo } from 'react'

// Manages quest state for a game.
// Quests unlock in order — completing the last objective of quest N
// automatically activates quest N+1.
export function useQuests(definitions) {
  const [states, setStates] = useState(() => {
    const map = {}
    definitions.forEach((q, i) => {
      map[q.id] = {
        status: i === 0 ? 'active' : 'locked',
        objectives: Object.fromEntries(q.objectives.map(o => [o.id, false])),
      }
    })
    return map
  })

  const completeObjective = useCallback((questId, objectiveId) => {
    setStates(prev => {
      if (!prev[questId] || prev[questId].status !== 'active') return prev
      if (prev[questId].objectives[objectiveId]) return prev // already done

      const updatedObj = { ...prev[questId].objectives, [objectiveId]: true }
      const allDone    = Object.values(updatedObj).every(Boolean)

      const next = { ...prev }
      next[questId] = { ...prev[questId], objectives: updatedObj, status: allDone ? 'completed' : 'active' }

      if (allDone) {
        const idx = definitions.findIndex(q => q.id === questId)
        const nextDef = definitions[idx + 1]
        if (nextDef) next[nextDef.id] = { ...prev[nextDef.id], status: 'active' }
      }

      return next
    })
  }, [definitions])

  const quests = useMemo(() =>
    definitions.map(def => ({
      ...def,
      status: states[def.id].status,
      objectives: def.objectives.map(o => ({
        ...o,
        completed: states[def.id].objectives[o.id],
      })),
    })),
  [definitions, states])

  const activeQuest   = quests.find(q => q.status === 'active') ?? null
  const allComplete   = quests.every(q => q.status === 'completed')
  const isObjectiveDone = useCallback((questId, objId) =>
    states[questId]?.objectives[objId] ?? false,
  [states])
  const isQuestActive = useCallback((questId) =>
    states[questId]?.status === 'active',
  [states])

  return { quests, activeQuest, allComplete, completeObjective, isObjectiveDone, isQuestActive }
}
