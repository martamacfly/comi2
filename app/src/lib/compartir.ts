import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import type { Plato, Producto } from '../db/types';

export type ResultadoCompartir = 'compartido' | 'copiado' | 'cancelado';

function nombreProducto(p: Producto): string {
  return p.emoji ? `${p.emoji} ${p.nombre}` : p.nombre;
}

function esCancelacion(e: unknown): boolean {
  const err = e as { name?: string; message?: string };
  return err?.name === 'AbortError' || /cancel/i.test(err?.message ?? '');
}

/**
 * Comparte texto con el menú del sistema (Android o navegador).
 * Si el navegador no sabe compartir, lo copia al portapapeles.
 */
export async function compartirTexto(titulo: string, texto: string): Promise<ResultadoCompartir> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ title: titulo, text: texto, dialogTitle: titulo });
      return 'compartido';
    }
    if (navigator.share) {
      await navigator.share({ title: titulo, text: texto });
      return 'compartido';
    }
  } catch (e) {
    if (esCancelacion(e)) return 'cancelado';
    throw e;
  }
  await navigator.clipboard.writeText(texto);
  return 'copiado';
}

export function textoReceta(plato: Plato, ingredientes: Producto[], conReceta: boolean): string {
  const lineas = [plato.nombre];
  if (ingredientes.length > 0) {
    lineas.push('', 'Ingredientes:', ...ingredientes.map((p) => `• ${nombreProducto(p)}`));
  }
  const pasos = conReceta ? (plato.pasos ?? []) : [];
  if (pasos.length > 0) {
    lineas.push('', 'Pasos:', ...pasos.map((paso, i) => `${i + 1}. ${paso}`));
  }
  if (conReceta && plato.notas) {
    lineas.push('', 'Notas:', plato.notas);
  }
  lineas.push('', 'Compartido desde Comi2');
  return lineas.join('\n');
}

export function textoListaCompra(pendientes: Producto[]): string {
  return [
    'Lista de la compra',
    '',
    ...pendientes.map((p) => `☐ ${nombreProducto(p)}`),
    '',
    'Compartido desde Comi2',
  ].join('\n');
}
