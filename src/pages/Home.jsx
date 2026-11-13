import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">INTERACTIVE SPACE MISSIONS</div>
        <h1 className="hero-title">
          EXPLORE THE<br />
          <span className="gradient-text">UNIVERSE</span>
        </h1>
        <p className="hero-sub">
          Pilot legendary spacecraft. Walk on the Moon. Drive the first lunar rover.
          Prepare humanity's return. Chart a course for the Red Planet.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/games')}>
            ▶ Launch Missions
          </button>
          <button className="btn-secondary" onClick={() => navigate('/about')}>
            Learn More
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">4</span>
            <span className="stat-label">Missions</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">60+</span>
            <span className="stat-label">Years of History</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Discoveries</span>
          </div>
        </div>
      </section>

      <section className="mission-strip">
        {[
          { icon: '🌕', label: 'Apollo 11', sub: 'First Moon Landing' },
          { icon: '🚗', label: 'Apollo 15', sub: 'Lunar Rover' },
          { icon: '🛸', label: 'Artemis',   sub: 'Return to Moon' },
          { icon: '🔴', label: 'Mars',       sub: 'Red Planet' },
        ].map(m => (
          <div key={m.label} className="mission-pill" onClick={() => navigate('/games')}>
            <span>{m.icon}</span>
            <div>
              <strong>{m.label}</strong>
              <small>{m.sub}</small>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
