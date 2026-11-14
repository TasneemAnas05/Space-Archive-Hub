import { useNavigate } from 'react-router-dom'
import './About.css'

const milestones = [
  { year: '1969', label: '01 / APOLLO 11',  title: 'First Moon Landing',    desc: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon. "One small step for man, one giant leap for mankind."', route: '/play/apollo11' },
  { year: '1971', label: '02 / APOLLO 15',  title: 'First Lunar Rover',     desc: 'David Scott and James Irwin drive the first Lunar Roving Vehicle across Hadley–Apennine, covering 27.9 km of lunar terrain.', route: '/play/apollo15' },
  { year: '2025', label: '03 / ARTEMIS',    title: 'Return to the Moon',    desc: "NASA's Artemis missions aim to return humans to the Moon, including the first woman and first person of color.", route: '/play/artemis' },
  { year: '2030s',label: '04 / MARS',       title: 'The Next Frontier',     desc: "Humanity's greatest challenge — a crewed mission to Mars. With rovers already exploring, the next step is sending astronauts on a 7+ month journey.", route: '/play/mars' },
]

const values = ['Education', 'Exploration', 'Inspiration', 'Innovation']

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="about-fig">

      <section className="about-hero-fig">
        <span className="fig-section-tag">THE PROJECT</span>
        <h1 className="about-hero-title">Space history,<br />made interactive.</h1>
        <p className="about-hero-desc">
          Space Archive Hub is an immersive educational experience bringing history's most
          daring space adventures to life. Each mission is grounded in real science,
          real history, and real human courage.
        </p>
      </section>

      <section className="about-timeline-fig">
        <span className="fig-section-tag">01 / MISSION TIMELINE</span>
        <h2 className="about-section-title">From Apollo to Mars</h2>
        <div className="timeline-fig-grid">
          {milestones.map((m, i) => (
            <div key={i} className="tl-fig-card" onClick={() => navigate(m.route)} style={{ cursor: 'pointer' }}>
              <span className="tl-fig-tag">{m.label}</span>
              <span className="tl-fig-year">{m.year}</span>
              <h3 className="tl-fig-title">{m.title}</h3>
              <p className="tl-fig-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-mission-fig">
        <div className="mission-fig-inner">
          <span className="fig-section-tag">02 / OUR MISSION</span>
          <h2 className="about-section-title">For the next generation<br />of explorers.</h2>
          <p className="about-mission-desc">
            We believe that space exploration belongs to everyone. This project merges
            interactive storytelling with real historical data to create experiences that
            educate, inspire, and challenge — no matter your age.
          </p>
          <div className="mission-fig-values">
            {values.map(v => (
              <span key={v} className="fig-value-tag">{v}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
