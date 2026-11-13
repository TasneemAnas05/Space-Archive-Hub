import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Apollo11/Apollo11.css'
import './Mars.css'

const COLS = 12
const ROWS = 9
const CELL = 56

const EMPTY    = 0
const ROCK     = 1
const SAMPLE   = 2
const BASE     = 3
const HAZARD   = 4
const HELI_PAD = 5

function buildGrid() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY))

  // Base (top-left)
  grid[0][0] = BASE

  // Helicopter pad (top-right area)
  grid[1][COLS - 2] = HELI_PAD

  // Rocks — scattered
  const rockPositions = [
    [1,2],[2,5],[3,3],[4,7],[5,1],[5,9],[6,4],[7,2],[7,8],[8,5]
  ]
  for (const [r, c] of rockPositions) grid[r][c] = ROCK

  // Hazards (dust storms)
  const hazards = [[2,8],[4,4],[6,10],[3,6]]
  for (const [r, c] of hazards) grid[r][c] = HAZARD

  // Samples
  const samplePositions = [
    [0,5],[1,9],[3,1],[4,10],[5,5],[6,7],[7,5],[8,2],[8,9],[2,3]
  ]
  for (const [r, c] of samplePositions) grid[r][c] = SAMPLE

  return grid
}

const initState = () => ({
  grid: buildGrid(),
  roverRow: 0,
  roverCol: 1,
  score: 0,
  heliDeployed: false,
  health: 100,
  status: 'playing',
})

const TOTAL_SAMPLES = 10
const CELL_COLORS = {
  [EMPTY]:    '#3a1a0a',
  [ROCK]:     '#6a4a3a',
  [SAMPLE]:   '#e8603c',
  [BASE]:     '#004488',
  [HAZARD]:   '#884400',
  [HELI_PAD]: '#226622',
}

const CELL_ICONS = {
  [BASE]:     '🏠',
  [SAMPLE]:   '🪨',
  [HAZARD]:   '🌪️',
  [HELI_PAD]: '🚁',
}

export default function Mars() {
  const [state, setState] = useState(initState)
  const navigate = useNavigate()

  const reset = useCallback(() => setState(initState()), [])

  const move = useCallback((dr, dc) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev
      const nr = prev.roverRow + dr
      const nc = prev.roverCol + dc
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev

      const cell = prev.grid[nr][nc]
      if (cell === ROCK) return prev

      const newGrid = prev.grid.map(r => [...r])
      let { score, health, heliDeployed, status } = prev

      if (cell === SAMPLE) {
        newGrid[nr][nc] = EMPTY
        score++
      }
      if (cell === HAZARD) {
        health = Math.max(0, health - 25)
      }
      if (cell === HELI_PAD && !heliDeployed) {
        heliDeployed = true
        // Deploy heli: collect 2 bonus samples
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (newGrid[r][c] === SAMPLE && Math.random() < 0.4) {
              newGrid[r][c] = EMPTY
              score++
            }
          }
        }
      }

      if (health <= 0) status = 'dead'
      if (score >= TOTAL_SAMPLES) status = 'win'

      return { ...prev, grid: newGrid, roverRow: nr, roverCol: nc, score, health, heliDeployed, status }
    })
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowUp')    move(-1,  0)
      if (e.key === 'ArrowDown')  move( 1,  0)
      if (e.key === 'ArrowLeft')  move( 0, -1)
      if (e.key === 'ArrowRight') move( 0,  1)
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  const W = COLS * CELL
  const H = ROWS * CELL

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/games')}>← Back</button>
        <h1 style={{ color: '#e8603c' }}>MARS — RED PLANET ROVER</h1>
      </div>

      <div className="game-layout" style={{ width: W + 2 }}>
        <div className="hud">
          <div className="hud-item">
            <span className="hud-label">HEALTH</span>
            <div className="fuel-bar">
              <div className="fuel-fill" style={{ width: `${state.health}%`, background: state.health < 30 ? '#ff4466' : '#e8603c' }} />
            </div>
            <span className="hud-val">{state.health}%</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">SAMPLES</span>
            <span className="hud-val">{state.score} / {TOTAL_SAMPLES}</span>
          </div>
          {state.heliDeployed && (
            <div className="hud-item">
              <span className="hud-val" style={{ color: '#44ff88', fontSize: '0.65rem' }}>🚁 HELI ACTIVE</span>
            </div>
          )}
        </div>

        <div className="mars-grid" style={{ width: W, height: H }} tabIndex={0}>
          {state.grid.map((row, ri) =>
            row.map((cell, ci) => {
              const isRover = ri === state.roverRow && ci === state.roverCol
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={`mars-cell ${isRover ? 'rover-cell' : ''}`}
                  style={{
                    left: ci * CELL,
                    top: ri * CELL,
                    width: CELL,
                    height: CELL,
                    background: CELL_COLORS[cell] || CELL_COLORS[EMPTY],
                    borderColor: cell === BASE ? '#0066cc' : cell === HAZARD ? '#cc6600' : undefined,
                  }}
                >
                  {isRover ? (
                    <span className="rover-icon">🤖</span>
                  ) : CELL_ICONS[cell] ? (
                    <span className="cell-icon">{CELL_ICONS[cell]}</span>
                  ) : null}
                </div>
              )
            })
          )}
        </div>

        {state.status !== 'playing' && (
          <div className={`result-overlay ${state.status === 'win' ? 'landed' : 'crashed'}`}>
            {state.status === 'win' ? (
              <>
                <div className="result-icon">🏆</div>
                <h2>MISSION COMPLETE!</h2>
                <p>All samples collected. Humanity's footprint on Mars is growing.</p>
              </>
            ) : (
              <>
                <div className="result-icon">☢️</div>
                <h2>ROVER LOST</h2>
                <p>Too many dust storm encounters. Mission aborted.</p>
              </>
            )}
            <button className="retry-btn" onClick={reset}>TRY AGAIN</button>
          </div>
        )}
      </div>

      <div className="controls-hint">
        <span>↑ ↓ ← → — Move rover</span>
        <span>🪨 Collect samples</span>
        <span>🌪️ Avoid hazards</span>
        <span>🚁 Deploy helicopter</span>
      </div>
    </div>
  )
}
