import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarDots } from '@phosphor-icons/react';
import { db } from '../db/database';
import type { Etiqueta, MomentoSlot, Plato, PlatoEtiqueta } from '../db/types';
import { TagChip } from '../components/TagChip';
import { DIAS_SEMANA, obtenerOCrearSemanaActiva } from '../lib/semana';

const MOMENTOS: MomentoSlot[] = ['comida', 'cena'];

function platoCompatible(plato: Plato, momento: MomentoSlot): boolean {
  if (plato.momento === 'ambos') return true;
  return plato.momento === momento;
}

export function SemanaPage() {
  const [semanaId, setSemanaId] = useState<number | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;
    setListo(false);
    setInitError(null);

    obtenerOCrearSemanaActiva()
      .then((semana) => {
        if (!activo) return;
        if (semana.id == null) {
          setInitError('No se pudo inicializar la semana.');
          return;
        }
        setSemanaId(semana.id);
      })
      .catch((err) => {
        if (!activo) return;
        console.error('SemanaPage init:', err);
        setInitError(
          err instanceof Error ? err.message : 'Error al cargar la semana',
        );
      })
      .finally(() => {
        if (activo) setListo(true);
      });

    return () => {
      activo = false;
    };
  }, []);

  const slots = useLiveQuery(
    async () => {
      if (semanaId == null) return [];
      return db.planSlots.where('semanaId').equals(semanaId).toArray();
    },
    [semanaId],
  );

  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
  const etiquetas = useLiveQuery(() => db.etiquetas.toArray());
  const platoEtiquetas = useLiveQuery(() => db.platoEtiquetas.toArray());

  const asignar = async (
    diaSemana: number,
    momento: MomentoSlot,
    platoId: number | '',
  ) => {
    if (semanaId == null) return;
    const lista = slots ?? [];
    const existente = lista.find(
      (s) => s.diaSemana === diaSemana && s.momento === momento,
    );
    if (platoId === '') {
      if (existente?.id != null) {
        await db.planSlots.update(existente.id, { platoId: undefined });
      }
      return;
    }
    if (existente?.id != null) {
      await db.planSlots.update(existente.id, { platoId });
    } else {
      await db.planSlots.add({
        semanaId,
        diaSemana,
        momento,
        platoId,
      });
    }
  };

  const etiquetasDePlato = (platoId: number): Etiqueta[] => {
    if (!platoEtiquetas || !etiquetas) return [];
    const ids = platoEtiquetas
      .filter((pe: PlatoEtiqueta) => pe.platoId === platoId)
      .map((pe) => pe.etiquetaId);
    return etiquetas.filter((e) => e.id != null && ids.includes(e.id));
  };

  const datosListos =
    listo && platos !== undefined && slots !== undefined && etiquetas !== undefined;

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>Semana</h1>
          <p className="page__lead">
            Planifica comida y cena de lunes a domingo.
          </p>
        </div>
        <CalendarDots
          size={36}
          weight="duotone"
          className="page__head-icon"
          aria-hidden
        />
      </div>

      {initError && (
        <div className="alert alert--error" role="alert">
          <p>{initError}</p>
          <p className="muted">
            Prueba a recargar la página. Si persiste, borra los datos del sitio en
            DevTools → Application → IndexedDB → comi2-db.
          </p>
        </div>
      )}

      {!datosListos && !initError && (
        <p className="muted">Cargando planificador…</p>
      )}

      {datosListos && !initError && platos.length === 0 && (
        <div className="empty-state">
          <p className="muted">
            Necesitas al menos un plato para planificar la semana.
          </p>
          <Link to="/platos/nuevo" className="btn-primary">
            Crear un plato
          </Link>
        </div>
      )}

      {datosListos && !initError && platos.length > 0 && semanaId != null && (
        <div className="semana-grid">
          {DIAS_SEMANA.map((diaLabel, diaSemana) => (
            <article key={diaLabel} className="semana-dia">
              <h2>{diaLabel}</h2>
              {MOMENTOS.map((momento) => {
                const slot = slots.find(
                  (s) => s.diaSemana === diaSemana && s.momento === momento,
                );
                const opciones = platos.filter((p) =>
                  platoCompatible(p, momento),
                );
                const platoAsignado =
                  slot?.platoId != null
                    ? platos.find((p) => p.id === slot.platoId)
                    : undefined;
                const tags =
                  platoAsignado?.id != null
                    ? etiquetasDePlato(platoAsignado.id)
                    : [];

                return (
                  <div key={momento} className="semana-slot">
                    <label>
                      <span className="semana-slot__label">
                        {momento === 'comida' ? 'Comida' : 'Cena'}
                      </span>
                      <select
                        value={slot?.platoId ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          void asignar(
                            diaSemana,
                            momento,
                            v === '' ? '' : Number(v),
                          );
                        }}
                      >
                        <option value="">— Sin plato —</option>
                        {opciones.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    {opciones.length === 0 && (
                      <p className="muted semana-slot__hint">
                        No hay platos de{' '}
                        {momento === 'comida' ? 'comida' : 'cena'}.
                      </p>
                    )}
                    {tags.length > 0 && (
                      <div className="tag-row">
                        {tags.map((t) => (
                          <TagChip key={t.id} etiqueta={t} small />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
