import { db } from '../db/database';
import type { Plato, Producto } from '../db/types';
import { emojiPorDefecto, normalizarEmoji } from './producto-emoji';

export async function getPlatosPorProducto(productoId: number): Promise<Plato[]> {
  const links = await db.platoProductos
    .where('productoId')
    .equals(productoId)
    .toArray();
  const platoIds = [...new Set(links.map((l) => l.platoId))];
  if (platoIds.length === 0) return [];
  const platos = await db.platos.where('id').anyOf(platoIds).toArray();
  return platos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export async function crearProducto(
  nombre: string,
  emoji?: string,
): Promise<number> {
  const n = nombre.trim();
  if (!n) throw new Error('Escribe un nombre para el producto');
  const existente = await db.productos.where('nombre').equals(n).first();
  if (existente?.id != null) return existente.id;
  const e = emoji ? normalizarEmoji(emoji) : emojiPorDefecto(n);
  return db.productos.add({ nombre: n, emoji: e });
}

export async function actualizarProducto(
  id: number,
  datos: Partial<Pick<Producto, 'nombre' | 'emoji'>>,
): Promise<void> {
  const actual = await db.productos.get(id);
  if (!actual) throw new Error('Producto no encontrado');

  const nombre =
    datos.nombre !== undefined ? datos.nombre.trim() : actual.nombre;
  if (!nombre) throw new Error('El nombre del producto es obligatorio');

  const emoji =
    datos.emoji !== undefined
      ? normalizarEmoji(datos.emoji)
      : actual.emoji ?? emojiPorDefecto(nombre);

  const otro = await db.productos.where('nombre').equals(nombre).first();
  if (otro?.id != null && otro.id !== id) {
    throw new Error('Ya existe un producto con ese nombre');
  }

  await db.productos.update(id, { nombre, emoji });
}
