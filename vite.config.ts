import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/LeagueSkinTracker/',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          api: ['axios']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api/ddragon': {
        target: 'https://ddragon.leagueoflegends.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ddragon/, ''),
        secure: true,
        headers: {
          'User-Agent': 'LoL-Skin-Tracker/3.0.0'
        }
      }
    }
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios']
  },
  css: {
    postcss: './postcss.config.js'
  }
})