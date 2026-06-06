import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { textColorForBackground } from './color';

export type MomentoResumen = {
  momento: 'comida' | 'cena';
  plato: { nombre: string } | undefined;
  tags: Array<{ id?: number; nombre: string; color: string }>;
};

export type DiaResumen = {
  diaLabel: string;
  momentos: MomentoResumen[];
};

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#f7f6f3',
  surface: '#ffffff',
  border: '#e5e1dc',
  text: '#1a1916',
  muted: '#6b6560',
  sage: '#7fa896',
  sageDark: '#4d7a66',
  comida: '#b45309',
  cena: '#4f46e5',
  strip: '#f0ede9',
} as const;

const DPR = 2;
const W = 720;
const PAD = 36;
const INNER_W = W - PAD * 2;
const DAY_STRIP_H = 36;
const ROW_H = 34;
const TAG_H = 22;
const TAG_PAD_X = 8;
const TAG_RADIUS = 11;
const TAG_GAP = 6;
const FONT = 'system-ui, -apple-system, sans-serif';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function tagsWidth(
  ctx: CanvasRenderingContext2D,
  tags: DiaResumen['momentos'][0]['tags'],
): number {
  let total = 0;
  for (const t of tags) {
    ctx.font = `500 11px ${FONT}`;
    const tw = ctx.measureText(t.nombre).width;
    total += tw + TAG_PAD_X * 2 + TAG_GAP;
  }
  return total - TAG_GAP;
}

function drawTags(
  ctx: CanvasRenderingContext2D,
  tags: DiaResumen['momentos'][0]['tags'],
  startX: number,
  cy: number,
) {
  let x = startX;
  ctx.font = `500 11px ${FONT}`;
  for (const t of tags) {
    const tw = ctx.measureText(t.nombre).width;
    const pillW = tw + TAG_PAD_X * 2;
    roundRect(ctx, x, cy - TAG_H / 2, pillW, TAG_H, TAG_RADIUS);
    ctx.fillStyle = t.color;
    ctx.fill();
    ctx.fillStyle = textColorForBackground(t.color);
    ctx.fillText(t.nombre, x + TAG_PAD_X, cy + 4);
    x += pillW + TAG_GAP;
  }
}

function calcDayHeight(
  ctx: CanvasRenderingContext2D,
  dia: DiaResumen,
): number {
  let h = DAY_STRIP_H;
  for (const m of dia.momentos) {
    h += ROW_H;
    if (m.tags.length > 0) {
      const tw = tagsWidth(ctx, m.tags);
      if (tw > INNER_W - 180) h += TAG_H + 6;
    }
  }
  return h + 12;
}

