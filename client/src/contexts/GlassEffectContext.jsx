import { createContext, useContext, useMemo } from 'react'
import useOSStore from '@stores/osStore'

/**
 * GlassEffectContext — Computed glass/acrylic style tokens.
 *
 * Provides glass tokens to every surface that uses glassmorphism:
 * windows, taskbar, start menu, notifications, snap overlays, widgets.
 *
 * Architecture:
 *  - Single store read at the provider level
 *  - All consumers get pre-computed style objects — no per-component store reads
 *  - When transparency is disabled, all surfaces fall back to solid backgrounds
 *  - glassBlur (0–100) scales the blur intensity proportionally
 *
 * Usage:
 *   const glass = useGlassEffect('window')   // → { background, backdropFilter, border }
 *   const glass = useGlassEffect('taskbar')
 *   const glass = useGlassEffect('panel')
 *   const glass = useGlassEffect('toast')
 *   const glass = useGlassEffect('menu')
 *
 *   const backdrop = useGlassBackdrop(6)     // dim scrim behind modal overlays
 *   const { enabled, ...variants } = useOSAnimations()
 */

// ── Variant base tokens ──────────────────────────────────────────────────────
// These describe the "fully transparent, max blur" state.
// Actual values are modulated by transparency toggle and glassBlur setting.
const GLASS_VARIANTS = {
  window: {
    bgOpacity:     0.88,   // base rgba alpha for window backgrounds
    bgOpacitySolid: 0.97,  // when transparency is off
    blurBase:      32,     // px at 100% glassBlur
    saturation:    1.8,
    border:        'rgba(255,255,255,0.08)',
    borderFocused: 'rgba(255,255,255,0.12)',
  },
  taskbar: {
    bgOpacity:     0.82,
    bgOpacitySolid: 0.97,
    blurBase:      28,
    saturation:    1.8,
    border:        'rgba(255,255,255,0.06)',
    borderFocused: null,
  },
  panel: {
    bgOpacity:     0.94,
    bgOpacitySolid: 0.98,
    blurBase:      32,
    saturation:    2.0,
    border:        'rgba(255,255,255,0.09)',
    borderFocused: null,
  },
  toast: {
    bgOpacity:     0.95,
    bgOpacitySolid: 0.98,
    blurBase:      24,
    saturation:    1.8,
    border:        null,   // toast uses type-colored borders
    borderFocused: null,
  },
  menu: {
    bgOpacity:     0.92,
    bgOpacitySolid: 0.98,
    blurBase:      40,
    saturation:    2.0,
    border:        'rgba(255,255,255,0.08)',
    borderFocused: null,
  },
  chrome: {
    bgOpacity:     0.95,
    bgOpacitySolid: 0.98,
    blurBase:      12,
    saturation:    1.5,
    border:        null,
    borderFocused: null,
  },
}

