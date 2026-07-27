import { useCallback } from 'react'
import DesktopEffectsLayer from '@components/effects/DesktopEffectsLayer'
import DesktopIconGrid     from './DesktopIconGrid'
import ContextMenu         from './ContextMenu'
import Taskbar             from '@components/taskbar/Taskbar'
import WindowManager       from '@components/window/WindowManager'
import WidgetManager       from '@components/widgets/WidgetManager'
import GlobalSearch        from '@components/ui/GlobalSearch'
import KeyboardOverlay     from '@components/ui/KeyboardOverlay'
import NotificationToasts  from '@components/notifications/NotificationToasts'
import NotificationCenter  from '@components/notifications/NotificationCenter'
import SnapAssistPanel     from '@components/snap/SnapAssistPanel'
import useOSStore          from '@stores/osStore'
import useWindowStore      from '@stores/windowStore'
import useWidgetStore      from '@stores/widgetStore'
import APP_REGISTRY, { APP_IDS } from '@constants/appRegistry'
import { AVAILABLE_WIDGETS } from '@constants/widgetRegistry'
import WelcomeOverlay      from '@components/onboarding/WelcomeOverlay'

export default function Desktop() {
  // Fine-grained selectors — Desktop only re-renders when these two actions
  // change, not on every osStore update (accent color, volume, wifi, etc.)
  const showContextMenu = useOSStore(s => s.showContextMenu)
  const hideContextMenu = useOSStore(s => s.hideContextMenu)
  const openWindow  = useWindowStore(s => s.openWindow)
  const minimizeAll = useWindowStore(s => s.minimizeAll)

  const handleDesktopRightClick = useCallback((e) => {
    e.preventDefault()
    showContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: 'Command Palette',
          icon: 'search',
          shortcut: 'Ctrl+K',
          action: () => useOSStore.getState().openSearch(),
        },
        {
          label: 'Open Terminal',
          icon: 'terminal',
          shortcut: 'Ctrl+`',
          action: () => openWindow(APP_IDS.TERMINAL, {
            title: APP_REGISTRY[APP_IDS.TERMINAL].title,
            defaultSize: APP_REGISTRY[APP_IDS.TERMINAL].defaultSize,
            minSize: APP_REGISTRY[APP_IDS.TERMINAL].minSize,
          }),
        },
        { divider: true },
        {
          label: 'Change Wallpaper',
          icon: 'image',
          action: () => openWindow(APP_IDS.SETTINGS, {
            title: APP_REGISTRY[APP_IDS.SETTINGS].title,
            defaultSize: APP_REGISTRY[APP_IDS.SETTINGS].defaultSize,
            minSize: APP_REGISTRY[APP_IDS.SETTINGS].minSize,
          }),
        },
        {
          label: 'Show All Apps',
          icon: 'grid-3x3',
          action: () => useOSStore.getState().toggleStartMenu(),
        },
        {
          label: 'Minimize All Windows',
          icon: 'minus-square',
          action: minimizeAll,
        },
        { divider: true },
        // ── Widgets (Feature 7/8 — desktop integration) ──────────────────
        // One "Add <Title> Widget" item per AVAILABLE_WIDGETS entry.
        // Future widgets need zero changes here — they appear automatically
        // once their registry entry sets `available: true`.
        ...AVAILABLE_WIDGETS.map(w => ({
          label: `Add ${w.title} Widget`,
          icon: w.icon,
          action: () => useWidgetStore.getState().addWidget(w.id),
        })),
        ...(useWidgetStore.getState().widgets.length > 0
          ? [{
              label: 'Reset Widgets',
              icon: 'rotate-ccw',
              action: () => useWidgetStore.getState().resetWidgets(),
            }]
          : []),
        { divider: true },
        {
          label: 'Keyboard Shortcuts',
          icon: 'keyboard',
          shortcut: 'Ctrl+/',
          action: () => useOSStore.getState().toggleKeyboardOverlay(),
        },
        { divider: true },
        {
          label: 'Refresh Desktop',
          icon: 'refresh-cw',
          action: () => window.location.reload(),
        },
      ],
    })
  }, [showContextMenu, openWindow, minimizeAll])

  return (
    <DesktopEffectsLayer>
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
        onClick={hideContextMenu}
      >
        {/* Desktop icons */}
        <DesktopIconGrid onContextMenu={handleDesktopRightClick} />

        {/* Desktop widgets — Feature 3/7 */}
        <WidgetManager />

        {/* Context menu (portal → #overlay-layer) */}
        <ContextMenu />

        {/* Windows (portal → #window-layer) */}
        <WindowManager />

        {/* Taskbar */}
        <Taskbar />

        {/* OS overlays (all portal-rendered → #overlay-layer) */}
        <GlobalSearch />
        <KeyboardOverlay />
        <NotificationToasts />
        <NotificationCenter />

        {/* Snap assist companion panel */}
        <SnapAssistPanel />

        {/* First-visit onboarding overlay — Phase 14 */}
        <WelcomeOverlay />
      </div>
    </DesktopEffectsLayer>
  )
}
