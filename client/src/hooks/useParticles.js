import { useEffect, useRef } from 'react'

/**
 * useParticles — Renders a floating particle field onto a canvas ref.
 * Particles drift, connect when close, and react to mouse position.
 *
 * @param {object} options
 *   count        — number of particles (default 80)
 *   color        — particle color (default '#6366f1')
 *   speed        — drift speed multiplier (default 1)
 *   interactive  — whether particles react to mouse (default true)
 *   maxDist      — max distance to draw connection lines (default 120)
 */
export function useParticles(canvasRef, {
  count = 80,
  color = '#6366f1',
  speed = 1,
  interactive = true,
  maxDist = 120,
} = {}) {
  const animRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Resize canvas to fill parent
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Mouse tracking
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    if (interactive) {
      canvas.addEventListener('mousemove', onMouse)
      canvas.addEventListener('mouseleave', () => { mouseRef.current = { x: -9999, y: -9999 } })
    }

    // Seed particles
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0,2), 16)
    const g = parseInt(hex.slice(2,4), 16)
    const b = parseInt(hex.slice(4,6), 16)

    const particles = Array.from({ length: count }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4 * speed,
      vy:  (Math.random() - 0.5) * 0.4 * speed,
      r:   Math.random() * 1.5 + 0.5,
      a:   Math.random() * 0.6 + 0.2,
    }))

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Move + wrap
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        // Mouse repulsion
        if (interactive) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            p.x += (dx / d) * 1.2
            p.y += (dy / d) * 1.2
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`
        ctx.fill()
      }

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < maxDist) {
            const opacity = (1 - d / maxDist) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      if (interactive) canvas.removeEventListener('mousemove', onMouse)
    }
  }, [canvasRef, count, color, speed, interactive, maxDist])
}
