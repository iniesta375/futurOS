import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import DynamicIcon from '@components/ui/DynamicIcon'
import Tooltip from '@components/ui/Tooltip'
import useWindowStore from '@stores/windowStore'
import { useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * TaskbarAppIcon — App icon in the taskbar pinned row.
 *
 * Performance: memo() + useShallow selector scoped to only this app's
 * windows. Was previously subscribing to all windows on every render,
 * causing all 7 icons to re-render on every drag frame.
 *
 * Phase 13B: whileHover/whileTap and running-dot animation gated on
 * useOSAnimations().enabled so they respect the animations toggle.
 */
const TaskbarAppIcon = memo(function TaskbarAppIcon({ app }) {
  const appWindows = useWindowStore(
    useShallow(s => s.windows.filter(w => w.appId === app.id))
  )
  const openWindow     = useWindowStore(s => s.openWindow)
  const focusWindow    = useWindowStore(s => s.focusWindow)
  const minimizeWindow = useWindowStore(s => s.minimizeWindow)
  const { enabled }  = useOSAnimations()

  const isRunning   = appWindows.length > 0
  const isFocused   = appWindows.some(w => w.isFocused && !w.isMinimized)

  const handleClick = () => {
    if (!isRunning) {
      openWindow(app.id, { title: app.title, defaultSize: app.defaultSize, minSize: app.minSize })
      return
    }
    const focused = appWindows.find(w => w.isFocused && !w.isMinimized)
    if (focused) {
      minimizeWindow(focused.id)
    } else {
      const target = appWindows.find(w => w.isMinimized) || appWindows[0]
      const win = useWindowStore.getState().windows.find(w => w.id === target.id)
      if (win?.isMinimized) {
        useWindowStore.setState(state => ({
          windows: state.windows.map(w =>
            w.id === target.id ? { ...w, isMinimized: false } : w
          ),
        }))
      }
      focusWindow(target.id)
    }
  }

  return (
    <Tooltip text={app.title} placement="top">
      <motion.button
        whileHover={enabled ? { scale: 1.1 } : {}}
        whileTap={enabled ? { scale: 0.92 } : {}}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={handleClick}
        aria-label={`${app.title}${isRunning ? (isFocused ? ' — focused' : ' — running') : ''}`}
        aria-pressed={isFocused}
        className="relative flex flex-col items-center justify-center"
        style={{
          width: 44, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: isFocused ? `${app.accentColor}22` : isRunning ? 'rgba(255,255,255,0.06)' : 'transparent',
          boxShadow: isFocused ? `0 0 0 1px ${app.accentColor}55, inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
          transition: enabled ? 'background 0.15s, box-shadow 0.15s' : 'none',
        }}
      >
        <DynamicIcon
          name={app.icon} size={20}
          color={isFocused ? app.accentColor : 'rgba(255,255,255,0.82)'}
          strokeWidth={1.75}
        />

        {/* Running indicator dot */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={enabled ? { scale: 0, opacity: 0 } : { opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={enabled ? { scale: 0, opacity: 0 } : { opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              aria-hidden="true"
              className="absolute"
              style={{
                bottom: 3,
                width: isFocused ? 16 : 4, height: 3, borderRadius: 99,
                background: isFocused ? app.accentColor : 'rgba(255,255,255,0.5)',
                boxShadow: isFocused ? `0 0 6px ${app.accentColor}` : 'none',
                transition: enabled
                  ? 'width 0.25s var(--ease-spring), background 0.2s'
                  : 'none',
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </Tooltip>
  )
})

export default TaskbarAppIcon
