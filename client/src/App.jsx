import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useOSStore from '@stores/osStore'
import { useShortcuts } from '@hooks/useShortcuts'
import { useLoginNotifications } from '@hooks/useLoginNotifications'
import { useRecruiterMode }      from '@hooks/useRecruiterMode'
import { useDeepLink }           from '@hooks/useDeepLink'
import { GlobalErrorBoundary }   from '@components/error/ErrorBoundary'
import MobileLanding             from '@components/onboarding/MobileLanding'
import BootSequence from '@components/boot/BootSequence'

const Desktop = lazy(() => import('@components/desktop/Desktop'))

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

/**
 * useIsMobile — detects screens below 768px with live resize tracking.
 *
 * Phase 14: the OS UI is fundamentally a desktop experience — window
 * management, drag-resize, taskbar — none of which translate well to
 * a 375px phone screen. On mobile we show a focused landing page instead.
 * A "View Desktop" button lets curious visitors override the gate.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

/**
 * useAccentColorSync — Phase 12.5 (C2) and syncs it to the CSS custom property
 * --color-accent on :root so every surface using var(--color-accent) reacts
 * live when the user changes the accent in Settings → Appearance.
 *
 * Mounted at the App root so it runs before any child renders, ensuring
 * the CSS variable is always in sync with the store on initial load too
 * (persisted value from localStorage is applied before the first paint).
 *
 * We subscribe with a fine-grained selector (s => s.accentColor) so this
 * effect only re-runs on color changes — not on any other osStore update.
 */
function useAccentColorSync() {
  const accentColor = useOSStore(s => s.accentColor)

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor)

    // Derive a slightly lighter "bright" variant for active states
    // (glass glow, focused borders) — simple lightening via opacity on white
    // We set a second variable so consumers can opt into the lighter tone
    document.documentElement.style.setProperty('--color-accent-bright', accentColor)
  }, [accentColor])
}

function DesktopWithNotifications() {
  useLoginNotifications()
  useRecruiterMode()
  useDeepLink()

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center"
             style={{ background: 'var(--color-os-bg)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.2)',
            borderTopColor: 'var(--color-accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      }
    >
      <Desktop />
    </Suspense>
  )
}

export default function App() {
  const bootPhase = useOSStore(s => s.bootPhase)
  useShortcuts()
  useAccentColorSync()

  const isMobile     = useIsMobile()
  const [forceDesktop, setForceDesktop] = useState(false)

  // Show mobile landing on phones unless user explicitly chose desktop
  if (isMobile && !forceDesktop) {
    return (
      <GlobalErrorBoundary>
        <MobileLanding onViewDesktop={() => setForceDesktop(true)} />
      </GlobalErrorBoundary>
    )
  }

  return (
    <GlobalErrorBoundary>
      <div className="fixed inset-0 overflow-hidden"
           style={{ fontFamily: 'var(--font-ui)', background: 'var(--color-os-bg)' }}>
        <AnimatePresence mode="wait">
          {(bootPhase === 'boot' || bootPhase === 'login') && (
            <motion.div key="boot-sequence" {...fadeVariants} className="fixed inset-0">
              <BootSequence />
            </motion.div>
          )}
          {bootPhase === 'desktop' && (
            <motion.div key="desktop" {...fadeVariants} className="fixed inset-0">
              <DesktopWithNotifications />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlobalErrorBoundary>
  )
}
