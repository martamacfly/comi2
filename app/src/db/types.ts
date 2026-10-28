export type MomentoPlato = 'comida' | 'cena' | 'ambos';

export interface Producto {
  id?: number;
  nombre: string;
  emoji: string;
}

export interface Plato {
  id?: number;
  nombre: string;
  momento: MomentoPlato;
  /** Receta: pasos en orden */
  pasos?: string[];
  /** Receta: texto libre (trucos, variantes, enlace…) */
  notas?: string;
}

export interface Etiqueta {
  id?: number;
  nombre: string;
  color: string;
}

export interface PlatoProducto {
  id?: number;
  platoId: number;
  productoId: number;
}

export interface PlatoEtiqueta {
  id?: number;
  platoId: number;
  etiquetaId: number;
}

export interface Semana {
  id?: number;
  fechaInicioLunes: Date;
}

export type MomentoSlot = 'comida' | 'cena';

export interface PlanSlot {
  id?: number;
  semanaId: number;
  diaSemana: number;
  momento: MomentoSlot;
  platoId?: number;
  productoId?: number;
}

/** Plato o producto disponible en la despensa (uno de los dos ids). */
export interface DespensaItem {
  id?: number;
  platoId?: number;
  productoId?: number;
}

/** Secciones que se pueden activar o desactivar en Opciones. */
export type Modulo = 'despensa' | 'listaCompra' | 'recetas';

export interface AjusteModulo {
  clave: Modulo;
  activo: boolean;
}

export interface EtiquetaConAsignacion extends Etiqueta {
  asignada: boolean;
}
