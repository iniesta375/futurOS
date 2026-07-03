import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import DesktopIcon from './DesktopIcon'
import { DESKTOP_APPS } from '@constants/appRegistry'
import useWindowStore from '@stores/windowStore'
import APP_REGISTRY from '@constants/appRegistry'

/**
 * DesktopIconGrid — Renders all desktop app icons in a vertical
 * left-aligned column with stagger entrance animations.
 * Clicking anywhere on the desktop deselects icons.
 */
export default function DesktopIconGrid({ onContextMenu }) {
  const [selectedId, setSelectedId] = useState(null)
  const openWindow = useWindowStore(s => s.openWindow)

  const handleLaunch = useCallback((appId) => {
    const app = APP_REGISTRY[appId]
    if (!app) return
    openWindow(appId, {
      title: app.title,
      defaultSize: app.defaultSize,
      minSize: app.minSize,
    })
    setSelectedId(null)
  }, [openWindow])

  const handleDesktopClick = useCallback(() => {
    setSelectedId(null)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.2 },
    },
  }

  return (
    <div
      role="region"
      aria-label="Desktop"
      className="absolute inset-0 pointer-events-none"
      style={{
        top: 0,
        bottom: 52,
        paddingTop: 24,
        paddingLeft: 20,
        zIndex: 1,
      }}
    >
      {/* Invisible hit area for desktop deselect */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onClick={handleDesktopClick}
        onContextMenu={onContextMenu}
        style={{ zIndex: 0 }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col gap-1 pointer-events-auto"
        style={{ zIndex: 1, width: 'fit-content' }}
      >
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            isSelected={selectedId === app.id}
            onSelect={setSelectedId}
            onLaunch={handleLaunch}
          />
        ))}
      </motion.div>
    </div>
  )
}
