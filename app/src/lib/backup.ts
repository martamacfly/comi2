import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { emojiPorDefecto } from './producto-emoji';
import { db } from '../db/database';
import type {
  Etiqueta,
  MomentoPlato,
  MomentoSlot,
  PlanSlot,
  Plato,
  PlatoEtiqueta,
  PlatoProducto,
  Producto,
  Semana,
} from '../db/types';

export const BACKUP_FORMAT = 'comi2-backup' as const;
export const BACKUP_VERSION = 1 as const;

export type Comi2BackupPayload = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: {
    productos: Producto[];
    platos: Plato[];
    etiquetas: Etiqueta[];
    platoProductos: PlatoProducto[];
    platoEtiquetas: PlatoEtiqueta[];
    semanas: Semana[];
    planSlots: PlanSlot[];
  };
};

const MOMENTOS_PLATO: MomentoPlato[] = ['comida', 'cena', 'ambos'];
const MOMENTOS_SLOT: MomentoSlot[] = ['comida', 'cena'];

function isPositiveInt(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n > 0;
}

function reviveSemana(raw: Record<string, unknown>): Semana {
  const id = raw.id;
  const fecha = raw.fechaInicioLunes;
  if (!fecha || typeof fecha !== 'string') {
    throw new Error('Semana inválida: falta fechaInicioLunes');
  }
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Semana inválida: fechaInicioLunes no es una fecha');
  }
  const semana: Semana = { fechaInicioLunes: d };
  if (id !== undefined && id !== null) {
    if (!isPositiveInt(id)) throw new Error('Semana inválida: id');
    semana.id = id;
  }
  return semana;
}

function reviveProducto(raw: Record<string, unknown>): Producto {
  const nombre =
    typeof raw.nombre === 'string' ? raw.nombre.trim() : '';
  if (!nombre) throw new Error('Producto sin nombre');
  const emoji =
    typeof raw.emoji === 'string' && raw.emoji.trim()
      ? raw.emoji.trim()
      : emojiPorDefecto(nombre);
  const p: Producto = { nombre, emoji };
  if (raw.id !== undefined && raw.id !== null) {
    if (!isPositiveInt(raw.id)) throw new Error('Producto inválido: id');
    p.id = raw.id;
  }
  return p;
}

function revivePlato(raw: Record<string, unknown>): Plato {
  const nombre =
    typeof raw.nombre === 'string' ? raw.nombre.trim() : '';
  if (!nombre) throw new Error('Plato sin nombre');
  const momento = raw.momento;
  if (typeof momento !== 'string' || !MOMENTOS_PLATO.includes(momento as MomentoPlato)) {
    throw new Error('Plato inválido: momento');
  }
  const p: Plato = { nombre, momento: momento as MomentoPlato };
  if (raw.id !== undefined && raw.id !== null) {
    if (!isPositiveInt(raw.id)) throw new Error('Plato inválido: id');
    p.id = raw.id;
  }
  return p;
}

function reviveEtiqueta(raw: Record<string, unknown>): Etiqueta {
  const nombre =
    typeof raw.nombre === 'string' ? raw.nombre.trim() : '';
  if (!nombre) throw new Error('Etiqueta sin nombre');
  const color =
    typeof raw.color === 'string' && raw.color.trim()
      ? raw.color.trim()
      : '#c4d4c8';
  const e: Etiqueta = { nombre, color };
  if (raw.id !== undefined && raw.id !== null) {
    if (!isPositiveInt(raw.id)) throw new Error('Etiqueta inválida: id');
    e.id = raw.id;
  }
  return e;
}

function revivePlatoProducto(raw: Record<string, unknown>): PlatoProducto {
  if (!isPositiveInt(raw.platoId) || !isPositiveInt(raw.productoId)) {
    throw new Error('Relación plato–producto inválida');
  }
  const row: PlatoProducto = {
    platoId: raw.platoId,
    productoId: raw.productoId,
  };
  if (raw.id !== undefined && raw.id !== null && isPositiveInt(raw.id)) {
    row.id = raw.id;
  }
  return row;
}

function revivePlatoEtiqueta(raw: Record<string, unknown>): PlatoEtiqueta {
  if (!isPositiveInt(raw.platoId) || !isPositiveInt(raw.etiquetaId)) {
    throw new Error('Relación plato–etiqueta inválida');
  }
  const row: PlatoEtiqueta = {
    platoId: raw.platoId,
    etiquetaId: raw.etiquetaId,
  };
  if (raw.id !== undefined && raw.id !== null && isPositiveInt(raw.id)) {
    row.id = raw.id;
  }
  return row;
}

