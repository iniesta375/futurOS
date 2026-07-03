/**
 * useRecruiterMode — Phase 13C Recruiter Onboarding
 *
 * Fires once on first visit (localStorage flag). Shows a welcome notification
 * with a "Start Tour" action that opens About Me → Projects → Terminal in
 * sequence, giving recruiters an immediate curated experience.
 *
 * Keyboard shortcut: Ctrl+Shift+R — opens the three core apps at any time.
 *
 * Design choices:
 *  - Lightweight: no new UI components. Uses the existing notificationStore.
 *  - Non-intrusive: 2s delay so the boot sequence completes first.
 *  - Idempotent: firedRef + localStorage prevent repeat fires.
 *  - The shortcut works every session (not gated on first-run).
 */

import { useEffect, useRef } from 'react'
import useNotificationStore from '@stores/notificationStore'
import useWindowStore       from '@stores/windowStore'
import useOSStore           from '@stores/osStore'
import { APP_IDS }          from '@constants/appRegistry'
import { Analytics }        from '@utils/analytics'

const FIRST_RUN_KEY = 'futuros-recruiter-welcomed'

export function openRecruiterApps() {
  Analytics.recruiterTour()

  const { openWindow } = useWindowStore.getState()

  // Stagger opens so windows don't all land on top of each other
  openWindow(APP_IDS.ABOUT)

  setTimeout(() => {
    openWindow(APP_IDS.PROJECTS)
  }, 300)

  setTimeout(() => {
    openWindow(APP_IDS.TERMINAL)
  }, 600)

  useNotificationStore.getState().notify({
    type:    'success',
    title:   'Welcome to FuturOS',
    message: "Here's a quick tour of my portfolio OS. Explore freely!",
    appIcon: '✦',
    appId:   'system',
    duration: 7000,
  })
}

export function useRecruiterMode() {
  const firedRef = useRef(false)

  // First-run welcome notification
  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const alreadyWelcomed = localStorage.getItem(FIRST_RUN_KEY)
    if (alreadyWelcomed) return

    const timer = setTimeout(() => {
      localStorage.setItem(FIRST_RUN_KEY, '1')

      useNotificationStore.getState().notify({
        type:    'info',
        title:   '👋 Welcome, Recruiter!',
        message: "Press Ctrl+Shift+R for a guided tour, or explore freely.",
        appIcon: '✦',
        appId:   'system',
        duration: 10000,
        action: {
          label: 'Start Tour',
          run:   openRecruiterApps,
        },
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Ctrl+Shift+R shortcut — works every session
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        openRecruiterApps()
        Analytics.shortcutUsed('Ctrl+Shift+R')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
