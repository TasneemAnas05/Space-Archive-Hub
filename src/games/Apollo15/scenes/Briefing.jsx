import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MISSION } from '../data/mission'
import './Briefing.css'

function Fact({ label, value }) {
  return (
    <div className="brief-fact">
      <span className="brief-fact-label">{label}</span>
      <span className="brief-fact-value">{value}</span>
    </div>
  )
}

export default function Briefing({ onStart }) {
  const [page, setPage] = useState(0) // 0: crew  1: stats  2: science
  const navigate = useNavigate()

  const pages = [
    {
      heading: 'The Crew & Spacecraft',
      content: (
        <>
          <div className="brief-crew">
            {Object.values(MISSION.crew).map(c => (
              <div key={c.id} className="brief-crewmember">
                <span className="crew-emoji">👨‍🚀</span>
                <span className="crew-callsign">{c.callsign}</span>
                <span className="crew-name">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="brief-facts">
            <Fact label="Lunar Module"     value={`"${MISSION.spacecraft.lm.name}" (${MISSION.spacecraft.lm.designation})`} />
            <Fact label="Command Module"   value={`"${MISSION.spacecraft.cm.name}"`} />
            <Fact label="Launch"           value={MISSION.launchDate} />
            <Fact label="Landing"          value={`${MISSION.landingDate} at ${MISSION.landingTime}`} />
            <Fact label="Landing Site"     value={MISSION.landingSite.name} />
            <Fact label="Site Description" value={MISSION.landingSite.description} />
          </div>
        </>
      ),
    },
    {
      heading: 'By the Numbers',
      content: (
        <>
          <div className="brief-stats-grid">
            {Object.entries(MISSION.stats).map(([k, v]) => (
              <div key={k} className="brief-stat-card">
                <span className="stat-card-val">{v}</span>
                <span className="stat-card-label">
                  {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
          <div className="brief-achievements">
            {MISSION.achievements.map((a, i) => (
              <div key={i} className="brief-achievement">
                <span className="ach-bullet">▸</span> {a}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      heading: 'Science Objectives',
      content: (
        <>
          <p className="brief-para">
            Apollo 15 deployed the most comprehensive Apollo Lunar Surface Experiments Package (ALSEP)
            yet attempted. The instruments transmitted data back to Earth for over six years.
          </p>
          <div className="brief-alsep">
            {MISSION.alsep.map((inst, i) => (
              <div key={i} className="alsep-item">
                <span className="alsep-num">{String(i + 1).padStart(2, '0')}</span>
                {inst}
              </div>
            ))}
          </div>
          <blockquote className="brief-quote">
            "{MISSION.quotes[0].text}"
            <cite>— David Scott</cite>
          </blockquote>
        </>
      ),
    },
  ]

  return (
    <div className="briefing">
      <div className="brief-bg" aria-hidden="true" />

      <div className="brief-panel">
        {/* Header */}
        <div className="brief-header">
          <div className="brief-patch">🌕</div>
          <div>
            <div className="brief-mission-num">MISSION BRIEFING</div>
            <h1 className="brief-title">APOLLO 15</h1>
            <div className="brief-tagline">The Most Ambitious Moon Mission Yet</div>
          </div>
          <div className="brief-id">{MISSION.designation}</div>
        </div>

        {/* Tab nav */}
        <div className="brief-tabs">
          {pages.map((p, i) => (
            <button
              key={i}
              className={`brief-tab ${page === i ? 'active' : ''}`}
              onClick={() => setPage(i)}
            >
              {['Crew', 'Stats', 'Science'][i]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="brief-content">
          <h2 className="brief-page-heading">{pages[page].heading}</h2>
          {pages[page].content}
        </div>

        {/* Actions */}
        <div className="brief-actions">
          <button className="btn-back" onClick={() => navigate('/games')}>← Mission Select</button>
          <button className="btn-launch" onClick={onStart}>
            <span>BEGIN EVA-1</span>
            <span className="btn-sub">Hadley Base · July 30, 1971</span>
          </button>
        </div>
      </div>
    </div>
  )
}
