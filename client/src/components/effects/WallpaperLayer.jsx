import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOSStore from '@stores/osStore'
import { WALLPAPERS } from '@constants/os'

/**
 * WallpaperLayer — Desktop wallpaper renderer.
 *
 * Features:
 *  - Crossfade animation on wallpaper change (duration from
 *    osStore.wallpaperCrossfade in ms)
 *  - Wallpaper dim overlay (osStore.wallpaperDim 0–80) dims the wallpaper
 *    without affecting the UI layer above it
 *  - Blur toggle (osStore.wallpaperBlur) applies backdrop blur and
 *    brightness reduction to the wallpaper
 *
 * Layer stack (bottom → top):
 *   1. Previous wallpaper (fades out, z=0)
 *   2. New wallpaper (fades in, z=1)
 *   3. Wallpaper dim overlay (z=2, pointerEvents:none)
 *   4. Ambient orbs (z=3)
 *   5. Noise grain (z=4)
 *   6. Bottom taskbar fade (z=5)
 */

function WallpaperBase({ wallpaper, blur }) {
  const bgStyle = wallpaper.type === 'css'
    ? { background: wallpaper.value }
    : {
        backgroundImage:    `url(${wallpaper.value})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
      }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        ...bgStyle,
        filter: blur ? 'blur(6px) brightness(0.82)' : 'none',
        // Slight scale-up when blurred so edges don't show
        transform: blur ? 'scale(1.04)' : 'scale(1)',
        transition: 'filter 0.5s ease, transform 0.5s ease',
      }}
    />
  )
}

export default function WallpaperLayer() {
  const wallpaperKey    = useOSStore(s => s.wallpaper)
  const wallpaperBlur   = useOSStore(s => s.wallpaperBlur)
  const wallpaperDim    = useOSStore(s => s.wallpaperDim)
  const crossfadeMs     = useOSStore(s => s.wallpaperCrossfade ?? 700)
  const accentColor     = useOSStore(s => s.accentColor)

  const current = useMemo(
    () => WALLPAPERS.find(w => w.id === wallpaperKey) || WALLPAPERS[0],
    [wallpaperKey]
  )

  // Dim opacity: 0 at wallpaperDim=0, 0.8 at wallpaperDim=80
  const dimOpacity = wallpaperDim / 100

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Wallpaper base with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={wallpaperKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: crossfadeMs / 1000, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          <WallpaperBase wallpaper={current} blur={wallpaperBlur} />
        </motion.div>
      </AnimatePresence>

      {/* Wallpaper dim overlay — dims the wallpaper independently of brightness */}
      {dimOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: '#000',
            opacity: dimOpacity,
            pointerEvents: 'none',
            transition: 'opacity 300ms ease',
          }}
        />
      )}

      {/* Ambient orbs — large soft glows for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800, height: 800,
          top: '-15%', left: '-10%',
          zIndex: 3,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow-pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600, height: 600,
          bottom: '5%', right: '5%',
          zIndex: 3,
          background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-pulse 11s ease-in-out infinite 2s',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          top: '40%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 3,
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'glow-pulse 14s ease-in-out infinite 4s',
        }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Bottom fade into taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 5,
          height: 160,
          background: 'linear-gradient(to top, rgba(8,8,15,0.65) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
