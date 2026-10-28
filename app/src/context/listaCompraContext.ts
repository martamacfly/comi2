import { createContext } from 'react';
import type { Producto } from '../db/types';

export type ListaCompraContextValue = {
  lista: Producto[] | null;
  yaTengoIds: ReadonlySet<number>;
  generando: boolean;
  generar: () => Promise<void>;
  borrarLista: () => void;
  marcarYaTengo: (productoId: number) => void;
  desmarcarYaTengo: (productoId: number) => void;
};

export const ListaCompraContext =
  createContext<ListaCompraContextValue | null>(null);
