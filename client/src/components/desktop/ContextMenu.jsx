import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicIcon from '@components/ui/DynamicIcon'
import useOSStore from '@stores/osStore'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * ContextMenu — Viewport-aware right-click context menu
 * Rendered into #overlay-layer portal. Auto-closes on outside click.
 *
 * Phase 12C Part 4: background/blur now sourced from
 * useGlassEffect('menu') and the open/close animation respects
 * animationsEnabled via useOSAnimations().enabled.
 *
 * items: Array<{
 *   label: string,
 *   icon?: string,        // lucide icon name
 *   action?: () => void,
 *   danger?: boolean,
 *   divider?: boolean,    // render a separator instead
 *   disabled?: boolean,
 *   shortcut?: string,
 * }>
 */
function ContextMenuContent({ x, y, items, onClose }) {
  const menuRef = useRef(null)
  const glass = useGlassEffect('menu')
  const { enabled } = useOSAnimations()

  // Clamp position so menu never clips viewport
  useEffect(() => {
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let cx = x, cy = y
    if (x + rect.width  > vw - 8) cx = vw - rect.width  - 8
    if (y + rect.height > vh - 8) cy = vh - rect.height - 8
    if (cx < 8) cx = 8
    if (cy < 8) cy = 8

    menuRef.current.style.left = `${cx}px`
    menuRef.current.style.top  = `${cy}px`
  }, [x, y])

  // Close on outside click or Escape
  useEffect(() => {
    const down = (e) => {
      if (!menuRef.current?.contains(e.target)) onClose()
    }
    const key = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [onClose])

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label="Context menu"
      initial={enabled ? { opacity: 0, scale: 0.94, y: -4 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={enabled ? { opacity: 0, scale: 0.94, y: -4 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.12, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      className="fixed z-[1000]"
      style={{
        left: x, top: y, minWidth: 200,
        ...glass, borderRadius: 10,
        boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        padding: '4px 0', fontFamily: 'var(--font-ui)',
      }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return (
            <div
              key={i}
              style={{
                height: 1,
                margin: '4px 8px',
                background: 'rgba(255,255,255,0.07)',
              }}
            />
          )
        }

        return (
          <button
            key={i}
            role="menuitem"
            aria-disabled={item.disabled}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.action?.()
                onClose()
              }
            }}
            className="w-full flex items-center gap-3 text-left transition-colors duration-100"
            style={{
              padding: '8px 14px',
              fontSize: 13,
              fontFamily: 'var(--font-ui)',
              color: item.danger
                ? 'var(--color-error)'
                : item.disabled
                  ? 'rgba(255,255,255,0.28)'
                  : 'rgba(255,255,255,0.88)',
              background: 'transparent',
              border: 'none',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              borderRadius: 6,
              margin: '0 4px',
              width: 'calc(100% - 8px)',
            }}
            onMouseEnter={e => {
              if (!item.disabled)
                e.currentTarget.style.background = item.danger
                  ? 'rgba(248,113,113,0.12)'
                  : 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {item.icon && (
              <DynamicIcon
                name={item.icon}
                size={15}
                color={item.danger ? 'var(--color-error)' : 'rgba(255,255,255,0.55)'}
                strokeWidth={1.75}
              />
            )}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 16 }}>
                {item.shortcut}
              </span>
            )}
          </button>
        )
      })}
    </motion.div>
  )
}

export default function ContextMenu() {
  const contextMenu = useOSStore(s => s.contextMenu)
  const hideContextMenu = useOSStore(s => s.hideContextMenu)
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {contextMenu && (
        <ContextMenuContent
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items || []}
          onClose={hideContextMenu}
        />
      )}
    </AnimatePresence>,
    overlay
  )
}
