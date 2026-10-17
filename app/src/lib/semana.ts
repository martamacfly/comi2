import { db } from '../db/database';
import type { MomentoSlot, PlanSlot, Semana } from '../db/types';

export type SemanaPlatoNuevoState = {
  desdeSemana: {
    semanaId: number;
    diaSemana: number;
    momento: MomentoSlot;
  };
};

export const NUEVO_PLATO_SELECT = '__nuevo__';

/** Lo que puede ocupar un hueco de la semana: un plato o un producto. */
export type ElementoSlot = { platoId: number } | { productoId: number };

export async function asignarEnSlot(
  semanaId: number,
  diaSemana: number,
  momento: MomentoSlot,
  elemento: ElementoSlot,
): Promise<void> {
  const cambios: Partial<PlanSlot> =
    'platoId' in elemento
      ? { platoId: elemento.platoId, productoId: undefined }
      : { productoId: elemento.productoId, platoId: undefined };
  const slots = await db.planSlots.where('semanaId').equals(semanaId).toArray();
  const existente = slots.find(
    (s) => s.diaSemana === diaSemana && s.momento === momento,
  );
  if (existente?.id != null) {
    await db.planSlots.update(existente.id, cambios);
  } else {
    await db.planSlots.add({ semanaId, diaSemana, momento, ...cambios });
  }
}

export function lunesDeSemana(fecha = new Date()): Date {
  const d = new Date(fecha);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

/** IndexedDB puede devolver Date como string ISO */
export function toDate(value: Date | string | number): Date {
  const d = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Fecha inválida');
  }
  return d;
}

export function mismaFecha(
  a: Date | string | number,
  b: Date | string | number,
): boolean {
  const da = toDate(a);
  const dbDate = toDate(b);
  return (
    da.getFullYear() === dbDate.getFullYear() &&
    da.getMonth() === dbDate.getMonth() &&
    da.getDate() === dbDate.getDate()
  );
}

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export async function obtenerOCrearSemanaActiva(): Promise<Semana> {
  const lunes = lunesDeSemana();
  const todas = await db.semanas.toArray();

  const existente = todas.find((s) => mismaFecha(s.fechaInicioLunes, lunes));
  if (existente?.id != null) {
    return existente;
  }

  const id = await db.semanas.add({ fechaInicioLunes: lunes });
  const creada = await db.semanas.get(id);
  if (!creada?.id) {
    throw new Error('No se pudo crear la semana');
  }
  return creada;
}

export async function obtenerSemanaActiva(): Promise<Semana | undefined> {
  const lunes = lunesDeSemana();
  const todas = await db.semanas.toArray();
  return todas.find((s) => mismaFecha(s.fechaInicioLunes, lunes));
}
