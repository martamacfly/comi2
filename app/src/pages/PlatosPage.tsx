import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CaretRight, Plus } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { TagChip } from '../components/TagChip';
import type { Etiqueta, MomentoPlato, Plato } from '../db/types';

const MOMENTO_LABEL: Record<MomentoPlato, string> = {
  comida: 'Comida',
  cena: 'Cena',
  ambos: 'Comida y cena',
};

const MOMENTO_BADGE: Record<MomentoPlato, string> = {
  comida: 'badge',
  cena: 'badge badge--cena',
  ambos: 'badge badge--ambos',
};

const MOMENTO_SECCIONES: { momento: MomentoPlato; titulo: string }[] = [
  { momento: 'comida', titulo: 'Comida' },
  { momento: 'cena', titulo: 'Cena' },
  { momento: 'ambos', titulo: 'Comida y cena' },
];

type VistaPlatos = 'momento' | 'etiquetas';

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
          <strong>{plato.nombre}</strong>
          {showMomentoBadge && (
            <span className={MOMENTO_BADGE[plato.momento]}>
              {MOMENTO_LABEL[plato.momento]}
            </span>
          )}
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
}: {
  titulo: ReactNode;
  count: number;
  children: ReactNode;
}) {
  return (
    <details className="platos-section">
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
  const [vista, setVista] = useState<VistaPlatos>('momento');

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
      <div className="page__head">
        <h1>Platos</h1>
        <Link to="/platos/nuevo" className="btn-primary btn-primary--icon">
          <Plus size={20} weight="bold" aria-hidden />
          Nuevo plato
        </Link>
      </div>

      {mensaje && (
        <p className="alert alert--success" role="status">
          {mensaje}
        </p>
      )}

      {platos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : platos.length === 0 ? (
        <div className="empty-state">
          <p className="muted">Aún no tienes platos en tu catálogo.</p>
          <Link to="/platos/nuevo" className="btn-primary btn-primary--icon">
            <Plus size={20} weight="bold" aria-hidden />
            Crear tu primer plato
          </Link>
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
              Por etiquetas
            </button>
          </div>

          {vista === 'momento' ? (
            <div
              id="platos-panel-momento"
              role="tabpanel"
              aria-labelledby="platos-tab-momento"
              className="platos-panels"
            >
              {MOMENTO_SECCIONES.map(({ momento, titulo }) => {
                const grupo = platos.filter((p) => p.momento === momento);
                return (
                  <PlatosSubseccion
                    key={momento}
                    titulo={titulo}
                    count={grupo.length}
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
    </section>
  );
}