function revivePlanSlot(raw: Record<string, unknown>): PlanSlot {
  if (
    !isPositiveInt(raw.semanaId) ||
    typeof raw.diaSemana !== 'number' ||
    !Number.isInteger(raw.diaSemana) ||
    raw.diaSemana < 0 ||
    raw.diaSemana > 6
  ) {
    throw new Error('Hueco de semana inválido');
  }
  const momento = raw.momento;
  if (typeof momento !== 'string' || !MOMENTOS_SLOT.includes(momento as MomentoSlot)) {
    throw new Error('Hueco de semana inválido: momento');
  }
  const slot: PlanSlot = {
    semanaId: raw.semanaId,
    diaSemana: raw.diaSemana,
    momento: momento as MomentoSlot,
  };
  if (raw.platoId !== undefined && raw.platoId !== null) {
    if (!isPositiveInt(raw.platoId)) throw new Error('planSlot.platoId inválido');
    slot.platoId = raw.platoId;
  }
  if (raw.id !== undefined && raw.id !== null && isPositiveInt(raw.id)) {
    slot.id = raw.id;
  }
  return slot;
}

function ensureArray<T>(v: unknown, label: string): T[] {
  if (!Array.isArray(v)) throw new Error(`Se esperaba un array: ${label}`);
  return v as T[];
}

/** Lee y valida JSON exportado por Comi2. */
export function parseBackupJson(text: string): Comi2BackupPayload['data'] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    throw new Error('El archivo no es JSON válido');
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('JSON inválido');
  const root = parsed as Record<string, unknown>;
  if (root.format !== BACKUP_FORMAT) {
    throw new Error('El archivo no es un respaldo de Comi2');
  }
  if (root.version !== BACKUP_VERSION) {
    throw new Error(`Versión de respaldo no soportada (${String(root.version)})`);
  }
  const dataRaw = root.data;
  if (!dataRaw || typeof dataRaw !== 'object') throw new Error('Falta el bloque data');

  const d = dataRaw as Record<string, unknown>;

  const etiquetas = ensureArray<unknown>(d.etiquetas, 'etiquetas').map((x) =>
    reviveEtiqueta(x as Record<string, unknown>),
  );
  const productos = ensureArray<unknown>(d.productos, 'productos').map((x) =>
    reviveProducto(x as Record<string, unknown>),
  );
  const platos = ensureArray<unknown>(d.platos, 'platos').map((x) =>
    revivePlato(x as Record<string, unknown>),
  );
  const platoProductos = ensureArray<unknown>(d.platoProductos, 'platoProductos').map(
    (x) => revivePlatoProducto(x as Record<string, unknown>),
  );
  const platoEtiquetas = ensureArray<unknown>(d.platoEtiquetas, 'platoEtiquetas').map(
    (x) => revivePlatoEtiqueta(x as Record<string, unknown>),
  );
  const semanas = ensureArray<unknown>(d.semanas, 'semanas').map((x) =>
    reviveSemana(x as Record<string, unknown>),
  );
  const planSlots = ensureArray<unknown>(d.planSlots, 'planSlots').map((x) =>
    revivePlanSlot(x as Record<string, unknown>),
  );

  for (const p of productos) {
    if (p.id == null) throw new Error('Todos los productos deben tener id en el respaldo');
  }
  for (const p of platos) {
    if (p.id == null) throw new Error('Todos los platos deben tener id en el respaldo');
  }
  for (const e of etiquetas) {
    if (e.id == null) throw new Error('Todas las etiquetas deben tener id en el respaldo');
  }
  for (const s of semanas) {
    if (s.id == null) throw new Error('Todas las semanas deben tener id en el respaldo');
  }

  const sinDup = (ids: number[], label: string) => {
    if (ids.length !== new Set(ids).size) {
      throw new Error(`Hay ids duplicados en ${label}`);
    }
  };
  sinDup(
    productos.map((p) => p.id!),
    'productos',
  );
  sinDup(platos.map((p) => p.id!), 'platos');
  sinDup(etiquetas.map((e) => e.id!), 'etiquetas');
  sinDup(semanas.map((s) => s.id!), 'semanas');

  const productoIds = new Set(productos.map((p) => p.id).filter(isPositiveInt));
  const platoIds = new Set(platos.map((p) => p.id).filter(isPositiveInt));
  const etiquetaIds = new Set(etiquetas.map((e) => e.id).filter(isPositiveInt));
  const semanaIds = new Set(semanas.map((s) => s.id).filter(isPositiveInt));

  for (const row of platoProductos) {
    if (!platoIds.has(row.platoId)) {
      throw new Error(`Relación plato–producto referencia platoId ${row.platoId} inexistente`);
    }
    if (!productoIds.has(row.productoId)) {
      throw new Error(`Relación plato–producto referencia productoId ${row.productoId} inexistente`);
    }
  }
  for (const row of platoEtiquetas) {
    if (!platoIds.has(row.platoId)) {
      throw new Error(`Relación plato–etiqueta referencia platoId ${row.platoId} inexistente`);
    }
    if (!etiquetaIds.has(row.etiquetaId)) {
      throw new Error(`Relación plato–etiqueta referencia etiquetaId ${row.etiquetaId} inexistente`);
    }
  }
  for (const slot of planSlots) {
    if (!semanaIds.has(slot.semanaId)) {
      throw new Error(`Plan semanal referencia semanaId ${slot.semanaId} inexistente`);
    }
    if (slot.platoId != null && !platoIds.has(slot.platoId)) {
      throw new Error(`Plan semanal referencia platoId ${slot.platoId} inexistente`);
    }
  }

  return {
    productos,
    platos,
    etiquetas,
    platoProductos,
    platoEtiquetas,
    semanas,
    planSlots,
  };
}

