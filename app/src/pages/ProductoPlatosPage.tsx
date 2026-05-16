import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CookingPot, ForkKnife } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { EmptyState } from '../components/EmptyState';
import { MomentoBadge } from '../components/MomentoBadge';
import { ProductoInlineTitle } from '../components/ProductoInlineTitle';
import { getPlatosPorProducto } from '../lib/productos';

export function ProductoPlatosPage() {
  const { id } = useParams();
  const productoId = id != null ? Number(id) : NaN;
  const idValido = Number.isFinite(productoId) && productoId > 0;

  const producto = useLiveQuery(
    () => (idValido ? db.productos.get(productoId) : undefined),
    [productoId, idValido],
  );

  const platos = useLiveQuery(
    () => (idValido ? getPlatosPorProducto(productoId) : []),
    [productoId, idValido],
  );

  if (!idValido) {
    return (
      <section className="page">
        <p className="muted">Producto no encontrado.</p>
        <Link to="/productos" className="breadcrumb__link">
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Volver a productos
        </Link>
      </section>
    );
  }

  if (producto === undefined || platos === undefined) {
    return (
      <section className="page">
        <p className="muted">Cargando…</p>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className="page">
        <p className="muted">Producto no encontrado.</p>
        <Link to="/productos" className="breadcrumb__link">
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Volver a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <p className="breadcrumb">
        <Link to="/productos" className="breadcrumb__link">
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Productos
        </Link>
        <span> / </span>
        <span>{producto.nombre}</span>
      </p>

      <ProductoInlineTitle producto={producto} productoId={productoId} />

      <p className="page__lead producto-inline-title__lead">
        Platos que usan este ingrediente ({platos.length}).
      </p>

      {platos.length === 0 ? (
        <EmptyState icon={CookingPot} iconTone="peach">
          <p className="muted">
            Ningún plato incluye este producto todavía.
          </p>
          <Link to="/platos/nuevo" className="btn-primary btn-primary--icon">
            <CookingPot size={20} weight="duotone" aria-hidden />
            Crear un plato
          </Link>
        </EmptyState>
      ) : (
        <ul className="card-list">
          {platos.map((plato) => (
            <li key={plato.id}>
              <Link to={`/platos/${plato.id}`} className="card">
                <div className="card__top">
                  <div className="card__title-row">
                    <ForkKnife
                      size={20}
                      weight="duotone"
                      className="card__dish-icon"
                      aria-hidden
                    />
                    <strong>{plato.nombre}</strong>
                  </div>
                  <MomentoBadge momento={plato.momento} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
