import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Basket,
  CookingPot,
  MagnifyingGlass,
  Trash,
  X,
} from '@phosphor-icons/react';
import { db } from '../db/database';
import type { Plato, Producto } from '../db/types';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProductoEmoji } from '../components/ProductoEmoji';
import {
  agregarPlatoADespensa,
  agregarProductoADespensa,
  normalizarBusqueda,
  quitarDeDespensa,
} from '../lib/despensa';

const MAX_SUGERENCIAS = 8;

type Sugerencia =
  | { tipo: 'plato'; plato: Plato }
  | { tipo: 'producto'; producto: Producto };

function nombreSugerencia(s: Sugerencia): string {
  return s.tipo === 'plato' ? s.plato.nombre : s.producto.nombre;
}

function claveSugerencia(s: Sugerencia): string {
  return s.tipo === 'plato' ? `plato-${s.plato.id}` : `producto-${s.producto.id}`;
}

export function DespensaPage() {
  const despensa = useLiveQuery(() => db.despensa.toArray());
  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
  const productos = useLiveQuery(() => db.productos.orderBy('nombre').toArray());

  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);

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

  const sugerencias = useMemo<Sugerencia[]>(() => {
    const q = normalizarBusqueda(consulta);
    if (!q || !despensa || !platos || !productos) return [];
    const platoIds = new Set(despensa.map((d) => d.platoId).filter((id) => id != null));
    const productoIds = new Set(
      despensa.map((d) => d.productoId).filter((id) => id != null),
    );
    const candidatas: Sugerencia[] = [
      ...platos
        .filter((p) => p.id != null && !platoIds.has(p.id))
        .map((plato): Sugerencia => ({ tipo: 'plato', plato })),
      ...productos
        .filter((p) => p.id != null && !productoIds.has(p.id))
        .map((producto): Sugerencia => ({ tipo: 'producto', producto })),
    ];
    // Primero las que empiezan por la consulta, luego las que la contienen
    const empiezan: Sugerencia[] = [];
    const contienen: Sugerencia[] = [];
    for (const s of candidatas) {
      const n = normalizarBusqueda(nombreSugerencia(s));
      if (n.startsWith(q)) empiezan.push(s);
      else if (n.includes(q)) contienen.push(s);
    }
    const porNombre = (a: Sugerencia, b: Sugerencia) =>
      nombreSugerencia(a).localeCompare(nombreSugerencia(b), 'es');
    return [...empiezan.sort(porNombre), ...contienen.sort(porNombre)].slice(
      0,
      MAX_SUGERENCIAS,
    );
  }, [consulta, despensa, platos, productos]);

  const elegir = async (s: Sugerencia) => {
    // Limpiar antes de guardar para no borrar lo que se teclee mientras tanto
    setConsulta('');
    setActivo(0);
    if (s.tipo === 'plato') await agregarPlatoADespensa(s.plato.id!);
    else await agregarProductoADespensa(s.producto.id!);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && sugerencias.length > 0) {
      e.preventDefault();
      setAbierto(true);
      setActivo((i) => (i + 1) % sugerencias.length);
    } else if (e.key === 'ArrowUp' && sugerencias.length > 0) {
      e.preventDefault();
      setActivo((i) => (i - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = sugerencias[activo];
      if (s) void elegir(s);
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  };

  const cargando =
    despensa === undefined || platos === undefined || productos === undefined;
  const catalogoVacio = !cargando && platos.length === 0 && productos.length === 0;
  const mostrarSugerencias = abierto && consulta.trim() !== '';

  return (
    <section className="page">
      <PageHeader
        title="Despensa"
        lead="Lo que tienes disponible. De aquí salen las opciones de Semana."
        icon={Basket}
        iconTone="lavender"
      />

      <div className="despensa-buscador">
        <div className="platos-search despensa-buscador__campo">
          <MagnifyingGlass
            size={18}
            weight="regular"
            className="platos-search__icon"
            aria-hidden
          />
          <input
            type="text"
            className="platos-search__input"
            placeholder="Añade un plato o producto…"
            value={consulta}
            onChange={(e) => {
              setConsulta(e.target.value);
              setActivo(0);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            onBlur={() => setAbierto(false)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={mostrarSugerencias}
            aria-controls="despensa-sugerencias"
            aria-autocomplete="list"
            aria-activedescendant={
              mostrarSugerencias && sugerencias[activo]
                ? `despensa-sug-${claveSugerencia(sugerencias[activo])}`
                : undefined
            }
            aria-label="Añadir a la despensa"
            autoComplete="off"
            disabled={cargando || catalogoVacio}
          />
          {consulta && (
            <button
              type="button"
              className="platos-search__clear"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setConsulta('')}
              aria-label="Borrar búsqueda"
            >
              <X size={16} weight="bold" aria-hidden />
            </button>
          )}
        </div>

        {mostrarSugerencias && (
          <ul
            id="despensa-sugerencias"
            className="despensa-sugerencias"
            role="listbox"
          >
            {sugerencias.length === 0 ? (
              <li className="despensa-sugerencias__vacio muted">
                No hay platos ni productos que coincidan con «{consulta.trim()}».
              </li>
            ) : (
              sugerencias.map((s, i) => (
                <li
                  key={claveSugerencia(s)}
                  id={`despensa-sug-${claveSugerencia(s)}`}
                  role="option"
                  aria-selected={i === activo}
                  className={`despensa-sugerencias__item${
                    i === activo ? ' despensa-sugerencias__item--activo' : ''
                  }`}
                  // mousedown para que el blur del input no cierre antes del click
                  onMouseDown={(e) => {
                    e.preventDefault();
                    void elegir(s);
                  }}
                  onMouseEnter={() => setActivo(i)}
                >
                  {s.tipo === 'plato' ? (
                    <CookingPot size={20} weight="duotone" aria-hidden />
                  ) : (
                    <ProductoEmoji producto={s.producto} size="sm" />
                  )}
                  <span className="despensa-sugerencias__nombre">
                    {nombreSugerencia(s)}
                  </span>
                  <span className="despensa-sugerencias__tipo">
                    {s.tipo === 'plato' ? 'Plato' : 'Producto'}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

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
