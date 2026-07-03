import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import useWidgetStore from '@stores/widgetStore'
import WidgetContainer from './WidgetContainer'
import WidgetRenderer from './WidgetRenderer'

// Mirrors Window.jsx's TASKBAR_H — widgets share the same usable desktop
// area as windows and must not be draggable underneath the taskbar.
const TASKBAR_HEIGHT = 52

/**
 * WidgetManager — Feature 3.
 *
 * Renders every widget instance from widgetStore inside a single bounded
 * container that:
 *
 *  - acts as the Framer Motion `dragConstraints` ref for every widget
 *    (WidgetContainer reads this via the `containerRef` prop), so widgets
 *    can be dragged freely across the desktop but never under the taskbar
 *    or off-screen — Feature 4's "desktop boundaries" requirement
 *  - sits inside Desktop's existing z-index:1 stacking context, ABOVE
 *    desktop icons but BELOW the taskbar (z-index 400) and, by
 *    construction, below #window-layer (100) and #overlay-layer (500) —
 *    see widgetStore.js for the full z-index explanation
 *  - has `pointer-events: none` itself so empty desktop space still
 *    receives clicks (deselect icons, close context menu); each widget
 *    card re-enables pointer events on itself
 *
 * Focus / z-index ordering among widgets is delegated entirely to
 * widgetStore (`focusWidget` bumps a module-level counter) — this
 * component only reads `activeWidgetId` to pass the focus-ring flag down.
 *
 * AnimatePresence here lets WidgetContainer's `exit` variant (from
 * useOSAnimations) play when a widget is removed via its close button.
 */
export default function WidgetManager() {
  const containerRef = useRef(null)

  const widgets         = useWidgetStore(s => s.widgets)
  const activeWidgetId  = useWidgetStore(s => s.activeWidgetId)
  const focusWidget      = useWidgetStore(s => s.focusWidget)
  const moveWidget       = useWidgetStore(s => s.moveWidget)
  const resizeWidget     = useWidgetStore(s => s.resizeWidget)
  const toggleVisibility = useWidgetStore(s => s.toggleVisibility)
  const removeWidget     = useWidgetStore(s => s.removeWidget)

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-0 pointer-events-none"
      style={{ bottom: TASKBAR_HEIGHT, zIndex: 5 }}
    >
      <AnimatePresence>
        {widgets.map(widget => (
          <WidgetContainer
            key={widget.instanceId}
            widget={widget}
            isActive={widget.instanceId === activeWidgetId}
            containerRef={containerRef}
            onFocus={() => focusWidget(widget.instanceId)}
            onMove={(position) => moveWidget(widget.instanceId, position)}
            onResize={(size) => resizeWidget(widget.instanceId, size)}
            onToggleMinimize={() => toggleVisibility(widget.instanceId)}
            onClose={() => removeWidget(widget.instanceId)}
          >
            <WidgetRenderer widgetId={widget.widgetId} />
          </WidgetContainer>
        ))}
      </AnimatePresence>
    </div>
  )
}
