# Guía: generar la APK de Comi2 (Android)

Documento de referencia con **todos los pasos**, **requisitos** y **cambios en el repositorio** para empaquetar la app web como **APK Android** con [Capacitor](https://capacitorjs.com/).

La carpeta nativa `app/android/` ya está en el repo; en una máquina nueva solo hace falta instalar herramientas, configurar el SDK local y ejecutar los scripts.

---

## Resumen

| Concepto | Valor |
|----------|--------|
| Empaquetado | Capacitor 8 |
| `appId` | `es.comi2.app` |
| Nombre en el launcher | Comi2 |
| Web empaquetada | `app/dist/` (build de Vite) |
| APK debug (fácil de localizar) | **`releases/comi2.apk`** (raíz del repo, tras `npm run cap:apk:debug`) |
| APK debug (Gradle) | `app/android/app/build/outputs/apk/debug/app-debug.apk` |
| Datos en el móvil | IndexedDB (`comi2-db`), igual que en el navegador |

---

## Requisitos en tu PC

| Herramienta | Versión / notas |
|-------------|-----------------|
| **Node.js** | LTS v20+ (igual que desarrollo web) |
| **JDK** | **21** (Capacitor 8 / Android Gradle Plugin lo exigen) |
| **Android SDK** | Instalado con [Android Studio](https://developer.android.com/studio) o solo *command-line tools* |
| **Gradle** | No hace falta instalarlo a mano; usa el wrapper `app/android/gradlew.bat` (Windows) o `gradlew` (Linux/macOS) |

### Java 21

- En Windows, si tienes **Android Studio**, su JBR suele estar en:
  `C:\Program Files\Android\Android Studio\jbr`
- Los scripts `cap:apk:*` del `package.json` apuntan ahí en Windows. En Linux/macOS define `JAVA_HOME` al JDK 21 antes de Gradle (ver [Compilar la APK](#compilar-la-apk)).

### Android SDK

Ruta típica en Windows:

`%LOCALAPPDATA%\Android\Sdk` → `C:\Users\<tu-usuario>\AppData\Local\Android\Sdk`

Gradle necesita un archivo **`app/android/local.properties`** (no se versiona) con:

```properties
sdk.dir=C\:\\Users\\<tu-usuario>\\AppData\\Local\\Android\\Sdk
```

Plantilla versionada: [`app/android/local.properties.example`](../../app/android/local.properties.example).

---

## Qué ya está configurado en el repo

Estos cambios **ya están hechos** en Comi2; sirven de inventario si clonas el proyecto o repites el proceso en otro sitio.

### Dependencias npm (`app/package.json`)

| Paquete | Uso |
|---------|-----|
| `@capacitor/core` | Runtime Capacitor en la WebView |
| `@capacitor/cli` | CLI `cap` |
| `@capacitor/android` | Proyecto Gradle Android |
| `@capacitor/app` | Plugin App (ciclo de vida básico) |

### Scripts npm (`app/package.json`)

| Script | Acción |
|--------|--------|
| `npm run cap:sync` | `npm run build` + `cap sync` (copia `dist/` al proyecto Android) |
| `npm run cap:android` | Abre el proyecto en Android Studio |
| `npm run cap:apk:debug` | Sync + `assembleDebug` + copia a `releases/comi2.apk` |
| `npm run cap:apk:release` | Sync + `assembleRelease` → APK/AAB firmable (requiere keystore) |
| `npm run cap:apk:debug:unix` | Igual que debug en Linux/macOS (`./gradlew`; define `JAVA_HOME` a JDK 21) |
| `npm run cap:icons` | Regenera iconos/splash Android desde `favicon.svg` |

### Configuración Capacitor (`app/capacitor.config.ts`)

- `appId`: `es.comi2.app`
- `appName`: `Comi2`
- `webDir`: `dist`
- `server.androidScheme`: `https` (rutas del router y assets estables en WebView)
- `android.allowMixedContent`: `true`

### Vite (`app/vite.config.ts`)

- `base: './'` — rutas relativas para que los assets carguen dentro del APK (`file`/Capacitor), no con `/` absoluto.

### HTML (`app/index.html`)

- `viewport-fit=cover` — área útil en pantallas con notch / barras del sistema.

### Proyecto Android (`app/android/`)

Generado con `npx cap add android` y versionado (salvo artefactos de build):

- `MainActivity` en `es.comi2.app`
- Gradle wrapper, `app/build.gradle`, iconos y manifiesto de la app

### `.gitignore` (raíz)

Ignora artefactos locales de Android:

- `app/android/local.properties`
- `app/android/.gradle/`, `build/`, `app/build/`
- `app/android/.idea/`
- `app/android/capacitor-cordova-android-plugins/` (regenerado en sync)

---

## Pasos desde cero (referencia histórica)

Si partieras solo de la app web **sin** Capacitor, el orden sería:

```bash
cd app
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app
```

1. Crear `capacitor.config.ts` (ver valores de la tabla anterior).
2. En `vite.config.ts`, poner `base: './'`.
3. En `index.html`, añadir `viewport-fit=cover` al meta viewport.
4. Añadir scripts `cap:sync`, `cap:android`, `cap:apk:debug`, `cap:apk:release`.
5. `npm run build`
6. `npx cap add android`
7. `npx cap sync android`
8. Crear `android/local.properties` con `sdk.dir=...`
9. Compilar con Gradle (Java 21).

En **este repositorio** los pasos 1–7 ya están aplicados; tú empiezas en [Primera vez en tu máquina](#primera-vez-en-tu-máquina).

---

## Primera vez en tu máquina

```bash
cd app
npm install
```

1. **SDK:** instala Android Studio (o SDK + platform-tools). Acepta licencias si Gradle lo pide.
2. **Copia la plantilla del SDK:**

   ```bash
   # Windows (PowerShell) — ajusta la ruta a tu usuario
   Copy-Item android\local.properties.example android\local.properties
   # Edita android\local.properties y confirma sdk.dir
   ```

3. **Java 21:** en Windows con Android Studio, los scripts npm ya usan su JBR. En otros SO:

   ```bash
   export JAVA_HOME=/ruta/al/jdk-21
   ```

4. **Compila:**

   ```bash
   npm run cap:apk:debug
   ```

5. **APK:** `releases/comi2.apk` (y copia en `app/android/.../app-debug.apk`)

### Script alternativo (Windows PowerShell)

```powershell
cd app
.\scripts\build-apk-debug.ps1
```

Equivalente a fijar `JAVA_HOME` y llamar a Gradle tras un `cap:sync`.

---

## Flujo habitual (cambios en la app web)

Cada vez que cambies React/CSS/datos en `app/src/`:

```bash
cd app
npm run cap:apk:debug
```

Eso ejecuta build web → `cap sync` → `assembleDebug`. No hace falta abrir Android Studio solo para una APK de prueba.

Solo abre Android Studio si quieres depurar nativo o tocar el manifiesto:

```bash
npm run cap:android
```

---

## Compilar la APK

### Debug (instalación manual, pruebas)

```bash
cd app
npm run cap:apk:debug
```

| SO | Nota |
|----|------|
| **Windows** | `package.json` define `JAVA_HOME` al JBR de Android Studio |
| **Linux / macOS** | Antes del comando: `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` (macOS) o ruta a tu JDK 21 |

Salida principal: **`releases/comi2.apk`** en la raíz del repo (~4–5 MB). El script `cap:apk:debug` la copia ahí tras compilar; Gradle también genera `app/android/.../app-debug.apk`.

### Release (distribución)

```bash
npm run cap:apk:release
```

Requiere **firmar** la app (keystore + configuración en `app/android/app/build.gradle`). Sin keystore, `assembleRelease` puede fallar o generar un build no instalable en producción. Para Play Store suele usarse **AAB** (`bundleRelease`); no está automatizado en los scripts actuales.

---

## Instalar en el teléfono

### Copiar el APK

1. Pasa `releases/comi2.apk` al móvil (USB, Drive, correo…).
2. En Android: permite **instalar apps desconocidas** para el gestor de archivos o navegador que uses.
3. Abre el archivo y confirma.

### ADB (USB depuración)

```bash
adb install -r app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Comportamiento de la app en Android

- **Datos:** IndexedDB vía Dexie; persisten en el dispositivo hasta desinstalar o borrar datos de la app.
- **Sin servidor:** todo es local; no hay cuenta ni sync entre móviles.
- **Router:** React Router con `BrowserRouter` y esquema `https` de Capacitor; las rutas `/platos`, `/semana`, etc. funcionan igual que en web.
- **PWA:** el `manifest.webmanifest` aplica sobre todo al navegador.
- **Icono del launcher:** mismo diseño que `app/public/favicon.svg`. Fuente en `app/assets/icon.svg`; regenerar mipmaps con `npm run cap:icons` (usa `@capacitor/assets`, fondo `#f7f6f3`).

---

## Solución de problemas

| Error | Causa habitual | Qué hacer |
|-------|----------------|-----------|
| `SDK location not found` | Falta `local.properties` | Copiar `local.properties.example` → `local.properties` y poner `sdk.dir` |
| `invalid source release: 21` | JDK 17 en PATH | Usar JDK 21 / JBR de Android Studio (`JAVA_HOME`) |
| Pantalla en blanco | `base` de Vite incorrecto | Debe ser `base: './'` en `vite.config.ts` |
| Assets 404 en APK | No has hecho sync tras build | `npm run cap:sync` o `npm run cap:apk:debug` |
| Gradle descarga mucho la primera vez | Normal | SDK Build-Tools / Platform se instalan solos |

---

## Estructura Android relevante

```
Comi2/
├── releases/
│   ├── README.md
│   └── comi2.apk          # Generada por npm run cap:apk:debug (gitignore)
└── app/
    ├── capacitor.config.ts
    ├── vite.config.ts
    ├── scripts/
    │   └── build-apk-debug.ps1  # Atajo Windows (opcional)
    └── android/
        ├── local.properties.example
        ├── local.properties     # Tu SDK (gitignore)
        └── app/build/outputs/apk/debug/app-debug.apk
```

---

## Enlaces

- [Capacitor — Android](https://capacitorjs.com/docs/android)
- [Howto Comi2](../../howto-comi2.md) — sección *APK Android*
- [Guía de desarrollo](desarrollo.md)
- [README del proyecto](../../README.md)
