import { db } from '../db/database';
import type { Etiqueta, MomentoPlato, Producto } from '../db/types';

export async function getEtiquetasDePlato(platoId: number): Promise<Etiqueta[]> {
  const links = await db.platoEtiquetas.where('platoId').equals(platoId).toArray();
  const ids = links.map((l) => l.etiquetaId);
  if (ids.length === 0) return [];
  return db.etiquetas.where('id').anyOf(ids).toArray();
}

export async function getProductosDePlato(platoId: number): Promise<Producto[]> {
  const links = await db.platoProductos.where('platoId').equals(platoId).toArray();
  const ids = links.map((l) => l.productoId);
  if (ids.length === 0) return [];
  return db.productos.where('id').anyOf(ids).toArray();
}

export async function syncPlatoProductos(
  platoId: number,
  productoIds: number[],
): Promise<void> {
  const actual = await db.platoProductos.where('platoId').equals(platoId).toArray();
  const actualIds = new Set(actual.map((a) => a.productoId));
  const deseado = new Set(productoIds);

  await Promise.all(
    actual
      .filter((a) => !deseado.has(a.productoId))
      .map((a) => db.platoProductos.delete(a.id!)),
  );

  await Promise.all(
    productoIds
      .filter((id) => !actualIds.has(id))
      .map((productoId) => db.platoProductos.add({ platoId, productoId })),
  );
}

export async function syncPlatoEtiquetas(
  platoId: number,
  etiquetaIds: number[],
): Promise<void> {
  const actual = await db.platoEtiquetas.where('platoId').equals(platoId).toArray();
  const actualIds = new Set(actual.map((a) => a.etiquetaId));
  const deseado = new Set(etiquetaIds);

  await Promise.all(
    actual
      .filter((a) => !deseado.has(a.etiquetaId))
      .map((a) => db.platoEtiquetas.delete(a.id!)),
  );

  await Promise.all(
    etiquetaIds
      .filter((id) => !actualIds.has(id))
      .map((etiquetaId) => db.platoEtiquetas.add({ platoId, etiquetaId })),
  );
}

export async function guardarPlato(
  datos: {
    id?: number;
    nombre: string;
    momento: MomentoPlato;
    productoIds: number[];
    etiquetaIds: number[];
  },
): Promise<number> {
  const nombre = datos.nombre.trim();
  if (!nombre) throw new Error('El nombre del plato es obligatorio');

  let platoId = datos.id;
  if (platoId != null) {
    await db.platos.update(platoId, { nombre, momento: datos.momento });
  } else {
    platoId = await db.platos.add({
      nombre,
      momento: datos.momento,
    });
  }

  await syncPlatoProductos(platoId, datos.productoIds);
  await syncPlatoEtiquetas(platoId, datos.etiquetaIds);
  return platoId;
}

export async function eliminarPlato(platoId: number): Promise<void> {
  await db.transaction(
    'rw',
    [db.platos, db.platoProductos, db.platoEtiquetas, db.planSlots],
    async () => {
      await db.platoProductos.where('platoId').equals(platoId).delete();
      await db.platoEtiquetas.where('platoId').equals(platoId).delete();
      const slots = await db.planSlots.where('platoId').equals(platoId).toArray();
      await Promise.all(
        slots.map((s) => db.planSlots.update(s.id!, { platoId: undefined })),
      );
      await db.platos.delete(platoId);
    },
  );
}

export async function crearEtiqueta(
  nombre: string,
  color: string,
): Promise<number> {
  const n = nombre.trim();
  if (!n) throw new Error('El nombre de la etiqueta es obligatorio');
  const existente = await db.etiquetas.where('nombre').equals(n).first();
  if (existente?.id != null) return existente.id;
  return db.etiquetas.add({ nombre: n, color });
}

export async function actualizarEtiqueta(
  id: number,
  nombre: string,
  color: string,
): Promise<void> {
  const n = nombre.trim();
  if (!n) throw new Error('El nombre de la etiqueta es obligatorio');
  const otro = await db.etiquetas.where('nombre').equals(n).first();
  if (otro?.id != null && otro.id !== id) {
    throw new Error('Ya existe una etiqueta con ese nombre');
  }
  await db.etiquetas.update(id, { nombre: n, color });
}

export async function eliminarEtiqueta(etiquetaId: number): Promise<void> {
  await db.transaction('rw', [db.etiquetas, db.platoEtiquetas], async () => {
    await db.platoEtiquetas.where('etiquetaId').equals(etiquetaId).delete();
    await db.etiquetas.delete(etiquetaId);
  });
}
