import { useNavigate } from 'react-router-dom'
import './Games.css'

const GAMES = [
  { tag: '01 / THE MOON', title: 'Apollo 11', sub: 'Lunar Lander', desc: 'Pilot the Eagle lunar module from orbit to a safe touchdown on the Sea of Tranquility. Manage fuel, control descent, and land before history watches.', route: '/play/apollo11', status: 'Play now', img: '/images/moon.png', difficulty: 2, year: 'July 1969' },
  { tag: '02 / THE MOON', title: 'Apollo 15', sub: 'Lunar Rover', desc: 'Take the wheel of the first Lunar Roving Vehicle. Navigate the rugged Hadley–Apennine terrain, collect rock samples, and return to base.', route: '/play/apollo15', status: 'Play now', img: '/images/moon.png', difficulty: 1, year: 'July 1971' },
  { tag: '03 / THE MOON', title: 'Artemis',   sub: 'Return to the Moon', desc: 'Guide the Orion spacecraft through orbital maneuvers to dock with the Lunar Gateway. Precision burns and timing are everything.', route: '/play/artemis', status: 'Play now', img: '/images/moon.png', difficulty: 3, year: '2025+' },
  { tag: '04 / MARS',     title: 'Mars',      sub: 'Red Planet Rover', desc: 'Command the Perseverance rover across the Jezero Crater floor. Avoid hazards, deploy the Ingenuity helicopter, and collect samples.', route: '/play/mars', status: 'Coming soon', img: '/images/mars.png', difficulty: 2, year: '2030s' },
]

export default function Games() {
  const navigate = useNavigate()
  return (
    <div className="games-fig">
      <div className="games-fig-header">
        <span className="fig-section-tag-g">CHOOSE YOUR DESTINATION</span>
        <h1 className="games-fig-title">Don't just read history.<br />Step inside it.</h1>
        <p className="games-fig-sub">Four missions. Four moments that defined humanity's reach into the cosmos.</p>
      </div>

      <div className="games-fig-grid">
        {GAMES.map(g => (
          <div key={g.title} className="game-fig-card" style={{ backgroundImage: `url(${g.img})` }}>
            <div className="game-fig-overlay" />
            <div className="game-fig-body">
              <span className="game-fig-tag">{g.tag}</span>
              <h2 className="game-fig-title">{g.title}</h2>
              <p className="game-fig-sub">{g.sub} · {g.year}</p>
              <p className="game-fig-desc">{g.desc}</p>
              {g.status === 'Play now' ? (
                <button className="game-fig-btn-primary" onClick={() => navigate(g.route)}>
                  Explore {g.title} →
                </button>
              ) : (
                <button className="game-fig-btn-muted" disabled>{g.status}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
