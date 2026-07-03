import { useCallback, useRef, useEffect } from 'react'
import useSnapStore from '@stores/snapStore'
import useWindowStore from '@stores/windowStore'
import {
  SNAP_ZONE,
  detectSnapZone,
  getSnapGeometry,
  SNAP_COMPLEMENTS,
} from '@constants/snapConstants'

/**
 * useSnapEngine — Phase 12.5 updated (H2: cancellable snap-assist timer)
 *
 * Changes from Phase 12C:
 *  - assistTimerRef stores the pending showSnapAssist timeout handle
 *  - A useEffect cleanup cancels it if the component (Window) unmounts
 *    before the 350ms fires — prevents stale Snap Assist UI appearing
 *    after a window is closed mid-drag-or-snap
 *  - cancelAssistTimer() is also called at the start of each new drag
 *    so a rapid snap → drag cancels any queued assist from the previous snap
 *
 * @param {string} windowId — the window this engine controls
 */
export function useSnapEngine(windowId) {
  // Use getState() for all store interactions — this hook is called inside
  // Window and we don't want drag frame updates re-triggering subscriptions.
  // Actions are stable references from getState() so useCallback([]) is safe.
  const preDragRef    = useRef(null)
  const assistTimerRef = useRef(null)
  // Cancel the pending assist timer (called on new drag start AND on unmount)
  const cancelAssistTimer = useCallback(() => {
    if (assistTimerRef.current !== null) {
      clearTimeout(assistTimerRef.current)
      assistTimerRef.current = null
    }
  }, [])

  // Cleanup on unmount — prevents stale Snap Assist if window closes mid-snap
  useEffect(() => () => cancelAssistTimer(), [cancelAssistTimer])

  // ── Drag start ─────────────────────────────────────────────────────────
  const onDragStart = useCallback(() => {
    cancelAssistTimer()
    const win = useWindowStore.getState().getWindow(windowId)
    if (win) {
      preDragRef.current = {
        position: { ...win.position },
        size:     { ...win.size },
      }
    }
    useSnapStore.getState().startDrag(windowId)
    document.body.classList.add('dragging')
  }, [windowId, cancelAssistTimer])

  // ── Drag move — equality-guarded inside snapStore ──────────────────────
  const onDrag = useCallback((_e, d) => {
    const zone = detectSnapZone(d.x, d.y)
    useSnapStore.getState().updateDragZone(zone)
  }, [])

  // ── Drag stop ──────────────────────────────────────────────────────────
  const onDragStop = useCallback((_e, d) => {
    document.body.classList.remove('dragging')
    const zone = detectSnapZone(d.x, d.y)
    useSnapStore.getState().endDrag()

    if (zone && zone !== SNAP_ZONE.NONE) {
      const geo = getSnapGeometry(zone)
      if (geo) {
        const win = useWindowStore.getState().getWindow(windowId)
        const preSnapPosition = win?.snapZone
          ? win.preMaximizePosition ?? win.position
          : (preDragRef.current?.position ?? win?.position)
        const preSnapSize = win?.snapZone
          ? win.preMaximizeSize ?? win.size
          : (preDragRef.current?.size ?? win?.size)

        useWindowStore.getState().setWindowGeometry(windowId, {
          position:            { x: geo.x, y: geo.y },
          size:                { width: geo.width, height: geo.height },
          snapZone:            zone,
          preMaximizePosition: preSnapPosition,
          preMaximizeSize:     preSnapSize,
        })

        const complements = SNAP_COMPLEMENTS[zone]
        if (complements?.length) {
          assistTimerRef.current = setTimeout(() => {
            assistTimerRef.current = null
            useSnapStore.getState().showSnapAssist(windowId, complements)
          }, 350)
        }
      }
      return
    }

    // Free drop
    useWindowStore.getState().setWindowGeometry(windowId, {
      position: { x: d.x, y: d.y },
      snapZone: null,
    })
  }, [windowId])

  return { onDragStart, onDrag, onDragStop }
}

/**
 * useSnapRestore — un-snaps a window back to pre-snap geometry.
 */
export function useSnapRestore() {
  return useCallback((windowId) => {
    const { getWindow, setWindowGeometry } = useWindowStore.getState()
    const win = getWindow(windowId)
    if (!win || !win.snapZone) return

    setWindowGeometry(windowId, {
      position:            win.preMaximizePosition ?? win.position,
      size:                win.preMaximizeSize     ?? win.size,
      snapZone:            null,
      preMaximizePosition: null,
      preMaximizeSize:     null,
    })
  }, [])
}
