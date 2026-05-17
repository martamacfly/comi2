# Guía de desarrollo — Comi2

## Enfoque: web primero, Android aparte

La aplicación es una **SPA** (React + Vite). Con Node y el servidor de desarrollo puedes trabajar **solo en el navegador** sin instalar Android Studio ni generar APK.

La carpeta **`app/android/`** y los scripts **`npm run cap:*`** entran en juego **solo** si quieres compilar para móvil; están documentados en **[android-apk.md](android-apk.md)** para no mezclar requisitos.

## Requisitos previos

- [Node.js](https://nodejs.org/) LTS (v20 o superior recomendado)
- npm (incluido con Node.js)

## Arranque rápido

Instala dependencias **una vez** en `app/`:

```bash
cd app
npm install
```

Luego levanta el dev server:

```bash
npm run dev
```

Desde la **raíz del repositorio** (tras el `npm install` anterior) también puedes usar:

```bash
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## Scripts en la raíz del repositorio

El `package.json` de la raíz delega en `app/`:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run preview` | Vista previa del build |

Los comandos **Capacitor / APK** (`cap:sync`, `cap:apk:debug`, …) están solo en **`app/package.json`**; ejecútalos con **`cd app`**.

## Scripts en `app/` (resumen)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | ESLint |
| `npm run cap:sync` | Build web + sincronizar con Android *(solo si trabajas APK)* |
| `npm run cap:android` | Abrir proyecto en Android Studio |
| `npm run cap:apk:debug` | Generar APK → `releases/comi2.apk` *(opcional)* |
| `npm run cap:apk:release` | Build release (requiere firma / keystore) |
| `npm run cap:apk:debug:unix` | APK debug en Linux/macOS (`JAVA_HOME` = JDK 21) |

## APK Android

Guía dedicada (solo si vas a generar o firmar APK): **[android-apk.md](android-apk.md)** (JDK 21, `local.properties`, instalación en el móvil y troubleshooting).

## Base de datos local

- Motor: IndexedDB, acceso vía [Dexie](https://dexie.org/).
- Nombre de la BD: `comi2-db`.
- Para inspeccionar datos: DevTools del navegador → **Application** → **IndexedDB** → `comi2-db`.

## Respaldo JSON

En la app, **Platos** incluye al pie el panel **Respaldo** (exportar / importar). El formato y la validación están en [`app/src/lib/backup.ts`](../../app/src/lib/backup.ts) (`comi2-backup`, versión 1). La importación ejecuta una transacción Dexie que vacía y repuebla las tablas afectadas.

## Convenciones

- Código de la app solo en `app/src/`.
- Documentación de producto en `docs/` (Markdown en español).
- Assets de diseño en `assets/disenos/` e `assets/imagenes/`.
- No commitear `node_modules`, `dist` ni archivos `.env`.
- Las APK generadas (`releases/*.apk`) están en `.gitignore`; cada quien las construye en local si las necesita.

## Estructura de `app/src/`

```
src/
├── context/      # Estado de la lista de compra entre rutas (sesión)
├── db/           # Esquema Dexie y tipos
├── hooks/        # Hooks reutilizables
├── styles/       # Estilos globales
├── App.tsx
└── main.tsx
```

`lib/backup.ts` y `components/PlatosBackupPanel.tsx` gestionan el respaldo JSON desde la pantalla Platos.

## Ramas y commits

<!-- Define aquí tu flujo (main, develop, feature/*, etc.) -->
