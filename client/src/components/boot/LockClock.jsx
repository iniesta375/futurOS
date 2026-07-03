import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClock } from '@hooks/useClock'
import { useParticles } from '@hooks/useParticles'

/**
 * LockClock — Full-screen lock display with large time + date.
 * Shows before the login card slides up. Click anywhere to proceed.
 */
export default function LockClock({ wallpaper, onUnlock }) {
  const { timeStr, fullDateStr } = useClock()
  const canvasRef = useRef(null)
  useParticles(canvasRef, { count: 50, color: '#6366f1', speed: 0.6, maxDist: 100 })

  const bgStyle = wallpaper?.type === 'css'
    ? { background: wallpaper.value }
    : { background: 'radial-gradient(ellipse at 20% 50%, #1a0533 0%, #08080f 50%, #0a1628 100%)' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
      onClick={onUnlock}
      style={{
        position: 'fixed', inset: 0,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        ...bgStyle,
        overflow: 'hidden',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', width: 600, height: 600, top: '-10%', left: '-5%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
        animation: 'glow-pulse 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, bottom: '0%', right: '-5%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
        animation: 'glow-pulse 11s ease-in-out infinite 3s',
      }} />

      {/* Clock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          textAlign: 'center', userSelect: 'none',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Large time */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 14vw, 120px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          textShadow: '0 0 80px rgba(99,102,241,0.3)',
        }}>
          {timeStr}
        </div>

        {/* Date */}
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
          marginTop: 12, letterSpacing: '0.02em',
        }}>
          {fullDateStr}
        </div>
      </motion.div>

      {/* Unlock hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 64,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 1,
        }}
      >
        {/* Chevron up icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 13L10 8L15 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em',
        }}>
          CLICK TO UNLOCK
        </span>
      </motion.div>
    </motion.div>
  )
}
