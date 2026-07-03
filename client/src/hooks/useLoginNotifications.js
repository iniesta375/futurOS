/**
 * useLoginNotifications.js — Phase 12.5 (H5: consolidated notification seeder)
 *
 * Previously two hooks existed:
 *   - useLoginNotifications (simple, 5 static messages) — was wired in App.jsx
 *   - useNotifications (richer, time-aware, window tracking) — was never wired
 *
 * Decision: keep the richer logic from useNotifications.js, expose it under
 * the name App.jsx already uses (useLoginNotifications), delete the old file.
 * useNotifications.js is now dead code and will be removed in Phase 13.
 *
 * Changes:
 *  - Greeting is time-of-day aware (morning / afternoon / evening)
 *  - Uses notificationStore.notify() exclusively (no osStore.addNotification)
 *  - firedRef prevents double-fire in React StrictMode
 *  - All timers are stored and cancelled on unmount (memory-leak fix)
 */

import { useEffect, useRef } from 'react'
import useNotificationStore from '@stores/notificationStore'
import useOSStore from '@stores/osStore'

function buildSeedSequence(userName) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening'

  return [
    {
      delay: 600,
      payload: {
        type: 'success',
        title: `${greeting}, ${userName}`,
        message: 'FuturOS initialized. All services running.',
        appIcon: '🖥️',
        appId: 'system',
        duration: 6000,
      },
    },
    {
      delay: 2400,
      payload: {
        type: 'info',
        title: 'Tip: Command Palette',
        message: 'Press Ctrl+K anywhere to search apps, files, and actions instantly.',
        appIcon: '⌨️',
        appId: 'system',
        duration: 7000,
        action: {
          label: 'Try it',
          run: () => useOSStore.getState().toggleSearch(),
        },
      },
    },
    {
      delay: 4500,
      payload: {
        type: 'app',
        title: 'Projects loaded',
        message: '6 portfolio projects indexed and ready to explore.',
        appIcon: '📁',
        appId: 'projects',
        duration: 5000,
        silent: true,
      },
    },
    {
      delay: 6200,
      payload: {
        type: 'system',
        title: 'FuturOS v1.0.0 — Portfolio Edition',
        message: 'Built with React 18, Vite 5, Tailwind CSS v4, Framer Motion.',
        appIcon: '✦',
        appId: 'system',
        duration: 5000,
        silent: true,
      },
    },
    {
      delay: 8500,
      payload: {
        type: 'info',
        title: 'Keyboard shortcuts available',
        message: 'Press ? or Ctrl+/ for a full shortcut reference.',
        appIcon: '⌨️',
        appId: 'system',
        duration: 5500,
        action: {
          label: 'Show',
          run: () => useOSStore.getState().toggleKeyboardOverlay(),
        },
      },
    },
  ]
}

export function useLoginNotifications() {
  const firedRef = useRef(false)

  useEffect(() => {
    // Only seed once per session (also guards React StrictMode double-invoke)
    if (firedRef.current) return
    firedRef.current = true

    const userName = useOSStore.getState().userName
    const sequence = buildSeedSequence(userName)

    // Store all timer handles so we can cancel on unmount
    const timers = sequence.map(({ delay, payload }) =>
      setTimeout(() => {
        useNotificationStore.getState().notify(payload)
      }, delay)
    )

    // Cleanup: cancel any pending timers if component unmounts early
    return () => timers.forEach(clearTimeout)
  }, [])
}
