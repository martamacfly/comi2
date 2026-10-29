import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas: obligatorio para Capacitor/APK (assets en WebView).
  // Ver docs/guias/android-apk.md
  // En GitHub Pages se compila con VITE_BASE=/comi2/ (ver .github/workflows/pages.yml).
  base: process.env.VITE_BASE ?? './',
})
