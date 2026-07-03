import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react'
import SnapLayoutPicker from '@components/snap/SnapLayoutPicker'
import { useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * TrafficLights — Window control buttons (close, minimize, maximize).
 *
 * Hovering the green maximize button reveals the SnapLayoutPicker.
 *
 * Phase 13B:
 *  - whileHover/whileTap gated on useOSAnimations().enabled
 *  - aria-label on each button for screen reader access
 */
export default function TrafficLights({
  onClose, onMinimize, onMaximize,
  isMaximized, windowId, accentColor = '#6366f1',
}) {
  const [hovered,  setHovered]  = useState(false)
  const [showSnap, setShowSnap] = useState(false)
  const { enabled } = useOSAnimations()

  const buttons = [
    { key: 'close',    color: '#ff5f57', icon: X,
      shadow: 'rgba(255,95,87,0.5)',   label: 'Close window',    action: onClose    },
    { key: 'minimize', color: '#febc2e', icon: Minus,
      shadow: 'rgba(254,188,46,0.5)', label: 'Minimize window', action: onMinimize },
    { key: 'maximize', color: '#28c840', icon: isMaximized ? Minimize2 : Maximize2,
      shadow: 'rgba(40,200,64,0.5)',  label: isMaximized ? 'Restore window' : 'Maximize window',
      action: onMaximize },
  ]

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSnap(false) }}
      style={{ position: 'relative' }}
    >
      {buttons.map(({ key, color, icon: Icon, action, shadow, label }) => (
        <motion.button
          key={key}
          whileHover={enabled ? { scale: 1.15 } : {}}
          whileTap={enabled ? { scale: 0.88 } : {}}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          aria-label={label}
          onClick={e => {
            e.stopPropagation()
            if (key === 'maximize' && showSnap && windowId) return
            action?.()
          }}
          onMouseEnter={() => {
            if (key === 'maximize' && !isMaximized && windowId) setShowSnap(true)
          }}
          style={{
            width: 13, height: 13, borderRadius: '50%',
            background: color, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: hovered ? `0 0 8px ${shadow}` : 'none',
            transition: 'box-shadow 0.15s', flexShrink: 0, position: 'relative',
          }}
        >
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: enabled ? 0.1 : 0 }}
            aria-hidden="true"
          >
            <Icon size={7} strokeWidth={2.5} color="rgba(0,0,0,0.6)" />
          </motion.div>
        </motion.button>
      ))}

      <AnimatePresence>
        {showSnap && windowId && !isMaximized && (
          <SnapLayoutPicker
            windowId={windowId}
            accentColor={accentColor}
            onClose={() => setShowSnap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
