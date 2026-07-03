import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import useSnapStore from '@stores/snapStore'
import { SNAP_ZONE, SNAP_ZONE_META, getSnapGeometry, TASKBAR_H } from '@constants/snapConstants'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * SnapPreviewOverlay — Phase 12C snap ghost overlay.
 *
 * Renders into #window-layer (sits above windows but below overlay-layer).
 * Shows a semi-transparent zone fill + zone label when cursor is near a snap zone.
 *
 * Reads ONLY from snapStore (not windowStore) so drag position changes
 * don't cause windowStore subscribers to re-render.
 *
 * Architecture note: This component is always mounted but renders nothing
 * when previewVisible is false. This avoids portal mount/unmount overhead
 * on every drag start.
 *
 * Phase 12C Part 4: the zone label pill's background/blur now come from
 * useGlassEffect('chrome'), and all motion (zone ghost, dim layer, label
 * pill) respects animationsEnabled via useOSAnimations().enabled. This
 * stays cheap during drag — useGlassEffect reads the already-memoized
 * GlassEffectContext value, and useOSAnimations only re-renders when the
 * animationsEnabled setting itself changes, not on drag frames.
 *
 * The full-screen ScreenDimLayer (a flat rgba(0,0,0,0.2) scrim, no blur)
 * is intentionally NOT migrated to useGlassBackdrop — it's a much
 * lighter "dim while dragging" effect, not a modal scrim, and isn't
 * considered part of the glass surface system.
 */
function ZoneGhost({ zone, accentColor }) {
  const geo  = getSnapGeometry(zone)
  const meta = SNAP_ZONE_META[zone]
  const glass = useGlassEffect('chrome')
  const { enabled } = useOSAnimations()

  if (!geo || !meta) return null

  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_H

  // Convert pixel geometry to percentage for CSS (stays correct on resize)
  const style = {
    left:   `${(geo.x / vw)     * 100}%`,
    top:    `${(geo.y / vh)     * 100}%`,
    width:  `${(geo.width / vw) * 100}%`,
    height: `${(geo.height / vh) * 100}%`,
  }

  return (
    <motion.div
      key={zone}
      initial={enabled ? { opacity: 0, scale: 0.97 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={enabled ? { opacity: 0, scale: 0.97 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.14, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      style={{
        position: 'absolute',
        ...style,
        pointerEvents: 'none',
        zIndex: 95,
        // Subtle zone fill
        background: `${accentColor}14`,
        border: `2px solid ${accentColor}55`,
        borderRadius: 12,
        // Inner glow
        boxShadow: `inset 0 0 48px ${accentColor}0a, 0 0 0 1px ${accentColor}22`,
      }}
    >
      {/* Radial glow at center */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 10,
        background: `radial-gradient(ellipse at 50% 50%, ${accentColor}18 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Zone label badge */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        {/* Label pill */}
        <motion.div
          initial={enabled ? { opacity: 0, y: 6 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enabled ? { delay: 0.06, duration: 0.18 } : { duration: 0 }}
          style={{
            ...glass,
            border: `1px solid ${accentColor}44`,
            borderRadius: 24,
            padding: '5px 16px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 6px ${accentColor}`,
          }} />
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12, fontWeight: 700,
            color: accentColor,
            letterSpacing: '0.05em',
          }}>
            {meta.label.toUpperCase()}
          </span>
        </motion.div>
      </div>

      {/* Corner accent dots */}
      {[
        { top: 8,  left: 8  },
        { top: 8,  right: 8 },
        { bottom: 8, left: 8  },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          width: 6, height: 6, borderRadius: '50%',
          background: `${accentColor}66`,
          pointerEvents: 'none',
        }} />
      ))}
    </motion.div>
  )
}

function ScreenDimLayer() {
  const { enabled } = useOSAnimations()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={enabled ? { duration: 0.15 } : { duration: 0 }}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.2)',
        pointerEvents: 'none',
        zIndex: 94,
      }}
    />
  )
}

export default function SnapPreviewOverlay({ accentColor = '#6366f1' }) {
  const { activeZone, previewVisible } = useSnapStore(
    useShallow(s => ({ activeZone: s.activeZone, previewVisible: s.previewVisible }))
  )

  const layer = document.getElementById('window-layer')
  if (!layer) return null

  return createPortal(
    <AnimatePresence>
      {previewVisible && activeZone && (
        <>
          <ScreenDimLayer key="dim" />
          <ZoneGhost key={`ghost-${activeZone}`} zone={activeZone} accentColor={accentColor} />
        </>
      )}
    </AnimatePresence>,
    layer
  )
}
