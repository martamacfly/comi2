# Notas del proyecto Comi2

## Qué es

Aplicación móvil para Android (también usable como web) que gestiona cómics. Funciona sin conexión con datos almacenados localmente en el dispositivo.

---

## Tecnología

| Capa | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Routing | React Router v7 |
| Build web | Vite 8 |
| Base de datos local | Dexie 4 → IndexedDB |
| Empaquetado móvil | Capacitor 8 |
| Android nativo | Gradle |

---

## Herramientas necesarias

- **Node.js** LTS v20+
- **JDK 21** (para compilar la APK)
- **Android SDK** — lo más cómodo es tenerlo vía Android Studio
- Configurar `app/android/local.properties` con la ruta al SDK (copiar desde `local.properties.example`)

---

## Generar una nueva versión (APK debug)

```powershell
cd app
npm install
npm run cap:apk:debug
```

Esto ejecuta en orden: build web → sincronización Capacitor → compilación Gradle → copia la APK a `releases/comi2.apk`.

Antes de generar, actualizar `versionCode` y `versionName` en:
```
app/android/app/build.gradle
```

---

## Dónde está la APK

```
releases/comi2.apk          ← copia lista para instalar (gitignoreada)
```

El fichero raw de Gradle queda en:
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Documentación completa

- `howto-comi2.md` — guía completa del proyecto
- `docs/guias/android-apk.md` — proceso detallado de generación de APK
- `docs/guias/desarrollo.md` — arranque rápido para desarrollo web
