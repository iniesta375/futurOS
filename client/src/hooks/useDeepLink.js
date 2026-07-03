/**
 * useDeepLink — handles ?app= URL parameters for PWA homescreen shortcuts.
 *
 * The web app manifest defines shortcuts like /?app=about which let users
 * launch directly into a specific app from the OS homescreen shortcut.
 * This hook reads the param once on mount, opens the app, and cleans the URL.
 *
 * Also handles /?tour=1 for recruiter referral links (e.g. in email signatures).
 *
 * Valid app param values match APP_IDS: about, projects, terminal, files,
 * browser, settings, contact.
 *
 * Called in DesktopWithNotifications (after desktop is mounted) so the
 * window store is ready to receive openWindow() calls.
 */

import { useEffect, useRef } from 'react'
import useWindowStore from '@stores/windowStore'
import useOSStore     from '@stores/osStore'
import { APP_IDS }   from '@constants/appRegistry'

const VALID_APP_IDS = new Set(Object.values(APP_IDS))

export function useDeepLink() {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const params = new URLSearchParams(window.location.search)

    // ?app=<appId> — open a specific app on load
    const appParam = params.get('app')
    if (appParam && VALID_APP_IDS.has(appParam)) {
      // Small delay to let Desktop fully mount before opening
      const t = setTimeout(() => {
        useWindowStore.getState().openWindow(appParam)
        // Clean the URL without a page reload
        const url = new URL(window.location.href)
        url.searchParams.delete('app')
        window.history.replaceState({}, '', url.pathname + (url.search || ''))
      }, 800)
      return () => clearTimeout(t)
    }

    // ?tour=1 — recruiter deep link (e.g. from email signature)
    const tourParam = params.get('tour')
    if (tourParam === '1') {
      const t = setTimeout(() => {
        const { openWindow } = useWindowStore.getState()
        openWindow(APP_IDS.ABOUT)
        setTimeout(() => openWindow(APP_IDS.PROJECTS), 300)
        setTimeout(() => openWindow(APP_IDS.TERMINAL), 600)

        const url = new URL(window.location.href)
        url.searchParams.delete('tour')
        window.history.replaceState({}, '', url.pathname + (url.search || ''))
      }, 800)
      return () => clearTimeout(t)
    }
  }, [])
}
