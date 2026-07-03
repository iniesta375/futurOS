/**
 * NotificationCenter.jsx — FuturOS Notification Center Panel
 *
 * Features:
 * - Slides up from above taskbar, right-anchored
 * - Grouped by type with color-coded section headers
 * - Unread dot + bold title for unread items
 * - Mark-as-read on click, mark-all-read, clear-all
 * - Action button rendered inline per-notification
 * - Relative timestamps ("just now", "2m ago", etc.)
 * - Empty state with bell icon
 * - Click-outside to close
 * - Portal rendered into #overlay-layer
 *
 * Phase 12C Part 3: panel background/blur now sourced from
 * useGlassEffect('panel'), and the open/close animation respects the
 * animationsEnabled setting via useOSAnimations().enabled.
 */

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCheck, Trash2, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import DynamicIcon from '@components/ui/DynamicIcon'
import useNotificationStore, { TYPE_CONFIG } from '@stores/notificationStore'
import { useClickOutside } from '@hooks/useClickOutside'
import { useFocusTrap } from '@hooks/useFocusTrap'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

// ── Time helper ───────────────────────────────────────────────────────────

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (secs < 5)    return 'just now'
  if (secs < 60)   return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

// ── Single notification row ───────────────────────────────────────────────

function NotifRow({ notif, onRead, onRemove }) {
  const cfg   = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
  const color = cfg.color

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, padding: 0, overflow: 'hidden',
              transition: { duration: 0.2 } }}
      transition={{ duration: 0.18 }}
      onClick={() => onRead(notif.id)}
      style={{
        padding: '11px 14px 11px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'default',
        background: notif.read ? 'transparent' : `${color}07`,
        transition: 'background 0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { e.currentTarget.style.background = notif.read ? 'transparent' : `${color}07` }}
    >
      {/* Unread indicator bar */}
      {!notif.read && (
        <div style={{
          position: 'absolute', left: 6, top: '20%', bottom: '20%',
          width: 3, borderRadius: 99,
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }} />
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Type icon */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {notif.appIcon
            ? <span style={{ fontSize: 14, lineHeight: 1 }}>{notif.appIcon}</span>
            : <DynamicIcon name={cfg.icon} size={14} color={color} strokeWidth={2} />
          }
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 8, marginBottom: 2,
          }}>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: 12,
              fontWeight: notif.read ? 500 : 700,
              color: notif.read ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.92)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {notif.title}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'rgba(255,255,255,0.26)', flexShrink: 0,
            }}>
              {timeAgo(notif.timestamp)}
            </span>
          </div>

          {notif.message && (
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: 11, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.42)', margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {notif.message}
            </p>
          )}

          {/* Inline action CTA */}
          {notif.action && (
            <button
              onClick={e => { e.stopPropagation(); notif.action.run?.() }}
              style={{
                marginTop: 6,
                fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
                color, background: `${color}18`,
                border: `1px solid ${color}30`,
                borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${color}28`}
              onMouseLeave={e => e.currentTarget.style.background = `${color}18`}
            >
              {notif.action.label}
            </button>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(notif.id) }}
          style={{
            width: 18, height: 18, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.2)', borderRadius: 4,
            transition: 'color 0.12s, background 0.12s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f87171'
            e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.background = 'none'
          }}
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Panel ─────────────────────────────────────────────────────────────────

function NotificationPanel({ onClose }) {
  const ref = useRef(null)
  useClickOutside(ref, onClose)
  useFocusTrap(ref, true)

  const glass = useGlassEffect('panel')
  const { enabled } = useOSAnimations()

  // Narrow subscriptions — only re-render when these specific slices change
  const notifications    = useNotificationStore(useShallow(s => s.notifications))
  const markRead         = useNotificationStore(s => s.markRead)
  const markAllRead      = useNotificationStore(s => s.markAllRead)
  const removeNotification = useNotificationStore(s => s.removeNotification)
  const clearAll         = useNotificationStore(s => s.clearAll)

  const unread = notifications.filter(n => !n.read).length

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Notification center"
      initial={enabled ? { opacity: 0, y: 8, scale: 0.97 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={enabled ? { opacity: 0, y: 8, scale: 0.97 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.2, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      style={{
        position: 'fixed',
        bottom: 58, right: 8,       // sits above taskbar, right-anchored
        width: 340, maxHeight: '72vh',
        ...glass,
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 900,
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={15} color="rgba(255,255,255,0.65)" strokeWidth={1.75} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            color: 'rgba(255,255,255,0.92)',
          }}>
            Notifications
          </span>
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0.7 }} animate={{ scale: 1 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                background: 'rgba(99,102,241,0.22)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.32)',
                padding: '1px 7px', borderRadius: 99,
              }}
            >
              {unread}
            </motion.span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 3 }}>
          {unread > 0 && (
            <IconBtn icon={CheckCheck} onClick={markAllRead} title="Mark all read" />
          )}
          {notifications.length > 0 && (
            <IconBtn icon={Trash2} onClick={clearAll} title="Clear all" danger />
          )}
          <IconBtn icon={X} onClick={onClose} title="Close" />
        </div>
      </div>

      {/* ── Notification list ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                padding: '44px 20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 12,
              }}
            >
              <BellOff size={36} color="rgba(255,255,255,0.1)" strokeWidth={1.25} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 13,
                color: 'rgba(255,255,255,0.3)',
              }}>
                No notifications
              </span>
            </motion.div>
          ) : (
            notifications.map(n => (
              <NotifRow
                key={n.id}
                notif={n}
                onRead={markRead}
                onRemove={removeNotification}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      {notifications.length > 0 && (
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.2)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(255,255,255,0.22)',
          }}>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
                color: '#818cf8',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 6, padding: '2px 9px', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
            >
              Mark all read
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Icon button helper ────────────────────────────────────────────────────

function IconBtn({ icon: Icon, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, border: 'none', cursor: 'pointer',
        borderRadius: 8, background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.45)',
        transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger
          ? 'rgba(248,113,113,0.1)'
          : 'rgba(255,255,255,0.08)'
        e.currentTarget.style.color = danger ? '#f87171' : 'rgba(255,255,255,0.85)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = danger ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.45)'
      }}
    >
      <Icon size={14} strokeWidth={2} />
    </button>
  )
}

// ── Portal export ─────────────────────────────────────────────────────────

export default function NotificationCenter() {
  const centerOpen = useNotificationStore(s => s.centerOpen)
  const closeCenter = useNotificationStore(s => s.closeCenter)
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {centerOpen && <NotificationPanel onClose={closeCenter} />}
    </AnimatePresence>,
    overlay
  )
}
