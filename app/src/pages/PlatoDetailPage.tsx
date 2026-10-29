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
  DownloadSimple,
  ForkKnife,
  PencilSimple,
  ShareNetwork,
  TextAa,
  Trash,
} from '@phosphor-icons/react';
import { Capacitor } from '@capacitor/core';
import { db } from '../db/database';
import { ProductoEmoji } from '../components/ProductoEmoji';
import { TagChip } from '../components/TagChip';
import { MomentoBadge } from '../components/MomentoBadge';
import { eliminarPlato } from '../lib/platos';
import { useModulos } from '../lib/opciones';
import { compartirTexto, textoReceta } from '../lib/compartir';
import {
  compartirImagenReceta,
  generarImagenRecetaCanvas,
  guardarImagenReceta,
  type RecetaImagen,
} from '../lib/imagen-receta';

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
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<'guardar' | 'compartir' | null>(null);
  const [avisoCompartir, setAvisoCompartir] = useState<{
    tipo: 'success' | 'error';
    texto: string;
  } | null>(null);

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

  useEffect(() => {
    if (!vistaPrevia) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVistaPrevia(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [vistaPrevia]);

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

  const datosImagen: RecetaImagen = {
    plato,
    ingredientes: productosSorted,
    etiquetas: etiquetasSorted,
    conReceta: modulos?.recetas ?? false,
  };

  const abrirCompartir = async () => {
    setAvisoCompartir(null);
    const canvas = await generarImagenRecetaCanvas(datosImagen);
    setVistaPrevia(canvas.toDataURL('image/png'));
  };

  const cerrarCompartir = () => setVistaPrevia(null);

  const onCompartirImagen = async () => {
    setOcupado('compartir');
    setAvisoCompartir(null);
    try {
      const ok = await compartirImagenReceta(datosImagen);
      if (!ok) {
        setAvisoCompartir({
          tipo: 'error',
          texto: 'Este navegador no permite compartir imágenes. Usa Guardar imagen.',
        });
      }
    } catch {
      setAvisoCompartir({ tipo: 'error', texto: 'No se pudo compartir la imagen.' });
    } finally {
      setOcupado(null);
    }
  };

  const onGuardarImagen = async () => {
    setOcupado('guardar');
    setAvisoCompartir(null);
    try {
      await guardarImagenReceta(datosImagen);
      setAvisoCompartir({
        tipo: 'success',
        texto: Capacitor.isNativePlatform()
          ? 'Imagen guardada en la galería (álbum Comi2).'
          : 'Imagen descargada.',
      });
    } catch {
      setAvisoCompartir({ tipo: 'error', texto: 'No se pudo guardar la imagen.' });
    } finally {
      setOcupado(null);
    }
  };

  const onCompartirTexto = async () => {
    setAvisoCompartir(null);
    try {
      const resultado = await compartirTexto(
        plato.nombre,
        textoReceta(plato, productosSorted, modulos?.recetas ?? false),
      );
      if (resultado === 'copiado') {
        setAvisoCompartir({ tipo: 'success', texto: 'Receta copiada al portapapeles.' });
      }
    } catch {
      setAvisoCompartir({ tipo: 'error', texto: 'No se pudo compartir la receta.' });
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
          <button type="button" className="btn-secondary" onClick={() => void abrirCompartir()}>
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

      {vistaPrevia && (
        <div className="modal-backdrop" role="presentation" onClick={cerrarCompartir}>
          <div
            className="modal modal--compartir-receta"
            role="dialog"
            aria-labelledby="compartir-receta-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="compartir-receta-title">Compartir receta</h2>
            <div className="compartir-receta__preview">
              <img src={vistaPrevia} alt={`Imagen de la receta ${plato.nombre}`} />
            </div>
            {avisoCompartir && (
              <p
                className={`alert alert--${avisoCompartir.tipo}`}
                role={avisoCompartir.tipo === 'error' ? 'alert' : 'status'}
              >
                {avisoCompartir.texto}
              </p>
            )}
            <div className="form-actions compartir-receta__actions">
              <button
                type="button"
                className="btn-primary btn-primary--icon"
                disabled={ocupado != null}
                onClick={() => void onCompartirImagen()}
              >
                <ShareNetwork size={18} weight="duotone" aria-hidden />
                {ocupado === 'compartir' ? 'Generando…' : 'Compartir imagen'}
              </button>
              <button
                type="button"
                className="btn-secondary btn-secondary--icon"
                disabled={ocupado != null}
                onClick={() => void onGuardarImagen()}
              >
                <DownloadSimple size={18} weight="duotone" aria-hidden />
                {ocupado === 'guardar' ? 'Guardando…' : 'Guardar imagen'}
              </button>
              <button
                type="button"
                className="btn-secondary btn-secondary--icon"
                onClick={() => void onCompartirTexto()}
              >
                <TextAa size={18} weight="duotone" aria-hidden />
                Como texto
              </button>
              <button type="button" className="btn-ghost" onClick={cerrarCompartir}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
