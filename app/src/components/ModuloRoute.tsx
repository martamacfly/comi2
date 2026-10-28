import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { Modulo } from '../db/types';
import { useModulos } from '../lib/opciones';

/** Muestra la página solo si su sección está activada en Opciones. */
export function ModuloRoute({
  modulo,
  children,
}: {
  modulo: Modulo;
  children: ReactNode;
}) {
  const modulos = useModulos();
  if (modulos === undefined) return null;
  if (!modulos[modulo]) return <Navigate to="/platos" replace />;
  return children;
}
