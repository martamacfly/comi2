import type { Etiqueta, Plato, Producto } from '../db/types';
import {
  C,
  cargarLogo,
  compartirCanvas,
  dibujarLogo,
  drawTags,
  FONT,
  guardarCanvas,
  roundRect,
  type Logo,
} from './imagen-semana';

export type RecetaImagen = {
  plato: Plato;
  ingredientes: Producto[];
  etiquetas: Etiqueta[];
  /** false si el módulo Recetas está apagado: solo nombre e ingredientes */
  conReceta: boolean;
};

// Ancho pensado para redes: 540 × 2 = 1080 px. Alto mínimo 4:5 (1350 px), como un post de Instagram.
const DPR = 2;
const W = 540;
const MIN_H = 675;
const PAD = 28;
const INNER_W = W - PAD * 2;
const CARD_PAD = 20;
const CARD_INNER_W = INNER_W - CARD_PAD * 2;

const MOMENTO_LABEL: Record<Plato['momento'], string> = {
  comida: 'Comida',
  cena: 'Cena',
  ambos: 'Comida y cena',
};

function wrapLines(ctx: CanvasRenderingContext2D, texto: string, maxW: number): string[] {
  const lineas: string[] = [];
  for (const parrafo of texto.split('\n')) {
    let actual = '';
    for (const palabra of parrafo.split(/\s+/).filter(Boolean)) {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (ctx.measureText(prueba).width <= maxW || !actual) {
        actual = prueba;
      } else {
        lineas.push(actual);
        actual = palabra;
      }
    }
    lineas.push(actual);
  }
  return lineas;
}

