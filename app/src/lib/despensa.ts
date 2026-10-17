import { db } from '../db/database';

export async function agregarPlatoADespensa(platoId: number): Promise<void> {
  const existe = await db.despensa.where('platoId').equals(platoId).count();
  if (existe === 0) await db.despensa.add({ platoId });
}

export async function agregarProductoADespensa(productoId: number): Promise<void> {
  const existe = await db.despensa.where('productoId').equals(productoId).count();
  if (existe === 0) await db.despensa.add({ productoId });
}

export async function quitarDeDespensa(id: number): Promise<void> {
  await db.despensa.delete(id);
}

export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}
