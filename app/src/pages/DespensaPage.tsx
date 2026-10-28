import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Basket, CookingPot, Trash } from '@phosphor-icons/react';
import { db } from '../db/database';
import type { Plato, Producto } from '../db/types';
import {
  BuscadorPredictivo,
  type OpcionBuscador,
} from '../components/BuscadorPredictivo';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProductoEmoji } from '../components/ProductoEmoji';
import {
  agregarPlatoADespensa,
  agregarProductoADespensa,
  quitarDeDespensa,
} from '../lib/despensa';

export function DespensaPage() {
  const despensa = useLiveQuery(() => db.despensa.toArray());
  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
  const productos = useLiveQuery(() => db.productos.orderBy('nombre').toArray());

  const { platosEnDespensa, productosEnDespensa } = useMemo(() => {
    const platosEnDespensa: { itemId: number; plato: Plato }[] = [];
    const productosEnDespensa: { itemId: number; producto: Producto }[] = [];
    if (!despensa || !platos || !productos) {
      return { platosEnDespensa, productosEnDespensa };
    }
    for (const item of despensa) {
      if (item.id == null) continue;
      if (item.platoId != null) {
        const plato = platos.find((p) => p.id === item.platoId);
        if (plato) platosEnDespensa.push({ itemId: item.id, plato });
      } else if (item.productoId != null) {
        const producto = productos.find((p) => p.id === item.productoId);
        if (producto) productosEnDespensa.push({ itemId: item.id, producto });
      }
    }
    platosEnDespensa.sort((a, b) => a.plato.nombre.localeCompare(b.plato.nombre, 'es'));
    productosEnDespensa.sort((a, b) =>
      a.producto.nombre.localeCompare(b.producto.nombre, 'es'),
    );
    return { platosEnDespensa, productosEnDespensa };
  }, [despensa, platos, productos]);

  // Lo que aún no está en la despensa
  const opciones = useMemo<OpcionBuscador[]>(() => {
    if (!despensa || !platos || !productos) return [];
    const platoIds = new Set(despensa.map((d) => d.platoId));
    const productoIds = new Set(despensa.map((d) => d.productoId));
    return [
      ...platos
        .filter((p) => p.id != null && !platoIds.has(p.id))
        .map((p) => ({
          clave: `plato:${p.id}`,
          nombre: p.nombre,
          icono: <CookingPot size={20} weight="duotone" aria-hidden />,
          etiqueta: 'Plato',
        })),
      ...productos
        .filter((p) => p.id != null && !productoIds.has(p.id))
        .map((p) => ({
          clave: `producto:${p.id}`,
          nombre: p.nombre,
          icono: <ProductoEmoji producto={p} size="sm" />,
          etiqueta: 'Producto',
        })),
    ];
  }, [despensa, platos, productos]);

  const elegir = async (clave: string) => {
    const [tipo, id] = clave.split(':');
    if (tipo === 'plato') await agregarPlatoADespensa(Number(id));
    else await agregarProductoADespensa(Number(id));
  };

  const cargando =
    despensa === undefined || platos === undefined || productos === undefined;
  const catalogoVacio = !cargando && platos.length === 0 && productos.length === 0;

  return (
    <section className="page">
      <PageHeader
        title="Despensa"
        lead="Lo que tienes disponible. De aquí salen las opciones de Semana."
        icon={Basket}
        iconTone="lavender"
      />

      <BuscadorPredictivo
        id="despensa"
        opciones={opciones}
        onElegir={elegir}
        textoSinResultados={(t) =>
          `No hay platos ni productos que coincidan con «${t}».`
        }
        placeholder="Añade un plato o producto…"
        ariaLabel="Añadir a la despensa"
        disabled={cargando || catalogoVacio}
      />

      {catalogoVacio && (
        <p className="muted">
          Primero crea algún <Link to="/platos">plato</Link> o{' '}
          <Link to="/productos">producto</Link> para poder añadirlo a la despensa.
        </p>
      )}

      {cargando ? (
        <p className="muted">Cargando…</p>
      ) : platosEnDespensa.length === 0 && productosEnDespensa.length === 0 ? (
        <EmptyState icon={Basket} iconTone="lavender">
          <p className="muted">La despensa está vacía.</p>
        </EmptyState>
      ) : (
        <>
          {platosEnDespensa.length > 0 && (
            <div className="despensa-grupo">
              <h2 className="despensa-grupo__titulo">
                Platos <span className="muted">({platosEnDespensa.length})</span>
              </h2>
              <ul className="list">
                {platosEnDespensa.map(({ itemId, plato }) => (
                  <li key={itemId} className="list__row">
                    <Link to={`/platos/${plato.id}`} className="list__row-link">
                      <CookingPot size={20} weight="duotone" aria-hidden />
                      {plato.nombre}
                    </Link>
                    <button
                      type="button"
                      className="btn-ghost btn-ghost--icon"
                      onClick={() => void quitarDeDespensa(itemId)}
                      aria-label={`Quitar ${plato.nombre} de la despensa`}
                    >
                      <Trash size={18} weight="regular" aria-hidden />
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {productosEnDespensa.length > 0 && (
            <div className="despensa-grupo">
              <h2 className="despensa-grupo__titulo">
                Productos{' '}
                <span className="muted">({productosEnDespensa.length})</span>
              </h2>
              <ul className="list">
                {productosEnDespensa.map(({ itemId, producto }) => (
                  <li key={itemId} className="list__row">
                    <Link
                      to={`/productos/${producto.id}`}
                      className="list__row-link"
                    >
                      <ProductoEmoji producto={producto} size="sm" />
                      {producto.nombre}
                    </Link>
                    <button
                      type="button"
                      className="btn-ghost btn-ghost--icon"
                      onClick={() => void quitarDeDespensa(itemId)}
                      aria-label={`Quitar ${producto.nombre} de la despensa`}
                    >
                      <Trash size={18} weight="regular" aria-hidden />
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
