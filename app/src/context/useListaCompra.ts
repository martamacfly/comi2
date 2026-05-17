import { useContext } from 'react';
import {
  ListaCompraContext,
  type ListaCompraContextValue,
} from './listaCompraContext';

export function useListaCompra(): ListaCompraContextValue {
  const ctx = useContext(ListaCompraContext);
  if (!ctx) {
    throw new Error('useListaCompra debe usarse dentro de ListaCompraProvider');
  }
  return ctx;
}
