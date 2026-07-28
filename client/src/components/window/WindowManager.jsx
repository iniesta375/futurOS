import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import useWindowStore from '@stores/windowStore'
import useSnapStore from '@stores/snapStore'
import APP_REGISTRY from '@constants/appRegistry'
import Window from './Window'
import SnapPreviewOverlay from '@components/snap/SnapPreviewOverlay'


export default function WindowManager() {
  const windows = useWindowStore(useShallow(s => s.windows))

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
