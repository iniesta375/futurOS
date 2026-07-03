import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAGES = [
  { label: 'Loading kernel modules',   duration: 400 },
  { label: 'Mounting file systems',    duration: 350 },
  { label: 'Starting display server',  duration: 300 },
  { label: 'Loading user profile',     duration: 350 },
  { label: 'Initializing workspace',   duration: 300 },
  { label: 'Launching FuturOS...',     duration: 200 },
]

export default function LogoScreen({ onDone }) {
  const [stage, setStage]       = useState(0)
  const [progress, setProgress] = useState(0)
  const [showLabel, setShowLabel] = useState(true)

  useEffect(() => {
    let total = 0
    const timers = []

    STAGES.forEach((s, i) => {
      timers.push(setTimeout(() => {
        setStage(i)
        setShowLabel(true)
        // Animate progress
        const target = ((i + 1) / STAGES.length) * 100
        const start  = (i / STAGES.length) * 100
        const steps  = 30
        for (let step = 0; step <= steps; step++) {
          timers.push(setTimeout(() => {
            setProgress(start + (target - start) * (step / steps))
          }, (s.duration / steps) * step))
        }
      }, total))
      total += s.duration
    })

    // Done
    timers.push(setTimeout(() => onDone?.(), total + 200))

    return () => timers.forEach(clearTimeout)
  }, [onDone])

  const totalDuration = STAGES.reduce((s, x) => s + x.duration, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, #0d0d1f 0%, #08080f 65%, #050508 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Background particle shimmer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 60%)',
      }} />

      {/* ── Logo assembly ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.85 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 28 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
      >
        {/* Orbital ring + icon */}
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: 'rgba(99,102,241,0.7)',
              borderRightColor: 'rgba(99,102,241,0.2)',
            }}
          />
          {/* Inner counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 10,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderBottomColor: 'rgba(34,211,238,0.6)',
              borderLeftColor: 'rgba(34,211,238,0.15)',
            }}
          />
          {/* Pulsing halo */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -10,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            }}
          />

          {/* Center icon */}
          <div style={{
            position: 'absolute', inset: 20,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="5"  y="5"  width="11" height="11" rx="2.5" fill="rgba(255,255,255,0.95)" />
              <rect x="20" y="5"  width="11" height="11" rx="2.5" fill="rgba(255,255,255,0.75)" />
              <rect x="5"  y="20" width="11" height="11" rx="2.5" fill="rgba(255,255,255,0.75)" />
              <rect x="20" y="20" width="11" height="11" rx="2.5" fill="rgba(255,255,255,0.50)" />
            </svg>
          </div>

          {/* Orbiting dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%' }}
          >
            <div style={{
              position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)',
              width: 6, height: 6, borderRadius: '50%',
              background: '#6366f1',
              boxShadow: '0 0 8px #6366f1, 0 0 16px rgba(99,102,241,0.5)',
            }} />
          </motion.div>
        </div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800,
            background: 'linear-gradient(135deg, #a5b4fc, #818cf8 40%, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            FuturOS
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400,
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em',
            marginTop: 6, textTransform: 'uppercase',
          }}>
            Developer Portfolio
          </div>
        </motion.div>
      </motion.div>

      {/* ── Progress section ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: 56,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          width: 280,
        }}
      >
        {/* Stage label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.04em', height: 18,
              textAlign: 'center',
            }}
          >
            {STAGES[stage]?.label}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: 2,
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 99, overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)',
              width: `${progress}%`,
            }}
            transition={{ duration: 0.08 }}
          />
        </div>

        {/* Percentage */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
        }}>
          {Math.round(progress)}%
        </div>
      </motion.div>

      {/* Version badge */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em',
      }}>
        FuturOS 1.0.0-PORTFOLIO · BUILD 2025
      </div>
    </motion.div>
  )
}
