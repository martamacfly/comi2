import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Modulo } from '../db/types';

export type EstadoModulos = Record<Modulo, boolean>;

export const MODULOS: { clave: Modulo; nombre: string; descripcion: string }[] = [
  {
    clave: 'despensa',
    nombre: 'Despensa',
    descripcion:
      'Apunta los platos y productos que tienes. Semana solo ofrecerá lo que haya en la despensa.',
  },
  {
    clave: 'listaCompra',
    nombre: 'Lista de la compra',
    descripcion:
      'Genera la lista de la compra con los productos de lo que hayas planificado en Semana.',
  },
  {
    clave: 'recetas',
    nombre: 'Recetas',
    descripcion: 'Añade pasos y notas a cada plato y consúltalos en su ficha.',
  },
];

/** Al instalar, todo está activado. */
export const MODULOS_POR_DEFECTO: EstadoModulos = {
  despensa: true,
  listaCompra: true,
  recetas: true,
};

/** Estado de las secciones opcionales; `undefined` mientras carga. */
export function useModulos(): EstadoModulos | undefined {
  return useLiveQuery(async () => {
    const guardados = await db.ajustes.toArray();
    const estado = { ...MODULOS_POR_DEFECTO };
    for (const a of guardados) {
      if (a.clave in estado) estado[a.clave] = a.activo;
    }
    return estado;
  });
}

export async function activarModulo(clave: Modulo, activo: boolean): Promise<void> {
  await db.ajustes.put({ clave, activo });
}
