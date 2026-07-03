import { useEffect } from 'react'

/**
 * useFocusTrap — Phase 13B Accessibility
 *
 * Traps keyboard focus inside a ref element while active.
 * When the overlay opens, focus is moved to the first focusable child.
 * Tab/Shift+Tab cycle within the trap. Escape is handled by the caller
 * (each overlay already listens for Escape via useClickOutside or its
 * own keydown handler).
 *
 * Used by: GlobalSearch, KeyboardOverlay, NotificationCenter, StartMenu.
 *
 * @param {React.RefObject} ref - Container to trap focus within
 * @param {boolean} active - Whether the trap is active
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return

    const container = ref.current
    const focusable = () => Array.from(container.querySelectorAll(FOCUSABLE))

    // Move focus into the container on open
    const first = focusable()[0]
    first?.focus()

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const nodes = focusable()
      if (!nodes.length) { e.preventDefault(); return }

      const firstEl = nodes[0]
      const lastEl  = nodes[nodes.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if at first, wrap to last
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        // Tab: if at last, wrap to first
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [ref, active])
}
