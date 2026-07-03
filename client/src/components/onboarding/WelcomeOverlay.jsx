import { useState, useEffect, useCallback } from 'react'
import { createPortal }   from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Search, MousePointer2, ChevronRight, X } from 'lucide-react'
import { IDENTITY } from '@content/portfolio'
import { useOSAnimations, useGlassEffect } from '@contexts/GlassEffectContext'
import useWindowStore from '@stores/windowStore'
import { APP_IDS }   from '@constants/appRegistry'

const STORAGE_KEY   = 'futuros-onboarded-v1'
const AUTO_OPEN_KEY = 'futuros-auto-opened-v1'

const HINTS = [
  {
    icon: MousePointer2,
    color: '#818cf8',
    title: 'Double-click to open apps',
    desc:  'Click any icon on the desktop twice to launch it.',
  },
  {
    icon: Search,
    color: '#34d399',
    title: 'Ctrl + K for spotlight search',
    desc:  'Instantly find apps, projects, actions, and files.',
  },
  {
    icon: Monitor,
    color: '#22d3ee',
    title: 'Start with About Me',
    desc:  "It has my bio, skills, experience, and resume download.",
  },
]

/**
 * WelcomeOverlay — Phase 14 first-visit onboarding.
 *
 * Shown once per browser on the very first visit.
 * Auto-opens About Me when the visitor dismisses it.
 *
 * localStorage keys:
 *   futuros-onboarded-v1  — set to '1' after first dismissal
 *   futuros-auto-opened-v1 — prevents auto-open running twice
 */
export default function WelcomeOverlay() {
  const [visible, setVisible]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const { enabled } = useOSAnimations()
  const glass = useGlassEffect('panel')

  // Only show once per browser
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so the desktop has time to finish its entrance animation
        const t = setTimeout(() => { setMounted(true); setVisible(true) }, 900)
        return () => clearTimeout(t)
      }
    } catch { /* localStorage blocked in some privacy modes */ }
  }, [])

  const dismiss = useCallback((openAbout = true) => {
    setVisible(false)

    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ok */ }

    if (openAbout) {
      // Wait for exit animation to finish, then open About Me
      const t = setTimeout(() => {
        try {
          if (!localStorage.getItem(AUTO_OPEN_KEY)) {
            localStorage.setItem(AUTO_OPEN_KEY, '1')
            useWindowStore.getState().openWindow(APP_IDS.ABOUT)
          }
        } catch {
          useWindowStore.getState().openWindow(APP_IDS.ABOUT)
        }
      }, enabled ? 350 : 0)
      return () => clearTimeout(t)
    }
  }, [enabled])

  const overlay = typeof document !== 'undefined'
    ? document.getElementById('overlay-layer')
    : null

  if (!mounted || !overlay) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: enabled ? 0.25 : 0 }}
            onClick={() => dismiss(true)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* Card */}
          <motion.div
            key="welcome-card"
            initial={enabled ? { opacity: 0, y: 28, scale: 0.95 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={enabled ? { opacity: 0, y: 16, scale: 0.97 } : { opacity: 0 }}
            transition={enabled
              ? { type: 'spring', stiffness: 380, damping: 30, delay: 0.05 }
              : { duration: 0 }
            }
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 420, maxWidth: 'calc(100vw - 32px)',
              zIndex: 1101,
              ...glass,
              borderRadius: 20,
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.15)',
              overflow: 'hidden',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '28px 28px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {/* Close button */}
              <button
                onClick={() => dismiss(false)}
                aria-label="Close welcome overlay"
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 28, height: 28, borderRadius: 8,
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>

              {/* Sigil */}
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 0 24px rgba(99,102,241,0.2)',
              }}>
                ✦
              </div>

              <div style={{
                fontSize: 20, fontWeight: 800, letterSpacing: '-0.025em',
                color: 'rgba(255,255,255,0.95)', marginBottom: 6,
              }}>
                Welcome to FuturOS
              </div>
              <p style={{
                fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.48)',
              }}>
                {IDENTITY.name}&apos;s interactive portfolio — built like an operating
                system so you can explore freely. Here&apos;s how to get around:
              </p>
            </div>

            {/* Hints */}
            <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {HINTS.map(({ icon: Icon, color, title, desc }) => (
                <motion.div
                  key={title}
                  initial={enabled ? { opacity: 0, x: -8 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '12px 14px', borderRadius: 12,
                    background: `${color}0a`,
                    border: `1px solid ${color}22`,
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: `${color}18`, border: `1px solid ${color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: 'rgba(255,255,255,0.88)', marginBottom: 3,
                    }}>
                      {title}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
                      {desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              padding: '0 20px 20px',
              display: 'flex', gap: 10,
            }}>
              <motion.button
                whileHover={enabled ? { scale: 1.02 } : {}}
                whileTap={enabled ? { scale: 0.97 } : {}}
                onClick={() => dismiss(true)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  padding: '11px 16px', borderRadius: 11, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.01em',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Open About Me
                <ChevronRight size={15} strokeWidth={2.5} />
              </motion.button>

              <button
                onClick={() => dismiss(false)}
                style={{
                  padding: '11px 16px', borderRadius: 11,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 13, cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Explore freely
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    overlay
  )
}
