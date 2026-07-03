import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * useOSStore — Single source of truth for OS-level appearance, effects,
 * and UI overlay state.
 *
 * Fields owned here (authoritative, no other store duplicates these):
 *   accentColor, transparency, animationsEnabled, wallpaperBlur,
 *   glassBlur, wallpaperDim, wallpaperCrossfade, brightness,
 *   wallpaper, volume, wifi, bluetooth.
 *
 * accentColor is synced → --color-accent CSS variable in App.jsx
 * (useAccentColorSync) so every var(--color-accent) surface updates live.
 *
 * Notification state is owned entirely by notificationStore.js.
 * OS overlay toggles (search, notifCenter, keyboardOverlay, contextMenu)
 * live here because they are OS-shell concerns, not notification data.
 */
const useOSStore = create(
  persist(
    (set, get) => ({
      // ── Boot & Auth ──────────────────────────────────────────────────────
      bootPhase:  'boot',
      isLoggedIn: false,
      userName:   'Developer',
      userAvatar: null,
      setBootPhase: (phase) => set({ bootPhase: phase }),
      login:  (name) => set({ isLoggedIn: true, userName: name, bootPhase: 'desktop' }),
      logout: ()     => set({ isLoggedIn: false, bootPhase: 'login' }),

      // ── Appearance ───────────────────────────────────────────────────────
      wallpaper:         'gradient-nebula',
      accentColor:       '#6366f1',
      transparency:      true,
      animationsEnabled: true,
      wallpaperBlur:     false,

      setWallpaper:        (w) => set({ wallpaper: w }),
      setAccentColor:      (c) => set({ accentColor: c }),
      toggleTransparency:  ()  => set(s => ({ transparency:      !s.transparency      })),
      toggleAnimations:    ()  => set(s => ({ animationsEnabled: !s.animationsEnabled })),
      toggleWallpaperBlur: ()  => set(s => ({ wallpaperBlur:     !s.wallpaperBlur     })),

      // ── Desktop Effects ───────────────────────────────────────────────────
      wallpaperDim: 0,
      setWallpaperDim: (v) => set({ wallpaperDim: Math.min(80, Math.max(0, v)) }),

      // glassBlur: 0–100 — scales backdrop-filter blur across all glass surfaces
      glassBlur: 80,
      setGlassBlur: (v) => set({ glassBlur: Math.min(100, Math.max(0, v)) }),

      // wallpaperCrossfade: ms for wallpaper switching animation
      wallpaperCrossfade: 700,
      setWallpaperCrossfade: (ms) => set({ wallpaperCrossfade: Math.min(2000, Math.max(0, ms)) }),

      // ── System ───────────────────────────────────────────────────────────
      volume:     75,
      brightness: 100,
      wifi:       true,
      bluetooth:  false,

      setVolume:       (v) => set({ volume:     Math.min(100, Math.max(0, v))  }),
      setBrightness:   (b) => set({ brightness: Math.min(100, Math.max(10, b)) }),
      toggleWifi:      ()  => set(s => ({ wifi:      !s.wifi      })),
      toggleBluetooth: ()  => set(s => ({ bluetooth: !s.bluetooth })),

      // ── Start Menu ───────────────────────────────────────────────────────
      startMenuOpen:   false,
      toggleStartMenu: () => set(s => ({ startMenuOpen: !s.startMenuOpen })),
      closeStartMenu:  () => set({ startMenuOpen: false }),

      // ── Search ───────────────────────────────────────────────────────────
      searchOpen:     false,
      searchQuery:    '',
      toggleSearch:   () => set(s => ({ searchOpen: !s.searchOpen, searchQuery: '' })),
      openSearch:     () => set({ searchOpen: true,  searchQuery: '' }),
      closeSearch:    () => set({ searchOpen: false, searchQuery: '' }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── Notification Center ──────────────────────────────────────────────
      notifCenterOpen:   false,
      toggleNotifCenter: () => set(s => ({ notifCenterOpen: !s.notifCenterOpen })),
      closeNotifCenter:  () => set({ notifCenterOpen: false }),

      // ── Keyboard Overlay ─────────────────────────────────────────────────
      keyboardOverlayOpen:   false,
      toggleKeyboardOverlay: () => set(s => ({ keyboardOverlayOpen: !s.keyboardOverlayOpen })),
      closeKeyboardOverlay:  () => set({ keyboardOverlayOpen: false }),

      // ── Context Menu ─────────────────────────────────────────────────────
      contextMenu:     null,
      showContextMenu: (menu) => set({ contextMenu: menu }),
      hideContextMenu: ()     => set({ contextMenu: null }),
    }),
    {
      name: 'futuros-os-state',
      partialize: (state) => ({
        // Appearance
        wallpaper:          state.wallpaper,
        accentColor:        state.accentColor,
        transparency:       state.transparency,
        animationsEnabled:  state.animationsEnabled,
        wallpaperBlur:      state.wallpaperBlur,
        // Desktop Effects
        wallpaperDim:       state.wallpaperDim,
        glassBlur:          state.glassBlur,
        wallpaperCrossfade: state.wallpaperCrossfade,
        // System
        volume:             state.volume,
        brightness:         state.brightness,
        // Profile
        userName:           state.userName,
        userAvatar:         state.userAvatar,
      }),
    }
  )
)

export default useOSStore
