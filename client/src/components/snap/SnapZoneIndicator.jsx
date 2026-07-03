import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SNAP_ZONE_META } from '@constants/snapConstants'
import { useSnapRestore } from '@hooks/useSnapEngine'
import { useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * SnapZoneIndicator — shows inside the window title bar when snapped.
 *
 * Phase 13B: whileHover/whileTap gated, aria-label on unsnap button.
 */
export default function SnapZoneIndicator({ windowId, snapZone, accentColor = '#6366f1' }) {
  const unSnap = useSnapRestore()
  const meta   = snapZone ? SNAP_ZONE_META[snapZone] : null
  const { enabled } = useOSAnimations()

  return (
    <AnimatePresence>
      {snapZone && meta && (
        <motion.div
          key={snapZone}
          initial={enabled ? { opacity: 0, scale: 0.85, x: 6 } : { opacity: 0 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={enabled ? { opacity: 0, scale: 0.85, x: 6 } : { opacity: 0 }}
          transition={enabled ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 8px 2px 7px', borderRadius: 20,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}44`, flexShrink: 0,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: accentColor, boxShadow: `0 0 5px ${accentColor}`, flexShrink: 0,
            }}
          />
          <span style={{
            fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
            color: accentColor, letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}>
            {meta.label}
          </span>
          <motion.button
            whileHover={enabled ? { scale: 1.2 } : {}}
            whileTap={enabled ? { scale: 0.9 } : {}}
            aria-label={`Unsnap window from ${meta.label}`}
            onClick={e => { e.stopPropagation(); unSnap(windowId) }}
            style={{
              width: 14, height: 14, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: 'transparent',
              border: 'none', cursor: 'pointer',
              color: `${accentColor}aa`, padding: 0, flexShrink: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = `${accentColor}aa`}
          >
            <X size={9} strokeWidth={3} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
