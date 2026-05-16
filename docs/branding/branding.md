# Branding — Comi2

Guía de identidad visual para la aplicación Comi2: tipografía moderna, paleta pastel, iconografía y componentes de interfaz (menús, botones, navegación).

**Versión:** 1.0  
**Ubicación de assets:** [`assets/branding/`](../../assets/branding/) (logos, iconos exportados, capturas)

---

## 1. Esencia de marca

| Atributo | Descripción |
|----------|-------------|
| **Propósito** | Organizar la comida de la semana y la compra sin estrés |
| **Personalidad** | Cálida, clara, confiable, ligera |
| **Tono visual** | Pastel, aireado, actual; nada corporativo frío ni infantil excesivo |
| **Palabras clave** | Fresco · Ordenado · Casero · Amable |

### Logo y nombre

- **Nombre:** Comi2 (C mayúscula; «2» como segunda versión / evolución del producto).
- **Wordmark:** `assets/imagenes/logo2.svg` — texto «Comi2» en verde (`#1E5A36` y variantes).
- **Icono de marca:** `assets/imagenes/comi2.svg` — ilustración (cuchara / comida); va a la **derecha** del wordmark en la cabecera.
- **Favicon / PWA:** `assets/imagenes/favicon.svg` (mismo motivo que logo2 con `viewBox` recortado); copias en `app/public/favicon.svg`, `icon-512.png`, `apple-touch-icon.png`.
- **Cabecera:** fondo `--color-header-bg` (sage pastel); títulos `--color-header-title` / `--color-sage-deep` (`#1E5A36`); iconografía de UI `--color-icon`.
- **Fondos:** usar sobre blanco, crema (`--color-surface`) o pastel muy suave; evitar sobre fotos sin overlay.

---

## 2. Tipografía

