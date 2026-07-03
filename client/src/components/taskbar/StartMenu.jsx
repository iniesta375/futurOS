import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Power, User } from 'lucide-react'
import { createPortal } from 'react-dom'
import DynamicIcon from '@components/ui/DynamicIcon'
import useOSStore from '@stores/osStore'
import useWindowStore from '@stores/windowStore'
import APP_REGISTRY from '@constants/appRegistry'
import { useClickOutside } from '@hooks/useClickOutside'
import { useGlassEffect }    from '@contexts/GlassEffectContext'
import { useFocusTrap } from '@hooks/useFocusTrap'

const ALL_APPS = Object.values(APP_REGISTRY)

function StartMenuContent({ onClose }) {
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  // Fine-grained selectors — was useOSStore() (subscribes to entire store)
  const userName = useOSStore(s => s.userName)
  const logout   = useOSStore(s => s.logout)
  const openWindow = useWindowStore(s => s.openWindow)

  useClickOutside(ref, onClose)
  useFocusTrap(ref, true)
  const glass = useGlassEffect('menu')

  const filteredApps = query
    ? ALL_APPS.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_APPS

  const launch = (appId) => {
    const app = APP_REGISTRY[appId]
    openWindow(appId, { title: app.title, defaultSize: app.defaultSize, minSize: app.minSize })
    onClose()
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  }
  const itemVariants = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Start Menu"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.34, 1.1, 0.64, 1] }}
      style={{
        position: 'fixed',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 580,
        maxHeight: '70vh',
        background: 'rgba(12, 12, 24, 0.92)',
        ...glass,
        backdropFilter: glass.backdropFilter,
        WebkitBackdropFilter: glass.WebkitBackdropFilter,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        zIndex: 700,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header: User info */}
      <div
        className="flex items-center gap-3 px-6 pt-5 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}
        >
          <User size={18} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-ui)' }}>
            {userName}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)' }}>
            Developer · FuturOS
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-5 py-3">
        <div
          className="flex items-center gap-3 px-4 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            height: 40,
          }}
        >
          <Search size={15} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search apps..."
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-ui)',
              border: 'none',
            }}
          />
        </div>
      </div>

      {/* Apps section label */}
      <div className="px-6 pb-2">
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', fontFamily: 'var(--font-ui)' }}>
          {query ? `RESULTS — ${filteredApps.length}` : 'ALL APPS'}
        </span>
      </div>

      {/* App grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <AnimatePresence mode="wait">
          {filteredApps.length > 0 ? (
            <motion.div
              key={query}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}
            >
              {filteredApps.map(app => (
                <motion.button
                  key={app.id}
                  variants={itemVariants}
                  onClick={() => launch(app.id)}
                  aria-label={`Open ${app.title}`}
                  className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors duration-100"
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl"
                    style={{
                      width: 48, height: 48,
                      background: `${app.accentColor}18`,
                      border: `1px solid ${app.accentColor}33`,
                      boxShadow: `0 4px 16px ${app.accentColor}22`,
                    }}
                  >
                    <DynamicIcon
                      name={app.icon}
                      size={22}
                      color={app.accentColor}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: 'rgba(255,255,255,0.78)',
                    fontFamily: 'var(--font-ui)',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {app.title}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', fontSize: 13 }}
            >
              No apps found for "{query}"
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: Power */}
      <div
        className="flex items-center justify-end px-5 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => { logout(); onClose() }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-150"
          style={{
            fontSize: 12, color: 'rgba(255,255,255,0.5)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >
          <Power size={13} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}

export default function StartMenu() {
  const startMenuOpen = useOSStore(s => s.startMenuOpen)
  const closeStartMenu = useOSStore(s => s.closeStartMenu)
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {startMenuOpen && <StartMenuContent onClose={closeStartMenu} />}
    </AnimatePresence>,
    overlay
  )
}
