# Assets — Comi2

Recursos visuales y de diseño del proyecto (no código).

## Carpetas

| Carpeta | Contenido |
|---------|-----------|
| `branding/` | Logo, iconos de marca, capturas (ver [docs/branding/branding.md](../docs/branding/branding.md)) |
| `disenos/` | Mockups, wireframes, exports de Figma, prototipos |
| `imagenes/` | Iconos, logos, ilustraciones, fotos |

## Convenciones de nombres

- Usar kebab-case: `pantalla-inicio-v1.png`
- Incluir versión si hay iteraciones: `menu-mobile-v2.fig`
- Evitar espacios y caracteres especiales en nombres de archivo

## Formatos recomendados

| Tipo | Formatos |
|------|----------|
| Mockups / UI | PNG, SVG, PDF |
| Diseño editable | Figma (enlace en un `.md` si no se exporta) |
| Iconos | SVG preferido |
| Fotos | WebP o PNG optimizado |

## Logos de marca (`imagenes/`)

| Archivo | Uso |
|---------|-----|
| `logo2.svg` | Wordmark «Comi2» (cabecera, base del favicon) |
| `comi2.svg` | Icono junto al wordmark en cabecera |
| `favicon.svg` | Recorte para favicon (copiar a `app/public/favicon.svg`) |
| `logo.png` | Logo raster para README, previews o uso donde convenga PNG |
| `logo2.png`, `comi2.png` | Raster para PWA / touch icon si hace falta |

## Uso en la app

Copiar a `app/public/` al actualizar la marca:

- `logo2.svg` → `logo-mark.svg`
- `comi2.svg` → `brand-icon.svg`
- `favicon.svg` → `favicon.svg`
- `logo2.png` → `apple-touch-icon.png`, `icon-512.png` (opcional)

La cabecera y el `manifest.webmanifest` están documentados en [howto-comi2.md](../howto-comi2.md#marca-en-cabecera-y-favicon).
