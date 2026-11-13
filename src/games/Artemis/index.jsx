import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Apollo11/Apollo11.css'
import './Artemis.css'

const W = 600
const H = 480
const SHIP_R = 14
const ASTEROID_COUNT = 10

function rand(min, max) { return Math.random() * (max - min) + min }

function initState() {
  const asteroids = Array.from({ length: ASTEROID_COUNT }, () => ({
    x: rand(80, W - 80),
    y: rand(80, H - 150),
    r: rand(14, 28),
    vx: rand(-0.5, 0.5),
    vy: rand(-0.5, 0.5),
  }))
  return {
    shipX: W / 2,
    shipY: H - 60,
    shipAngle: -Math.PI / 2,
    vx: 0,
    vy: 0,
    fuel: 100,
    asteroids,
    // Gateway station target
    targetX: W / 2,
    targetY: 70,
    docked: false,
    crashed: false,
    status: 'playing',
  }
}

export default function Artemis() {
  const canvasRef = useRef(null)
  const stateRef = useRef(initState())
  const keysRef = useRef({ left: false, right: false, up: false })
  const rafRef = useRef(null)
  const [ui, setUi] = useState({ fuel: 100, status: 'playing' })
  const navigate = useNavigate()

  const reset = useCallback(() => {
    stateRef.current = initState()
    setUi({ fuel: 100, status: 'playing' })
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
    let frame = 0

    function loop() {
      frame++
      const s = stateRef.current
      const k = keysRef.current

      if (s.status === 'playing') {
        // Rotate
        if (k.left)  s.shipAngle -= 0.04
        if (k.right) s.shipAngle += 0.04
        // Thrust
        if (k.up && s.fuel > 0) {
          s.vx += Math.cos(s.shipAngle) * 0.08
          s.vy += Math.sin(s.shipAngle) * 0.08
          s.fuel = Math.max(0, s.fuel - 0.3)
        }
        // Drag
        s.vx *= 0.995; s.vy *= 0.995
        s.shipX += s.vx; s.shipY += s.vy

        // Wrap
        if (s.shipX < 0) s.shipX = W
        if (s.shipX > W) s.shipX = 0
        if (s.shipY < 0) s.shipY = H
        if (s.shipY > H) s.shipY = 0

        // Move asteroids
        for (const a of s.asteroids) {
          a.x += a.vx; a.y += a.vy
          if (a.x < -a.r) a.x = W + a.r
          if (a.x > W + a.r) a.x = -a.r
          if (a.y < -a.r) a.y = H + a.r
          if (a.y > H + a.r) a.y = -a.r

          // Collision
          const dx = s.shipX - a.x, dy = s.shipY - a.y
          if (Math.sqrt(dx * dx + dy * dy) < SHIP_R + a.r) {
            s.status = 'crashed'
          }
        }

        // Docking check
        const dx = s.shipX - s.targetX, dy = s.shipY - s.targetY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
        if (dist < 28 && spd < 0.6) s.status = 'docked'

        setUi({ fuel: Math.round(s.fuel), status: s.status })
      }

      // Draw
      ctx.fillStyle = '#03030f'
      ctx.fillRect(0, 0, W, H)

      // Moon in background
      ctx.beginPath()
      ctx.arc(W - 80, H - 80, 55, 0, Math.PI * 2)
      const moonGrad = ctx.createRadialGradient(W - 90, H - 90, 10, W - 80, H - 80, 55)
      moonGrad.addColorStop(0, '#d8e8f0')
      moonGrad.addColorStop(1, '#8898aa')
      ctx.fillStyle = moonGrad
      ctx.fill()

      // Gateway station (target)
      const t = s
      ctx.save()
      ctx.translate(t.targetX, t.targetY)
      ctx.strokeStyle = frame % 60 < 30 ? '#00d4ff' : '#7b2fff'
      ctx.lineWidth = 2
      ctx.strokeRect(-18, -6, 36, 12)
      ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-18, 0); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(18, 0);  ctx.lineTo(28, 0);  ctx.stroke()
      ctx.fillStyle = '#7b2fff'
      ctx.font = '8px Orbitron, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('GATEWAY', 0, -12)
      ctx.restore()

      // Docking ring indicator
      const dist2 = Math.sqrt((s.shipX - s.targetX) ** 2 + (s.shipY - s.targetY) ** 2)
      if (dist2 < 80) {
        ctx.beginPath()
        ctx.arc(s.targetX, s.targetY, 32, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,212,255,${0.3 + 0.3 * Math.sin(frame * 0.1)})`
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Asteroids
      for (const a of s.asteroids) {
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fillStyle = '#5a4a3a'
        ctx.fill()
        ctx.strokeStyle = '#7a6a5a'
        ctx.lineWidth = 1
        ctx.stroke()
        // craters on asteroid
        ctx.beginPath()
        ctx.arc(a.x - a.r * 0.3, a.y - a.r * 0.2, a.r * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = '#4a3a2a'
        ctx.fill()
      }

      // Ship (Orion)
      if (s.status !== 'crashed') {
        ctx.save()
        ctx.translate(s.shipX, s.shipY)
        ctx.rotate(s.shipAngle + Math.PI / 2)
        // Capsule
        ctx.beginPath()
        ctx.moveTo(0, -SHIP_R)
        ctx.lineTo(SHIP_R * 0.6, SHIP_R * 0.5)
        ctx.lineTo(-SHIP_R * 0.6, SHIP_R * 0.5)
        ctx.closePath()
        ctx.fillStyle = '#d4c89a'
        ctx.fill()
        ctx.strokeStyle = '#00d4ff'
        ctx.lineWidth = 1.5
        ctx.stroke()
        // Service module
        ctx.fillStyle = '#8899aa'
        ctx.fillRect(-8, SHIP_R * 0.5, 16, 10)
        // Thruster
        if (k.up && s.fuel > 0 && s.status === 'playing') {
          ctx.fillStyle = '#ff6b35'
          ctx.beginPath()
          ctx.moveTo(-5, SHIP_R * 0.5 + 10)
          ctx.lineTo(0, SHIP_R * 0.5 + 18 + Math.random() * 6)
          ctx.lineTo(5, SHIP_R * 0.5 + 10)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      } else {
        ctx.font = '28px serif'
        ctx.fillText('💥', s.shipX - 14, s.shipY + 10)
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
        <h1 style={{ color: '#7b2fff' }}>ARTEMIS — LUNAR GATEWAY DOCKING</h1>
      </div>

      <div className="game-layout">
        <div className="hud">
          <div className="hud-item">
            <span className="hud-label">FUEL</span>
            <div className="fuel-bar"><div className="fuel-fill" style={{ width: `${ui.fuel}%` }} /></div>
            <span className="hud-val">{ui.fuel}%</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">OBJECTIVE</span>
            <span className="hud-val" style={{ color: '#7b2fff', fontSize: '0.65rem' }}>DOCK WITH GATEWAY</span>
          </div>
        </div>

        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />

        {ui.status !== 'playing' && (
          <div className={`result-overlay ${ui.status === 'docked' ? 'landed' : 'crashed'}`}>
            {ui.status === 'docked' ? (
              <>
                <div className="result-icon">🛸</div>
                <h2>DOCKING SUCCESSFUL!</h2>
                <p>Orion has docked with the Lunar Gateway. Welcome back to the Moon.</p>
              </>
            ) : (
              <>
                <div className="result-icon">☄️</div>
                <h2>HULL BREACH</h2>
                <p>Asteroid impact. Mission aborted.</p>
              </>
            )}
            <button className="retry-btn" onClick={reset}>TRY AGAIN</button>
          </div>
        )}
      </div>

      <div className="controls-hint">
        <span>↑ / SPACE — Thrust</span>
        <span>← → — Rotate</span>
        <span>Avoid asteroids, dock slowly</span>
      </div>
    </div>
  )
}
