import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import PostScreen from './PostScreen'
import LogoScreen from './LogoScreen'
import LockClock from './LockClock'
import LoginScreen from './LoginScreen'
import { WALLPAPERS } from '@constants/os'
import useOSStore from '@stores/osStore'

/**
 * Sub-phases of the boot sequence:
 *   post  → BIOS / POST terminal output
 *   logo  → FuturOS logo + progress bar
 *   lock  → Full-screen clock (lock screen)
 *   login → Login card with PIN input
 *
 * Phase 14: returning visitors (localStorage flag set) skip directly to
 * the login screen to avoid the ~8-second first-boot sequence on repeat
 * visits. First-time visitors still see the full sequence — it's a
 * meaningful first impression. The Skip button on the PIN screen remains
 * for anyone who wants to bypass login immediately.
 */
const RETURNING_KEY = 'futuros-has-booted-v1'

function isReturningVisitor() {
  try { return !!localStorage.getItem(RETURNING_KEY) }
  catch { return false }
}

function markAsReturning() {
  try { localStorage.setItem(RETURNING_KEY, '1') } catch { /* ok */ }
}

export default function BootSequence() {
  // Returning visitors start at 'login' — skip post + logo + lock
  const [subPhase, setSubPhase] = useState(
    isReturningVisitor() ? 'login' : 'post'
  )
  const wallpaper = useOSStore(s => s.wallpaper)
  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0]

  // Auto-advance from POST → logo after 1.8s (or skip on click)
  useEffect(() => {
    if (subPhase !== 'post') return
    const t = setTimeout(() => setSubPhase('logo'), 1800)
    return () => clearTimeout(t)
  }, [subPhase])

  // Mark as returning after POST so next visit skips
  useEffect(() => {
    if (subPhase === 'logo') markAsReturning()
  }, [subPhase])

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <AnimatePresence mode="wait">
        {subPhase === 'post' && (
          <PostScreen
            key="post"
            onDone={() => setSubPhase('logo')}
          />
        )}

        {subPhase === 'logo' && (
          <LogoScreen
            key="logo"
            onDone={() => setSubPhase('lock')}
          />
        )}

        {subPhase === 'lock' && (
          <LockClock
            key="lock"
            wallpaper={currentWallpaper}
            onUnlock={() => setSubPhase('login')}
          />
        )}

        {subPhase === 'login' && (
          <LoginScreen key="login" />
        )}
      </AnimatePresence>
    </div>
  )
}
