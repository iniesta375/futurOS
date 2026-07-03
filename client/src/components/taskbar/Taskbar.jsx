import { motion } from 'framer-motion'
import { Grid3x3 } from 'lucide-react'
import useOSStore            from '@stores/osStore'
import { PINNED_APPS }       from '@constants/appRegistry'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'
import TaskbarAppIcon        from './TaskbarAppIcon'
import SystemTray            from './SystemTray'
import StartMenu             from './StartMenu'
import Tooltip               from '@components/ui/Tooltip'

/**
 * Taskbar — OS taskbar with pinned apps, start menu, and system tray.
 * Background and blur come from useGlassEffect('taskbar') so blur intensity
 * tracks the glassBlur setting live.
 */
export default function Taskbar() {
  // Fine-grained selectors — avoid subscribing to entire osStore
  const startMenuOpen  = useOSStore(s => s.startMenuOpen)
  const toggleStartMenu = useOSStore(s => s.toggleStartMenu)
  const glass = useGlassEffect('taskbar')
  const { enabled } = useOSAnimations()

  return (
    <>
      <StartMenu />

      <motion.div
        initial={{ y: 52, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.34, 1.1, 0.64, 1] }}
        className="fixed left-0 right-0 bottom-0 flex items-center"
        style={{
          height: 52,
          ...glass,
          background: glass.background ?? 'rgba(8, 8, 18, 0.82)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingLeft: 8,
          paddingRight: 8,
          zIndex: 400,
          boxShadow: '0 -1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Start button */}
        <Tooltip text="Start" placement="top">
          <motion.button
            whileHover={enabled ? { scale: 1.08 } : {}}
            whileTap={enabled ? { scale: 0.92 } : {}}
            onClick={toggleStartMenu}
            aria-label="Start menu"
            aria-expanded={startMenuOpen}
            aria-haspopup="dialog"
            className="flex items-center justify-center rounded-xl mr-2"
            style={{
              width: 44, height: 44,
              border: 'none', cursor: 'pointer',
              background: startMenuOpen ? 'rgba(99,102,241,0.25)' : 'transparent',
              boxShadow: startMenuOpen
                ? '0 0 0 1px rgba(99,102,241,0.5), 0 0 20px rgba(99,102,241,0.3)'
                : 'none',
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { if (!startMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { if (!startMenuOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <Grid3x3
              size={20}
              strokeWidth={1.75}
              color={startMenuOpen ? '#818cf8' : 'rgba(255,255,255,0.82)'}
            />
          </motion.button>
        </Tooltip>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)', marginRight: 8, flexShrink: 0 }} />

        {/* Pinned apps */}
        <div className="flex items-center gap-1 flex-1">
          {PINNED_APPS.map(app => (
            <TaskbarAppIcon key={app.id} app={app} />
          ))}
        </div>

        {/* System tray */}
        <SystemTray />
      </motion.div>
    </>
  )
}
