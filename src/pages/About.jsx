import './About.css'

const milestones = [
  {
    year: '1969',
    title: 'Apollo 11',
    desc: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon. "One small step for man, one giant leap for mankind."',
    icon: '🌕',
    color: 'var(--accent-moon)',
  },
  {
    year: '1971',
    title: 'Apollo 15',
    desc: 'David Scott and James Irwin drive the first Lunar Roving Vehicle across the Hadley–Apennine region, covering 27.9 km of lunar terrain.',
    icon: '🚗',
    color: 'var(--accent-1)',
  },
  {
    year: '2025',
    title: 'Artemis Program',
    desc: 'NASA\'s Artemis missions aim to return humans to the Moon, including the first woman and first person of color, paving the way for sustained lunar exploration.',
    icon: '🛸',
    color: 'var(--accent-2)',
  },
  {
    year: '2030s',
    title: 'Mars Missions',
    desc: 'Humanity\'s greatest challenge — a crewed mission to Mars. With rovers already exploring the Red Planet, the next step is sending astronauts on a journey of 7+ months.',
    icon: '🔴',
    color: 'var(--accent-mars)',
  },
]

export default function About() {
  return (
    <div className="about">
      <div className="about-hero">
        <h1>ABOUT THE PROJECT</h1>
        <p>
          Space Missions is an interactive educational experience bringing history's most
          daring space adventures to life through immersive browser games. Each mission
          is grounded in real science, real history, and real human courage.
        </p>
      </div>

      <section className="timeline">
        <h2>MISSION TIMELINE</h2>
        <div className="timeline-track">
          {milestones.map((m, i) => (
            <div key={i} className="timeline-item" style={{ '--tl-color': m.color }}>
              <div className="tl-year">{m.year}</div>
              <div className="tl-dot" />
              <div className="tl-card">
                <span className="tl-icon">{m.icon}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-box">
          <h2>OUR MISSION</h2>
          <p>
            We believe that space exploration belongs to everyone. This project merges
            interactive gaming with real historical data to create experiences that
            educate, inspire, and challenge. Whether you're 8 or 80, you can take the
            helm of Apollo 11, feel the thrill of driving the first lunar rover, or plot
            a course to the Red Planet.
          </p>
          <div className="mission-values">
            {['Education', 'Exploration', 'Inspiration', 'Innovation'].map(v => (
              <span key={v} className="value-tag">{v}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
