import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * Tooltip — Lightweight OS tooltip
 * Usage: <Tooltip text="Open Files"><button>...</button></Tooltip>
 *
 * Phase 12C Part 4: background/blur sourced from useGlassEffect('chrome')
 * (the closest existing variant for a small dark UI chrome element), and
 * the show/hide animation respects animationsEnabled.
 */
export default function Tooltip({ text, children, placement = 'top', delay = 600 }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)
  const glass = useGlassEffect('chrome')
  const { enabled } = useOSAnimations()

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }
  const hide = () => {
    clearTimeout(timerRef.current)
    setVisible(false)
  }

  const placementStyles = {
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
  }

  const motionProps = {
    top:    { initial: { opacity: 0, y: 4  }, animate: { opacity: 1, y: 0  }, exit: { opacity: 0, y: 4  } },
    bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0  }, exit: { opacity: 0, y: -4 } },
    left:   { initial: { opacity: 0, x: 4  }, animate: { opacity: 1, x: 0  }, exit: { opacity: 0, x: 4  } },
    right:  { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0  }, exit: { opacity: 0, x: -4 } },
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && text && (
          <motion.div
            {...motionProps[placement]}
            transition={enabled ? { duration: 0.15 } : { duration: 0 }}
            className="absolute z-[9999] pointer-events-none whitespace-nowrap"
            style={placementStyles[placement]}
          >
            <div
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                ...glass,
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.88)',
                fontFamily: 'var(--font-ui)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
