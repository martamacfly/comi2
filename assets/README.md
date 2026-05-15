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

## Uso en la app

Los assets que deban empaquetarse en la build de React pueden copiarse o referenciarse desde `app/public/` cuando estén listos para producción.
