import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CalendarDots,
  ListBullets,
  Trash,
} from '@phosphor-icons/react';
import { db } from '../db/database';
import type { Etiqueta, MomentoSlot, Plato, PlatoEtiqueta } from '../db/types';
import { PageHeader } from '../components/PageHeader';
import { TagChip } from '../components/TagChip';
import { MomentoSlotIcon } from '../lib/momento-icons';
import {
  asignarPlatoEnSlot,
  DIAS_SEMANA,
  NUEVO_PLATO_SELECT,
  obtenerOCrearSemanaActiva,
} from '../lib/semana';

const MOMENTOS: MomentoSlot[] = ['comida', 'cena'];

function platoCompatible(plato: Plato, momento: MomentoSlot): boolean {
  if (plato.momento === 'ambos') return true;
  return plato.momento === momento;
}

export function SemanaPage() {
  const navigate = useNavigate();
  const [semanaId, setSemanaId] = useState<number | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const [limpiando, setLimpiando] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  useEffect(() => {
    let activo = true;

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

  const hayPlatosAsignados = useMemo(
    () => (slots ?? []).some((s) => s.platoId != null),
    [slots],
  );

  const resumenSemana = useMemo(() => {
    if (!slots || !platos) return [];
    return DIAS_SEMANA.map((diaLabel, diaSemana) => ({
      diaLabel,
      momentos: MOMENTOS.map((momento) => {
        const slot = slots.find(
          (s) => s.diaSemana === diaSemana && s.momento === momento,
        );
        const plato =
          slot?.platoId != null
            ? platos.find((p) => p.id === slot.platoId)
            : undefined;
        const tags = plato?.id != null ? etiquetasDePlato(plato.id) : [];
        return { momento, plato, tags };
      }),
    }));
  }, [slots, platos, platoEtiquetas, etiquetas]);

  useEffect(() => {
    if (!mostrarResumen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMostrarResumen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mostrarResumen]);

  const limpiarSemana = async () => {
    if (semanaId == null || !hayPlatosAsignados || limpiando) return;
    const ok = window.confirm(
      '¿Vaciar toda la semana? Se quitarán los platos de comida y cena.',
    );
    if (!ok) return;
    setLimpiando(true);
    try {
      await db.planSlots.where('semanaId').equals(semanaId).delete();
    } finally {
      setLimpiando(false);
    }
  };

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
    await asignarPlatoEnSlot(semanaId, diaSemana, momento, platoId);
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
      <PageHeader
        title="Semana"
        lead="Planifica comida y cena de lunes a domingo."
        icon={CalendarDots}
        iconTone="sky"
      />

      {datosListos && !initError && semanaId != null && (
        <div className="semana-toolbar">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setMostrarResumen(true)}
            disabled={!hayPlatosAsignados}
          >
            <ListBullets size={20} weight="duotone" aria-hidden />
            Ver resumen
          </button>
          {hayPlatosAsignados && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => void limpiarSemana()}
              disabled={limpiando}
            >
              <Trash size={20} weight="duotone" aria-hidden />
              {limpiando ? 'Limpiando…' : 'Limpiar semana'}
            </button>
          )}
        </div>
      )}

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

      {datosListos && !initError && platos.length === 0 && semanaId != null && (
        <p className="muted">
          Aún no tienes platos. Elige «Nuevo plato…» en cualquier hueco para crear
          uno y asignarlo.
        </p>
      )}

      {datosListos && !initError && semanaId != null && (
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
                        <MomentoSlotIcon momento={momento} />
                        {momento === 'comida' ? 'Comida' : 'Cena'}
                      </span>
                      <select
                        value={slot?.platoId ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === NUEVO_PLATO_SELECT) {
                            if (semanaId == null) return;
                            navigate('/platos/nuevo', {
                              state: {
                                desdeSemana: { semanaId, diaSemana, momento },
                              },
                            });
                            return;
                          }
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
                        <option value={NUEVO_PLATO_SELECT}>+ Nuevo plato…</option>
                      </select>
                    </label>
                    {opciones.length === 0 && (
                      <p className="muted semana-slot__hint">
                        No hay platos de {momento === 'comida' ? 'comida' : 'cena'}
                        . Elige «Nuevo plato…» para crear uno.
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

      {mostrarResumen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setMostrarResumen(false)}
        >
          <div
            className="modal modal--semana-resumen"
            role="dialog"
            aria-labelledby="semana-resumen-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="semana-resumen-title">Resumen de la semana</h2>
            <p className="muted semana-resumen__lead">
              Vista de solo lectura de los platos planificados.
            </p>
            <div className="semana-resumen">
              {resumenSemana.map(({ diaLabel, momentos }) => (
                <article key={diaLabel} className="semana-resumen__dia">
                  <h3>{diaLabel}</h3>
                  <ul className="semana-resumen__lista">
                    {momentos.map(({ momento, plato, tags }) => (
                      <li key={momento} className="semana-resumen__item">
                        <span className="semana-resumen__momento">
                          <MomentoSlotIcon momento={momento} />
                          {momento === 'comida' ? 'Comida' : 'Cena'}
                        </span>
                        <span className="semana-resumen__plato-wrap">
                          <span
                            className={
                              plato ? 'semana-resumen__plato' : 'semana-resumen__plato muted'
                            }
                          >
                            {plato?.nombre ?? '— Sin plato —'}
                          </span>
                          {tags.map((t) => (
                            <TagChip key={t.id} etiqueta={t} small />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setMostrarResumen(false)}
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
