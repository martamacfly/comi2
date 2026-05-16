# Comi2 — aplicación (`app/`)

Código de la interfaz: **React 19**, **TypeScript**, **Vite**, **Dexie** (IndexedDB). Empaquetado móvil con **Capacitor 8** en `android/`.

Documentación general: [README.md](../README.md) · [howto-comi2.md](../howto-comi2.md) · [docs/](../docs/)

---

## Desarrollo web

```bash
npm install
npm run dev
```

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor Vite (HMR) |
| `npm run build` | Compilación → `dist/` |
| `npm run preview` | Vista previa del build |
| `npm run lint` | ESLint |

---

## APK Android

Guía completa: **[docs/guias/android-apk.md](../docs/guias/android-apk.md)**

```bash
# Primera vez en tu PC
copy android\local.properties.example android\local.properties
# Edita local.properties → sdk.dir con tu ruta del Android SDK

npm run cap:apk:debug
```

APK: **`../releases/comi2.apk`** (el script la copia ahí; Gradle también deja una copia en `android/app/build/outputs/apk/debug/`)

| Script | Descripción |
|--------|-------------|
| `npm run cap:icons` | Regenerar icono launcher desde `favicon.svg` |
| `npm run cap:sync` | Build + sincronizar web con Android |
| `npm run cap:android` | Abrir Android Studio |
| `npm run cap:apk:debug` | APK de prueba |
| `npm run cap:apk:release` | Build release (keystore) |
| `npm run cap:apk:debug:unix` | APK debug en Linux/macOS |

Windows (alternativa): `.\scripts\build-apk-debug.ps1`

---

## Archivos relevantes para móvil

| Archivo | Rol |
|---------|-----|
| `capacitor.config.ts` | Id de app, `webDir`, esquema Android |
| `vite.config.ts` | `base: './'` para assets en APK |
| `index.html` | Viewport con `viewport-fit=cover` |
| `android/` | Proyecto Gradle (no commitear `local.properties` ni `build/`) |

---

## Estructura `src/`

```
src/
├── components/
├── db/           # Dexie, tipos
├── lib/          # Dominio (platos, lista, semana…)
├── pages/
├── styles/
├── App.tsx
└── main.tsx
```

Base de datos: `comi2-db` (IndexedDB). Inspección: DevTools → Application → IndexedDB.
