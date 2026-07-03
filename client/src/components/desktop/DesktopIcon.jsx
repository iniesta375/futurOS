import { useState, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import DynamicIcon from '@components/ui/DynamicIcon'
import { useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * DesktopIcon — A single app icon on the desktop grid.
 *
 * Phase 13B:
 *  - Animation gated on useOSAnimations().enabled (was un-gated)
 *  - Added aria-label and role="button" for keyboard + screen reader access
 *  - Added tabIndex={0} + onKeyDown for Enter/Space launch
 *  - Replaced fire-and-forget setTimeout with a ref so it can be cancelled
 *    on unmount (stale-timer cleanup from the Phase 12 audit)
 *  - Double-click still launches; single-click selects; Enter/Space launches
 */
const DesktopIcon = memo(function DesktopIcon({ app, onLaunch, isSelected, onSelect }) {
  const [justClicked, setJustClicked] = useState(false)
  const timerRef  = useRef(null)
  const { enabled } = useOSAnimations()

  // Cleanup stale timer on unmount (audit item L2)
  const clearClickTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    onSelect?.(app.id)

    if (justClicked) {
      clearClickTimer()
      onLaunch?.(app.id)
      setJustClicked(false)
    } else {
      setJustClicked(true)
      clearClickTimer()
      timerRef.current = setTimeout(() => setJustClicked(false), 400)
    }
  }, [app.id, justClicked, onLaunch, onSelect, clearClickTimer])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onLaunch?.(app.id)
    }
  }, [app.id, onLaunch])

  return (
    <motion.div
      initial={enabled ? { opacity: 0, scale: 0.8, y: 10 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={enabled ? { scale: 1.06 } : {}}
      whileTap={enabled ? { scale: 0.95 } : {}}
      transition={enabled ? { type: 'spring', stiffness: 400, damping: 28 } : { duration: 0 }}
      onClick={handleClick}
      onDoubleClick={() => onLaunch?.(app.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${app.title}${isSelected ? ', selected' : ''} — double-click or press Enter to open`}
      aria-pressed={isSelected}
      className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer select-none w-[88px]"
      style={{
        background: isSelected ? 'rgba(99,102,241,0.2)' : 'transparent',
        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: 52, height: 52,
          background: isSelected ? `${app.accentColor}22` : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isSelected ? app.accentColor + '44' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isSelected
            ? `0 0 20px ${app.accentColor}44, inset 0 1px 0 rgba(255,255,255,0.1)`
            : '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'all 0.2s ease',
        }}
      >
        <DynamicIcon
          name={app.icon}
          size={24}
          color={isSelected ? app.accentColor : 'rgba(255,255,255,0.85)'}
          strokeWidth={1.5}
        />
        {isSelected && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${app.accentColor}33, transparent 70%)`,
            }}
          />
        )}
      </div>

      <span
        className="text-center leading-tight font-medium"
        style={{
          fontFamily: 'var(--font-ui)', fontSize: 11,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.82)',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          maxWidth: 80, overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
        }}
      >
        {app.title}
      </span>
    </motion.div>
  )
})

export default DesktopIcon
