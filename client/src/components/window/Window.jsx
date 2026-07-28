import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Rnd } from 'react-rnd'
import useWindowStore from '@stores/windowStore'
import WindowChrome from './WindowChrome'
import AppRenderer from './AppRenderer'
import APP_REGISTRY from '@constants/appRegistry'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'
import { useSnapEngine } from '@hooks/useSnapEngine'
import { WindowErrorBoundary } from '@components/error/ErrorBoundary'

const TASKBAR_H = 52


export default function Window({ win }) {
  const focusWindow      = useWindowStore(s => s.focusWindow)
  const closeWindow      = useWindowStore(s => s.closeWindow)
  const minimizeWindow   = useWindowStore(s => s.minimizeWindow)
  const toggleMaximize   = useWindowStore(s => s.toggleMaximize)
  const setWindowGeometry = useWindowStore(s => s.setWindowGeometry)

  const { onDragStart, onDrag, onDragStop } = useSnapEngine(win.id)

  const app         = APP_REGISTRY[win.appId]
  const glass       = useGlassEffect('window')
  const accentColor = app?.accentColor || '#6366f1'

  const { enabled, windowVariants, panelEase } = useOSAnimations()

  const maxW = window.innerWidth
  const maxH = window.innerHeight - TASKBAR_H

  const rndPosition = win.isMaximized ? { x: 0, y: 0 } : { x: win.position.x, y: win.position.y }
  const rndSize     = win.isMaximized ? { width: maxW, height: maxH } : { width: win.size.width, height: win.size.height }

  console.log({
  id: win.id,
  isMaximized: win.isMaximized,
  rndPosition,
  rndSize,
  maxW,
  maxH,
})

  const handleFocus    = useCallback(() => { if (!win.isFocused) focusWindow(win.id) }, [win.id, win.isFocused, focusWindow])
  const handleClose = useCallback(() => {
  console.log("handleClose fired:", win.id)

  closeWindow(win.id)
}, [win.id, closeWindow])
  const handleMinimize = useCallback(() => minimizeWindow(win.id), [win.id, minimizeWindow])
  const handleMaximize = useCallback(() => toggleMaximize(win.id), [win.id, toggleMaximize])

  const handleDragStart = useCallback((_e, _d) => {
    focusWindow(win.id)
    onDragStart()
  }, [win.id, focusWindow, onDragStart])

  const handleDrag     = useCallback((_e, d) => onDrag(_e, d),    [onDrag])
  const handleDragStop = useCallback((_e, d) => onDragStop(_e, d), [onDragStop])

  const handleResizeStop = useCallback((_e, _dir, ref, _delta, position) => {
    setWindowGeometry(win.id, {
      size:     { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height) },
      position,
      snapZone: null,
    })
  }, [win.id, setWindowGeometry])

  if (win.isMinimized) return null



  return (
    <motion.div
      key={win.id}
      variants={windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: win.zIndex,
      }}
    >
      <Rnd
        key={`${win.id}-${win.isMaximized}`}
        position={rndPosition}
        size={rndSize}
        minWidth={win.minSize.width}
        minHeight={win.minSize.height}
        maxWidth={win.isMaximized  ? maxW : undefined}
        maxHeight={win.isMaximized ? maxH : undefined}
        bounds="parent"
        dragHandleClassName="window-drag-handle"
        cancel=".no-drag"
        disableDragging={win.isMaximized}
        enableResizing={!win.isMaximized}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={handleFocus}
        resizeHandleStyles={{
          bottom:      { cursor: 's-resize',  height: 8,  bottom: -4             },
          top:         { cursor: 'n-resize',  height: 8,  top: -4                },
          left:        { cursor: 'w-resize',  width: 8,   left: -4               },
          right:       { cursor: 'e-resize',  width: 8,   right: -4              },
          bottomRight: { cursor: 'se-resize', width: 14, height: 14, bottom: -4, right: -4 },
          bottomLeft:  { cursor: 'sw-resize', width: 14, height: 14, bottom: -4, left: -4  },
          topRight:    { cursor: 'ne-resize', width: 14, height: 14, top: -4,    right: -4 },
          topLeft:     { cursor: 'nw-resize', width: 14, height: 14, top: -4,    left: -4  },
        }}
        style={{ pointerEvents: 'auto' }}
      >
      <WindowErrorBoundary
        appId={win.appId}
        windowId={win.id}
        appTitle={app?.title || win.appId}
        onClose={handleClose}
        onRestart={() => handleClose()}
      >
        <div
          style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            background:           win.isMaximized ? 'rgba(10,10,20,0.97)' : glass.background,
            backdropFilter:       glass.backdropFilter,
            WebkitBackdropFilter: glass.WebkitBackdropFilter,
            border: win.isMaximized
              ? 'none'
              : `1px solid ${win.isFocused ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: win.isMaximized ? 0 : 12,
            boxShadow: win.isMaximized
              ? 'none'
              : win.isFocused
                ? `0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px ${accentColor}0a`
                : '0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
            overflow: 'hidden',
            transition: enabled
              ? 'border-color 0.2s, box-shadow 0.25s, border-radius 0.25s'
              : 'none',
          }}
        >
          {win.isFocused && !win.isMaximized && (
            <div style={{
              position: 'absolute',
              top: 0, left: '15%', right: '15%', height: 1,
              background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
              pointerEvents: 'none', zIndex: 1,
            }} />
          )}

          <WindowChrome
            win={win}
            isFocused={win.isFocused}
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
          />

          <div
            className="flex-1 overflow-hidden relative"
            style={{ borderRadius: win.isMaximized ? 0 : '0 0 12px 12px' }}
            onMouseDown={handleFocus}
          >
            {!win.isFocused && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.12)',
                pointerEvents: 'none', zIndex: 20,
                borderRadius: win.isMaximized ? 0 : '0 0 12px 12px',
                transition: enabled ? 'background 0.2s' : 'none',
              }} />
            )}
            <AppRenderer win={win} />
          </div>
        </div>
      </WindowErrorBoundary>
      </Rnd>
    </motion.div>
  )
}
