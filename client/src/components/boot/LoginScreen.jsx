import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useClock } from '@hooks/useClock'
import { useParticles } from '@hooks/useParticles'
import PinInput from './PinInput'
import useOSStore from '@stores/osStore'
import { WALLPAPERS } from '@constants/os'

/**
 * LoginScreen — Full login card shown after lock screen is dismissed.
 * Features: ambient particles, avatar, greeting, PIN input.
 */
export default function LoginScreen() {
  const { login, userName, wallpaper } = useOSStore()
  const { timeStr, dateStr } = useClock()
  const canvasRef = useRef(null)
  useParticles(canvasRef, { count: 60, color: '#6366f1', speed: 0.7, maxDist: 110 })

  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0]
  const bgStyle = currentWallpaper.type === 'css'
    ? { background: currentWallpaper.value }
    : { background: 'radial-gradient(ellipse at 20% 50%, #1a0533 0%, #08080f 50%, #0a1628 100%)' }

  const handleSuccess = () => login(userName)
  const handleSkip = () => login(userName)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0,
        ...bgStyle,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
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
        position: 'absolute', width: 700, height: 700, top: '-15%', left: '-10%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
        animation: 'glow-pulse 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, bottom: '5%', right: '0%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
        animation: 'glow-pulse 12s ease-in-out infinite 2s',
      }} />

      {/* Mini clock top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute', top: 48,
          textAlign: 'center', userSelect: 'none', zIndex: 1,
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300,
          color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em',
        }}>
          {timeStr}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: 'rgba(255,255,255,0.4)', marginTop: 2,
        }}>
          {dateStr}
        </div>
      </motion.div>

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 24,
          padding: '40px 48px 36px',
          background: 'rgba(10, 10, 22, 0.72)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
          minWidth: 320,
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
          borderRadius: 99,
        }} />

        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 360, damping: 26 }}
          style={{
            width: 80, height: 80,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #22d3ee 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(99,102,241,0.55), 0 8px 24px rgba(0,0,0,0.4)',
            border: '2px solid rgba(255,255,255,0.14)',
            position: 'relative',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            fontWeight: 700, color: '#fff',
          }}>
            {userName.charAt(0).toUpperCase()}
          </span>

          {/* Online dot */}
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 14, height: 14, borderRadius: '50%',
            background: '#34d399',
            border: '2px solid rgba(10,10,22,0.9)',
            boxShadow: '0 0 8px rgba(52,211,153,0.6)',
          }} />
        </motion.div>

        {/* Name + role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em',
          }}>
            {userName}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 12,
            color: 'rgba(255,255,255,0.42)', marginTop: 3,
          }}>
            FuturOS · Local Account
          </div>
        </motion.div>

        {/* PIN input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PinInput onSuccess={handleSuccess} onSkip={handleSkip} />
        </motion.div>
      </motion.div>

      {/* Bottom accessibility row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'absolute', bottom: 32,
          fontFamily: 'var(--font-ui)', fontSize: 11,
          color: 'rgba(255,255,255,0.22)',
          zIndex: 1,
        }}
      >
        FuturOS v1.0 · Portfolio Edition
      </motion.div>
    </motion.div>
  )
}
