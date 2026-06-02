import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    // the heavy Three.js chunk is lazy-loaded (only when the canvas mounts), so the
    // size warning for it is expected and harmless.
    chunkSizeWarningLimit: 1200,
    // Split the heavy 3D runtime into its own chunk so first paint / preloader
    // isn't blocked by Three.js parsing.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('@react-three/postprocessing') || id.includes('node_modules/postprocessing'))
            return 'post'
          if (id.includes('@react-three')) return 'r3f'
        },
      },
    },
  },
})
