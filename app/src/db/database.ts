import Dexie, { type Table } from 'dexie';
import { emojiPorDefecto } from '../lib/producto-emoji';
import type {
  Etiqueta,
  PlanSlot,
  Plato,
  PlatoEtiqueta,
  PlatoProducto,
  Producto,
  Semana,
} from './types';

export class Comi2Database extends Dexie {
  productos!: Table<Producto, number>;
  platos!: Table<Plato, number>;
  etiquetas!: Table<Etiqueta, number>;
  platoProductos!: Table<PlatoProducto, number>;
  platoEtiquetas!: Table<PlatoEtiqueta, number>;
  semanas!: Table<Semana, number>;
  planSlots!: Table<PlanSlot, number>;

  constructor() {
    super('comi2-db');

    this.version(1).stores({
      items: '++id, nombre, creadoEn',
    });

    this.version(2).stores({
      productos: '++id, nombre',
      platos: '++id, nombre, momento',
      etiquetas: '++id, nombre',
      platoProductos: '++id, platoId, productoId',
      platoEtiquetas: '++id, platoId, etiquetaId, [platoId+etiquetaId]',
      semanas: '++id, fechaInicioLunes',
      planSlots: '++id, semanaId, [semanaId+diaSemana+momento]',
    });

    this.version(3)
      .stores({
        productos: '++id, nombre',
        platos: '++id, nombre, momento',
        etiquetas: '++id, nombre',
        platoProductos: '++id, platoId, productoId',
        platoEtiquetas: '++id, platoId, etiquetaId, [platoId+etiquetaId]',
        semanas: '++id, fechaInicioLunes',
        planSlots: '++id, semanaId, [semanaId+diaSemana+momento]',
      })
      .upgrade(async (tx) => {
        await tx.table('productos').toCollection().modify((p: Producto) => {
          if (!p.emoji) p.emoji = emojiPorDefecto(p.nombre);
        });
      });
  }
}

export const db = new Comi2Database();
