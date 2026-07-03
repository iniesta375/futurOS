import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'
import { WIDGET_REGISTRY } from '@constants/widgetRegistry'

const HEADER_HEIGHT = 38

/**
 * WidgetContainer — shared chrome for every desktop widget (Feature 5).
 *
 * Provides the glassmorphic card, header (icon + title + minimize/close),
 * drag-to-move, optional drag-to-resize, focus state, and minimize-to-
 * header-bar collapse. Individual widgets only implement their *content*
 * — passed as `children` via WidgetRenderer — so adding a new widget never
 * requires touching this file.
 *
 * ── Drag (Feature 4) ────────────────────────────────────────────────────
 * Position is fully controlled by widgetStore (`widget.position`).
 * Framer Motion's `drag` is used with `dragMomentum={false}` and
 * `dragElastic={0}`, so there is no inertia overshoot and no rubber-band
 * "snap back" after release — the widget stays exactly where it's dropped.
 *
 * The element is rendered with `left/top` from the store and `x: 0, y: 0`
 * (Framer's transform offset). During a drag, Framer animates `x`/`y` via
 * transform on top of `left/top`. On release we commit
 * `position + offset` to the store in a single `onDragEnd` call — the
 * store update re-renders with new `left/top` and `x/y` reset to 0 in the
 * same frame, so the widget doesn't jump.
 *
 * `dragConstraints` is a ref to the desktop bounds (passed down from
 * WidgetManager), so widgets can't be dragged under the taskbar or off the
 * visible desktop.
 *
 * Only the header initiates a drag — the body calls `e.stopPropagation()`
 * on pointerdown so interactive widget content (buttons, inputs, etc.)
 * never triggers a drag gesture, while still reporting focus.
 *
 * ── Resize ──────────────────────────────────────────────────────────────
 * Only rendered when `WIDGET_REGISTRY[widgetId].resizable` is true (Clock
 * is fixed-size; future widgets like System Monitor or Calendar can opt
 * in). Implemented with native pointer events rather than Framer drag, to
 * avoid two gesture recognizers fighting over the same element. Size is
 * tracked as local state while dragging and only committed to the store
 * (and therefore localStorage) once, on pointerup — see "Performance
 * considerations" in the phase notes.
 */
export default function WidgetContainer({
  widget,
  isActive,
  containerRef,
  onFocus,
  onMove,
  onResize,
  onToggleMinimize,
  onClose,
  children,
}) {
  const def   = WIDGET_REGISTRY[widget.widgetId] || {}
  const glass = useGlassEffect('window')
  const { enabled } = useOSAnimations()

  const [liveSize, setLiveSize] = useState(null)
  const size      = liveSize || widget.size
  const collapsed = widget.minimized
  const accent    = def.accentColor || '#6366f1'

  // ── Drag end → commit position once ─────────────────────────────────────
  const handleDragEnd = useCallback((_e, info) => {
    onMove({
      x: Math.round(widget.position.x + info.offset.x),
      y: Math.round(widget.position.y + info.offset.y),
    })
  }, [widget.position, onMove])

  // ── Resize handle → commit size once, on release ────────────────────────
  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()

    const startX = e.clientX
    const startY = e.clientY
    const startW = widget.size.width
    const startH = widget.size.height
    const minW = def.minSize?.width  || 160
    const minH = def.minSize?.height || 120

    const onPointerMove = (ev) => {
      setLiveSize({
        width:  Math.max(minW, startW + (ev.clientX - startX)),
        height: Math.max(minH, startH + (ev.clientY - startY)),
      })
    }
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      setLiveSize(current => {
        if (current) onResize(current)
        return null
      })
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }, [widget.size, def.minSize, onResize, onFocus])

  return (
    <motion.div
      drag={!collapsed}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={containerRef}
      onDragStart={onFocus}
      onDragEnd={handleDragEnd}
      onPointerDownCapture={onFocus}
      initial={enabled ? { opacity: 0, scale: 0.92, y: 14 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={enabled
        ? { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15 } }
        : { opacity: 0 }}
      transition={enabled ? { type: 'spring', stiffness: 380, damping: 32 } : { duration: 0 }}
      className="absolute pointer-events-auto select-none"
      style={{
        left: widget.position.x,
        top:  widget.position.y,
        x: 0, y: 0,
        width: size.width,
        height: collapsed ? HEADER_HEIGHT : size.height,
        zIndex: widget.zIndex,
        touchAction: 'none',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          ...glass,
          border: `1px solid ${isActive ? `${accent}40` : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 16,
          boxShadow: isActive
            ? `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), 0 0 32px ${accent}1a`
            : '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.25s',
          position: 'relative',
        }}
      >
        {/* Top accent line when active — matches Window.jsx focused state */}
        {isActive && !collapsed && (
          <div style={{
            position: 'absolute', top: 0, left: '12%', right: '12%', height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
            pointerEvents: 'none', zIndex: 1,
          }} />
        )}

        {/* ── Header (drag handle) ── */}
        <div
          onDoubleClick={onToggleMinimize}
          className="flex items-center gap-2 flex-shrink-0"
          style={{
            height: HEADER_HEIGHT,
            padding: '0 8px 0 12px',
            cursor: 'grab',
            borderBottom: collapsed ? 'none' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0"
            style={{
              width: 20, height: 20,
              background: `${accent}1f`,
              border: `1px solid ${accent}38`,
            }}
          >
            <DynamicIcon name={def.icon || 'box'} size={11} color={accent} strokeWidth={2.25} />
          </div>

          <span
            className="flex-1 truncate"
            style={{
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.8)', letterSpacing: '0.01em',
            }}
          >
            {def.title || widget.widgetId}
          </span>

          {/* Minimize / restore */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={onToggleMinimize}
            className="flex items-center justify-center rounded-md transition-colors flex-shrink-0"
            style={{
              width: 22, height: 22, border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.42)', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)' }}
            title={collapsed ? 'Restore widget' : 'Minimize widget'}
          >
            {collapsed
              ? <Plus  size={13} strokeWidth={2.5} />
              : <Minus size={13} strokeWidth={2.5} />}
          </button>

          {/* Close (remove from desktop) */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={onClose}
            className="flex items-center justify-center rounded-md transition-colors flex-shrink-0"
            style={{
              width: 22, height: 22, border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.42)', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)' }}
            title="Remove widget"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Body ── */}
        {!collapsed && (
          <div
            onPointerDown={e => e.stopPropagation()}
            className="flex-1 overflow-hidden relative"
            style={{ cursor: 'default' }}
          >
            {children}
          </div>
        )}

        {/* ── Resize handle (only if registry marks this widget resizable) ── */}
        {!collapsed && def.resizable && (
          <div
            onPointerDown={handleResizeStart}
            style={{
              position: 'absolute', right: 0, bottom: 0,
              width: 18, height: 18, cursor: 'nwse-resize',
              touchAction: 'none', zIndex: 2,
            }}
          >
            <div style={{
              position: 'absolute', right: 5, bottom: 5,
              width: 8, height: 8,
              borderRight: '2px solid rgba(255,255,255,0.28)',
              borderBottom: '2px solid rgba(255,255,255,0.28)',
              borderRadius: '0 0 2px 0',
            }} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
