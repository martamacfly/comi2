# Documentación Comi2

Índice de la documentación del proyecto.

## Contenido

| Documento | Descripción |
|-----------|-------------|
| [Howto Comi2](../howto-comi2.md) | Guía completa: producto, código, BD y uso de la app |
| [Requisitos](requisitos/requisitos.md) | Requisitos funcionales y no funcionales |
| [Funcionalidades](funcionalidades/funcionalidades.md) | Casos de uso, módulos y prioridades |
| [Arquitectura](arquitectura/arquitectura.md) | Stack técnico, capas y modelo de datos |
| [Branding](branding/branding.md) | Identidad visual, colores pastel, tipografía e iconografía |
| [Guía de desarrollo](guias/desarrollo.md) | Cómo ejecutar la app **solo en el navegador** y scripts npm (raíz y `app/`) |
| [APK Android](guias/android-apk.md) | **Opcional:** Capacitor, Gradle y JDK 21 solo si quieres generar APK |

La guía de APK está separada a propósito: quien clone el repo para usar o mejorar la web **no tiene que instalar** el SDK de Android ni seguir esos pasos.

## Convención

- Toda la documentación del producto vive en esta carpeta (`docs/`).
- Los diseños e imágenes están en [`../assets/`](../assets/).
- El código de la aplicación está en [`../app/`](../app/).
- Desarrollo web habitual: Node + `npm install` en `app/` + `npm run dev` (ver [Guía de desarrollo](guias/desarrollo.md)). La **APK Android** es un flujo aparte y opcional ([android-apk.md](guias/android-apk.md)).
