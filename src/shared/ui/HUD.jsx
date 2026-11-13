import './HUD.css'

export default function HUD({ onLRV = false, o2 = 100, suit = 100, missionTime = '' }) {
  return (
    <div className="hud-bar">
      <div className="hud-left">
        {onLRV && <span className="hud-vehicle-badge">🚗 LRV ACTIVE</span>}
      </div>

      <div className="hud-center">
        {missionTime && (
          <span className="hud-clock">
            <span className="hud-clock-label">MET</span> {missionTime}
          </span>
        )}
      </div>

      <div className="hud-right">
        <div className="hud-stat">
          <span className="hud-stat-label">O₂</span>
          <div className="hud-bar-track">
            <div className="hud-bar-fill o2" style={{ width: `${o2}%`, background: o2 < 20 ? '#ff4466' : undefined }} />
          </div>
          <span className="hud-stat-val">{Math.round(o2)}%</span>
        </div>
        <div className="hud-stat">
          <span className="hud-stat-label">SUIT</span>
          <div className="hud-bar-track">
            <div className="hud-bar-fill suit" style={{ width: `${suit}%` }} />
          </div>
          <span className="hud-stat-val">{Math.round(suit)}%</span>
        </div>
      </div>
    </div>
  )
}
