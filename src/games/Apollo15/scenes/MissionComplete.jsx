import { useNavigate } from 'react-router-dom'
import { MISSION } from '../data/mission'
import './MissionComplete.css'

export default function MissionComplete({ onReplay }) {
  const navigate = useNavigate()

  return (
    <div className="complete-wrapper">
      <div className="complete-panel">
        <div className="complete-patch">🏆</div>

        <div className="complete-badge">MISSION ACCOMPLISHED</div>
        <h1 className="complete-title">APOLLO 15 COMPLETE</h1>
        <p className="complete-sub">
          LM Falcon lifts off from Hadley Base · August 2, 1971
        </p>

        <div className="complete-quote">
          <blockquote>
            "{MISSION.quotes[0].text}"
          </blockquote>
          <cite>— Commander David R. Scott, Apollo 15</cite>
        </div>

        <div className="complete-stats">
          {[
            ['EVA Time',      MISSION.stats.totalEvaTime],
            ['Distance',      MISSION.stats.distanceTraveled],
            ['Samples',       MISSION.stats.samplesCollected],
            ['Experiments',   `${MISSION.alsep.length} ALSEP instruments`],
          ].map(([label, val]) => (
            <div key={label} className="complete-stat">
              <span className="cs-val">{val}</span>
              <span className="cs-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="complete-legacy">
          <h3>Mission Legacy</h3>
          <p>
            Apollo 15 returned the most scientifically significant samples of any lunar
            mission. The Genesis Rock — a 4.5 billion-year-old piece of the Moon's
            original crust — answered questions about the solar system's formation.
            The ALSEP instruments continued transmitting until September 1977.
          </p>
          <p>
            Fourteen fallen space explorers — American and Soviet — were honoured
            with a small plaque left on the lunar surface, a silent monument beside
            the descent stage of Falcon.
          </p>
        </div>

        <div className="complete-actions">
          <button className="btn-replay" onClick={onReplay}>
            ↺ Play Again
          </button>
          <button className="btn-missions" onClick={() => navigate('/games')}>
            ◀ Mission Select
          </button>
          <button className="btn-home" onClick={() => navigate('/')}>
            ⌂ Home
          </button>
        </div>
      </div>
    </div>
  )
}