// ── Compute glass style object for a variant ─────────────────────────────────
function computeGlass(variant, { transparency, glassBlur }) {
  const def = GLASS_VARIANTS[variant] ?? GLASS_VARIANTS.panel

  if (!transparency) {
    // Solid fallback — no blur, higher opacity
    return {
      background:         `rgba(10, 10, 20, ${def.bgOpacitySolid})`,
      backdropFilter:     'none',
      WebkitBackdropFilter: 'none',
      border:             def.border ? `1px solid ${def.border}` : undefined,
      _isTransparent:     false,
    }
  }

  // Scale blur: glassBlur 0–100 maps to 0–blurBase px
  const blurPx     = Math.round((glassBlur / 100) * def.blurBase)
  const saturate   = 1 + ((glassBlur / 100) * (def.saturation - 1))
  const filter     = blurPx > 0
    ? `blur(${blurPx}px) saturate(${saturate.toFixed(2)})`
    : 'none'

  return {
    background:           `rgba(10, 10, 20, ${def.bgOpacity})`,
    backdropFilter:       filter,
    WebkitBackdropFilter: filter,
    border:               def.border ? `1px solid ${def.border}` : undefined,
    _isTransparent:       true,
    _blurPx:              blurPx,
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
const GlassEffectContext = createContext({})

/**
 * GlassEffectProvider — wraps the desktop, precomputes all variant tokens.
 * Mount once in Desktop.jsx.
 */
export function GlassEffectProvider({ children }) {
  const transparency = useOSStore(s => s.transparency)
  const glassBlur    = useOSStore(s => s.glassBlur)

  const value = useMemo(() => {
    const params = { transparency, glassBlur }
    return {
      window:  computeGlass('window',  params),
      taskbar: computeGlass('taskbar', params),
      panel:   computeGlass('panel',   params),
      toast:   computeGlass('toast',   params),
      menu:    computeGlass('menu',    params),
      chrome:  computeGlass('chrome',  params),
      // Raw settings for consumers that need them
      isTransparent: transparency,
      blurScale:     glassBlur / 100,
    }
  }, [transparency, glassBlur])

  return (
    <GlassEffectContext.Provider value={value}>
      {children}
    </GlassEffectContext.Provider>
  )
}

/**
 * useGlassEffect — Hook for consuming glass tokens.
 *
 * @param {'window'|'taskbar'|'panel'|'toast'|'menu'|'chrome'} variant
 * @returns {{ background, backdropFilter, WebkitBackdropFilter, border }}
 */
export function useGlassEffect(variant = 'panel') {
  const ctx = useContext(GlassEffectContext)
  return ctx[variant] ?? ctx.panel ?? {}
}

/**
 * useGlassBackdrop — Hook for the full-screen dim scrim behind modal
 * overlays (Command Palette, Keyboard Shortcuts, etc).
 *
 * Phase 12C Part 3.
 *
 * The scrim's blur scales with glassBlur (capped at `maxBlurPx` at 100%),
 * matching the same proportional feel as the glass surfaces themselves.
 * When transparency is disabled, the scrim falls back to a flat dim
 * with no blur — consistent with how surfaces go solid.
 *
 * @param {number} maxBlurPx - scrim blur (px) at 100% glassBlur
 * @returns {{ background, backdropFilter, WebkitBackdropFilter }}
 */
export function useGlassBackdrop(maxBlurPx = 6) {
  const transparency = useOSStore(s => s.transparency)
  const glassBlur    = useOSStore(s => s.glassBlur)

  return useMemo(() => {
    if (!transparency) {
      return {
        background:           'rgba(0,0,0,0.7)',
        backdropFilter:       'none',
        WebkitBackdropFilter: 'none',
      }
    }

    const blurPx = Math.round((glassBlur / 100) * maxBlurPx)
    const filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none'

    return {
      background:           'rgba(0,0,0,0.48)',
      backdropFilter:       filter,
      WebkitBackdropFilter: filter,
    }
  }, [transparency, glassBlur, maxBlurPx])
}

/**
 * useOSAnimations — returns Framer Motion variants and transition configs
 * that respect the animationsEnabled setting.
 */
export function useOSAnimations() {
  const settingEnabled = useOSStore(s => s.animationsEnabled)

  // Also respect the OS-level prefers-reduced-motion media query.
  // Either the user's OS preference OR the in-app toggle disables animations.
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const enabled = settingEnabled && !prefersReduced

  return useMemo(() => ({
    enabled,

    // Spring config for window open/close
    windowSpring: enabled
      ? { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }
      : { duration: 0 },

    // Fast spring for UI elements (buttons, badges, etc.)
    uiSpring: enabled
      ? { type: 'spring', stiffness: 500, damping: 30 }
      : { duration: 0 },

    // Smooth ease for panels and menus
    panelEase: enabled
      ? { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
      : { duration: 0 },

    // Fade only (for overlays)
    fade: enabled
      ? { duration: 0.2 }
      : { duration: 0 },

    // Window entrance variants
    windowVariants: {
      initial: enabled ? { opacity: 0, scale: 0.92, y: 20 } : { opacity: 0 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit:    enabled ? { opacity: 0, scale: 0.88, y: 30 } : { opacity: 0 },
    },

    // Panel slide-up (start menu, notification center)
    slideUp: {
      initial: enabled ? { opacity: 0, y: 12, scale: 0.97 } : { opacity: 0 },
      animate: { opacity: 1, y: 0,  scale: 1 },
      exit:    enabled ? { opacity: 0, y: 12, scale: 0.96 } : { opacity: 0 },
    },

    // Toast slide-in from right
    toastSlide: {
      initial: enabled ? { opacity: 0, x: 64, scale: 0.95 } : { opacity: 0 },
      animate: { opacity: 1, x: 0,  scale: 1 },
      exit:    enabled ? { opacity: 0, x: 64, scale: 0.92 } : { opacity: 0 },
    },
  }), [enabled])
}

export default GlassEffectContext
