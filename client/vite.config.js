import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    define: {
    process: {
      env: {},
    },
  },
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
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-rnd') ||
              id.includes('node_modules/re-resizable') ||
              id.includes('node_modules/react-draggable') ||
              id.includes('node_modules/zustand')) {
            return 'vendor-ui'
          }

          if (id.includes('/src/stores/') ||
              id.includes('/src/contexts/') ||
              id.includes('/src/constants/') ||
              id.includes('/src/hooks/')) {
            return 'shell'
          }

          if (id.includes('/src/components/snap/') ||
              id.includes('/src/components/notifications/') ||
              id.includes('/src/components/ui/GlobalSearch') ||
              id.includes('/src/components/ui/KeyboardOverlay')) {
            return 'overlays'
          }

          if (id.includes('/src/components/widgets/')) {
            return 'widgets'
          }

          
        },
      },
    },
  },
})
