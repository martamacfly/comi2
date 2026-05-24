import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CaretRight,
  CheckCircle,
  CookingPot,
  ForkKnife,
  ListBullets,
  MagnifyingGlass,
  Plus,
  Sun,
  Tag,
  Moon,
  X,
} from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { EmptyState } from '../components/EmptyState';
import { PlatosBackupPanel } from '../components/PlatosBackupPanel';
import { PageHeader } from '../components/PageHeader';
import { TagChip } from '../components/TagChip';
import { MomentoBadge } from '../components/MomentoBadge';
import { normalizeHex } from '../lib/color';
import type { Etiqueta, MomentoPlato, Plato } from '../db/types';

type SubseccionTone = MomentoPlato | 'neutral' | 'etiqueta';

const MOMENTO_SECCIONES: {
  momento: MomentoPlato;
  titulo: string;
  Icon: typeof Sun;
}[] = [
  { momento: 'comida', titulo: 'Comida', Icon: Sun },
  { momento: 'cena', titulo: 'Cena', Icon: Moon },
  { momento: 'ambos', titulo: 'Comida y cena', Icon: ForkKnife },
];

type VistaPlatos = 'todos' | 'momento' | 'etiquetas';

type LocationState = {
  platoCreado?: string;
  platoActualizado?: string;
};

function PlatoCard({
  plato,
  tags,
  showMomentoBadge,
}: {
  plato: Plato;
  tags: Etiqueta[];
  showMomentoBadge: boolean;
}) {
  return (
    <li>
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
          {showMomentoBadge && <MomentoBadge momento={plato.momento} />}
        </div>
        {tags.length > 0 && (
          <div className="tag-row">
            {tags.map((t) => (
              <TagChip key={t.id} etiqueta={t} small />
            ))}
          </div>
        )}
      </Link>
    </li>
  );
}

function PlatosLista({
  platos,
  etiquetasPorPlato,
  showMomentoBadge,
  vacio,
}: {
  platos: Plato[];
  etiquetasPorPlato: Map<number, Etiqueta[]> | undefined;
  showMomentoBadge: boolean;
  vacio: string;
}) {
  if (platos.length === 0) {
    return <p className="muted platos-section__empty">{vacio}</p>;
  }
  return (
    <ul className="card-list">
      {platos.map((plato) => {
        const tags =
          plato.id != null ? etiquetasPorPlato?.get(plato.id) ?? [] : [];
        return (
          <PlatoCard
            key={plato.id}
            plato={plato}
            tags={tags}
            showMomentoBadge={showMomentoBadge}
          />
        );
      })}
    </ul>
  );
}

function PlatosSubseccion({
  titulo,
  count,
  children,
  tone = 'neutral',
  accentColor,
}: {
  titulo: ReactNode;
  count: number;
  children: ReactNode;
  tone?: SubseccionTone;
  accentColor?: string;
}) {
  const style: CSSProperties | undefined =
    tone === 'etiqueta' && accentColor
      ? ({ '--section-accent': normalizeHex(accentColor) } as CSSProperties)
      : undefined;

  return (
    <details
      className={`platos-section platos-section--${tone}`}
      style={style}
    >
      <summary className="platos-section__summary">
        <CaretRight
          className="platos-section__chevron"
          size={18}
          weight="bold"
          aria-hidden
        />
        <span className="platos-section__heading">{titulo}</span>
        <span className="platos-section__count">{count}</span>
      </summary>
      <div className="platos-section__body">{children}</div>
    </details>
  );
}

