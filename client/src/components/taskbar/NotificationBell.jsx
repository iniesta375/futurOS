import { useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Bell, BellDot } from 'lucide-react'
import useNotificationStore from '@stores/notificationStore'
import { useOSAnimations } from '@contexts/GlassEffectContext'
import Tooltip from '@components/ui/Tooltip'

const NotificationBell = memo(function NotificationBell() {
  const unreadCount  = useNotificationStore(s => s.getUnreadCount)
  const centerOpen   = useNotificationStore(s => s.centerOpen)
  const toggleCenter = useNotificationStore(s => s.toggleCenter)
  const { enabled }  = useOSAnimations()

  const controls   = useAnimation()
  const prevUnread = useRef(0)

  useEffect(() => {
    if (enabled && unreadCount > prevUnread.current && prevUnread.current >= 0) {
      controls.start({
        rotate: [0, -18, 16, -12, 10, -6, 4, 0],
        transition: { duration: 0.55, ease: 'easeInOut' },
      })
    }
    prevUnread.current = unreadCount
  }, [unreadCount, controls, enabled])

  return (
    <Tooltip text="Notifications" placement="top">
      <motion.button
        animate={controls}
        whileHover={enabled ? { scale: 1.1 } : {}}
        whileTap={enabled ? { scale: 0.9 } : {}}
        onClick={toggleCenter}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={centerOpen}
        aria-haspopup="dialog"
        style={{
          position: 'relative',
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 9, border: 'none', cursor: 'pointer',
          background: centerOpen ? 'rgba(129,140,248,0.2)' : 'transparent',
          color: centerOpen ? '#818cf8' : 'rgba(255,255,255,0.65)',
          transition: 'background 0.15s, color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (!centerOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.88)'
          }
        }}
        onMouseLeave={e => {
          if (!centerOpen) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
          }
        }}
      >
        {unreadCount > 0
          ? <BellDot size={17} strokeWidth={2}    aria-hidden="true" />
          : <Bell    size={17} strokeWidth={1.75} aria-hidden="true" />
        }

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={enabled ? { scale: 0, opacity: 0 } : { opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={enabled ? { scale: 0, opacity: 0 } : { opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: 'absolute', top: 3, right: 3,
                minWidth: 15, height: 15, borderRadius: 99,
                background: '#f87171',
                border: '2px solid rgba(8,8,18,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 8, fontWeight: 900, color: '#fff',
                padding: '0 2px',
                boxShadow: '0 0 8px rgba(248,113,113,0.7)',
                lineHeight: 1,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {centerOpen && (
          <motion.div
            layoutId="bell-indicator"
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: 3,
              width: 14, height: 3, borderRadius: 99,
              background: '#818cf8',
              boxShadow: '0 0 6px rgba(129,140,248,0.8)',
            }}
          />
        )}
      </motion.button>
    </Tooltip>
  )
})

export default NotificationBell
