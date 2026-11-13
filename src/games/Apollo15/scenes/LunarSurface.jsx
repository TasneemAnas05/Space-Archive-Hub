import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { useKeyboard }   from '../../../shared/engine/useKeyboard'
import { useGameLoop }   from '../../../shared/engine/useGameLoop'
import { useCamera }     from '../../../shared/engine/useCamera'
import { useDialogue }   from '../../../shared/systems/useDialogue'
import { useQuests }     from '../../../shared/systems/useQuests'
import { useAudio }      from '../../../shared/systems/useAudio'
import DialogueBox       from '../../../shared/ui/DialogueBox'
import QuestLog          from '../../../shared/ui/QuestLog'
import HUD               from '../../../shared/ui/HUD'
import InteractionPrompt from '../../../shared/ui/InteractionPrompt'
import { DIALOGUES }     from '../data/dialogues'
import { QUEST_DEFS }    from '../data/quests'
import { ENTITY_DEFS }   from '../data/entities'
import './LunarSurface.css'

// ─── World constants ───────────────────────────────────────────────────────
const CW       = 820   // canvas width
const CH       = 480   // canvas height
const WW       = 3400  // world width
const WH       = CH
const GROUND   = 310   // baseline y for the flat surface
const P_W      = 22    // player width
const P_H      = 42    // player height
const P_SPEED  = 2.4
const LRV_SPEED = 4.6
const INTER_D  = 68    // interaction distance (px)

// ─── Terrain generation ────────────────────────────────────────────────────
function buildTerrain() {
  const pts = []
  for (let x = 0; x <= WW; x += 10) {
    // gentle undulation; ramp up at Hadley Rille (x > 2750)
    const rille  = x > 2750 ? (x - 2750) * 0.016 : 0
    const y = GROUND
      + Math.sin(x * 0.0022) * 10
      + Math.sin(x * 0.007)  * 5
      + Math.sin(x * 0.021)  * 2
      + rille
    pts.push([x, Math.min(y, GROUND + 55)])
  }
  return pts
}

function terrainY(terrain, wx) {
  const idx = Math.floor(wx / 10)
  const clamped = Math.max(0, Math.min(idx, terrain.length - 2))
  const t = (wx - terrain[clamped][0]) / 10
  return terrain[clamped][1] * (1 - t) + (terrain[clamped + 1]?.[1] ?? GROUND) * t
}

// ─── Star field (pre-computed, stable) ────────────────────────────────────
function buildStars() {
  const rng = (seed) => { let s = seed; return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF } }
  const r = rng(0xDEADBEEF)
  return Array.from({ length: 200 }, () => ({
    rx: r(),       // relative-x in [0,1] — multiply by WW for parallax
    ry: r() * 0.65 * CH,
    radius: r() * 1.5 + 0.3,
    alpha: r() * 0.7 + 0.3,
  }))
}

// ─── Mountain silhouette (pre-computed) ────────────────────────────────────
function buildMountains() {
  // Far layer (Apennines)
  const far = [
    0, 230,  180, 185,  310, 162,  440, 195,  570, 155,
    700, 178, 850, 162, 1000, 195, 1150, 168, 1300, 155,
    1450, 182, 1600, 170, 1750, 158, 1900, 185, 2050, 170,
    2200, 155, 2350, 178, 2500, 165, 2650, 182, 2800, 170,
    WW, 230,
  ]
  // Near foothills
  const near = [
    0, 272,  200, 258, 400, 268, 600, 254, 800, 265,
    1000, 255, 1200, 264, 1400, 255, 1600, 265, 1800, 255,
    2000, 262, 2200, 255, 2400, 263, 2600, 255, 2800, 262,
    WW, 272,
  ]
  return { far, near }
}

// ─── Crater positions (decorative) ─────────────────────────────────────────
function buildCraters() {
  const positions = [
    [160, 335, 18], [420, 345, 12], [680, 340, 22], [910, 332, 15],
    [1100, 348, 10], [1340, 335, 25], [1550, 342, 14], [1820, 335, 20],
    [2050, 345, 12], [2300, 335, 28], [2600, 340, 16], [2850, 338, 20],
  ]
  return positions.map(([x, y, r]) => ({ x, y, r }))
}