function truncar(ctx: CanvasRenderingContext2D, texto: string, maxW: number): string {
  if (ctx.measureText(texto).width <= maxW) return texto;
  let t = texto;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

/**
 * Dibuja la receta. Con draw=false solo mide y devuelve el alto que necesita,
 * para poder crear el canvas del tamaño justo antes de pintar.
 */
function pintarReceta(
  ctx: CanvasRenderingContext2D,
  datos: RecetaImagen,
  logo: Logo | null,
  draw: boolean,
): number {
  const { plato, ingredientes, etiquetas, conReceta } = datos;
  const pasos = conReceta ? (plato.pasos ?? []).filter((p) => p.trim()) : [];
  const notas = conReceta ? plato.notas?.trim() : undefined;

  // ── Logo ──
  let y = PAD;
  if (logo) {
    if (draw) dibujarLogo(ctx, logo, W / 2, y + 4, 34);
    y += 4 + 34 + 18;
  }

  // ── Cabecera ──
  ctx.font = `700 30px ${FONT}`;
  const titulo = wrapLines(ctx, plato.nombre, INNER_W - 48);
  const cabeceraH = 24 + 22 + titulo.length * 38 + 30 + (etiquetas.length > 0 ? 34 : 0) + 8;

  if (draw) {
    roundRect(ctx, PAD, y, INNER_W, cabeceraH, 18);
    ctx.fillStyle = C.sageDark;
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffffcc';
    ctx.font = `700 12px ${FONT}`;
    ctx.fillText('RECETA', PAD + 24, y + 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `700 30px ${FONT}`;
    titulo.forEach((linea, i) => ctx.fillText(linea, PAD + 24, y + 76 + i * 38));

    ctx.fillStyle = '#ffffffdd';
    ctx.font = `500 14px ${FONT}`;
    ctx.fillText(MOMENTO_LABEL[plato.momento], PAD + 24, y + 76 + titulo.length * 38 - 6);

    if (etiquetas.length > 0) {
      drawTags(ctx, etiquetas, PAD + 24, y + 76 + titulo.length * 38 + 20);
    }
  }
  y += cabeceraH + 16;

  // ── Tarjeta genérica ──
  const tarjeta = (tituloTarjeta: string, contenidoH: number, pintar: (top: number) => void) => {
    const h = CARD_PAD + 22 + contenidoH + CARD_PAD;
    if (draw) {
      roundRect(ctx, PAD, y, INNER_W, h, 14);
      ctx.fillStyle = C.surface;
      ctx.fill();
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = C.sageDark;
      ctx.font = `700 12px ${FONT}`;
      ctx.fillText(tituloTarjeta.toUpperCase(), PAD + CARD_PAD, y + CARD_PAD + 12);
      pintar(y + CARD_PAD + 22);
    }
    y += h + 14;
  };

  // ── Ingredientes (dos columnas) ──
  if (ingredientes.length > 0) {
    const FILA = 28;
    const filas = Math.ceil(ingredientes.length / 2);
    const colW = CARD_INNER_W / 2;
    tarjeta('Ingredientes', filas * FILA + 4, (top) => {
      ctx.font = `400 15px ${FONT}`;
      ingredientes.forEach((p, i) => {
        const col = i < filas ? 0 : 1;
        const fila = i < filas ? i : i - filas;
        const x = PAD + CARD_PAD + col * colW;
        const texto = p.emoji ? `${p.emoji}  ${p.nombre}` : `•  ${p.nombre}`;
        ctx.fillStyle = C.text;
        ctx.fillText(truncar(ctx, texto, colW - 10), x, top + 22 + fila * FILA);
      });
    });
  }

  // ── Preparación ──
  if (pasos.length > 0) {
    ctx.font = `400 15px ${FONT}`;
    const TEXTO_X = 36;
    const LINEA = 21;
    const bloques = pasos.map((paso) => wrapLines(ctx, paso, CARD_INNER_W - TEXTO_X));
    const altoPasos = bloques.reduce((acc, l) => acc + Math.max(l.length * LINEA, 26) + 10, 0);
    tarjeta('Preparación', altoPasos, (top) => {
      let py = top + 6;
      bloques.forEach((lineas, i) => {
        const x = PAD + CARD_PAD;
        ctx.beginPath();
        ctx.arc(x + 12, py + 12, 12, 0, Math.PI * 2);
        ctx.fillStyle = C.sage;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 12px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(String(i + 1), x + 12, py + 16);

        ctx.textAlign = 'left';
        ctx.fillStyle = C.text;
        ctx.font = `400 15px ${FONT}`;
        lineas.forEach((l, j) => ctx.fillText(l, x + TEXTO_X, py + 17 + j * LINEA));
        py += Math.max(lineas.length * LINEA, 26) + 10;
      });
    });
  }

  // ── Notas ──
  if (notas) {
    ctx.font = `italic 400 14px ${FONT}`;
    const lineas = wrapLines(ctx, notas, CARD_INNER_W);
    tarjeta('Notas', lineas.length * 20 + 6, (top) => {
      ctx.fillStyle = C.muted;
      ctx.font = `italic 400 14px ${FONT}`;
      lineas.forEach((l, j) => ctx.fillText(l, PAD + CARD_PAD, top + 18 + j * 20));
    });
  }

  // ── Pie ──
  y += 6;
  if (draw) {
    ctx.fillStyle = C.muted;
    ctx.font = `500 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Hecha con Comi2', W / 2, y + 14);
  }
  return y + 24 + PAD;
}

export async function generarImagenRecetaCanvas(datos: RecetaImagen): Promise<HTMLCanvasElement> {
  const logo = await cargarLogo();
  const tmp = document.createElement('canvas').getContext('2d')!;
  const contenido = pintarReceta(tmp, datos, logo, false);
  const alto = Math.max(MIN_H, contenido);

  const canvas = document.createElement('canvas');
  canvas.width = W * DPR;
  canvas.height = alto * DPR;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, alto);
  // Si la receta es corta, se centra en vertical dentro del formato 4:5
  ctx.translate(0, (alto - contenido) / 2);
  pintarReceta(ctx, datos, logo, true);
  return canvas;
}

function nombreArchivo(plato: Plato): string {
  const slug = plato.nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `receta-${slug || 'comi2'}`;
}

export async function guardarImagenReceta(datos: RecetaImagen): Promise<void> {
  return guardarCanvas(await generarImagenRecetaCanvas(datos), nombreArchivo(datos.plato));
}

export async function compartirImagenReceta(datos: RecetaImagen): Promise<boolean> {
  return compartirCanvas(
    await generarImagenRecetaCanvas(datos),
    nombreArchivo(datos.plato),
    datos.plato.nombre,
  );
}
