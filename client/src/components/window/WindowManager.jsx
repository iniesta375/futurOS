import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import useWindowStore from '@stores/windowStore'
import useSnapStore from '@stores/snapStore'
import APP_REGISTRY from '@constants/appRegistry'
import Window from './Window'
import SnapPreviewOverlay from '@components/snap/SnapPreviewOverlay'

/**
 * WindowManager — Phase 12.5 (H3: SnapPreviewOverlay singleton)
 *
 * Changes from Phase 12C:
 *
 * H3 — SnapPreviewOverlay is now a TRUE singleton mounted here, not inside
 *   each Window. Previous implementation conditionally rendered one overlay
 *   per-window (conditioned on `isThisWindowDragging`) which:
 *     1. Violated the "shared singleton" comment in the old Window.jsx
 *     2. Caused React StrictMode to double-mount/unmount the overlay
 *     3. Would render two overlays simultaneously on multi-touch devices
 *
 *   Fix: WindowManager reads `activeDragWindowId` from snapStore directly
 *   and derives `accentColor` from APP_REGISTRY via the dragged window's
 *   appId. Single mount, zero per-window logic.
 *
 * useShallow on `windows` is preserved — WindowManager still re-renders
 * only when the SET of windows changes, not on every focus/position update.
 *
 * The SnapPreviewOverlay subscription (activeDragWindowId) is isolated to
 * WindowManager's own selector — it does NOT cause Window children to
 * re-render when dragging starts/stops.
 */
export default function WindowManager() {
  const windows = useWindowStore(useShallow(s => s.windows))

  // H3: resolve accentColor for the currently-dragging window here,
  // not inside each Window. activeDragWindowId changes only on drag
  // start/stop — not on every mousemove — so this is cheap.
  const activeDragWindowId = useSnapStore(s => s.activeDragWindowId)
  const dragAccentColor = (() => {
    if (!activeDragWindowId) return '#6366f1'
    const dragWin = windows.find(w => w.id === activeDragWindowId)
    return APP_REGISTRY[dragWin?.appId]?.accentColor ?? '#6366f1'
  })()

  const layer = document.getElementById('window-layer')
  if (!layer) return null

  const visibleWindows = [...windows]
    .filter(w => !w.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex)

  return createPortal(
    <>
      {/* H3: Single SnapPreviewOverlay instance for the entire window layer */}
      <SnapPreviewOverlay accentColor={dragAccentColor} />

      <AnimatePresence>
        {visibleWindows.map(win => (
          <Window key={win.id} win={win} />
        ))}
      </AnimatePresence>
    </>,
    layer
  )
}
