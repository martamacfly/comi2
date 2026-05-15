import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { TagChip } from '../components/TagChip';
import type { Etiqueta, MomentoPlato } from '../db/types';

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

export function PlatosPage() {
  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
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

  return (
    <section className="page">
      <div className="page__head">
        <h1>Platos</h1>
        <Link to="/platos/nuevo" className="btn-primary">
          Nuevo plato
        </Link>
      </div>

      {platos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : platos.length === 0 ? (
        <p className="muted">
          No hay platos. <Link to="/platos/nuevo">Crea el primero</Link>.
        </p>
      ) : (
        <ul className="card-list">
          {platos.map((plato) => {
            const tags =
              plato.id != null ? etiquetasPorPlato?.get(plato.id) ?? [] : [];
            return (
              <li key={plato.id}>
                <Link to={`/platos/${plato.id}`} className="card">
                  <div className="card__top">
                    <strong>{plato.nombre}</strong>
                    <span className={MOMENTO_BADGE[plato.momento]}>
                      {MOMENTO_LABEL[plato.momento]}
                    </span>
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
          })}
        </ul>
      )}
    </section>
  );
}
