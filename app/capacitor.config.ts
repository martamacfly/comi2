/**
 * Capacitor — empaquetado Android (APK).
 * Guía completa: ../docs/guias/android-apk.md
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.comi2.app',
  appName: 'Comi2',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
