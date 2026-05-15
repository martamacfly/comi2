import { db } from '../db/database';
import type { Producto } from '../db/types';

export async function generarListaCompra(semanaId: number): Promise<Producto[]> {
  const slots = await db.planSlots
    .where('semanaId')
    .equals(semanaId)
    .filter((s) => s.platoId != null)
    .toArray();

  const platoIds = [...new Set(slots.map((s) => s.platoId!))];
  if (platoIds.length === 0) return [];

  const links = await db.platoProductos
    .where('platoId')
    .anyOf(platoIds)
    .toArray();
  const productoIds = [...new Set(links.map((l) => l.productoId))];
  if (productoIds.length === 0) return [];

  const productos = await db.productos.where('id').anyOf(productoIds).toArray();
  return productos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
