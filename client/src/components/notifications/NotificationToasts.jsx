
import { memo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import useNotificationStore, { TYPE_CONFIG } from '@stores/notificationStore'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'



const Toast = memo(function Toast({ toast }) {
  const dismissToast = useNotificationStore(s => s.dismissToast)
  const pauseToast   = useNotificationStore(s => s.pauseToast)
  const resumeToast  = useNotificationStore(s => s.resumeToast)
  const cfg   = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info
  const glass = useGlassEffect('toast')
  const { enabled } = useOSAnimations()

  return (
    <motion.div
      layout
      initial={enabled ? { opacity: 0, x: 72, scale: 0.9 } : { opacity: 0 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={enabled
        ? { opacity: 0, x: 72, scale: 0.88, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }
        : { opacity: 0 }}
      transition={enabled ? { type: 'spring', stiffness: 400, damping: 32 } : { duration: 0 }}
      onMouseEnter={() => pauseToast(toast.id)}
      onMouseLeave={() => resumeToast(toast.id)}
      style={{
        width: 320, borderRadius: 14,
        ...glass,
        border: `1px solid ${cfg.color}44`,
        boxShadow: [
          '0 16px 48px rgba(0,0,0,0.55)',
          `0 0 0 1px rgba(255,255,255,0.04)`,
          `0 0 28px ${cfg.color}1a`,
        ].join(', '),
        overflow: 'hidden', position: 'relative', cursor: 'default',
      }}
    >
      {/* ── Progress bar ── */}
      {!toast.paused && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
            transformOrigin: 'left',
          }}
        />
      )}
      {/* Static bar while paused */}
      {toast.paused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `${cfg.color}66`,
        }} />
      )}

      {/* ── Content ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '13px 13px 12px',
      }}>
        {/* Icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${cfg.color}1a`, border: `1px solid ${cfg.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 1,
        }}>
          {toast.appIcon
            ? <span style={{ fontSize: 16, lineHeight: 1 }}>{toast.appIcon}</span>
            : <DynamicIcon name={cfg.icon} size={16} color={cfg.color} strokeWidth={2} />
          }
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.3, marginBottom: toast.message ? 3 : 0,
          }}>
            {toast.title}
          </div>
          {toast.message && (
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.5)',
            }}>
              {toast.message}
            </div>
          )}
          {/* Optional action button */}
          {toast.action && (
            <button
              onClick={() => { toast.action.run?.(); dismissToast(toast.id) }}
              style={{
                marginTop: 7,
                fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
                color: cfg.color,
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}33`,
                borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${cfg.color}2a`}
              onMouseLeave={e => e.currentTarget.style.background = `${cfg.color}18`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => dismissToast(toast.id)}
          style={{
            width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'transparent', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)', transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
          }}
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  )
})

// ── Stack container ───────────────────────────────────────────────────────

export default function NotificationToasts() {
  const toasts  = useNotificationStore(s => s.toasts)
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        top: 14, right: 14,
        display: 'flex', flexDirection: 'column', gap: 8,
        zIndex: 800, pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {[...toasts].reverse().map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <Toast toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    overlay
  )
}
