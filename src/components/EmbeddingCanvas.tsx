import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  cluster: number
  r: number
}

const CLUSTER_COLORS = ['#5eead4', '#c084fc', '#7dd3fc']

export default function EmbeddingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pointer = { x: -9999, y: -9999, active: false }

    const CLUSTER_COUNT = 3
    const POINTS_PER_CLUSTER = 22
    const points: Point[] = []

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      points.length = 0
      for (let c = 0; c < CLUSTER_COUNT; c++) {
        const cx = width * (0.22 + c * 0.28 + (c === 1 ? 0.06 : 0))
        const cy = height * (0.3 + (c % 2 === 0 ? 0.1 : 0.4))
        for (let i = 0; i < POINTS_PER_CLUSTER; i++) {
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * 46 + Math.random() * 20
          points.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            cluster: c,
            r: Math.random() * 1.6 + 1.4,
          })
        }
      }
    }

    function step() {
      ctx!.clearRect(0, 0, width, height)

      // drift
      for (const p of points) {
        if (!prefersReducedMotion) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1
        }
        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const d2 = dx * dx + dy * dy
          if (d2 < 130 * 130) {
            const d = Math.sqrt(d2) || 1
            p.x -= (dx / d) * 0.6
            p.y -= (dy / d) * 0.6
          }
        }
      }

      // connective lines within neighbor radius
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i]
          const b = points[j]
          if (a.cluster !== b.cluster) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 42) {
            ctx!.strokeStyle = CLUSTER_COLORS[a.cluster] + '22'
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // points
      for (const p of points) {
        const dx = pointer.x - p.x
        const dy = pointer.y - p.y
        const near = pointer.active && dx * dx + dy * dy < 130 * 130
        ctx!.beginPath()
        ctx!.fillStyle = near ? '#ffffff' : CLUSTER_COLORS[p.cluster]
        ctx!.globalAlpha = near ? 1 : 0.85
        ctx!.arc(p.x, p.y, near ? p.r + 1.2 : p.r, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.globalAlpha = 1
      }

      raf = requestAnimationFrame(step)
    }

    let raf = requestAnimationFrame(step)

    function onResize() {
      resize()
      seed()
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }

    function onPointerLeave() {
      pointer.active = false
    }

    resize()
    seed()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
