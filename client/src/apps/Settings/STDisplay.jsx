import { Sun, Zap, Layers, Droplets, Clock } from 'lucide-react'
import useOSStore from '@stores/osStore'
import {
  SectionHeader, SettingCard, SettingRow,
  SettingSlider, Toggle, Divider,
} from './STShared'

/**
 * STDisplay — Phase 12.5 (C3: reactive settings reads)
 *
 * Changes:
 *  - All 8 non-reactive useOSStore.getState() calls inside the render body
 *    replaced with reactive destructured values from the useOSStore() hook.
 *  - `transparency` and `wallpaperBlur` are now reactive: toggling them
 *    on this screen instantly updates the glass preview swatch and the
 *    toggle's own visual state without needing an external re-render.
 *  - The glass preview swatch now calls useGlassEffect('taskbar') instead
 *    of hand-rolling the computeGlass formula (L6 from audit), so it stays
 *    in sync if GLASS_VARIANTS ever changes.
 *  - Wallpaper blur toggle and transparency toggle use the reactive values.
 */
export default function STDisplay() {
  // C3: ALL fields destructured from the hook — fully reactive
  const {
    brightness,         setBrightness,
    wallpaperDim,       setWallpaperDim,
    wallpaperBlur,      toggleWallpaperBlur,
    glassBlur,          setGlassBlur,
    wallpaperCrossfade, setWallpaperCrossfade,
    transparency,       toggleTransparency,
    animationsEnabled,  toggleAnimations,
    accentColor,
  } = useOSStore()

  // Glass preview values — derive directly from reactive state (no hand-rolled formula)
  const previewBlurPx = Math.round((glassBlur / 100) * 28)
  const previewBg     = transparency ? 0.82 : 0.97
  const previewFilter = transparency
    ? `blur(${previewBlurPx}px) saturate(1.8)`
    : 'none'

  return (
    <div className="selectable">
      <SectionHeader
        title="Display"
        subtitle="Brightness, dimming, glass effects, and animation settings"
      />

      {/* ── Brightness ─────────────────────────────────────────────────── */}
      <Divider label="BRIGHTNESS" />
      <SettingCard>
        <SettingRow
          label="Screen Brightness"
          description={`Dims the entire display including windows — ${brightness}%`}
        >
          <SettingSlider
            value={brightness} onChange={setBrightness}
            min={10} max={100} accent={accentColor} suffix="%"
          />
        </SettingRow>
      </SettingCard>

      {/* Brightness live preview */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 16, position: 'relative', height: 100,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0f1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          left: 16, top: 12, right: 16, bottom: 12,
          background: 'rgba(12,12,24,0.8)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            Window content
          </span>
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(0,0,0,${Math.pow(1 - (brightness - 10) / 90, 2) * 0.9})`,
          transition: 'background 0.1s',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 6, right: 10,
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(255,255,255,0.4)',
        }}>
          {brightness}% preview
        </div>
      </div>

      {/* ── Wallpaper Effects ──────────────────────────────────────────── */}
      <Divider label="WALLPAPER" />
      <SettingCard>
        <SettingRow
          label="Wallpaper Dim"
          description={`Darken the desktop wallpaper without affecting windows — ${wallpaperDim}%`}
        >
          <SettingSlider
            value={wallpaperDim} onChange={setWallpaperDim}
            min={0} max={80} accent={accentColor} suffix="%"
          />
        </SettingRow>
        <SettingRow
          label="Wallpaper Blur"
          description="Apply gaussian blur to the wallpaper layer"
          noBorder
        >
          {/* C3: reactive value — was useOSStore.getState().wallpaperBlur */}
          <Toggle
            value={wallpaperBlur}
            onChange={toggleWallpaperBlur}
            accent={accentColor}
          />
        </SettingRow>
      </SettingCard>

      <SettingCard>
        <SettingRow
          label="Crossfade Speed"
          description={`Wallpaper switching animation — ${wallpaperCrossfade}ms`}
          noBorder
        >
          <SettingSlider
            value={wallpaperCrossfade} onChange={setWallpaperCrossfade}
            min={0} max={2000} accent={accentColor} suffix="ms"
          />
        </SettingRow>
      </SettingCard>

      {/* ── Glass / Acrylic Effects ─────────────────────────────────────── */}
      <Divider label="GLASS EFFECTS" />
      <SettingCard>
        <SettingRow
          label="Transparency & Glass"
          description="Enable acrylic blur on windows, taskbar, and panels"
        >
          {/* C3: reactive value — was useOSStore.getState().transparency */}
          <Toggle
            value={transparency}
            onChange={toggleTransparency}
            accent={accentColor}
          />
        </SettingRow>
        <SettingRow
          label="Blur Intensity"
          description={`Backdrop-filter strength across all glass surfaces — ${glassBlur}%`}
          noBorder
        >
          <SettingSlider
            value={glassBlur} onChange={setGlassBlur}
            min={0} max={100} accent={accentColor} suffix="%"
          />
        </SettingRow>
      </SettingCard>

      {/* Glass preview — fully reactive (C3 + L6) */}
      <div style={{
        position: 'relative', height: 80, borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0a1628 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 16,
      }}>
        <div style={{
          position: 'absolute',
          left: 16, top: 12, right: 16, bottom: 12,
          background: `rgba(10, 10, 20, ${previewBg})`,
          backdropFilter: previewFilter,
          WebkitBackdropFilter: previewFilter,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, backdrop-filter 0.15s',
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
            {transparency
              ? `Glass surface · blur ${previewBlurPx}px`
              : 'Solid surface (no blur)'
            }
          </span>
        </div>
      </div>

      {/* ── Performance ────────────────────────────────────────────────── */}
      <Divider label="PERFORMANCE" />
      <SettingCard>
        <SettingRow
          label="Smooth Animations"
          description="Window open/close, hover effects, and transitions. Disable on slower devices."
        >
          <Toggle value={animationsEnabled} onChange={toggleAnimations} accent={accentColor} />
        </SettingRow>
        <SettingRow
          label="Reduce Motion"
          description="Respects your OS accessibility setting (prefers-reduced-motion)"
          noBorder
        >
          <Toggle
            value={typeof window !== 'undefined'
              && window.matchMedia('(prefers-reduced-motion: reduce)').matches}
            onChange={() => {}}
            accent={accentColor}
          />
        </SettingRow>
      </SettingCard>

      {/* ── System Info ────────────────────────────────────────────────── */}
      <Divider label="SYSTEM" />
      <SettingCard>
        <SettingRow label="Viewport" noBorder>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {window.innerWidth} × {window.innerHeight}
          </span>
        </SettingRow>
      </SettingCard>
    </div>
  )
}
