import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useWindowStore from '@stores/windowStore'
import useSnapStore from '@stores/snapStore'
import {
  SNAP_ZONE,
  SNAP_ZONE_META,
  getSnapGeometry,
  SNAP_COMPLEMENTS,
} from '@constants/snapConstants'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * SnapLayoutPicker — Phase 12C layout picker.
 *
 * Triggered by hovering the green (maximize) TrafficLight button.
 * Shows all 8 snap zones as visual miniature previews.
 *
 * Integration: TrafficLights.jsx passes windowId + accentColor.
 * This component reads/writes only via windowStore + snapStore.
 *
 * Phase 12C Part 4: panel background/blur sourced from
 * useGlassEffect('menu'), and all motion (panel entrance/exit, zone
 * preview buttons, hover fill) respects animationsEnabled via
 * useOSAnimations().enabled.
 */

// Layout ordering for the picker grid: 3 rows
const PICKER_ROWS = [
  // Row 1: full-width options
  [SNAP_ZONE.LEFT, SNAP_ZONE.TOP, SNAP_ZONE.RIGHT],
  // Row 2: quadrant options
  [SNAP_ZONE.TOP_LEFT, SNAP_ZONE.TOP_RIGHT],
  // Row 3: bottom quadrants + center
  [SNAP_ZONE.BOTTOM_LEFT, SNAP_ZONE.CENTER, SNAP_ZONE.BOTTOM_RIGHT],
]

function ZonePreviewButton({ zone, windowId, accentColor, onApply }) {
  const [hovered, setHovered] = useState(false)
  const meta = SNAP_ZONE_META[zone]
  const { enabled } = useOSAnimations()
  const hoverTap = enabled ? { whileHover: { scale: 1.07 }, whileTap: { scale: 0.95 } } : {}
  if (!meta) return null

  const { preview } = meta

  return (
    <motion.button
      {...hoverTap}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onApply(zone)}
      title={meta.label}
      style={{
        position: 'relative',
        width: 52, height: 38,
        borderRadius: 7,
        border: `1.5px solid ${hovered ? accentColor + '77' : 'rgba(255,255,255,0.1)'}`,
        background: hovered ? `${accentColor}12` : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: enabled ? 'border-color 0.12s, background 0.12s' : 'none',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {/* Screen background */}
      <div style={{
        position: 'absolute',
        inset: 3,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }} />

      {/* Zone fill highlight */}
      <motion.div
        animate={{
          background: hovered ? accentColor : `${accentColor}55`,
          opacity: hovered ? 0.9 : 0.65,
        }}
        transition={enabled ? { duration: 0.12 } : { duration: 0 }}
        style={{
          position: 'absolute',
          left:   `calc(${preview.left} + 3px)`,
          top:    `calc(${preview.top} + 3px)`,
          width:  `calc(${preview.width} - 6px)`,
          height: `calc(${preview.height} - 6px)`,
          borderRadius: 3,
        }}
      />
    </motion.button>
  )
}

export default function SnapLayoutPicker({ windowId, accentColor = '#6366f1', onClose }) {
  // Actions only — use getState() so these are stable references that don't
  // subscribe to store shape. SnapLayoutPicker renders infrequently (only
  // while hovering the maximize TrafficLight button) so render cost here
  // is negligible, but getState() guarantees we're always reading fresh.
  const setWindowGeometry = useWindowStore(s => s.setWindowGeometry)
  const getWindow         = useWindowStore(s => s.getWindow)
  const showSnapAssist    = useSnapStore(s => s.showSnapAssist)
  const glass = useGlassEffect('menu')
  const { enabled } = useOSAnimations()

  // Phase 12.5 H2: cancellable timer ref — prevents stale Snap Assist
  // if the window is closed before the 300ms fires.
  const assistTimerRef = useRef(null)
  useEffect(() => () => {
    if (assistTimerRef.current !== null) clearTimeout(assistTimerRef.current)
  }, [])

  const applyZone = (zone) => {
    const geo = getSnapGeometry(zone)
    if (!geo) { onClose?.(); return }

    const win = getWindow(windowId)
    if (!win) { onClose?.(); return }

    const prePos  = win.snapZone ? (win.preMaximizePosition ?? win.position) : win.position
    const preSize = win.snapZone ? (win.preMaximizeSize     ?? win.size    ) : win.size

    setWindowGeometry(windowId, {
      position:            { x: geo.x, y: geo.y },
      size:                { width: geo.width, height: geo.height },
      snapZone:            zone,
      preMaximizePosition: prePos,
      preMaximizeSize:     preSize,
    })

    onClose?.()

    const complements = SNAP_COMPLEMENTS[zone]
    if (complements?.length) {
      assistTimerRef.current = setTimeout(() => {
        assistTimerRef.current = null
        showSnapAssist(windowId, complements)
      }, 300)
    }
  }

  return (
    <motion.div
      initial={enabled ? { opacity: 0, y: -6, scale: 0.96 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={enabled ? { opacity: 0, y: -4,  scale: 0.96 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.15, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      onMouseLeave={onClose}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 190,
        ...glass,
        borderRadius: 12,
        padding: '10px 10px 8px',
        boxShadow: `0 20px 56px rgba(0,0,0,0.55),
                    0 0 0 1px rgba(255,255,255,0.04),
                    0 0 32px ${accentColor}0a`,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 9, fontWeight: 700,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.12em',
        textAlign: 'center',
        marginBottom: 8,
        paddingBottom: 7,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        SNAP LAYOUT
      </div>

      {/* Zone grid rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {PICKER_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {row.map(zone => (
              <ZonePreviewButton
                key={zone}
                zone={zone}
                windowId={windowId}
                accentColor={accentColor}
                onApply={applyZone}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Zone label tooltip — shows on any hovered button via CSS */}
      <div style={{
        marginTop: 7,
        paddingTop: 6,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        fontFamily: 'var(--font-ui)',
        fontSize: 9,
        color: 'rgba(255,255,255,0.25)',
        textAlign: 'center',
        letterSpacing: '0.04em',
      }}>
        Hover to preview · Click to snap
      </div>
    </motion.div>
  )
}
