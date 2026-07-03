import { useEffect, useCallback } from 'react'
import useOSStore     from '@stores/osStore'
import useWindowStore from '@stores/windowStore'
import { APP_IDS }   from '@constants/appRegistry'

/**
 * useShortcuts — FuturOS keyboard shortcut manager.
 *
 * Architecture:
 *  - Single `keydown` listener registered at the App root via useShortcuts()
 *  - All handlers call store.getState() at invocation time — always fresh,
 *    never stale closures
 *  - useCallback([]) keeps the handler reference stable so the useEffect
 *    never re-registers the listener
 *
 * M3 fix (Phase 13A): the previous version called useOSStore() and
 * useWindowStore() as hooks at the top of the function, subscribing to
 * the entire store and causing App to re-render on every window
 * open/close/focus cycle. Those hook calls are now gone — the module-level
 * static imports remain (needed for .getState()) but the hook subscriptions
 * do not. Static imports here cause zero re-render overhead.
 *
 * To extend: add a case to the Ctrl or single-key switch blocks below.
 */
export function useShortcuts() {
  const handler = useCallback((e) => {
    const tag     = document.activeElement?.tagName?.toLowerCase()
    const inInput = tag === 'input' || tag === 'textarea'
      || document.activeElement?.isContentEditable

    // ── Global shortcuts (fire even inside inputs) ─────────────────
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      useOSStore.getState().toggleSearch()
      return
    }

    if (inInput) return

    // ── Ctrl combos ────────────────────────────────────────────────
    if (e.ctrlKey) {
      // Ctrl+Shift+R — Recruiter tour (open About, Projects, Terminal)
      if (e.shiftKey && e.key === 'R') {
        e.preventDefault()
        import('@hooks/useRecruiterMode').then(m => m.openRecruiterApps?.())
        return
      }

      // Ctrl+Shift+D — Download resume
      if (e.shiftKey && e.key === 'D') {
        e.preventDefault()
        import('@constants/actionsRegistry').then(m => m.executeAction('resume.download'))
        return
      }

      switch (e.key) {
        case '`':  // Ctrl+` → Terminal
          e.preventDefault()
          useWindowStore.getState().openWindow(APP_IDS.TERMINAL)
          return

        case 'w':  // Ctrl+W → Close focused window
          e.preventDefault()
          {
            const { activeWindowId, closeWindow } = useWindowStore.getState()
            if (activeWindowId) closeWindow(activeWindowId)
          }
          return

        case 'h':  // Ctrl+H → Minimize focused window
          e.preventDefault()
          {
            const { activeWindowId, minimizeWindow } = useWindowStore.getState()
            if (activeWindowId) minimizeWindow(activeWindowId)
          }
          return

        case '/':  // Ctrl+/ → Keyboard shortcuts overlay
          e.preventDefault()
          useOSStore.getState().toggleKeyboardOverlay()
          return

        case 'm':  // Ctrl+M → Minimize all windows
          e.preventDefault()
          useWindowStore.getState().minimizeAll()
          return

        default: break
      }
    }

    // ── Single-key shortcuts ───────────────────────────────────────
    switch (e.key) {
      case 'Escape': {
        // Cascade dismiss: search → keyboard overlay → start menu → notif center → context menu
        const s = useOSStore.getState()
        if (s.searchOpen)          { s.closeSearch();          return }
        if (s.keyboardOverlayOpen) { s.closeKeyboardOverlay(); return }
        if (s.startMenuOpen)       { s.closeStartMenu();       return }
        if (s.notifCenterOpen)     { s.closeNotifCenter();     return }
        if (s.contextMenu)         { s.hideContextMenu();      return }
        return
      }

      case '?':
        e.preventDefault()
        useOSStore.getState().toggleKeyboardOverlay()
        return

      case 'F11':
        e.preventDefault()
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen().catch(() => {})
        return

      default: break
    }
  }, []) // empty deps — handler uses getState(), never stale

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}