export function PlatosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [vista, setVista] = useState<VistaPlatos>('todos');
  const [busqueda, setBusqueda] = useState('');

  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
  const todasEtiquetas = useLiveQuery(() => db.etiquetas.orderBy('nombre').toArray());
  const etiquetasPorPlato = useLiveQuery(async () => {
    if (!platos?.length) return new Map<number, Etiqueta[]>();
    const map = new Map<number, Etiqueta[]>();
    await Promise.all(
      platos.map(async (p) => {
        if (p.id == null) return;
        const links = await db.platoEtiquetas
          .where('platoId')
          .equals(p.id)
          .toArray();
        const ids = links.map((l) => l.etiquetaId);
        const tags =
          ids.length > 0
            ? await db.etiquetas.where('id').anyOf(ids).toArray()
            : [];
        map.set(p.id, tags);
      }),
    );
    return map;
  }, [platos]);

  const platosFiltrados = useMemo(() => {
    if (!platos || busqueda.trim() === '') return platos ?? [];
    const q = busqueda.trim().toLowerCase();
    return platos.filter((p) => p.nombre.toLowerCase().includes(q));
  }, [platos, busqueda]);

  const platosSinEtiqueta = useMemo(() => {
    if (!platos) return [];
    return platos.filter((p) => {
      if (p.id == null) return false;
      return (etiquetasPorPlato?.get(p.id) ?? []).length === 0;
    });
  }, [platos, etiquetasPorPlato]);

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

  return (
    <section className="page">
      <PageHeader
        title="Platos"
        lead="Tu recetario: organízalo como prefieras."
        icon={CookingPot}
      >
        <Link to="/platos/nuevo" className="btn-primary btn-primary--icon">
          <Plus size={20} weight="bold" aria-hidden />
          Nuevo plato
        </Link>
      </PageHeader>

      {mensaje && (
        <p className="alert alert--success alert--with-icon" role="status">
          <CheckCircle size={22} weight="duotone" aria-hidden />
          <span>{mensaje}</span>
        </p>
      )}

      {platos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : (
        <>
          {platos.length === 0 ? (
            <EmptyState icon={CookingPot} iconTone="peach">
              <p className="muted">Aún no tienes platos en tu catálogo.</p>
              <Link to="/platos/nuevo" className="btn-primary btn-primary--icon">
                <Plus size={20} weight="bold" aria-hidden />
                Crear tu primer plato
              </Link>
            </EmptyState>
          ) : (
            <>
          <div className="platos-search">
            <MagnifyingGlass
              size={18}
              weight="regular"
              className="platos-search__icon"
              aria-hidden
            />
            <input
              type="search"
              className="platos-search__input"
              placeholder="Buscar plato…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar platos"
              autoComplete="off"
            />
            {busqueda && (
              <button
                type="button"
                className="platos-search__clear"
                onClick={() => setBusqueda('')}
                aria-label="Borrar búsqueda"
              >
                <X size={16} weight="bold" aria-hidden />
              </button>
            )}
          </div>

          {busqueda.trim() !== '' ? (
            <div className="platos-panels platos-panels--flat" role="region" aria-label="Resultados de búsqueda">
              {platosFiltrados.length === 0 ? (
                <p className="muted platos-search__empty">
                  No hay platos que coincidan con «{busqueda.trim()}».
                </p>
              ) : (
                <PlatosLista
                  platos={platosFiltrados}
                  etiquetasPorPlato={etiquetasPorPlato}
                  showMomentoBadge
                  vacio=""
                />
              )}
            </div>
          ) : (
          <>
          <div
            className="platos-tabs"
            role="tablist"
            aria-label="Agrupar platos"
          >
            <button
              type="button"
              role="tab"
              id="platos-tab-todos"
              aria-selected={vista === 'todos'}
              aria-controls="platos-panel-todos"
              className={
                vista === 'todos'
                  ? 'platos-tabs__btn platos-tabs__btn--wide platos-tabs__btn--active'
                  : 'platos-tabs__btn platos-tabs__btn--wide'
              }
              onClick={() => setVista('todos')}
            >
              <ListBullets size={18} weight="duotone" aria-hidden />
              Todos
            </button>
            <button
              type="button"
              role="tab"
              id="platos-tab-momento"
              aria-selected={vista === 'momento'}
              aria-controls="platos-panel-momento"
              className={
                vista === 'momento'
                  ? 'platos-tabs__btn platos-tabs__btn--active'
                  : 'platos-tabs__btn'
              }
              onClick={() => setVista('momento')}
            >
              <Sun size={18} weight="duotone" aria-hidden />
              Por momento
            </button>
            <button
              type="button"
              role="tab"
              id="platos-tab-etiquetas"
              aria-selected={vista === 'etiquetas'}
              aria-controls="platos-panel-etiquetas"
              className={
                vista === 'etiquetas'
                  ? 'platos-tabs__btn platos-tabs__btn--active'
                  : 'platos-tabs__btn'
              }
              onClick={() => setVista('etiquetas')}
            >
              <Tag size={18} weight="duotone" aria-hidden />
              Por etiquetas
            </button>
          </div>

          {vista === 'todos' ? (
            <div
              id="platos-panel-todos"
              role="tabpanel"
              aria-labelledby="platos-tab-todos"
              className="platos-panels platos-panels--flat"
            >
              <PlatosLista
                platos={platos}
                etiquetasPorPlato={etiquetasPorPlato}
                showMomentoBadge
                vacio="No hay platos en el catálogo."
              />
            </div>
          ) : vista === 'momento' ? (
            <div
              id="platos-panel-momento"
              role="tabpanel"
              aria-labelledby="platos-tab-momento"
              className="platos-panels"
            >
              {MOMENTO_SECCIONES.map(({ momento, titulo, Icon }) => {
                const grupo = platos.filter((p) => p.momento === momento);
                return (
                  <PlatosSubseccion
                    key={momento}
                    titulo={
                      <>
                        <Icon size={20} weight="duotone" aria-hidden />
                        {titulo}
                      </>
                    }
                    count={grupo.length}
                    tone={momento}
                  >
                    <PlatosLista
                      platos={grupo}
                      etiquetasPorPlato={etiquetasPorPlato}
                      showMomentoBadge={false}
                      vacio="Ningún plato en esta categoría."
                    />
                  </PlatosSubseccion>
                );
              })}
            </div>
          ) : (
            <div
              id="platos-panel-etiquetas"
              role="tabpanel"
              aria-labelledby="platos-tab-etiquetas"
              className="platos-panels"
            >
              {todasEtiquetas === undefined ? (
                <p className="muted">Cargando etiquetas…</p>
              ) : (
                <>
                  {todasEtiquetas.map((etiqueta) => {
                    if (etiqueta.id == null) return null;
                    const grupo = platos.filter((p) => {
                      if (p.id == null) return false;
                      return (etiquetasPorPlato?.get(p.id) ?? []).some(
                        (t) => t.id === etiqueta.id,
                      );
                    });
                    return (
                      <PlatosSubseccion
                        key={etiqueta.id}
                        titulo={<TagChip etiqueta={etiqueta} small />}
                        count={grupo.length}
                        tone="etiqueta"
                        accentColor={etiqueta.color}
                      >
                        <PlatosLista
                          platos={grupo}
                          etiquetasPorPlato={etiquetasPorPlato}
                          showMomentoBadge
                          vacio="Ningún plato con esta etiqueta."
                        />
                      </PlatosSubseccion>
                    );
                  })}
                  {platosSinEtiqueta.length > 0 && (
                    <PlatosSubseccion
                      titulo="Sin etiquetas"
                      count={platosSinEtiqueta.length}
                      tone="neutral"
                    >
                      <PlatosLista
                        platos={platosSinEtiqueta}
                        etiquetasPorPlato={etiquetasPorPlato}
                        showMomentoBadge
                        vacio="Todos los platos tienen al menos una etiqueta."
                      />
                    </PlatosSubseccion>
                  )}
                  {todasEtiquetas.length === 0 && (
                    <p className="muted platos-section__hint">
                      Aún no hay etiquetas. Créalas al editar un plato para
                      agruparlos aquí.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          </>
          )}
            </>
          )}
          <PlatosBackupPanel
            onImportSuccess={() =>
              setMensaje('Respaldo importado correctamente.')
            }
          />
        </>
      )}
    </section>
  );
}
