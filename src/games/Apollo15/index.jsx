import { useState } from 'react'
import Briefing        from './scenes/Briefing'
import LunarSurface    from './scenes/LunarSurface'
import MissionComplete from './scenes/MissionComplete'
import './Apollo15.css'

// Scene flow: briefing → surface → complete
// Each scene unmounts cleanly when the next begins.
export default function Apollo15() {
  const [scene, setScene] = useState('briefing')

  if (scene === 'briefing')
    return <Briefing onStart={() => setScene('surface')} />

  if (scene === 'surface')
    return (
      <div className="a15-game-host">
        <LunarSurface onComplete={() => setScene('complete')} />
      </div>
    )

  if (scene === 'complete')
    return <MissionComplete onReplay={() => setScene('briefing')} />

  return null
}
