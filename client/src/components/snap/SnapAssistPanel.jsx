import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LayoutGrid } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useShallow } from 'zustand/react/shallow'
import useSnapStore from '@stores/snapStore'
import useWindowStore from '@stores/windowStore'
import APP_REGISTRY from '@constants/appRegistry'
import DynamicIcon from '@components/ui/DynamicIcon'
import { getSnapGeometry, SNAP_ZONE_META } from '@constants/snapConstants'
import { useClickOutside } from '@hooks/useClickOutside'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * SnapAssistPanel — Phase 12C Snap Assist companion panel.
 *
 * Appears in the corner of the screen after a window is snapped.
 * Shows thumbnails of other open windows that can fill the remaining zones.
 * Clicking a thumbnail snaps that window to the complementary zone.
 *
 * Position: top-right corner, above taskbar
 * Triggers: hideSnapAssist after a window is placed or after 5s timeout
 *
 * Phase 12C Part 4: panel background/blur sourced from
 * useGlassEffect('panel'), and all motion (panel entrance/exit, close
 * button, zone thumbnails) respects animationsEnabled via
 * useOSAnimations().enabled.
 */

const PANEL_TIMEOUT_MS = 6000

function ZoneSlot({ zone, accentColor, onPlace, availableWindows }) {
  const meta = SNAP_ZONE_META[zone]
  const { enabled } = useOSAnimations()
  const hoverTap = enabled ? { whileHover: { scale: 1.04, y: -2 }, whileTap: { scale: 0.97 } } : {}

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      marginBottom: 12,
    }}>
      {/* Zone label */}
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 10, fontWeight: 600,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 4px ${accentColor}`,
          flexShrink: 0,
        }} />
        {meta?.label?.toUpperCase() ?? zone.toUpperCase()}
      </div>

      {/* Window thumbnails for this zone */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {availableWindows.length === 0 ? (
          <div style={{
            width: '100%', height: 40,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-ui)', fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
          }}>
            No windows available
          </div>
        ) : (
          availableWindows.map(win => {
            const app = APP_REGISTRY[win.appId]
            const appAccent = app?.accentColor || '#6366f1'
            return (
              <motion.button
                key={win.id}
                {...hoverTap}
                onClick={() => onPlace(win.id, zone)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${appAccent}33`,
                  borderRadius: 9,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.12s, border-color 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${appAccent}14`
                  e.currentTarget.style.borderColor = `${appAccent}66`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = `${appAccent}33`
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: `${appAccent}20`,
                  border: `1px solid ${appAccent}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <DynamicIcon
                    name={app?.icon || 'square'}
                    size={13}
                    color={appAccent}
                    strokeWidth={1.75}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12, fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}>
                  {win.title}
                </span>
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}

function PanelContent({ assistWindowId, assistTargetZones, accentColor }) {
  const panelRef = useRef(null)
  const hideSnapAssist   = useSnapStore(s => s.hideSnapAssist)
  const setWindowGeometry = useWindowStore(s => s.setWindowGeometry)
  const focusWindow       = useWindowStore(s => s.focusWindow)
  // Only subscribe to windows array — not entire store shape
  const windows = useWindowStore(useShallow(s => s.windows))
  const glass = useGlassEffect('panel')
  const { enabled } = useOSAnimations()
  const hoverTap = enabled ? { whileHover: { scale: 1.15 }, whileTap: { scale: 0.9 } } : {}
  useClickOutside(panelRef, hideSnapAssist)

  const placeable = windows.filter(w =>
    !w.isMinimized &&
    w.id !== assistWindowId
  )

  const handlePlace = (targetWindowId, zone) => {
    const geo = getSnapGeometry(zone)
    if (!geo) return

    const win = useWindowStore.getState().getWindow(targetWindowId)
    setWindowGeometry(targetWindowId, {
      position:            { x: geo.x, y: geo.y },
      size:                { width: geo.width, height: geo.height },
      snapZone:            zone,
      preMaximizePosition: win?.position ?? null,
      preMaximizeSize:     win?.size ?? null,
    })
    focusWindow(targetWindowId)
    hideSnapAssist()
  }

  return (
    <motion.div
      ref={panelRef}
      initial={enabled ? { opacity: 0, x: 16, scale: 0.97 } : { opacity: 0 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={enabled ? { opacity: 0, x: 16,  scale: 0.96 } : { opacity: 0 }}
      transition={enabled ? { type: 'spring', stiffness: 400, damping: 34 } : { duration: 0 }}
      style={{
        position: 'fixed',
        top: 16, right: 16,
        width: 240,
        ...glass,
        borderRadius: 14,
        boxShadow: `0 24px 64px rgba(0,0,0,0.6),
                    0 0 0 1px rgba(255,255,255,0.04),
                    0 0 40px ${accentColor}0a`,
        zIndex: 750,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LayoutGrid size={12} color={accentColor} strokeWidth={2} />
          </div>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12, fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
          }}>
            Snap Assist
          </span>
        </div>
        <motion.button
          {...hoverTap}
          onClick={hideSnapAssist}
          style={{
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Subtitle */}
      <div style={{
        padding: '8px 14px 4px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.38)',
        lineHeight: 1.4,
      }}>
        Choose a window to fill the remaining space
      </div>

      {/* Zone slots */}
      <div style={{ padding: '8px 14px 14px', overflowY: 'auto', maxHeight: 360 }}>
        {assistTargetZones.map(zone => (
          <ZoneSlot
            key={zone}
            zone={zone}
            accentColor={accentColor}
            availableWindows={placeable}
            onPlace={handlePlace}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function SnapAssistPanel({ accentColor = '#6366f1' }) {
  const { assistVisible, assistWindowId, assistTargetZones } = useSnapStore(
    useShallow(s => ({
      assistVisible:     s.assistVisible,
      assistWindowId:    s.assistWindowId,
      assistTargetZones: s.assistTargetZones,
    }))
  )

  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {assistVisible && (
        <PanelContent
          key="snap-assist"
          assistWindowId={assistWindowId}
          assistTargetZones={assistTargetZones}
          accentColor={accentColor}
        />
      )}
    </AnimatePresence>,
    overlay
  )
}