// ─── World initialiser ─────────────────────────────────────────────────────
function initWorld() {
  const terrain  = buildTerrain()
  const entities = ENTITY_DEFS.map(e => ({ ...e, state: 'idle', wx: e.x }))
  const lrvDef   = entities.find(e => e.id === 'lrv')

  return {
    terrain,
    craters: buildCraters(),
    stars: buildStars(),
    mountains: buildMountains(),
    player: {
      x: 200, y: GROUND - P_H, vx: 0, facing: 1, onLRV: false,
    },
    lrv: { x: lrvDef?.wx ?? 540 },
    entities,
    footprints: [],
    entityDone: {},   // id → true when interacted
    frame: 0,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Pure rendering functions ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

function drawSky(ctx, camX) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND)
  g.addColorStop(0, '#020210')
  g.addColorStop(1, '#0a0828')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CW, GROUND)
}

function drawStars(ctx, camX, stars) {
  for (const s of stars) {
    const sx = (s.rx * WW - camX * 0.08) % CW
    ctx.beginPath()
    ctx.arc(sx < 0 ? sx + CW : sx, s.ry, s.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
    ctx.fill()
  }
}

function drawEarth(ctx, camX) {
  const ex = CW - 90 - camX * 0.04
  const ey = 65
  const g = ctx.createRadialGradient(ex - 12, ey - 12, 4, ex, ey, 38)
  g.addColorStop(0, '#5599ff')
  g.addColorStop(0.5, '#2255bb')
  g.addColorStop(1, '#0a2255')
  ctx.beginPath()
  ctx.arc(ex, ey, 38, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  // cloud wisps
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath(); ctx.ellipse(ex - 10, ey - 8,  14, 5, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(ex + 8,  ey + 10, 10, 4, -0.4, 0, Math.PI * 2); ctx.fill()
}

function drawSun(ctx, camX) {
  const sx = 55 - camX * 0.03
  const sy = 45
  ctx.beginPath()
  ctx.arc(sx, sy, 10, 0, Math.PI * 2)
  const g = ctx.createRadialGradient(sx, sy, 1, sx, sy, 20)
  g.addColorStop(0, 'rgba(255,255,220,0.95)')
  g.addColorStop(0.4, 'rgba(255,220,100,0.4)')
  g.addColorStop(1, 'rgba(255,180,50,0)')
  ctx.fillStyle = 'rgba(255,255,220,0.95)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(sx, sy, 20, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
}

function drawMountains(ctx, camX, mts) {
  // Far Apennines
  const f = mts.far
  const fOff = -(camX * 0.18)
  ctx.beginPath()
  ctx.moveTo(0, CH)
  for (let tile = -1; tile <= 2; tile++) {
    const o = fOff + tile * WW
    for (let i = 0; i < f.length - 1; i += 2) {
      ctx.lineTo(f[i] + o, f[i + 1])
    }
  }
  ctx.lineTo(CW, CH)
  ctx.closePath()
  ctx.fillStyle = '#1e2a3a'
  ctx.fill()

  // Near foothills
  const n = mts.near
  const nOff = -(camX * 0.3)
  ctx.beginPath()
  ctx.moveTo(0, CH)
  for (let tile = -1; tile <= 2; tile++) {
    const o = nOff + tile * WW
    for (let i = 0; i < n.length - 1; i += 2) {
      ctx.lineTo(n[i] + o, n[i + 1])
    }
  }
  ctx.lineTo(CW, CH)
  ctx.closePath()
  ctx.fillStyle = '#2a3848'
  ctx.fill()
}

function drawTerrain(ctx, camX, terrain, craters) {
  // Surface fill
  const g = ctx.createLinearGradient(0, GROUND, 0, CH)
  g.addColorStop(0, '#c8c0a8')
  g.addColorStop(0.4, '#b8b098')
  g.addColorStop(1, '#a09880')
  ctx.beginPath()
  ctx.moveTo(-10, CH)
  let first = true
  for (const [wx, wy] of terrain) {
    const sx = wx - camX
    if (sx < -15 || sx > CW + 15) continue
    if (first) { ctx.lineTo(sx, wy); first = false }
    else ctx.lineTo(sx, wy)
  }
  ctx.lineTo(CW + 10, CH)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()

  // Surface edge
  ctx.beginPath()
  first = true
  for (const [wx, wy] of terrain) {
    const sx = wx - camX
    if (sx < -15 || sx > CW + 15) continue
    if (first) { ctx.moveTo(sx, wy); first = false }
    else ctx.lineTo(sx, wy)
  }
  ctx.strokeStyle = '#d8d0b8'
  ctx.lineWidth = 1
  ctx.stroke()

  // Craters
  for (const c of craters) {
    const sx = c.x - camX
    if (Math.abs(sx - CW / 2) > CW) continue
    ctx.beginPath()
    ctx.ellipse(sx, c.y, c.r, c.r * 0.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#a09070'
    ctx.fill()
    ctx.strokeStyle = '#909070'
    ctx.lineWidth = 0.5
    ctx.stroke()
    // inner shadow
    ctx.beginPath()
    ctx.ellipse(sx + 2, c.y + 1, c.r * 0.7, c.r * 0.3, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#8a8060'
    ctx.fill()
  }
}

function drawFootprints(ctx, camX, prints) {
  for (const p of prints) {
    const sx = p.x - camX
    if (sx < -10 || sx > CW + 10 || p.alpha <= 0) continue
    ctx.beginPath()
    ctx.ellipse(sx, p.y, 4, 2, p.angle ?? 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(160,148,124,${p.alpha * 0.6})`
    ctx.fill()
  }
}

// ─── Entity draw helpers ───────────────────────────────────────────────────

function drawLM(ctx, sx, gy) {
  const y = gy
  ctx.save()
  ctx.translate(sx, y)

  // Legs
  ctx.strokeStyle = '#a0a090'
  ctx.lineWidth = 3
  ;[[-26, -16, -54, 8], [26, -16, 54, 8],
    [-20, -16, -44, 4], [20, -16, 44, 4]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  })
  // Footpads
  ;[[-54, 8], [54, 8]].forEach(([fx, fy]) => {
    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#888'; ctx.fill()
  })

  // Descent stage — gold foil
  ctx.fillStyle = '#c8a830'
  ctx.beginPath()
  ctx.moveTo(-34, 0); ctx.lineTo(-26, -18); ctx.lineTo(26, -18); ctx.lineTo(34, 0)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = '#a08820'; ctx.lineWidth = 1; ctx.stroke()

  // Ascent stage
  ctx.fillStyle = '#d8d8c8'
  ctx.fillRect(-18, -58, 36, 42)
  ctx.strokeStyle = '#b8b8a8'; ctx.lineWidth = 1; ctx.strokeRect(-18, -58, 36, 42)

  // Windows
  ctx.fillStyle = '#aacc44'
  ctx.fillRect(-10, -50, 8, 7)
  ctx.fillRect(2,   -50, 8, 7)

  // Hatch
  ctx.fillStyle = '#c8c8b8'
  ctx.fillRect(-6, -18, 12, 2)

  // Label
  ctx.fillStyle = '#000'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('FALCON', 0, -24)

  ctx.restore()
}

function drawFlag(ctx, sx, gy, planted) {
  if (!planted) {
    // Kit on ground
    ctx.fillStyle = '#d8c880'
    ctx.fillRect(sx - 10, gy - 8, 20, 8)
    ctx.fillStyle = '#c8b870'
    ctx.font = '8px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FLAG', sx, gy - 1)
    return
  }
  // Planted flag
  const pole = gy - 48
  ctx.strokeStyle = '#c8c8c0'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(sx, gy); ctx.lineTo(sx, pole); ctx.stroke()
  // Horizontal rod
  ctx.beginPath(); ctx.moveTo(sx, pole); ctx.lineTo(sx + 32, pole); ctx.stroke()
  // Flag body — stripes
  const fw = 32, fh = 20
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#cc2222' : '#eeeeee'
    ctx.fillRect(sx, pole + i * (fh / 7), fw, fh / 7 + 0.5)
  }
  // Blue canton
  ctx.fillStyle = '#002288'
  ctx.fillRect(sx, pole, fw * 0.4, fh * 0.54)
  // Stars (simple dots)
  ctx.fillStyle = '#ffffff'
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    ctx.beginPath()
    ctx.arc(sx + 2 + c * 3, pole + 2 + r * 3.5, 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawAstronaut(ctx, sx, gy, facing, moving, frame, variant, label) {
  const walk = moving ? Math.sin(frame * 0.18) * 5 : 0
  ctx.save()
  ctx.translate(sx, gy)
  if (facing < 0) ctx.scale(-1, 1)

  // Shadow
  ctx.beginPath()
  ctx.ellipse(2, 2, 13, 4, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill()

  // Legs
  ctx.fillStyle = '#cccccc'
  ctx.save(); ctx.rotate(walk * 0.04)
  ctx.fillRect(-9, -10, 8, 20)
  ctx.restore()
  ctx.save(); ctx.rotate(-walk * 0.04)
  ctx.fillRect(1, -10, 8, 20)
  ctx.restore()

  // Torso
  ctx.fillStyle = variant === 'irwin' ? '#e8e0d0' : '#f0f0f0'
  ctx.fillRect(-11, -34, 22, 26)

  // PLSS backpack
  ctx.fillStyle = '#c0c0c0'
  ctx.fillRect(-16, -32, 6, 20)

  // Arms
  ctx.fillStyle = '#d8d8d8'
  ctx.save(); ctx.rotate(-walk * 0.035)
  ctx.fillRect(-18, -30, 7, 16)
  ctx.restore()
  ctx.save(); ctx.rotate(walk * 0.035)
  ctx.fillRect(11, -30, 7, 16)
  ctx.restore()

  // Helmet globe
  ctx.beginPath()
  ctx.arc(0, -44, 13, 0, Math.PI * 2)
  ctx.fillStyle = '#ebebeb'; ctx.fill()
  ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1; ctx.stroke()

  // Gold visor
  ctx.beginPath()
  ctx.ellipse(1, -43, 10, 7, 0, 0.1 * Math.PI, 0.9 * Math.PI)
  ctx.fillStyle = '#c8980a'; ctx.fill()

  ctx.restore()

  // Label
  if (label) {
    ctx.font = `bold 10px 'Orbitron', monospace`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,212,255,0.9)'
    ctx.fillText(label, sx, gy - 60)
  }
}

function drawLRV(ctx, sx, gy, occupied, frame) {
  ctx.save()
  ctx.translate(sx, gy)

  // Shadow
  ctx.beginPath()
  ctx.ellipse(0, 4, 54, 7, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill()

  // Chassis
  ctx.fillStyle = '#c8b040'
  ctx.fillRect(-50, -20, 100, 16)

  // Fenders
  ctx.fillStyle = '#a89830'
  ;[[-50, -22], [38, -22]].forEach(([fx]) => {
    ctx.beginPath(); ctx.arc(fx + 12, -6, 16, Math.PI, 0); ctx.fill()
  })

  // Seats
  ctx.fillStyle = '#a89030'
  ctx.fillRect(-38, -32, 34, 14)
  ctx.fillRect(-2, -32, 34, 14)

  // Antenna
  ctx.strokeStyle = '#eeeeee'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(28, -32); ctx.lineTo(42, -58); ctx.stroke()
  ctx.beginPath(); ctx.arc(42, -58, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#c8d8e8'; ctx.fill()

  // Camera (front-left)
  ctx.fillStyle = '#333'
  ctx.fillRect(-48, -34, 10, 7)
  ctx.beginPath(); ctx.arc(-43, -31, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#111'; ctx.fill()

  // Wheels
  const spin = occupied ? frame * 0.15 : 0
  ;[-38, -14, 14, 38].forEach(wx => {
    ctx.save(); ctx.translate(wx, 4)
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2)
    ctx.fillStyle = '#6a6a6a'; ctx.fill()
    ctx.strokeStyle = '#999'; ctx.lineWidth = 2; ctx.stroke()
    // spokes
    for (let a = 0; a < 6; a++) {
      const ang = spin + (a / 6) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(ang) * 11, Math.sin(ang) * 11)
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5; ctx.stroke()
    }
    ctx.restore()
  })

  if (occupied) {
    // Astronaut in seat (simplified)
    ctx.fillStyle = '#f0f0f0'
    ctx.beginPath(); ctx.arc(-18, -38, 9, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#c8980a'
    ctx.beginPath(); ctx.arc(-17, -37, 7, 0.1 * Math.PI, 0.9 * Math.PI); ctx.fill()
  }

  ctx.restore()
}

function drawSample(ctx, sx, gy, variant) {
  const colors = { basalt: '#5a5a60', mare: '#6a5a40', genesis: '#e8e0d0' }
  const col = colors[variant] ?? '#5a5a50'
  ctx.save(); ctx.translate(sx, gy)
  // Irregular rock shape
  ctx.beginPath()
  ctx.moveTo(-10, -4)
  ctx.lineTo(-6, -11)
  ctx.lineTo(2, -14)
  ctx.lineTo(10, -9)
  ctx.lineTo(12, -2)
  ctx.lineTo(6, 2)
  ctx.lineTo(-4, 2)
  ctx.closePath()
  ctx.fillStyle = col; ctx.fill()
  ctx.strokeStyle = variant === 'genesis' ? '#c0b080' : '#888888'
  ctx.lineWidth = 1; ctx.stroke()
  // Glint
  ctx.beginPath(); ctx.arc(2, -9, 2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill()
  ctx.restore()

  // Genesis rock glow
  if (variant === 'genesis') {
    ctx.beginPath(); ctx.arc(sx, gy - 6, 16, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(220,210,180,0.1)'; ctx.fill()
  }
}

function drawALSEP(ctx, sx, gy, deployed) {
  if (!deployed) {
    // Site marker
    ctx.strokeStyle = '#00d4ff'
    ctx.setLineDash([4, 4])
    ctx.strokeRect(sx - 30, gy - 20, 60, 20)
    ctx.setLineDash([])
    ctx.font = '9px Orbitron, monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#00d4ff'
    ctx.fillText('ALSEP SITE', sx, gy - 6)
    return
  }
  ctx.save(); ctx.translate(sx, gy)
  // Central station box
  ctx.fillStyle = '#c8c0a8'
  ctx.fillRect(-12, -20, 24, 20)
  ctx.strokeStyle = '#a0a090'; ctx.lineWidth = 1; ctx.strokeRect(-12, -20, 24, 20)
  // RTG cylinder
  ctx.fillStyle = '#8a8880'
  ctx.fillRect(-34, -18, 10, 18)
  ctx.fillStyle = '#6a6860'
  ctx.fillRect(-36, -20, 14, 4)
  // Seismometer dome
  ctx.beginPath(); ctx.arc(26, -6, 10, Math.PI, 0)
  ctx.fillStyle = '#a8a898'; ctx.fill()
  ctx.strokeStyle = '#888'; ctx.lineWidth = 1; ctx.stroke()
  // Antenna mast
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, -38); ctx.stroke()
  ctx.beginPath(); ctx.arc(0, -38, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#c8d8e8'; ctx.fill()
  ctx.restore()
}

function drawHammerFeather(ctx, sx, gy, used) {
  if (used) return
  ctx.save(); ctx.translate(sx, gy)
  // Hammer
  ctx.fillStyle = '#808080'
  ctx.fillRect(-18, -16, 8, 10)
  ctx.fillRect(-22, -20, 16, 7)
  // Handle
  ctx.strokeStyle = '#a08040'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(-14, 4); ctx.stroke()
  // Feather
  ctx.strokeStyle = '#e8e0c8'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(6, 2); ctx.lineTo(14, -18); ctx.stroke()
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(6 + (14 - 6) * i / 6, 2 + (-18 - 2) * i / 6)
    ctx.lineTo(6 + (14 - 6) * i / 6 + 5, 2 + (-18 - 2) * i / 6)
    ctx.stroke()
  }
  ctx.restore()
}

function drawRilleEdge(ctx, sx, gy) {
  // Edge of Hadley Rille — ground drops sharply
  ctx.save(); ctx.translate(sx, gy)
  // Warning chevrons on the edge
  ctx.fillStyle = 'rgba(255,180,0,0.8)'
  for (let i = -20; i <= 20; i += 10) {
    ctx.beginPath()
    ctx.moveTo(i, 0); ctx.lineTo(i + 5, -8); ctx.lineTo(i + 10, 0)
    ctx.closePath(); ctx.fill()
  }
  // Depth hint (gradient drop)
  const g = ctx.createLinearGradient(0, 0, 0, 40)
  g.addColorStop(0, 'rgba(30,20,10,0.8)')
  g.addColorStop(1, 'rgba(10,5,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(-40, 0, 80, 40)
  // Label
  ctx.font = `bold 9px 'Orbitron', monospace`
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffb400'
  ctx.fillText('HADLEY RILLE', 0, -12)
  ctx.font = '8px monospace'
  ctx.fillStyle = '#8892a4'
  ctx.fillText('~300m deep', 0, 16)
  ctx.restore()
}

// ─── Entity dispatching ─────────────────────────────────────────────────────
function drawEntity(ctx, entity, camX, terrain, entityDone, lrvX, lrvOccupied, frame) {
  const sx  = entity.wx - camX
  if (sx < -120 || sx > CW + 120) return
  const gy  = terrainY(terrain, entity.wx)
  const done = !!entityDone[entity.id]

  switch (entity.type) {
    case 'structure': drawLM(ctx, sx, gy); break
    case 'npc':       drawAstronaut(ctx, sx, gy, 1, false, frame, entity.id, entity.label); break
    case 'flag':      drawFlag(ctx, sx, gy, done); break
    case 'vehicle':   break // LRV drawn separately
    case 'sample':    if (!done) drawSample(ctx, sx, gy, entity.variant); break
    case 'alsep':     drawALSEP(ctx, sx, gy, done); break
    case 'item':      drawHammerFeather(ctx, sx, gy, done); break
    case 'rille':     drawRilleEdge(ctx, sx, gy); break
  }
}

function drawNearbyHighlight(ctx, sx, gy, entity) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(sx, gy - 20, 24, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,212,255,0.4)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()
}

function renderWorld(ctx, world, camX, nearbyId, dialogue) {
  const { terrain, craters, stars, mountains, player, entities, footprints, lrv, entityDone, frame } = world

  ctx.clearRect(0, 0, CW, CH)
  drawSky(ctx, camX)
  drawStars(ctx, camX, stars)
  drawEarth(ctx, camX)
  drawSun(ctx, camX)
  drawMountains(ctx, camX, mountains)
  drawTerrain(ctx, camX, terrain, craters)
  drawFootprints(ctx, camX, footprints)

  // LRV (behind player so drawn first if LRV is in front)
  const lrvSx = lrv.x - camX
  const lrvGy = terrainY(terrain, lrv.x)
  drawLRV(ctx, lrvSx, lrvGy, player.onLRV, frame)
  if (nearbyId === 'lrv') drawNearbyHighlight(ctx, lrvSx, lrvGy, null)

  // All other entities
  for (const entity of entities) {
    if (entity.id === 'lrv') continue
    drawEntity(ctx, entity, camX, terrain, entityDone, lrv.x, player.onLRV, frame)
    if (entity.id === nearbyId) {
      const sx = entity.wx - camX
      const gy = terrainY(terrain, entity.wx)
      drawNearbyHighlight(ctx, sx, gy, entity)
    }
  }

  // Player (or LRV-rider — handled inside drawLRV above)
  if (!player.onLRV) {
    const psx = player.x - camX
    const pgy = terrainY(terrain, player.x + P_W / 2)
    drawAstronaut(ctx, psx + P_W / 2, pgy, player.facing, Math.abs(player.vx) > 0.3, frame, 'scott', null)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Component ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export default function LunarSurface({ onComplete }) {
  const canvasRef   = useRef(null)
  const worldRef    = useRef(initWorld())

  const keysRef     = useKeyboard()
  const { camera, follow } = useCamera(CW, CH, WW, WH)

  const { dialogue, dialogueActiveRef, startDialogue, advanceDialogue } = useDialogue()
  const { quests, activeQuest, allComplete, completeObjective, isQuestActive } = useQuests(QUEST_DEFS)
  const { playInteract, playCollect, playQuestDone } = useAudio()

  const [nearbyId, setNearbyId]   = useState(null)
  const [onLRV,    setOnLRV]      = useState(false)
  const [hudProps, setHudProps]   = useState({ o2: 100, suit: 100 })
  const [missionSec, setMissionSec] = useState(0)

  // Mirror allComplete into a ref so the game loop can read it safely
  const allCompleteRef = useRef(false)
  allCompleteRef.current = allComplete

  // ── Handle E / Space key: interact or advance dialogue ─────────────────
  const handleInteract = useCallback(() => {
    if (dialogueActiveRef.current) { advanceDialogue(); return }

    const world  = worldRef.current
    const player = world.player
    // Check LRV first (mount/dismount)
    if (player.onLRV) {
      player.onLRV = false
      setOnLRV(false)
      return
    }

    const target = world.entities.find(e => {
      if (world.entityDone[e.id] && e.type !== 'npc' && e.type !== 'structure') return false
      const dist = Math.abs((player.x + P_W / 2) - e.wx)
      return dist < INTER_D
    }) ?? (Math.abs((player.x + P_W / 2) - world.lrv.x) < INTER_D ? { id: 'lrv' } : null)

    if (!target) return

    // LRV boarding
    if (target.id === 'lrv' && !player.onLRV) {
      player.onLRV = true
      setOnLRV(true)
      const def = world.entities.find(e => e.id === 'lrv')
      if (def && !world.entityDone['lrv_boarded']) {
        world.entityDone['lrv_boarded'] = true
        startDialogue(DIALOGUES.lrv_board, () => {
          completeObjective('geo_survey', 'board_lrv')
          playQuestDone()
        })
      }
      return
    }

    if (!target.interactLabel) return
    const dlg = target.dialogueId ? DIALOGUES[target.dialogueId] : null

    // Handle special return-to-LM case
    if (target.id === 'lm_falcon' && isQuestActive('return_mission')) {
      startDialogue(DIALOGUES.return_lm_final, () => {
        completeObjective('return_mission', 'board_lm')
        playQuestDone()
        setTimeout(() => onComplete?.(), 1200)
      })
      return
    }

    if (target.id === 'lm_falcon') {
      startDialogue(DIALOGUES.lm_examine); playInteract(); return
    }

    if (!dlg) return

    playInteract()
    const qt = target.questTrigger
    startDialogue(dlg, () => {
      if (qt && !world.entityDone[target.id]) {
        world.entityDone[target.id] = true
        completeObjective(qt.questId, qt.objectiveId)
        if (target.type === 'sample') playCollect()
        else playQuestDone()
      }
    })
    // Mark done immediately for non-repeatable entities
    if (target.type !== 'npc' && target.type !== 'structure') {
      world.entityDone[target.id] = true
    }
  }, [dialogueActiveRef, advanceDialogue, startDialogue, completeObjective,
      isQuestActive, playInteract, playCollect, playQuestDone, onComplete])

  useEffect(() => {
    const onKey = e => {
      if (e.code === 'KeyE' || e.code === 'Enter') { e.preventDefault(); handleInteract() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleInteract])

  // ── Mission elapsed time ─────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setMissionSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const missionTime = useMemo(() => {
    const h = Math.floor(missionSec / 3600)
    const m = Math.floor((missionSec % 3600) / 60)
    const s = missionSec % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }, [missionSec])

  // ── Game loop ─────────────────────────────────────────────────────────────
  useGameLoop((dt) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx   = canvas.getContext('2d')
    const world = worldRef.current
    const keys  = keysRef.current
    const p     = world.player

    if (!dialogueActiveRef.current) {
      const speed  = p.onLRV ? LRV_SPEED : P_SPEED
      const moveL  = keys.has('ArrowLeft')  || keys.has('KeyA')
      const moveR  = keys.has('ArrowRight') || keys.has('KeyD')

      if (moveL)      { p.vx = -speed * dt; p.facing = -1 }
      else if (moveR) { p.vx =  speed * dt; p.facing =  1 }
      else            { p.vx *= 0.7 }

      p.x = Math.max(10, Math.min(WW - P_W - 10, p.x + p.vx))

      if (p.onLRV) world.lrv.x = p.x + P_W / 2

      // Snap player y to terrain
      p.y = terrainY(world.terrain, p.x + P_W / 2) - P_H

      // Footprints
      if (!p.onLRV && Math.abs(p.vx) > 0.3 && world.frame % 12 === 0) {
        world.footprints.push({
          x: p.x + P_W / 2 + (Math.random() - 0.5) * 8,
          y: terrainY(world.terrain, p.x + P_W / 2) + 2,
          angle: Math.random() * 0.4 - 0.2,
          alpha: 0.9,
        })
        if (world.footprints.length > 300) world.footprints.shift()
      }
      // Fade prints
      for (const fp of world.footprints) fp.alpha = Math.max(0, fp.alpha - 0.0003)
    }

    // Camera (soft follow)
    follow(p.x + P_W / 2, 0, 0.1)
    const camX = camera.current.x

    // Nearby entity detection (update React state only on change)
    const pCx = p.x + P_W / 2
    let nearest = null
    let nearDist = INTER_D + 1

    // LRV
    const lrvDist = Math.abs(pCx - world.lrv.x)
    if (lrvDist < INTER_D) { nearest = { id: 'lrv', interactLabel: p.onLRV ? 'Dismount LRV' : 'Board LRV' }; nearDist = lrvDist }

    for (const e of world.entities) {
      if (world.entityDone[e.id] && e.type !== 'npc' && e.type !== 'structure') continue
      if (e.id === 'lm_falcon' && !isQuestActive('return_mission') &&
          world.entityDone['lm_examine']) continue
      const d = Math.abs(pCx - e.wx)
      if (d < nearDist) { nearest = e; nearDist = d }
    }
    // LM return override
    const lmDef = world.entities.find(e => e.id === 'lm_falcon')
    if (lmDef && Math.abs(pCx - lmDef.wx) < INTER_D && isQuestActive('return_mission')) {
      nearest = { ...lmDef, interactLabel: 'Board LM Falcon' }
    }

    const nid = nearest?.id ?? null
    if (nid !== nearbyId) setNearbyId(nid)

    world.frame++
    renderWorld(ctx, world, camX, nid, dialogueActiveRef.current)
  })

  // Find the interactLabel for the HUD prompt
  const nearbyEntity = nearbyId === 'lrv'
    ? { interactLabel: onLRV ? 'Dismount LRV' : 'Board LRV' }
    : worldRef.current.entities.find(e => e.id === nearbyId) ?? null

  return (
    <div className="lunar-surface-wrapper">
      <canvas ref={canvasRef} width={CW} height={CH} className="lunar-canvas" />

      <HUD onLRV={onLRV} o2={100} suit={100} missionTime={missionTime} />
      <QuestLog quests={quests} />

      {!dialogueActiveRef.current && nearbyEntity && (
        <InteractionPrompt label={nearbyEntity.interactLabel} />
      )}

      <DialogueBox dialogue={dialogue} onAdvance={advanceDialogue} />

      <div className="surface-controls">
        <span>← → / A D — Move</span>
        <span>E / Enter — Interact</span>
      </div>
    </div>
  )
}
