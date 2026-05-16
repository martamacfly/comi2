import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas: obligatorio para Capacitor/APK (assets en WebView).
  // Ver docs/guias/android-apk.md
  base: './',
})
