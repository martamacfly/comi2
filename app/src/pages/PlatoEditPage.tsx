import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { TagChip } from '../components/TagChip';
import { db } from '../db/database';
import type { Etiqueta, MomentoPlato } from '../db/types';
import {
  ETIQUETA_COLORES_PREDEFINIDOS,
  normalizeHex,
} from '../lib/color';
import { InlineProductoAdd } from '../components/InlineProductoAdd';
import {
  actualizarEtiqueta,
  crearEtiqueta,
  eliminarEtiqueta,
  eliminarPlato,
  guardarPlato,
} from '../lib/platos';
import { CookingPot, X } from '@phosphor-icons/react';

export function PlatoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nuevo';
  const platoIdNum = isNew ? NaN : Number(id);
  const platoId =
    !isNew && Number.isFinite(platoIdNum) ? platoIdNum : undefined;

  const plato = useLiveQuery(
    () => (platoId != null && !Number.isNaN(platoId) ? db.platos.get(platoId) : undefined),
    [platoId],
  );
  const productos = useLiveQuery(() => db.productos.orderBy('nombre').toArray());
  const todasEtiquetas = useLiveQuery(() => db.etiquetas.orderBy('nombre').toArray());
  const productoIdsAsignados = useLiveQuery(
    () =>
      platoId != null
        ? db.platoProductos
            .where('platoId')
            .equals(platoId)
            .toArray()
            .then((r) => r.map((x) => x.productoId))
        : [],
    [platoId],
  );
  const etiquetaIdsAsignados = useLiveQuery(
    () =>
      platoId != null
        ? db.platoEtiquetas
            .where('platoId')
            .equals(platoId)
            .toArray()
            .then((r) => r.map((x) => x.etiquetaId))
        : [],
    [platoId],
  );

  const [nombre, setNombre] = useState('');
  const [momento, setMomento] = useState<MomentoPlato>('ambos');
  const [selectedProductoIds, setSelectedProductoIds] = useState<number[]>([]);
  const [selectedEtiquetaIds, setSelectedEtiquetaIds] = useState<number[]>([]);
  const [nuevaEtiquetaNombre, setNuevaEtiquetaNombre] = useState('');
  const [nuevaEtiquetaColor, setNuevaEtiquetaColor] = useState<string>(
    ETIQUETA_COLORES_PREDEFINIDOS[0],
  );
  const [editEtiqueta, setEditEtiqueta] = useState<Etiqueta | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadedFromDb, setLoadedFromDb] = useState(isNew);

  useEffect(() => {
    if (isNew || plato === undefined) return;
    if (plato === null) {
      navigate('/platos', { replace: true });
      return;
    }
    if (loadedFromDb) return;
    if (productoIdsAsignados === undefined || etiquetaIdsAsignados === undefined) {
      return;
    }
    setNombre(plato.nombre);
    setMomento(plato.momento);
    setSelectedProductoIds(productoIdsAsignados);
    setSelectedEtiquetaIds(etiquetaIdsAsignados);
    setLoadedFromDb(true);
  }, [
    isNew,
    plato,
    navigate,
    loadedFromDb,
    productoIdsAsignados,
    etiquetaIdsAsignados,
  ]);

  const etiquetasAsignadas =
    todasEtiquetas?.filter(
      (e) => e.id != null && selectedEtiquetaIds.includes(e.id),
    ) ?? [];

  const etiquetasDisponibles =
    todasEtiquetas?.filter(
      (e) => e.id != null && !selectedEtiquetaIds.includes(e.id),
    ) ?? [];

  const productosAsignados =
    productos
      ?.filter((p) => p.id != null && selectedProductoIds.includes(p.id))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) ?? [];

  const productosDisponibles =
    productos
      ?.filter((p) => p.id != null && !selectedProductoIds.includes(p.id))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) ?? [];

  const quitarProducto = (productoId: number) => {
    setSelectedProductoIds((prev) => prev.filter((x) => x !== productoId));
  };

  const toggleProducto = (productoId: number) => {
    setSelectedProductoIds((prev) =>
      prev.includes(productoId)
        ? prev.filter((x) => x !== productoId)
        : [...prev, productoId],
    );
  };

  const asignarEtiqueta = (etiquetaId: number) => {
    setSelectedEtiquetaIds((prev) =>
      prev.includes(etiquetaId) ? prev : [...prev, etiquetaId],
    );
  };

  const quitarEtiqueta = (etiquetaId: number) => {
    setSelectedEtiquetaIds((prev) => prev.filter((x) => x !== etiquetaId));
  };

  const crearYAsignarEtiqueta = async () => {
    try {
      const etiquetaId = await crearEtiqueta(
        nuevaEtiquetaNombre,
        normalizeHex(nuevaEtiquetaColor),
      );
      setSelectedEtiquetaIds((prev) =>
        prev.includes(etiquetaId) ? prev : [...prev, etiquetaId],
      );
      setNuevaEtiquetaNombre('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear etiqueta');
    }
  };

  const guardarEdicionEtiqueta = async () => {
    if (!editEtiqueta?.id) return;
    try {
      await actualizarEtiqueta(
        editEtiqueta.id,
        editEtiqueta.nombre,
        normalizeHex(editEtiqueta.color),
      );
      setEditEtiqueta(null);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar etiqueta');
    }
  };

  const borrarEtiquetaCatalogo = async (etiquetaId: number) => {
    if (!confirm('¿Eliminar esta etiqueta de todos los platos?')) return;
    await eliminarEtiqueta(etiquetaId);
    setSelectedEtiquetaIds((prev) => prev.filter((x) => x !== etiquetaId));
    if (editEtiqueta?.id === etiquetaId) setEditEtiqueta(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await guardarPlato({
        id: platoId,
        nombre,
        momento,
        productoIds: selectedProductoIds,
        etiquetaIds: selectedEtiquetaIds,
      });
      if (isNew) {
        navigate('/platos', {
          state: { platoCreado: nombre.trim() },
        });
      } else {
        navigate('/platos', {
          state: { platoActualizado: nombre.trim() },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (platoId == null) return;
    if (!confirm('¿Eliminar este plato?')) return;
    await eliminarPlato(platoId);
    navigate('/platos');
  };

  if (!isNew && (platoId == null || Number.isNaN(platoIdNum))) {
    return (
      <section className="page">
        <p className="muted">Plato no encontrado.</p>
        <Link to="/platos" className="btn-ghost">
          Volver a platos
        </Link>
      </section>
    );
  }

  if (!isNew && plato === undefined) {
    return (
      <section className="page">
        <p className="muted">Cargando…</p>
      </section>
    );
  }

  return (
    <section className="page">
      <p className="breadcrumb">
        <Link to="/platos">Platos</Link>
        <span> / </span>
        <span>{isNew ? 'Nuevo' : nombre || 'Editar'}</span>
      </p>

      <form className="plato-form" onSubmit={onSubmit}>
        <div className="plato-form__header">
          <CookingPot size={32} weight="duotone" className="plato-form__icon" aria-hidden />
          <div>
            <h1>{isNew ? 'Nuevo plato' : 'Editar plato'}</h1>
            {isNew && (
              <p className="page__lead plato-form__lead">
                Define el plato, sus ingredientes y etiquetas. Después podrás usarlo en la semana.
              </p>
            )}
          </div>
        </div>

        {isNew && (
          <ol className="form-steps">
            <li className="form-steps__item form-steps__item--active">Nombre y momento</li>
            <li className="form-steps__item">Etiquetas</li>
            <li className="form-steps__item">Productos</li>
          </ol>
        )}

        <label className="field">
          <span>Nombre del plato</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Lentejas con verduras"
            autoFocus={isNew}
            required
          />
        </label>

        <fieldset className="field">
          <legend>Momento</legend>
          <div className="radio-group">
            {(
              [
                ['comida', 'Comida'],
                ['cena', 'Cena'],
                ['ambos', 'Ambos'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="radio">
                <input
                  type="radio"
                  name="momento"
                  value={value}
                  checked={momento === value}
                  onChange={() => setMomento(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <span>Etiquetas del plato</span>
          <div className="tag-row">
            {etiquetasAsignadas.map((t) => (
              <TagChip
                key={t.id}
                etiqueta={t}
                onRemove={() => quitarEtiqueta(t.id!)}
              />
            ))}
            {etiquetasAsignadas.length === 0 && (
              <span className="muted">Sin etiquetas</span>
            )}
          </div>

          {etiquetasDisponibles.length > 0 && (
            <div className="etiqueta-pick">
              <span className="field-hint">Añadir existente:</span>
              <div className="tag-row">
                {etiquetasDisponibles.map((t) => (
                  <TagChip
                    key={t.id}
                    etiqueta={t}
                    onClick={() => asignarEtiqueta(t.id!)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="etiqueta-nueva">
            <span className="field-hint">Nueva etiqueta</span>
            <div className="form-inline">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevaEtiquetaNombre}
                onChange={(e) => setNuevaEtiquetaNombre(e.target.value)}
              />
              <input
                type="color"
                value={normalizeHex(nuevaEtiquetaColor)}
                onChange={(e) => setNuevaEtiquetaColor(e.target.value)}
                title="Color"
              />
              <button type="button" onClick={crearYAsignarEtiqueta}>
                Crear y asignar
              </button>
            </div>
            <div className="color-palette">
              {ETIQUETA_COLORES_PREDEFINIDOS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch${nuevaEtiquetaColor === c ? ' color-swatch--active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNuevaEtiquetaColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {todasEtiquetas && todasEtiquetas.length > 0 && (
          <details className="catalogo-etiquetas">
            <summary>Catálogo de etiquetas (editar o eliminar)</summary>
            <ul className="list">
              {todasEtiquetas.map((t) => (
                <li key={t.id} className="list__row list__row--wrap">
                  <TagChip etiqueta={t} small />
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setEditEtiqueta({ ...t })}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-danger"
                      onClick={() => borrarEtiquetaCatalogo(t.id!)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="field">
          <span>Productos del plato</span>
          <p className="field-hint">
            Lista de ingredientes de este plato. Se actualiza al añadir o quitar.
          </p>

          <div className="plato-productos-asignados">
            <span className="plato-productos-asignados__title">
              En este plato ({productosAsignados.length})
            </span>
            {productosAsignados.length === 0 ? (
              <p className="muted plato-productos-asignados__empty">
                Aún no hay productos. Añádelos desde el catálogo o crea uno nuevo.
              </p>
            ) : (
              <ul className="plato-productos-list">
                {productosAsignados.map((p) => (
                  <li key={p.id} className="plato-productos-list__item">
                    <span>{p.nombre}</span>
                    <button
                      type="button"
                      className="btn-icon btn-icon--remove"
                      onClick={() => quitarProducto(p.id!)}
                      aria-label={`Quitar ${p.nombre}`}
                    >
                      <X size={18} weight="bold" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <InlineProductoAdd
            onCreated={(id) =>
              setSelectedProductoIds((prev) =>
                prev.includes(id) ? prev : [...prev, id],
              )
            }
          />

          {productos === undefined ? (
            <p className="muted">Cargando catálogo…</p>
          ) : productos.length === 0 ? (
            <p className="muted">
              No hay productos en el catálogo. Crea el primero con el formulario de arriba.
            </p>
          ) : productosDisponibles.length > 0 ? (
            <details
              className="plato-productos-catalogo"
              open={productosAsignados.length === 0}
            >
              <summary>Añadir del catálogo ({productosDisponibles.length})</summary>
              <ul className="check-list check-list--spaced">
                {productosDisponibles.map((p) => (
                  <li key={p.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => toggleProducto(p.id!)}
                      />
                      {p.nombre}
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <p className="muted field-hint">
              Todos los productos del catálogo ya están en este plato.
            </p>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : isNew ? 'Crear plato' : 'Guardar cambios'}
          </button>
          <Link to="/platos" className="btn-ghost">
            Cancelar
          </Link>
          {!isNew && platoId != null && (
            <button type="button" className="btn-danger" onClick={onDelete}>
              Eliminar plato
            </button>
          )}
        </div>
      </form>

      {editEtiqueta && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-labelledby="edit-etiqueta-title">
            <h2 id="edit-etiqueta-title">Editar etiqueta</h2>
            <p className="muted">
              Los cambios se aplican a todos los platos que usan esta etiqueta.
            </p>
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={editEtiqueta.nombre}
                onChange={(e) =>
                  setEditEtiqueta({ ...editEtiqueta, nombre: e.target.value })
                }
              />
            </label>
            <label className="field">
              <span>Color</span>
              <input
                type="color"
                value={normalizeHex(editEtiqueta.color)}
                onChange={(e) =>
                  setEditEtiqueta({ ...editEtiqueta, color: e.target.value })
                }
              />
            </label>
            <TagChip etiqueta={editEtiqueta} />
            <div className="form-actions">
              <button type="button" className="btn-primary" onClick={guardarEdicionEtiqueta}>
                Guardar etiqueta
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setEditEtiqueta(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
