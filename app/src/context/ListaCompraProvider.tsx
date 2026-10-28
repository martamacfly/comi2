import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ListaCompraContext } from './listaCompraContext';
import { generarListaCompra } from '../lib/lista';
import { obtenerSemanaActiva } from '../lib/semana';
import type { Producto } from '../db/types';

export function ListaCompraProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Producto[] | null>(null);
  const [yaTengoIds, setYaTengoIds] = useState<Set<number>>(() => new Set());
  const [generando, setGenerando] = useState(false);

  const semana = useLiveQuery(() => obtenerSemanaActiva());

  const generar = useCallback(async () => {
    if (!semana?.id) {
      setLista([]);
      setYaTengoIds(new Set());
      return;
    }
    setGenerando(true);
    try {
      const items = await generarListaCompra(semana.id);
      setLista(items);
      setYaTengoIds(new Set());
    } finally {
      setGenerando(false);
    }
  }, [semana?.id]);

  const borrarLista = useCallback(() => {
    setLista(null);
    setYaTengoIds(new Set());
  }, []);

  const marcarYaTengo = useCallback((productoId: number) => {
    setYaTengoIds((prev) => new Set(prev).add(productoId));
  }, []);

  const desmarcarYaTengo = useCallback((productoId: number) => {
    setYaTengoIds((prev) => {
      const next = new Set(prev);
      next.delete(productoId);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      lista,
      yaTengoIds,
      generando,
      generar,
      borrarLista,
      marcarYaTengo,
      desmarcarYaTengo,
    }),
    [
      lista,
      yaTengoIds,
      generando,
      generar,
      borrarLista,
      marcarYaTengo,
      desmarcarYaTengo,
    ],
  );

  return (
    <ListaCompraContext.Provider value={value}>
      {children}
    </ListaCompraContext.Provider>
  );
}
