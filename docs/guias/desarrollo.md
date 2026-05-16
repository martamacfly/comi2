# Guía de desarrollo — Comi2

## Requisitos previos

- [Node.js](https://nodejs.org/) LTS (v20 o superior recomendado)
- npm (incluido con Node.js)

## Arranque rápido

```bash
cd app
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## Scripts disponibles (en `app/`)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Linter (si está configurado en el proyecto) |
| `npm run cap:sync` | Build web + sincronizar con Android |
| `npm run cap:android` | Abrir proyecto en Android Studio |
| `npm run cap:apk:debug` | Generar APK → `releases/comi2-debug.apk` |
| `npm run cap:apk:release` | Build release (requiere firma / keystore) |
| `npm run cap:apk:debug:unix` | APK debug en Linux/macOS (`JAVA_HOME` = JDK 21) |

## APK Android

Ver la guía dedicada: **[android-apk.md](android-apk.md)** (requisitos JDK 21, `local.properties`, instalación en el móvil y troubleshooting).

## Base de datos local

- Motor: IndexedDB, acceso vía [Dexie](https://dexie.org/).
- Nombre de la BD: `comi2-db`.
- Para inspeccionar datos: DevTools del navegador → **Application** → **IndexedDB** → `comi2-db`.

## Convenciones

- Código de la app solo en `app/src/`.
- Documentación de producto en `docs/` (Markdown en español).
- Assets de diseño en `assets/disenos/` e `assets/imagenes/`.
- No commitear `node_modules`, `dist` ni archivos `.env`.

## Estructura de `app/src/`

```
src/
├── db/           # Esquema Dexie y tipos
├── hooks/        # Hooks reutilizables
├── styles/       # Estilos globales
├── App.tsx
└── main.tsx
```

## Ramas y commits

<!-- Define aquí tu flujo (main, develop, feature/*, etc.) -->
