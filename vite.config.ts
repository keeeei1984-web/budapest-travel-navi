import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'phrase-audio': ['./src/phrase-audio.ts'],
          'leaflet': ['leaflet'],
          'restaurant-audio': ['./src/restaurant-audio.ts'],
        },
      },
    },
  },
})
