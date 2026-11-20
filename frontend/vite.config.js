import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas para que funcione en GitHub Pages (/proyecto2025-marfortt-baudino/)
  base: './',
  build: {
    // GitHub Pages publica la carpeta /docs de la rama main
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