Fuentes **modernas**, legibles en móvil y escritorio, cargadas desde [Google Fonts](https://fonts.google.com/).

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| **Display / títulos** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | 600, 700 | Logo, H1, H2, botones principales |
| **Cuerpo / UI** | [Inter](https://fonts.google.com/specimen/Inter) | 400, 500, 600 | Párrafos, labels, inputs, navegación |
| **Opcional mono** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400 | Solo datos técnicos o depuración |

### Escala tipográfica

| Token | Tamaño | Line-height | Peso | Uso |
|-------|--------|-------------|------|-----|
| `--text-xs` | 0.75rem (12px) | 1.35 | 500 | Badges, hints |
| `--text-sm` | 0.875rem (14px) | 1.45 | 400 | Metadatos, chips pequeños |
| `--text-base` | 1rem (16px) | 1.5 | 400 | Cuerpo |
| `--text-lg` | 1.125rem (18px) | 1.45 | 500 | Lead, subtítulos |
| `--text-xl` | 1.25rem (20px) | 1.35 | 600 | H3, cards |
| `--text-2xl` | 1.5rem (24px) | 1.25 | 700 | H2 |
| `--text-3xl` | 1.875rem (30px) | 1.2 | 700 | H1 |

### Reglas

- Títulos en **Plus Jakarta Sans**; resto en **Inter**.
- Máximo dos pesos por bloque (ej. 400 + 600).
- No usar subrayado en navegación; solo en enlaces dentro de texto.
- Contraste mínimo **4.5:1** para texto normal sobre fondos pastel (ver sección 3).

---

## 3. Color

### 3.1 Paleta principal (pastel)

Colores de aplicación suaves, con suficiente contraste para texto oscuro (`--color-text`).

| Token | Hex | Muestra | Uso |
|-------|-----|---------|-----|
| `--color-sage` | `#B8D4C8` | Verde menta suave | Primario, navegación activa, acentos |
| `--color-sage-dark` | `#7FA896` | Verde más definido | Hover primario |
| `--color-sage-deep` | `#1E5A36` | Verde marca | Títulos de cabecera, iconos activos (`--color-icon`) |
| `--color-header-bg` | mezcla sage + surface | Cabecera y franjas de página |
| `--color-header-title` | `#1E5A36` | Títulos en cabecera de cada pantalla |
| `--color-peach` | `#F5D5C8` | Melocotón | Secundario, fondos destacados |
| `--color-peach-dark` | `#E8B4A0` | Melocotón intenso | Hover secundario |
| `--color-lavender` | `#D4C8E8` | Lavanda | Comida (momento), chips informativos |
| `--color-lavender-dark` | `#A894C8` | Lavanda media | Cena / estados alternativos |
| `--color-butter` | `#F5EDC8` | Mantequilla | Fondos de aviso suave, highlights |
| `--color-sky` | `#C8E0F5` | Cielo | Enlaces, info, lista de compra |
| `--color-sky-dark` | `#7EB3D4` | Cielo medio | Hover enlaces |

### 3.2 Neutros y superficies

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#F7F6F3` | Fondo general de la app (crema muy claro) |
| `--color-surface` | `#FFFFFF` | Cards, header, modales |
| `--color-surface-raised` | `#FEFDFB` | Superficie elevada sutil |
| `--color-border` | `#E8E6E1` | Bordes, divisores |
| `--color-border-strong` | `#D4D1CA` | Bordes en foco |
| `--color-text` | `#2D2A26` | Texto principal |
| `--color-text-muted` | `#6B6560` | Texto secundario |
| `--color-text-inverse` | `#FFFFFF` | Texto sobre botón primario |

### 3.3 Semánticos

| Token | Hex fondo | Hex texto/icono | Uso |
|-------|-----------|-----------------|-----|
| `--color-success` | `#D4EDDF` | `#2D6B4A` | Confirmación, guardado |
| `--color-warning` | `#F5EDC8` | `#8A6B2D` | Avisos |
| `--color-error` | `#F5D0D0` | `#9B3D3D` | Errores, eliminar |
| `--color-info` | `#C8E0F5` | `#3D6B8A` | Información |

### 3.4 Momentos del día (platos)

Alineado con el dominio de la app:

| Momento | Fondo chip | Texto |
|---------|------------|-------|
| Comida | `--color-lavender` | `#4A3D6B` |
| Cena | `--color-peach` | `#6B4A3D` |
| Ambos | `--color-sage` | `#2D4A3D` |

Las **etiquetas de usuario** mantienen su color personalizado (hex guardado en BD); la paleta pastel anterior es solo para UI del sistema.

### 3.5 Gradientes (opcional, decoración)

Uso ligero en header o pantalla vacía:

```css
--gradient-hero: linear-gradient(135deg, #F7F6F3 0%, #E8F0EC 40%, #F5EDE8 100%);
```

---

## 4. Iconografía

### 4.1 Librería recomendada

**[Phosphor Icons](https://phosphoricons.com/)** (estilo *Regular* o *Duotone* suave) o **[Lucide](https://lucide.dev/)** (trazo 1.75–2px).

- Tamaño base en UI: **20px** (navegación), **24px** (acciones en cards).
- Color: `--color-text-muted` por defecto; `--color-sage-dark` en activo.
- Esquinas redondeadas del trazo; coherente con `--radius-md`.

### 4.2 Iconos del menú principal

Orden en la UI: **Platos** → Productos → Semana → Lista.

| Sección | Icono Phosphor | Icono Lucide | Notas |
|---------|----------------|--------------|-------|
| **Platos** | `cooking-pot` o `fork-knife` | `chef-hat` / `utensils-crossed` | Recetas (primera opción) |
| **Productos** | `carrot` o `shopping-basket` | `carrot` / `shopping-basket` | Ingredientes |
| **Semana** | `calendar-dots` | `calendar-days` | Plan semanal |
| **Lista** | `clipboard-text` o `list-checks` | `clipboard-list` | Compra |

### 4.3 Acciones frecuentes

| Acción | Icono |
|--------|-------|
| Añadir | `plus-circle` |
| Editar | `pencil-simple` |
| Eliminar | `trash` |
| Guardar | `check-circle` |
| Cerrar | `x` |
| Etiqueta | `tag` |
| Color | `palette` |
| Filtrar | `funnel` |

### 4.4 Reglas

- Icono + texto en navegación (móvil: barra inferior opcional con icono + label corto).
- Botones solo-icono: área táctil mínima **44×44px**.
- No mezclar librerías en la misma vista.

---

## 5. Espaciado, radios y sombras

### Espaciado (escala 4px)

| Token | Valor |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |

### Radios (diseño actual, suave)

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 8px | Inputs, chips pequeños |
| `--radius-md` | 12px | Botones, cards |
| `--radius-lg` | 16px | Modales, paneles |
| `--radius-full` | 9999px | Pills, tags |

### Sombras

| Token | Valor |
|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(45, 42, 38, 0.06)` |
| `--shadow-md` | `0 4px 12px rgba(45, 42, 38, 0.08)` |
| `--shadow-lg` | `0 8px 24px rgba(45, 42, 38, 0.1)` |

---

## 6. Menús y navegación

### 6.1 Header (escritorio / tablet)

```
┌─────────────────────────────────────────────────────────────┐
│  Comi2          [🍳 Platos] [🥕 Productos] [📅 Semana] [📋 Lista] │
└─────────────────────────────────────────────────────────────┘
```

- Fondo: `--color-surface` con borde inferior `--color-border`.
- Enlace activo: fondo `--color-sage` al 35% opacidad (`rgba(184, 212, 200, 0.35)`), texto `--color-sage-dark`, **sin** subrayado.
- Hover: fondo `--color-bg`, transición 150ms ease.

### 6.2 Navegación móvil (recomendada &lt; 640px)

Barra fija inferior con 4 ítems; icono 24px + label `--text-xs`.

- Fondo: `--color-surface` + `--shadow-md` hacia arriba.
- Ítem activo: icono y label en `--color-sage-dark`.

### 6.3 Menús contextuales / desplegables

- Fondo `--color-surface`, `--radius-md`, `--shadow-lg`.
- Ítem altura mínima 40px; padding horizontal `--space-4`.
- Separadores `--color-border`.

---

## 7. Botones

Estilo **actual**: bordes redondeados, sin gradientes fuertes, feedback suave.

### Variantes

| Variante | Fondo | Texto | Borde | Uso |
|----------|-------|-------|-------|-----|
| **Primario** | `--color-sage-dark` | `--color-text-inverse` | ninguno | Guardar, Generar lista, CTA |
| **Secundario** | `--color-peach` | `#5C4033` | ninguno | Acciones alternativas |
| **Ghost** | transparente | `--color-text` | `1px solid --color-border` | Cancelar, acciones terciarias |
| **Ghost danger** | transparente | `--color-error` (texto) | `1px solid` tint error | Eliminar |
| **Icon** | `--color-bg` | `--color-text-muted` | ninguno | Solo icono en toolbar |

### Tamaños

| Tamaño | Padding | Font |
|--------|---------|------|
| `sm` | 6px 12px | `--text-sm` |
| `md` | 10px 18px | `--text-base` |
| `lg` | 12px 24px | `--text-lg` |

### Estados

- **Hover:** oscurecer fondo ~8% o usar variante `-dark`.
- **Active:** escala `transform: scale(0.98)`.
- **Disabled:** opacidad 0.5, sin pointer.
- **Focus visible:** anillo `2px solid --color-sky-dark`, offset 2px.

### Ejemplo visual (primario)

```
┌──────────────────────┐
│   ✓  Guardar plato    │  ← Plus Jakarta Sans 600, radius-md
└──────────────────────┘
     fondo #7FA896
```

---

## 8. Otros componentes

### Cards

- Fondo `--color-surface`, `--radius-md`, `--shadow-sm`, borde `1px solid --color-border`.
- Hover (clicables): `--shadow-md`, borde `--color-sage` al 50% opacidad.

### Chips / etiquetas de plato

- Forma pill (`--radius-full`).
- Fondo = color de la etiqueta (BD); texto con contraste automático (claro/oscuro).
- Padding: `6px 12px`; `--text-sm` 500.

### Inputs

- Fondo `--color-surface`, borde `--color-border`, `--radius-sm`.
- Focus: borde `--color-sage-dark`, sombra suave `0 0 0 3px rgba(127, 168, 150, 0.25)`.

### Badges (momento: comida / cena)

- Misma lógica que tabla en §3.4; tamaño `--text-xs`, mayúsculas opcionales desaconsejadas (usar sentence case).

### Planificador semanal

- Celdas día: card con cabecera día en **Plus Jakarta Sans 600**.
- Selects con icono de plato opcional a la izquierda.

---

## 9. Motion

| Token | Valor |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--ease-out` | `cubic-bezier(0.33, 1, 0.68, 1)` |

- Transiciones en hover/focus de botones y nav.
- Modales: fade + slide 8px desde abajo en móvil.
- Evitar animaciones largas o rebuscadas.

---

## 10. Implementación en código

### 10.1 Variables CSS (copiar a `app/src/styles/`)

Archivo recomendado: `tokens.css` importado antes de `index.css`.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap');

:root {
  /* Tipografía */
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Color — pasteles */
  --color-sage: #b8d4c8;
  --color-sage-dark: #7fa896;
  --color-peach: #f5d5c8;
  --color-peach-dark: #e8b4a0;
  --color-lavender: #d4c8e8;
  --color-lavender-dark: #a894c8;
  --color-butter: #f5edc8;
  --color-sky: #c8e0f5;
  --color-sky-dark: #7eb3d4;

  --color-bg: #f7f6f3;
  --color-surface: #ffffff;
  --color-border: #e8e6e1;
  --color-text: #2d2a26;
  --color-text-muted: #6b6560;
  --color-text-inverse: #ffffff;

  --color-success-bg: #d4eddf;
  --color-error-bg: #f5d0d0;
  --color-error-text: #9b3d3d;

  /* Radios y sombras */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(45, 42, 38, 0.06);
  --shadow-md: 0 4px 12px rgba(45, 42, 38, 0.08);

  /* Espaciado */
  --space-4: 16px;
  --space-6: 24px;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
}

h1, h2, h3, .layout__brand {
  font-family: var(--font-display);
}
```

### 10.2 Iconos en React

```bash
cd app
npm install @phosphor-icons/react
```

```tsx
import { CookingPot, CalendarDots, ClipboardText, Carrot } from '@phosphor-icons/react';

<CookingPot size={20} weight="regular" aria-hidden />;
```

### 10.3 Checklist de adopción

- [x] Añadir `tokens.css` y fuentes Google
- [x] Sustituir colores hardcodeados en `index.css` por variables
- [x] Iconos en `Layout` (nav escritorio + barra móvil)
- [x] Ajustar `TagChip` (compatible con colores custom)
- [x] Badges de momento (comida / cena / ambos) con pasteles
- [ ] Exportar logo SVG a `assets/branding/logo-comi2.svg`
- [ ] Capturas de referencia en `assets/branding/screens/`

---

## 11. Referencias visuales

| Recurso | Enlace |
|---------|--------|
| Plus Jakarta Sans | https://fonts.google.com/specimen/Plus+Jakarta+Sans |
| Inter | https://fonts.google.com/specimen/Inter |
| Phosphor Icons | https://phosphoricons.com |
| Lucide | https://lucide.dev |
| Contraste WCAG | https://webaim.org/resources/contrastchecker/ |

---

## Control de cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-05-15 | Documento inicial: pastel, tipografía moderna, iconografía y componentes UI |