export async function buildBackupPayload(): Promise<Comi2BackupPayload> {
  const [
    productos,
    platos,
    etiquetas,
    platoProductos,
    platoEtiquetas,
    semanas,
    planSlots,
  ] = await Promise.all([
    db.productos.toArray(),
    db.platos.toArray(),
    db.etiquetas.toArray(),
    db.platoProductos.toArray(),
    db.platoEtiquetas.toArray(),
    db.semanas.toArray(),
    db.planSlots.toArray(),
  ]);

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      productos,
      platos,
      etiquetas,
      platoProductos,
      platoEtiquetas,
      semanas,
      planSlots,
    },
  };
}

export async function downloadBackupFile(payload: Comi2BackupPayload): Promise<void> {
  const json = JSON.stringify(payload, null, 2);
  const day = new Date().toISOString().slice(0, 10);
  const filename = `comi2-respaldo-${day}.json`;

  // En Android nativo (Capacitor): escribir el fichero en Documents y compartirlo
  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({
      title: 'Respaldo Comi2',
      text: 'Copia de seguridad de Comi2',
      url: uri,
      dialogTitle: 'Guardar o compartir respaldo',
    });
    return;
  }

  // Fallback para navegadores de escritorio
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Sustituye por completo los datos de la base local por los del respaldo. */
export async function restoreBackupData(data: Comi2BackupPayload['data']): Promise<void> {
  const platoProductos = dedupePorClave(data.platoProductos, (r) =>
    `${r.platoId}-${r.productoId}`,
  );
  const platoEtiquetas = dedupePorClave(data.platoEtiquetas, (r) =>
    `${r.platoId}-${r.etiquetaId}`,
  );
  const planSlots = dedupePorClave(data.planSlots, (s) =>
    `${s.semanaId}-${s.diaSemana}-${s.momento}`,
  );

  await db.transaction(
    'rw',
    [
      db.planSlots,
      db.platoProductos,
      db.platoEtiquetas,
      db.platos,
      db.productos,
      db.etiquetas,
      db.semanas,
    ],
    async () => {
      await db.planSlots.clear();
      await db.platoProductos.clear();
      await db.platoEtiquetas.clear();
      await db.platos.clear();
      await db.productos.clear();
      await db.etiquetas.clear();
      await db.semanas.clear();

      if (data.etiquetas.length) await db.etiquetas.bulkPut(data.etiquetas);
      if (data.productos.length) await db.productos.bulkPut(data.productos);
      if (data.platos.length) await db.platos.bulkPut(data.platos);
      if (platoProductos.length) await db.platoProductos.bulkPut(platoProductos);
      if (platoEtiquetas.length) await db.platoEtiquetas.bulkPut(platoEtiquetas);
      if (data.semanas.length) await db.semanas.bulkPut(data.semanas);
      if (planSlots.length) await db.planSlots.bulkPut(planSlots);
    },
  );
}

function dedupePorClave<T>(rows: T[], keyFn: (row: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    const k = keyFn(row);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(row);
  }
  return out;
}
