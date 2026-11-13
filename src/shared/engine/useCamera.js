import { useRef } from 'react'

// 2-D side-scrolling camera that follows a target within world bounds.
// Returns:
//   camera   — ref whose .current is { x, y }
//   follow   — call each frame to track a world-space target
//   toScreen — convert world coords → screen coords
export function useCamera(viewW, viewH, worldW, worldH) {
  const camera = useRef({ x: 0, y: 0 })

  function follow(targetX, targetY = 0, lerpFactor = 1) {
    const desired = {
      x: Math.max(0, Math.min(targetX - viewW / 2, worldW - viewW)),
      y: Math.max(0, Math.min(targetY - viewH / 2, worldH - viewH)),
    }
    if (lerpFactor >= 1) {
      camera.current.x = desired.x
      camera.current.y = desired.y
    } else {
      camera.current.x += (desired.x - camera.current.x) * lerpFactor
      camera.current.y += (desired.y - camera.current.y) * lerpFactor
    }
  }

  function toScreen(worldX, worldY) {
    return {
      x: worldX - camera.current.x,
      y: worldY - camera.current.y,
    }
  }

  return { camera, follow, toScreen }
}
