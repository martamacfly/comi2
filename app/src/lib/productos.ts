import { db } from '../db/database';

export async function crearProducto(nombre: string): Promise<number> {
  const n = nombre.trim();
  if (!n) throw new Error('Escribe un nombre para el producto');
  const existente = await db.productos.where('nombre').equals(n).first();
  if (existente?.id != null) return existente.id;
  return db.productos.add({ nombre: n });
}
