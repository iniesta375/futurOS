import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './src'),
      '@apps':        path.resolve(__dirname, './src/apps'),
      '@components':  path.resolve(__dirname, './src/components'),
      '@hooks':       path.resolve(__dirname, './src/hooks'),
      '@stores':      path.resolve(__dirname, './src/stores'),
      '@utils':       path.resolve(__dirname, './src/utils'),
      '@constants':   path.resolve(__dirname, './src/constants'),
      '@styles':      path.resolve(__dirname, './src/styles'),
      '@contexts':    path.resolve(__dirname, './src/contexts'),
      '@content':     path.resolve(__dirname, './src/content'),
    },
  },

  server: {
    port: 3000,
  },

  build: {
    // Phase 13B: manual chunk splitting
    // Problem: Desktop-*.js was 873 KB (minified) because Vite bundled
    // framer-motion, react-rnd, zustand, and all snap/notification/taskbar
    // code into one chunk. Splitting by logical layer:
    //   vendor-react    — React core (tiny, never changes)
    //   vendor-motion   — Framer Motion (heaviest third-party dep ~350 KB raw)
    //   vendor-ui       — Lucide + react-rnd + zustand (UI utils)
    //   shell           — OS shell: stores, contexts, constants, hooks
    //   desktop         — Desktop + taskbar + window management
    //   overlays        — Search, notifications, snap, keyboard overlay
    //   widgets         — Widget system (already splitting ClockWidget)
    // Apps already lazy-split by AppRenderer — no change needed there.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── React core ─────────────────────────────────────────────
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }

          // ── Framer Motion — biggest single dep ────────────────────
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }

          // ── UI utilities ──────────────────────────────────────────
          if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-rnd') ||
              id.includes('node_modules/re-resizable') ||
              id.includes('node_modules/react-draggable') ||
              id.includes('node_modules/zustand')) {
            return 'vendor-ui'
          }

          // ── OS Shell: stores, contexts, constants, hooks ──────────
          if (id.includes('/src/stores/') ||
              id.includes('/src/contexts/') ||
              id.includes('/src/constants/') ||
              id.includes('/src/hooks/')) {
            return 'shell'
          }

          // ── Overlays: search, notifications, snap, keyboard ───────
          if (id.includes('/src/components/snap/') ||
              id.includes('/src/components/notifications/') ||
              id.includes('/src/components/ui/GlobalSearch') ||
              id.includes('/src/components/ui/KeyboardOverlay')) {
            return 'overlays'
          }

          // ── Widget system ─────────────────────────────────────────
          if (id.includes('/src/components/widgets/')) {
            return 'widgets'
          }

          // Everything else (desktop, taskbar, window, effects, boot)
          // → default chunk (was Desktop-*.js, now Desktop-*.js but smaller)
        },
      },
    },
  },
})
