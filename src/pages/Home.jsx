import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-fig">

      {/* ── HERO ── */}
      <section className="fig-hero" style={{ backgroundImage: 'url(/images/hero-panorama.png)' }}>
        <div className="fig-hero-overlay" />
        <div className="fig-hero-content">
          <span className="fig-tag">NASA SPACE APPS CHALLENGE · PROJECT CONCEPT</span>
          <h1 className="fig-hero-title">
            Space history.<br />Your next adventure.
          </h1>
          <p className="fig-hero-desc">
            Step inside the missions that defined humanity's greatest achievements.
            Explore the Moon, discover Apollo 15, and prepare for what comes next.
          </p>
          <div className="fig-hero-actions">
            <button className="fig-btn-primary" onClick={() => navigate('/games')}>
              Explore the missions &nbsp;→
            </button>
            <button className="fig-btn-secondary" onClick={() => navigate('/play/apollo15')}>
              Discover Apollo 15 &nbsp;↗
            </button>
          </div>
          <p className="fig-hero-scroll">SCROLL TO EXPLORE ↓</p>
        </div>
      </section>

      {/* ── CHOOSE YOUR DESTINATION ── */}
      <section className="fig-destinations">
        <div className="fig-dest-card fig-dest-moon" style={{ backgroundImage: 'url(/images/moon.png)' }}>
          <div className="fig-dest-overlay" />
          <div className="fig-dest-body">
            <span className="fig-dest-label">FIRST PROTOTYPE</span>
            <h2 className="fig-dest-title">The Moon</h2>
            <p className="fig-dest-desc">Walk in the tracks of Apollo 15.</p>
            <button className="fig-btn-dest-primary" onClick={() => navigate('/games')}>
              All missions →
            </button>
          </div>
        </div>

        <div className="fig-dest-card fig-dest-mars" style={{ backgroundImage: 'url(/images/mars.png)' }}>
          <div className="fig-dest-overlay" />
          <div className="fig-dest-body">
            <span className="fig-dest-label">ON THE HORIZON</span>
            <h2 className="fig-dest-title">Mars</h2>
            <p className="fig-dest-desc">The next chapter of exploration.</p>
            <button className="fig-btn-dest-muted">Coming soon</button>
          </div>
        </div>
      </section>

      {/* ── APOLLO 15 EXPERIENCE ── */}
      <section className="fig-experience">
        <div className="fig-exp-image">
          <img src="/images/apollo15.png" alt="Apollo 15 lunar surface" className="fig-exp-img" />
        </div>
        <div className="fig-exp-content">
          <span className="fig-section-tag">02 / THE FIRST EXPERIENCE</span>
          <h2 className="fig-exp-title">
            One giant leap.<br />Now it's your turn.
          </h2>
          <p className="fig-exp-desc">
            Relive the Apollo 15 mission through an immersive narrative experience.
            Make decisions, explore the lunar surface, and uncover the science behind
            one of humanity's greatest adventures.
          </p>
          <p className="fig-exp-features">EXPLORE · DRIVE · DEPLOY · DISCOVER</p>
          <button className="fig-btn-primary" onClick={() => navigate('/play/apollo15')}>
            Discover the mission →
          </button>
        </div>
      </section>

      {/* ── WAYS TO EXPLORE ── */}
      <section className="fig-ways">
        <div className="fig-ways-header">
          <span className="fig-section-tag">03 / LEARN BY EXPLORING</span>
          <h2 className="fig-ways-title">Don't just read history. Step inside it.</h2>
        </div>
        <div className="fig-ways-grid">
          {[
            { n: '01', title: 'Immersive 3D worlds',   desc: 'Navigate detailed recreations of historic mission environments.' },
            { n: '02', title: 'Story-driven missions', desc: 'Experience the drama and decisions of real space exploration.' },
            { n: '03', title: 'Hands-on science',      desc: 'Conduct experiments and collect data like real astronauts.' },
            { n: '04', title: 'Real mission data',     desc: 'Every detail grounded in NASA archives and historical records.' },
          ].map(f => (
            <div key={f.n} className="fig-way-card">
              <span className="fig-way-num">{f.n}</span>
              <h3 className="fig-way-title">{f.title}</h3>
              <p className="fig-way-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="fig-vision">
        <span className="fig-section-tag">04 / OUR VISION</span>
        <h2 className="fig-vision-title">
          For the next generation<br />of explorers.
        </h2>
        <p className="fig-vision-desc">
          Space Archive Hub was built to make the history of space exploration
          accessible, engaging, and alive — not just as facts to memorise, but
          as stories to live through.
        </p>
        <p className="fig-vision-desc">
          We believe the best way to understand what humanity has achieved beyond
          Earth is to step into those moments yourself.
        </p>
      </section>

    </div>
  )
}
