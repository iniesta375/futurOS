import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Mail, RotateCcw } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { PROFILE } from '@apps/AboutMe/aboutData'

/** Canvas confetti burst */
function ConfettiCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const colors = ['#6366f1','#818cf8','#22d3ee','#34d399','#fbbf24','#f97316','#f87171','#a78bfa']
    const pieces = Array.from({ length: 120 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height * 0.3 - canvas.height * 0.3,
      vx:   (Math.random() - 0.5) * 6,
      vy:   Math.random() * 4 + 2,
      rot:  Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.2,
      w:    Math.random() * 8 + 4,
      h:    Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    }))

    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = 0
      pieces.forEach(p => {
        p.x    += p.vx
        p.y    += p.vy
        p.vy   += 0.12  // gravity
        p.vx   *= 0.99  // drag
        p.rot  += p.vrot
        if (p.y > canvas.height * 0.8) p.alpha = Math.max(0, p.alpha - 0.025)
        if (p.alpha > 0) alive++

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive > 0) frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

export default function SuccessOverlay({ submittedData, onReset }) {
  const accent = useOSStore(s => s.accentColor)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,10,20,0.96)',
        zIndex: 20,
        padding: 32,
      }}
    >
      {showConfetti && <ConfettiCanvas />}

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 26 }}
        style={{
          maxWidth: 440, width: '100%',
          background: 'rgba(14,14,28,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: '40px 36px',
          textAlign: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          borderRadius: 99,
        }} />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 24 }}
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(52,211,153,0.12)',
            border: '2px solid rgba(52,211,153,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(52,211,153,0.25)',
          }}
        >
          <CheckCircle2 size={36} color="#34d399" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
            color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em', marginBottom: 8,
          }}>
            Message Sent! 🎉
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.55)', marginBottom: 24,
          }}>
            Thanks{submittedData?.name ? `, ${submittedData.name.split(' ')[0]}` : ''}! I'll get back to you at{' '}
            <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{submittedData?.email}</strong>{' '}
            within 24 hours.
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, marginBottom: 24, textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Mail size={13} color={accent} strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
              YOUR MESSAGE
            </span>
          </div>
          {[
            { label: 'From',    value: `${submittedData?.name} <${submittedData?.email}>` },
            { label: 'Subject', value: submittedData?.subject },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.35)', width: 56, flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
        >
          <a
            href={`mailto:${PROFILE.email}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10, textDecoration: 'none',
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: '#fff', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
              boxShadow: `0 4px 16px ${accent}40`,
            }}
          >
            <Mail size={14} strokeWidth={2} />
            Send Another
          </a>
          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} strokeWidth={2} />
            New Message
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
