import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'
import { WIDGET_REGISTRY } from '@constants/widgetRegistry'

/**
 * WidgetRenderer — resolves widgetId -> widget content component.
 *
 * Mirrors AppRenderer's appComponents map (components/window/AppRenderer.jsx)
 * so the two systems stay familiar to work with, but widgets are far
 * simpler: a content component renders ONLY its body. WidgetContainer
 * already supplies the glass card, header, drag, resize, and minimize —
 * the component here just fills the body area at 100% width/height.
 *
 * ── Adding a new widget (Feature 8) ─────────────────────────────────────
 *   1. Register metadata in constants/widgetRegistry.js (id, title, icon,
 *      defaultPosition/Size, accentColor, resizable, available: true)
 *   2. Build src/components/widgets/<Name>Widget.jsx — a self-contained
 *      component reading its own hooks/state, rendered at full size
 *   3. Add it to `widgetComponents` below using the same registry id
 *
 * Nothing else needs to change — widgetStore, WidgetManager and
 * WidgetContainer are completely widget-agnostic.
 */
const widgetComponents = {
  clock: lazy(() => import('./ClockWidget')),

  // ── Future widgets (Feature 8 — uncomment once built) ──────────────────
  // weather:          lazy(() => import('./WeatherWidget')),
  // calendar:         lazy(() => import('./CalendarWidget')),
  // 'system-monitor': lazy(() => import('./SystemMonitorWidget')),
  // notes:            lazy(() => import('./NotesWidget')),
  // music:            lazy(() => import('./MusicWidget')),
}

/** Shown briefly while a widget's chunk is loading */
function WidgetLoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2
        size={18}
        strokeWidth={1.75}
        color="rgba(255,255,255,0.3)"
        style={{ animation: 'spin 1s linear infinite' }}
      />
    </div>
  )
}

/** Shown for registry entries that don't have a component yet (available: false) */
function UnknownWidget({ widgetId }) {
  const def = WIDGET_REGISTRY[widgetId]
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 text-center px-4">
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
        {def?.title || widgetId}
      </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
        Coming soon
      </span>
    </div>
  )
}

export default function WidgetRenderer({ widgetId }) {
  const Component = widgetComponents[widgetId]

  if (!Component) {
    return <UnknownWidget widgetId={widgetId} />
  }

  return (
    <Suspense fallback={<WidgetLoadingFallback />}>
      <Component />
    </Suspense>
  )
}
