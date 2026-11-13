import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Apollo11.css'

const W = 600
const H = 480
const GRAVITY = 0.012
const THRUST = 0.028
const FUEL_USE = 0.4
const PAD_W = 90
const PAD_X = W / 2 - PAD_W / 2
const PAD_Y = H - 60
const LAND_VY_MAX = 0.6
const LAND_VX_MAX = 0.4

function makeTerrain() {
  const pts = [{ x: 0, y: H - 55 }]
  let x = 0
  while (x < W) {
    x += 25 + Math.random() * 35
    const y = H - 55 - Math.random() * 55
    if (x >= PAD_X - 10 && x <= PAD_X + PAD_W + 10) continue
    pts.push({ x: Math.min(x, W), y })
  }
  pts.push({ x: W, y: H - 55 })
  return pts
}

const initState = () => ({
  x: W / 2 - 10,
  y: 60,
  vx: 0,
  vy: 0,
  fuel: 100,
  status: 'flying', // flying | landed | crashed
  terrain: makeTerrain(),
})

export default function Apollo11() {
  const canvasRef = useRef(null)
  const stateRef = useRef(initState())
  const keysRef = useRef({ left: false, right: false, up: false })
  const rafRef = useRef(null)
  const [ui, setUi] = useState({ fuel: 100, vy: 0, status: 'flying' })
  const navigate = useNavigate()

  const reset = useCallback(() => {
    stateRef.current = initState()
    setUi({ fuel: 100, vy: 0, status: 'flying' })
  }, [])

  useEffect(() => {
    const onKey = (e, down) => {
      if (e.key === 'ArrowLeft')  keysRef.current.left  = down
      if (e.key === 'ArrowRight') keysRef.current.right = down
      if (e.key === 'ArrowUp' || e.key === ' ') keysRef.current.up = down
      if (down) e.preventDefault()
    }
    window.addEventListener('keydown',  e => onKey(e, true))
    window.addEventListener('keyup',    e => onKey(e, false))
    return () => {
      window.removeEventListener('keydown',  e => onKey(e, true))
      window.removeEventListener('keyup',    e => onKey(e, false))
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function loop() {
      const s = stateRef.current
      const k = keysRef.current

      if (s.status === 'flying') {
        let ax = 0, ay = GRAVITY
        let thrusting = false
        if (k.up && s.fuel > 0) {
          ay -= THRUST * 1.8
          thrusting = true
        }
        if (k.left  && s.fuel > 0) { ax -= THRUST; thrusting = true }
        if (k.right && s.fuel > 0) { ax += THRUST; thrusting = true }
        if (thrusting) s.fuel = Math.max(0, s.fuel - FUEL_USE * (k.up ? 1 : 0.5))

        s.vx += ax; s.vy += ay
        s.x  += s.vx; s.y  += s.vy
        s.x = Math.max(5, Math.min(W - 25, s.x))

        const lmBottom = s.y + 24
        if (
          lmBottom >= PAD_Y &&
          s.x + 10 >= PAD_X &&
          s.x + 10 <= PAD_X + PAD_W
        ) {
          s.status = Math.abs(s.vy) <= LAND_VY_MAX && Math.abs(s.vx) <= LAND_VX_MAX
            ? 'landed' : 'crashed'
        } else {
          for (const pt of s.terrain) {
            if (Math.abs(s.x - pt.x) < 20 && lmBottom >= pt.y) {
              s.status = 'crashed'
              break
            }
          }
        }
        if (s.y > H) s.status = 'crashed'
        setUi({ fuel: Math.round(s.fuel), vy: s.vy.toFixed(2), status: s.status })
      }

      // Draw
      ctx.fillStyle = '#03030f'
      ctx.fillRect(0, 0, W, H)

      // Landing pad
      ctx.fillStyle = '#c8d8e8'
      ctx.fillRect(PAD_X, PAD_Y, PAD_W, 6)
      ctx.fillStyle = '#00d4ff'
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(PAD_X + 15 + i * 30, PAD_Y - 6, 4, 6)
      }

      // Terrain
      const t = s.terrain
      ctx.beginPath()
      ctx.moveTo(0, H)
      ctx.lineTo(t[0].x, t[0].y)
      for (let i = 1; i < t.length; i++) ctx.lineTo(t[i].x, t[i].y)
      ctx.lineTo(W, H)
      ctx.closePath()
      ctx.fillStyle = '#1a1a3a'
      ctx.fill()
      ctx.strokeStyle = '#8892a4'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(t[0].x, t[0].y)
      for (let i = 1; i < t.length; i++) ctx.lineTo(t[i].x, t[i].y)
      ctx.stroke()

      // LM
      const lx = s.x, ly = s.y
      if (s.status !== 'crashed') {
        // Body
        ctx.fillStyle = '#d4c89a'
        ctx.fillRect(lx, ly, 20, 16)
        // Legs
        ctx.strokeStyle = '#d4c89a'
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(lx + 2, ly + 16); ctx.lineTo(lx - 8, ly + 24); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(lx + 18, ly + 16); ctx.lineTo(lx + 28, ly + 24); ctx.stroke()
        // Window
        ctx.fillStyle = '#00d4ff'
        ctx.beginPath(); ctx.arc(lx + 10, ly + 7, 4, 0, Math.PI * 2); ctx.fill()
        // Thruster flame
        const thrusting = keysRef.current.up && s.fuel > 0 && s.status === 'flying'
        if (thrusting) {
          ctx.fillStyle = '#ff6b35'
          ctx.beginPath()
          ctx.moveTo(lx + 6, ly + 16)
          ctx.lineTo(lx + 10, ly + 28 + Math.random() * 6)
          ctx.lineTo(lx + 14, ly + 16)
          ctx.closePath()
          ctx.fill()
        }
      } else {
        // Crash debris
        ctx.font = '28px serif'
        ctx.fillText('💥', lx - 8, ly + 20)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/games')}>← Back</button>
        <h1>APOLLO 11 — LUNAR LANDER</h1>
      </div>

      <div className="game-layout">
        <div className="hud">
          <div className="hud-item">
            <span className="hud-label">FUEL</span>
            <div className="fuel-bar"><div className="fuel-fill" style={{ width: `${ui.fuel}%` }} /></div>
            <span className="hud-val">{ui.fuel}%</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">DESCENT RATE</span>
            <span className={`hud-val ${Math.abs(ui.vy) > LAND_VY_MAX ? 'danger' : 'safe'}`}>{ui.vy} m/s</span>
          </div>
        </div>

        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />

        {ui.status !== 'flying' && (
          <div className={`result-overlay ${ui.status}`}>
            {ui.status === 'landed' ? (
              <>
                <div className="result-icon">🌕</div>
                <h2>THE EAGLE HAS LANDED!</h2>
                <p>"That's one small step for man, one giant leap for mankind."</p>
              </>
            ) : (
              <>
                <div className="result-icon">💥</div>
                <h2>MISSION FAILED</h2>
                <p>Descent rate too high. Houston, we have a problem.</p>
              </>
            )}
            <button className="retry-btn" onClick={reset}>TRY AGAIN</button>
          </div>
        )}
      </div>

      <div className="controls-hint">
        <span>↑ / SPACE — Thrust</span>
        <span>← → — Lateral</span>
        <span>Land gently on the pad</span>
      </div>
    </div>
  )
}
