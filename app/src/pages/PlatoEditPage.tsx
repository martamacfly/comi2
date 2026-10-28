import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ProductoEmoji } from '../components/ProductoEmoji';
import { TagChip } from '../components/TagChip';
import { db } from '../db/database';
import type { Etiqueta, MomentoPlato } from '../db/types';
import {
  ETIQUETA_COLORES_PREDEFINIDOS,
  normalizeHex,
} from '../lib/color';
import {
  BuscadorPredictivo,
  type OpcionBuscador,
} from '../components/BuscadorPredictivo';
import { crearProducto } from '../lib/productos';
import { agregarPlatoADespensa, normalizarBusqueda } from '../lib/despensa';
import { useModulos } from '../lib/opciones';
import { asignarEnSlot, type SemanaPlatoNuevoState } from '../lib/semana';
import {
  actualizarEtiqueta,
  crearEtiqueta,
  eliminarEtiqueta,
  eliminarPlato,
  guardarPlato,
} from '../lib/platos';
import {
  ArrowDown,
  ArrowUp,
  Check,
  CookingPot,
  Plus,
  Tag,
  Trash,
  X,
} from '@phosphor-icons/react';

export function PlatoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const desdeSemana = (location.state as SemanaPlatoNuevoState | null)
    ?.desdeSemana;
  const modulos = useModulos();
  const isNew = id == null || id === 'nuevo';
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
  const [momento, setMomento] = useState<MomentoPlato>(() =>
    desdeSemana?.momento === 'comida' || desdeSemana?.momento === 'cena'
      ? desdeSemana.momento
      : 'ambos',
  );
  const [selectedProductoIds, setSelectedProductoIds] = useState<number[]>([]);
  const [selectedEtiquetaIds, setSelectedEtiquetaIds] = useState<number[]>([]);
  const [pasos, setPasos] = useState<string[]>([]);
  const [notas, setNotas] = useState('');
  /** Índice del paso recién añadido, para darle el foco */
  const [pasoNuevo, setPasoNuevo] = useState<number | null>(null);
  const [nuevaEtiquetaNombre, setNuevaEtiquetaNombre] = useState('');
  const [nuevaEtiquetaColor, setNuevaEtiquetaColor] = useState<string>(
    ETIQUETA_COLORES_PREDEFINIDOS[0],
  );
  const [editEtiqueta, setEditEtiqueta] = useState<Etiqueta | null>(null);
  const [mostrarGestionEtiquetas, setMostrarGestionEtiquetas] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    setPasos(plato.pasos ?? []);
    setNotas(plato.notas ?? '');
    setLoadedFromDb(true);
  }, [
    isNew,
    plato,
    navigate,
    loadedFromDb,
    productoIdsAsignados,
    etiquetaIdsAsignados,
  ]);

  useEffect(() => {
    if (!mostrarGestionEtiquetas && !editEtiqueta) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (editEtiqueta) {
        setEditEtiqueta(null);
      } else {
        setMostrarGestionEtiquetas(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mostrarGestionEtiquetas, editEtiqueta]);

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

  const opcionesProducto: OpcionBuscador[] = productosDisponibles.map((p) => ({
    clave: String(p.id),
    nombre: p.nombre,
    icono: <ProductoEmoji producto={p} size="sm" />,
  }));

  const productoNoExiste = (texto: string) => {
    const n = normalizarBusqueda(texto);
    return !productos?.some((p) => normalizarBusqueda(p.nombre) === n);
  };

  const agregarProducto = (productoId: number) => {
    setSelectedProductoIds((prev) =>
      prev.includes(productoId) ? prev : [...prev, productoId],
    );
  };

  const crearYAgregarProducto = async (texto: string) => {
    try {
      // Si ya existe con ese nombre, crearProducto devuelve el existente
      agregarProducto(await crearProducto(texto));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el producto');
    }
  };

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

  const cambiarPaso = (i: number, texto: string) => {
    setPasos((prev) => prev.map((p, j) => (j === i ? texto : p)));
  };

  const moverPaso = (i: number, hacia: -1 | 1) => {
    setPasos((prev) => {
      const j = i + hacia;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const quitarPaso = (i: number) => {
    setPasos((prev) => prev.filter((_, j) => j !== i));
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
      const savedId = await guardarPlato({
        id: platoId,
        nombre,
        momento,
        productoIds: selectedProductoIds,
        etiquetaIds: selectedEtiquetaIds,
        // Con Recetas desactivado no se toca la receta guardada
        receta: modulos?.recetas ? { pasos, notas } : undefined,
      });
      if (desdeSemana) {
        // Un plato creado desde Semana también pasa a la despensa
        if (modulos?.despensa) await agregarPlatoADespensa(savedId);
        await asignarEnSlot(
          desdeSemana.semanaId,
          desdeSemana.diaSemana,
          desdeSemana.momento,
          { platoId: savedId },
        );
        navigate('/semana');
        return;
      }
      if (isNew) {
        navigate(`/platos/${savedId}`, {
          state: { platoCreado: nombre.trim() },
        });
      } else {
        navigate(`/platos/${savedId}`, {
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
    const nombrePlato = (plato?.nombre ?? nombre).trim() || 'este plato';
    if (
      !confirm(
        `¿Eliminar «${nombrePlato}»? Se quitará también de la semana planificada. Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await eliminarPlato(platoId);
      navigate('/platos', { state: { platoEliminado: nombrePlato } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plato');
      setDeleting(false);
    }
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
        {desdeSemana ? (
          <>
            <Link to="/semana">Semana</Link>
            <span> / </span>
            <span>Nuevo plato</span>
          </>
        ) : (
          <>
            <Link to="/platos">Platos</Link>
            <span> / </span>
            {isNew ? (
              <span>Nuevo</span>
            ) : (
              <>
                <Link to={`/platos/${platoId}`}>
                  {(plato?.nombre ?? nombre) || 'Plato'}
                </Link>
                <span> / </span>
                <span>Editar</span>
              </>
            )}
          </>
        )}
      </p>

      <form className="plato-form" onSubmit={onSubmit}>
        <div className="plato-form__header">
          <CookingPot size={26} weight="duotone" className="plato-form__icon" aria-hidden />
          <div>
            <h1>{isNew ? 'Nuevo plato' : 'Editar plato'}</h1>
            {isNew && (
              <p className="page__lead plato-form__lead">
                {desdeSemana
                  ? 'Crea el plato y volverás a la semana con el hueco ya asignado.'
                  : 'Define el plato, sus ingredientes y etiquetas. Después podrás usarlo en la semana.'}
              </p>
            )}
          </div>
        </div>

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
              <TagChip
                etiqueta={{ nombre: 'Sin etiquetas', color: '#e8e4df' }}
                disabled
              />
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

          <div className="etiqueta-gestionar">
            <button
              type="button"
              className="btn-secondary btn-secondary--icon"
              onClick={() => setMostrarGestionEtiquetas(true)}
            >
              <Tag size={16} weight="duotone" aria-hidden />
              Gestionar etiquetas
            </button>
          </div>
        </div>

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
                Aún no hay productos. Búscalos abajo o escribe uno nuevo para crearlo.
              </p>
            ) : (
              <ul className="plato-productos-list">
                {productosAsignados.map((p) => (
                  <li key={p.id} className="plato-productos-list__item">
                    <span className="plato-productos-list__label">
                      <ProductoEmoji producto={p} size="sm" />
                      {p.nombre}
                    </span>
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

          <BuscadorPredictivo
            id="plato-productos"
            opciones={opcionesProducto}
            onElegir={(clave) => agregarProducto(Number(clave))}
            onCrear={crearYAgregarProducto}
            textoCrear={(t) => `Crear producto «${t}»`}
            puedeCrear={productoNoExiste}
            textoSinResultados={(t) => `«${t}» ya está en este plato.`}
            placeholder="Añadir producto: tomate, arroz…"
            ariaLabel="Añadir producto al plato"
            disabled={productos === undefined}
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
              // Al editar sale plegado; solo se abre de entrada al crear un plato
              open={isNew}
            >
              <summary>Añadir del catálogo ({productosDisponibles.length})</summary>
              <ul className="check-list check-list--spaced">
                {productosDisponibles.map((p) => (
                  <li key={p.id}>
                    <label className="plato-productos-list__label">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => toggleProducto(p.id!)}
                      />
                      <ProductoEmoji producto={p} size="sm" />
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

        {modulos?.recetas && (
          <div className="field">
            <span>Receta</span>
            <p className="field-hint">Pasos para prepararlo, en orden.</p>
            {pasos.length > 0 && (
              <ol className="receta-pasos-edit">
                {pasos.map((paso, i) => (
                  <li key={i} className="receta-pasos-edit__item">
                    <span className="receta-pasos-edit__num" aria-hidden>
                      {i + 1}
                    </span>
                    <textarea
                      value={paso}
                      onChange={(e) => cambiarPaso(i, e.target.value)}
                      placeholder="Describe este paso"
                      rows={2}
                      autoFocus={i === pasoNuevo}
                      aria-label={`Paso ${i + 1}`}
                    />
                    <span className="receta-pasos-edit__acciones">
                      <button
                        type="button"
                        className="btn-icon btn-icon--mover"
                        onClick={() => moverPaso(i, -1)}
                        disabled={i === 0}
                        aria-label={`Subir paso ${i + 1}`}
                      >
                        <ArrowUp size={16} weight="bold" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-icon--mover"
                        onClick={() => moverPaso(i, 1)}
                        disabled={i === pasos.length - 1}
                        aria-label={`Bajar paso ${i + 1}`}
                      >
                        <ArrowDown size={16} weight="bold" aria-hidden />
                      </button>
                    </span>
                    <button
                      type="button"
                      className="btn-icon btn-icon--remove"
                      onClick={() => quitarPaso(i)}
                      aria-label={`Quitar paso ${i + 1}`}
                    >
                      <X size={18} weight="bold" aria-hidden />
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <div>
              <button
                type="button"
                className="btn-secondary btn-secondary--icon"
                onClick={() => {
                  setPasoNuevo(pasos.length);
                  setPasos((prev) => [...prev, '']);
                }}
              >
                <Plus size={16} weight="bold" aria-hidden />
                Añadir paso
              </button>
            </div>
          </div>
        )}

        {modulos?.recetas && (
          <label className="field">
            <span>Notas</span>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Trucos, variantes, de dónde sacaste la receta…"
              rows={3}
            />
          </label>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-primary--icon" disabled={saving}>
            <Check size={20} weight="bold" aria-hidden />
            {saving ? 'Guardando…' : isNew ? 'Crear plato' : 'Guardar cambios'}
          </button>
          <Link to={desdeSemana ? '/semana' : '/platos'} className="btn-ghost">
            Cancelar
          </Link>
          {!isNew && platoId != null && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => void onDelete()}
              disabled={saving || deleting}
            >
              <Trash size={20} weight="duotone" aria-hidden />
              {deleting ? 'Eliminando…' : 'Eliminar plato'}
            </button>
          )}
        </div>
      </form>

      {mostrarGestionEtiquetas && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setMostrarGestionEtiquetas(false)}
        >
          <div
            className="modal modal--gestionar-etiquetas"
            role="dialog"
            aria-labelledby="gestionar-etiquetas-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="gestionar-etiquetas-title">Gestionar etiquetas</h2>

            <div className="etiqueta-nueva">
              <span className="field-hint">Nueva etiqueta</span>
              <div className="form-inline">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevaEtiquetaNombre}
                  onChange={(e) => setNuevaEtiquetaNombre(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void crearYAsignarEtiqueta();
                    }
                  }}
                />
                <input
                  type="color"
                  value={normalizeHex(nuevaEtiquetaColor)}
                  onChange={(e) => setNuevaEtiquetaColor(e.target.value)}
                  title="Color"
                />
                <button type="button" onClick={() => void crearYAsignarEtiqueta()}>
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

            {todasEtiquetas && todasEtiquetas.length > 0 && (
              <div className="gestionar-etiquetas-catalogo">
                <span className="field-hint">Catálogo</span>
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
                          onClick={() => void borrarEtiquetaCatalogo(t.id!)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setMostrarGestionEtiquetas(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