export function generarImagenSemanaCanvas(dias: DiaResumen[]): HTMLCanvasElement {
  // Calcular altura total en un canvas temporal
  const tmp = document.createElement('canvas');
  tmp.width = W * DPR;
  tmp.height = 10;
  const tmpCtx = tmp.getContext('2d')!;

  const HEADER_H = 96;
  const FOOTER_H = 44;
  let totalH = PAD + HEADER_H;
  for (const dia of dias) totalH += calcDayHeight(tmpCtx, dia) + 12;
  totalH += FOOTER_H + PAD;

  // Canvas real
  const canvas = document.createElement('canvas');
  canvas.width = W * DPR;
  canvas.height = totalH * DPR;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);

  // Fondo
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, totalH);

  // ── Cabecera ──
  let y = PAD + 8;
  ctx.fillStyle = C.sageDark;
  ctx.font = `700 26px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Menú de la semana', W / 2, y + 26);
  y += 42;

  ctx.fillStyle = C.muted;
  ctx.font = `400 13px ${FONT}`;
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  ctx.fillText(`${fmt(lunes)} – ${fmt(domingo)}`, W / 2, y + 14);
  y += 36;

  // Separador
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  y += 16;

  ctx.textAlign = 'left';

  // ── Días ──
  for (const dia of dias) {
    const dH = calcDayHeight(tmpCtx, dia);

    // Tarjeta
    roundRect(ctx, PAD, y, INNER_W, dH, 10);
    ctx.fillStyle = C.surface;
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Strip del día
    roundRect(ctx, PAD, y, INNER_W, DAY_STRIP_H, 10);
    ctx.fillStyle = C.strip;
    ctx.fill();
    // Corregir bordes inferiores del strip (cuadrados)
    ctx.fillRect(PAD, y + DAY_STRIP_H - 10, INNER_W, 10);

    ctx.fillStyle = C.sageDark;
    ctx.font = `700 13px ${FONT}`;
    ctx.fillText(dia.diaLabel.toUpperCase(), PAD + 14, y + DAY_STRIP_H / 2 + 5);

    let ry = y + DAY_STRIP_H + 8;

    // Filas de momentos
    for (const m of dia.momentos) {
      const isComida = m.momento === 'comida';
      const accentColor = isComida ? C.comida : C.cena;
      const label = isComida ? 'Comida' : 'Cena';

      // Indicador de color
      ctx.fillStyle = accentColor;
      roundRect(ctx, PAD + 14, ry + 8, 3, 18, 2);
      ctx.fill();

      // Label
      ctx.fillStyle = accentColor;
      ctx.font = `600 12px ${FONT}`;
      ctx.fillText(label, PAD + 24, ry + 21);

      // Nombre del plato
      const nombreX = PAD + 88;
      const maxNombreW = INNER_W - 88 - 14;
      ctx.fillStyle = m.plato ? C.text : C.muted;
      ctx.font = m.plato ? `500 13px ${FONT}` : `400 13px ${FONT}`;
      const nombre = m.plato?.nombre ?? '— Sin plato —';

      // Truncar si es demasiado largo (cuando hay tags en línea)
      const tagsW = m.tags.length > 0 ? tagsWidth(tmpCtx, m.tags) : 0;
      const disponible = tagsW > 0
        ? maxNombreW - tagsW - 10
        : maxNombreW;

      let textoNombre = nombre;
      if (ctx.measureText(textoNombre).width > disponible) {
        while (
          textoNombre.length > 1 &&
          ctx.measureText(textoNombre + '…').width > disponible
        ) {
          textoNombre = textoNombre.slice(0, -1);
        }
        textoNombre += '…';
      }

      ctx.fillText(textoNombre, nombreX, ry + 21);

      // Tags en la misma fila (si caben) o en la siguiente
      if (m.tags.length > 0) {
        const nombreW = ctx.measureText(textoNombre).width;
        const tagsStartX = nombreX + nombreW + 10;
        if (tagsStartX + tagsW <= PAD + INNER_W - 14) {
          drawTags(ctx, m.tags, tagsStartX, ry + 17);
          ry += ROW_H;
        } else {
          ry += ROW_H;
          drawTags(ctx, m.tags, PAD + 88, ry - TAG_H / 2 - 2);
          ry += TAG_H + 6;
        }
      } else {
        ry += ROW_H;
      }
    }

    y += dH + 12;
  }

  // ── Pie ──
  y += 4;
  ctx.fillStyle = C.muted;
  ctx.font = `400 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Generado con Comi2', W / 2, y + 20);

  return canvas;
}

export async function compartirImagenSemana(dias: DiaResumen[]): Promise<void> {
  const canvas = generarImagenSemanaCanvas(dias);
  const day = new Date().toISOString().slice(0, 10);
  const filename = `menu-semana-${day}.png`;

  if (Capacitor.isNativePlatform()) {
    // En Android: escribir como base64 y compartir
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
    });
    await Share.share({
      title: 'Menú de la semana',
      text: 'Menú semanal generado con Comi2',
      url: uri,
      dialogTitle: 'Guardar o compartir menú',
    });
    return;
  }

  // Navegador de escritorio: descarga directa
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
