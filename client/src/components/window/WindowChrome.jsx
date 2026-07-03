import { memo } from 'react'
import TrafficLights from './TrafficLights'
import DynamicIcon from '@components/ui/DynamicIcon'
import SnapZoneIndicator from '@components/snap/SnapZoneIndicator'
import APP_REGISTRY from '@constants/appRegistry'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * WindowChrome — Phase 12C updated.
 *
 * Changes:
 *  - Added SnapZoneIndicator in the title area (shows when win.snapZone is set)
 *  - Indicator displays zone name and an X to un-snap
 *  - Title text shifts left slightly when indicator is visible (flex layout)
 *
 * Phase 12C Part 4:
 *  - blur/backdropFilter now come from useGlassEffect('chrome'), so the
 *    title bar tracks the transparency toggle and glassBlur slider.
 *  - The focus-aware tinted background (rgba(18,18,36,..) vs
 *    rgba(12,12,22,..)) is preserved only while transparency is ON —
 *    once it's off, the bar falls back to glass.background (the same
 *    flat solid every other "chrome" surface uses), matching the
 *    "all surfaces go solid" rule from GlassEffectContext.
 *  - The background/border CSS transition is skipped when
 *    animationsEnabled is false.
 */
const WindowChrome = memo(function WindowChrome({
  win,
  onClose,
  onMinimize,
  onMaximize,
  isFocused,
}) {
  const app         = APP_REGISTRY[win.appId]
  const accentColor = app?.accentColor || 'var(--color-accent)'
  const glass       = useGlassEffect('chrome')
  const { enabled } = useOSAnimations()

  return (
    <div
      className="window-drag-handle flex items-center gap-3 select-none"
      style={{
        height: 44,
        padding: '0 14px',
        ...glass,
        background: glass._isTransparent
          ? (isFocused ? 'rgba(18,18,36,0.95)' : 'rgba(12,12,22,0.90)')
          : glass.background,
        borderBottom: `1px solid ${isFocused ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: '12px 12px 0 0',
        flexShrink: 0,
        cursor: win.isMaximized ? 'default' : 'grab',
        transition: enabled ? 'background 0.2s, border-color 0.2s' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onDoubleClick={onMaximize}
    >
      {/* Top edge accent line */}
      {isFocused && (
        <div style={{
          position: 'absolute',
          top: 0, left: '10%', right: '10%', height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Traffic light controls + snap picker */}
      <TrafficLights
        windowId={win.id}
        accentColor={accentColor}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        isMaximized={win.isMaximized}
      />

      {/* App icon + title (flex-1 so snap indicator pushes from right) */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {app && (
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: 22, height: 22,
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}33`,
            }}
          >
            <DynamicIcon
              name={app.icon}
              size={12}
              color={isFocused ? accentColor : 'rgba(255,255,255,0.5)'}
              strokeWidth={1.75}
            />
          </div>
        )}
        <span
          className="truncate"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13, fontWeight: 500,
            color: isFocused ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.42)',
            letterSpacing: '0.01em',
            transition: 'color 0.2s',
          }}
        >
          {win.title}
        </span>
      </div>

      {/*
        Phase 12C: SnapZoneIndicator — shows current snap zone label + un-snap X button.
        Only visible when win.snapZone is set. AnimatePresence inside handles enter/exit.
        Positioned to the right of the title, before the right spacer.
      */}
      <SnapZoneIndicator
        windowId={win.id}
        snapZone={win.snapZone}
        accentColor={accentColor}
      />

      {/* Right spacer for optical title centering */}
      <div style={{ width: 55, flexShrink: 0 }} />
    </div>
  )
})

export default WindowChrome
