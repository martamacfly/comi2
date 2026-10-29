import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  CheckCircle,
  ForkKnife,
  PencilSimple,
  ShareNetwork,
  Trash,
} from '@phosphor-icons/react';
import { db } from '../db/database';
import { ProductoEmoji } from '../components/ProductoEmoji';
import { TagChip } from '../components/TagChip';
import { MomentoBadge } from '../components/MomentoBadge';
import { eliminarPlato } from '../lib/platos';
import { useModulos } from '../lib/opciones';
import { compartirTexto, textoReceta } from '../lib/compartir';

type LocationState = {
  platoCreado?: string;
  platoActualizado?: string;
};

export function PlatoDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const modulos = useModulos();
  const platoId = id != null ? Number(id) : NaN;
  const idValido = Number.isFinite(platoId) && platoId > 0;

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const detail = useLiveQuery(
    async () => {
      if (!idValido) return undefined;
      const plato = await db.platos.get(platoId);
      if (!plato) return { plato: null, productos: [], etiquetas: [] };
      const pp = await db.platoProductos
        .where('platoId')
        .equals(platoId)
        .toArray();
      const pe = await db.platoEtiquetas
        .where('platoId')
        .equals(platoId)
        .toArray();
      const prodIds = pp.map((x) => x.productoId);
      const etqIds = pe.map((x) => x.etiquetaId);
      const productos =
        prodIds.length > 0
          ? await db.productos.where('id').anyOf(prodIds).toArray()
          : [];
      const etiquetas =
        etqIds.length > 0
          ? await db.etiquetas.where('id').anyOf(etqIds).toArray()
          : [];
      return { plato, productos, etiquetas };
    },
    [platoId, idValido],
  );

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.platoCreado) {
      setMensaje(`Plato «${state.platoCreado}» creado correctamente.`);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (state?.platoActualizado) {
      setMensaje(`Plato «${state.platoActualizado}» actualizado.`);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!mensaje) return;
    const t = window.setTimeout(() => setMensaje(null), 5000);
    return () => window.clearTimeout(t);
  }, [mensaje]);

  if (!idValido) {
    return (
      <section className="page">
        <p className="muted">Plato no encontrado.</p>
        <Link to="/platos" className="breadcrumb__link">
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Volver a platos
        </Link>
      </section>
    );
  }

  if (detail === undefined) {
    return (
      <section className="page">
        <p className="muted">Cargando…</p>
      </section>
    );
  }

  const { plato, productos, etiquetas } = detail;

  if (!plato) {
    return (
      <section className="page">
        <p className="muted">Plato no encontrado.</p>
        <Link to="/platos" className="breadcrumb__link">
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Volver a platos
        </Link>
      </section>
    );
  }

  const productosSorted = [...productos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es'),
  );
  const etiquetasSorted = [...etiquetas].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es'),
  );

  const onShare = async () => {
    setError(null);
    try {
      const resultado = await compartirTexto(
        plato.nombre,
        textoReceta(plato, productosSorted, modulos?.recetas ?? false),
      );
      if (resultado === 'copiado') setMensaje('Receta copiada al portapapeles.');
    } catch {
      setError('No se pudo compartir la receta.');
    }
  };

  const onDelete = async () => {
    if (
      !confirm(
        `¿Eliminar «${plato.nombre}»? Se quitará también de la semana planificada. Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await eliminarPlato(platoId);
      navigate('/platos', { state: { platoEliminado: plato.nombre } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plato');
      setDeleting(false);
    }
  };

  return (
    <section className="page">
      <p className="breadcrumb">
        <Link to="/platos" className="breadcrumb__link">
          <ArrowLeft size={14} weight="bold" aria-hidden />
          Platos
        </Link>
        <span> / </span>
        <span>{plato.nombre}</span>
      </p>

      {mensaje && (
        <p className="alert alert--success alert--with-icon" role="status">
          <CheckCircle size={22} weight="duotone" aria-hidden />
          <span>{mensaje}</span>
        </p>
      )}

      {error && (
        <p className="alert alert--error" role="alert">
          {error}
        </p>
      )}

      <header className="plato-detail__header">
        <div className="plato-detail__title-block">
          <ForkKnife
            size={28}
            weight="duotone"
            className="plato-detail__icon"
            aria-hidden
          />
          <div>
            <h1 className="plato-detail__title">{plato.nombre}</h1>
            <MomentoBadge momento={plato.momento} />
          </div>
        </div>
        <div className="plato-detail__actions">
          <Link
            to={`/platos/${platoId}/editar`}
            className="btn-primary btn-primary--icon"
          >
            <PencilSimple size={20} weight="duotone" aria-hidden />
            Editar plato
          </Link>
          <button type="button" className="btn-secondary" onClick={() => void onShare()}>
            <ShareNetwork size={20} weight="duotone" aria-hidden />
            Compartir
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => void onDelete()}
            disabled={deleting}
          >
            <Trash size={20} weight="duotone" aria-hidden />
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </header>

      <div className="plato-detail__sections">
        <section className="plato-detail__section">
          <h2 className="plato-detail__section-title">Etiquetas</h2>
          {etiquetasSorted.length === 0 ? (
            <p className="muted">Sin etiquetas.</p>
          ) : (
            <div className="tag-row">
              {etiquetasSorted.map((t) => (
                <TagChip key={t.id} etiqueta={t} small />
              ))}
            </div>
          )}
        </section>

        <section className="plato-detail__section">
          <h2 className="plato-detail__section-title">Ingredientes</h2>
          {productosSorted.length === 0 ? (
            <p className="muted">
              Este plato no tiene productos en el catálogo.
            </p>
          ) : (
            <ul className="plato-detail__productos">
              {productosSorted.map((p) =>
                p.id != null ? (
                  <li key={p.id}>
                    <Link
                      to={`/productos/${p.id}`}
                      className="plato-detail__producto-link"
                    >
                      <ProductoEmoji producto={p} size="sm" />
                      <span>{p.nombre}</span>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </section>

        {modulos?.recetas && (
          <section className="plato-detail__section">
            <h2 className="plato-detail__section-title">Receta</h2>
            {(plato.pasos ?? []).length === 0 && !plato.notas ? (
              <p className="muted">
                Sin receta. Puedes añadirla en{' '}
                <Link to={`/platos/${platoId}/editar`}>Editar plato</Link>.
              </p>
            ) : (
              <>
                {(plato.pasos ?? []).length > 0 && (
                  <ol className="receta-pasos">
                    {plato.pasos!.map((paso, i) => (
                      <li key={i}>{paso}</li>
                    ))}
                  </ol>
                )}
                {plato.notas && (
                  <>
                    <h3 className="plato-detail__subsection-title">Notas</h3>
                    <p className="receta-notas">{plato.notas}</p>
                  </>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
