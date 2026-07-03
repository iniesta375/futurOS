import WallpaperLayer      from './WallpaperLayer'
import BrightnessOverlay   from './BrightnessOverlay'
import { GlassEffectProvider } from '@contexts/GlassEffectContext'

/**
 * DesktopEffectsLayer — Desktop visual effects wrapper.
 *
 * Single mount point for all desktop visual effects. Wraps the entire
 * Desktop content tree so:
 *  1. GlassEffectProvider  — makes glass tokens available to all children
 *  2. WallpaperLayer       — renders behind everything (zIndex 0)
 *  3. BrightnessOverlay    — renders above everything (zIndex 9999)
 *
 * Usage:
 *   <DesktopEffectsLayer>
 *     {all desktop content, windows, taskbar, overlays}
 *   </DesktopEffectsLayer>
 *
 * Effects are co-located here, not scattered across Desktop.jsx.
 * GlassEffectProvider is guaranteed to wrap all glass surface consumers.
 * Wallpaper and Brightness are siblings of content — not nested inside it —
 * avoiding unnecessary re-render cascades.
 */
export default function DesktopEffectsLayer({ children }) {
  return (
    <GlassEffectProvider>
      {/* Wallpaper behind everything */}
      <WallpaperLayer />

      {/* Desktop content — icons, windows, taskbar, overlays */}
      {children}

      {/* Brightness overlay — always on top, above windows and overlays */}
      <BrightnessOverlay />
    </GlassEffectProvider>
  )
}
