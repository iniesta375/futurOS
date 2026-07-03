import { useEffect, useRef } from 'react'
import useOSStore from '@stores/osStore'

/**
 * BrightnessOverlay — Full-screen brightness dimming layer.
 *
 * Dims the entire OS when brightness < 100 (osStore.brightness).
 *
 * Design decisions:
 *  - Uses CSS `opacity` on an rgba div (not filter:brightness) so it dims
 *    everything uniformly including windows, taskbar, and overlays
 *  - `pointerEvents: 'none'` — never intercepts mouse/touch events
 *  - `will-change: opacity` enables GPU compositing of the overlay layer
 *  - CSS transition (not Framer Motion) because this updates on every
 *    slider drag — RAF-based transitions would be overkill
 *  - Renders null at full brightness (no DOM node, zero cost)
 *  - zIndex 9999 — above all app layers including snap overlays
 *
 * Brightness range: 10–100 (enforced by osStore.setBrightness)
 *   100 → opacity 0.000 (invisible)
 *    10 → opacity 0.810 (very dark)
 *
 * This component is mounted in DesktopEffectsLayer and should not
 * be imported elsewhere.
 */
export default function BrightnessOverlay() {
  const brightness = useOSStore(s => s.brightness)

  // Quadratic easing gives a more perceptually linear dimming curve.
  // Linear mapping would make the 90–100 range feel too flat.
  const normalized = (100 - brightness) / 90            // 0 at 100%, 1 at 10%
  const opacity    = Math.max(0, Math.min(0.9, normalized * normalized * 0.9))

  // Skip rendering at full brightness — no DOM cost
  if (opacity <= 0.001) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9999,
        pointerEvents: 'none',
        userSelect:    'none',
        background:    '#000',
        opacity:       opacity,
        willChange:    'opacity',
        transition:    'opacity 80ms linear',
      }}
    />
  )
}
