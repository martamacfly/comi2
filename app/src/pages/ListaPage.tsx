import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardText,
  Confetti,
  House,
  ShoppingCart,
  Sparkle,
  Trash,
} from '@phosphor-icons/react';
import { ProductoEmoji } from '../components/ProductoEmoji';
import { useListaCompra } from '../context/useListaCompra';
import { PageHeader } from '../components/PageHeader';
import type { Producto } from '../db/types';

export function ListaPage() {
  const {
    lista,
    yaTengoIds,
    generando,
    generar,
    borrarLista,
    marcarYaTengo,
    desmarcarYaTengo,
  } = useListaCompra();

  const { pendientes, yaEnCasa } = useMemo(() => {
    if (!lista) return { pendientes: [], yaEnCasa: [] };
    const pendientes: Producto[] = [];
    const yaEnCasa: Producto[] = [];
    for (const p of lista) {
      if (p.id == null) continue;
      if (yaTengoIds.has(p.id)) yaEnCasa.push(p);
      else pendientes.push(p);
    }
    return { pendientes, yaEnCasa };
  }, [lista, yaTengoIds]);

  return (
    <section className="page">
      <PageHeader
        title="Lista de la compra"
        lead="Marca lo que ya tienes en casa para quitarlo de la compra."
        icon={ClipboardText}
        iconTone="lavender"
      />

      <div className="btn-group lista-compra__actions">
        <button
          type="button"
          className="btn-primary btn-primary--icon"
          onClick={() => void generar()}
          disabled={generando}
        >
          <Sparkle size={20} weight="duotone" aria-hidden />
          {generando ? 'Generando…' : 'Generar lista'}
        </button>
        {lista !== null && (
          <button
            type="button"
            className="btn-secondary"
            onClick={borrarLista}
            disabled={generando}
          >
            <Trash size={20} weight="duotone" aria-hidden />
            Borrar lista
          </button>
        )}
      </div>

      {lista === null ? (
        <p className="muted lista-compra__hint">Pulsa el botón para generar la lista.</p>
      ) : lista.length === 0 ? (
        <p className="muted lista-compra__hint">
          No hay productos. Planifica platos en{' '}
          <Link to="/semana">Semana</Link> y asegúrate de que tengan productos.
        </p>
      ) : (
        <div className="lista-compra__result">
          <p
            className={
              pendientes.length === 0
                ? 'lista-compra__resumen lista-compra__resumen--done'
                : 'lista-compra__resumen'
            }
            role="status"
          >
            {pendientes.length === 0 ? (
              <>
                <Confetti size={22} weight="duotone" aria-hidden />
                ¡Todo listo! No queda nada por comprar.
              </>
            ) : (
              <>
                <ShoppingCart size={20} weight="duotone" aria-hidden />
                <span>
                  <strong>{pendientes.length}</strong>
                  {pendientes.length === 1
                    ? ' producto por comprar'
                    : ' productos por comprar'}
                  {yaEnCasa.length > 0 && (
                    <>
                      {' '}
                      · {yaEnCasa.length} ya en casa
                    </>
                  )}
                </span>
              </>
            )}
          </p>

          {pendientes.length > 0 && (
            <ul className="check-list lista-compra">
              {pendientes.map((p) => (
                <li key={p.id}>
                  <label className="lista-compra__item">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => marcarYaTengo(p.id!)}
                      aria-label={`Ya tengo ${p.nombre}`}
                    />
                    <ProductoEmoji producto={p} size="sm" />
                    <span className="lista-compra__nombre">{p.nombre}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {yaEnCasa.length > 0 && (
            <details className="lista-compra__tengo">
              <summary>
                <House size={18} weight="duotone" aria-hidden />
                Ya en casa ({yaEnCasa.length})
              </summary>
              <ul className="check-list lista-compra lista-compra--tengo">
                {yaEnCasa.map((p) => (
                  <li key={p.id}>
                    <label className="lista-compra__item">
                      <input
                        type="checkbox"
                        checked
                        onChange={() => desmarcarYaTengo(p.id!)}
                        aria-label={`Volver a añadir ${p.nombre} a la compra`}
                      />
                      <ProductoEmoji producto={p} size="sm" />
                      <span className="lista-compra__nombre">{p.nombre}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
