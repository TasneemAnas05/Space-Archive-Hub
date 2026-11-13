import { useNavigate } from 'react-router-dom'
import './GameCard.css'

export default function GameCard({ title, subtitle, description, route, icon, color, difficulty, year }) {
  const navigate = useNavigate()

  return (
    <article className="game-card" style={{ '--card-color': color }}>
      <div className="card-glow" />
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <div>
          <h3 className="card-title">{title}</h3>
          <span className="card-subtitle">{subtitle}</span>
        </div>
        <span className="card-year">{year}</span>
      </div>
      <p className="card-desc">{description}</p>
      <div className="card-footer">
        <span className="card-difficulty">
          {'★'.repeat(difficulty)}{'☆'.repeat(3 - difficulty)} Difficulty
        </span>
        <button className="play-btn" onClick={() => navigate(route)}>
          ▶ PLAY
        </button>
      </div>
    </article>
  )
}
