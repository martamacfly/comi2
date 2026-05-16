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
}

export interface EtiquetaConAsignacion extends Etiqueta {
  asignada: boolean;
}
