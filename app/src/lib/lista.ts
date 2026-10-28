import { db } from '../db/database';
import type { Producto } from '../db/types';

export async function generarListaCompra(semanaId: number): Promise<Producto[]> {
  const slots = await db.planSlots.where('semanaId').equals(semanaId).toArray();

  const platoIds = [
    ...new Set(slots.flatMap((s) => (s.platoId != null ? [s.platoId] : []))),
  ];
  const links =
    platoIds.length > 0
      ? await db.platoProductos.where('platoId').anyOf(platoIds).toArray()
      : [];
  // Productos de los platos y productos asignados directamente a un hueco
  const productoIds = [
    ...new Set([
      ...links.map((l) => l.productoId),
      ...slots.flatMap((s) => (s.productoId != null ? [s.productoId] : [])),
    ]),
  ];
  if (productoIds.length === 0) return [];

  const productos = await db.productos.where('id').anyOf(productoIds).toArray();
  return productos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
