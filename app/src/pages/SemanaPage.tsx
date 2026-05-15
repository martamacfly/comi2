import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Etiqueta, MomentoSlot, Plato } from '../db/types';
import { TagChip } from '../components/TagChip';
import { DIAS_SEMANA, lunesDeSemana, mismaFecha } from '../lib/semana';

const MOMENTOS: MomentoSlot[] = ['comida', 'cena'];

function platoCompatible(plato: Plato, momento: MomentoSlot): boolean {
  if (plato.momento === 'ambos') return true;
  return plato.momento === momento;
}

export function SemanaPage() {
  const lunes = lunesDeSemana();

  const semana = useLiveQuery(async () => {
    const todas = await db.semanas.toArray();
    return (
      todas.find((s) => mismaFecha(s.fechaInicioLunes, lunes)) ??
      (await db.semanas.add({ fechaInicioLunes: lunes }).then((id) =>
        db.semanas.get(id),
      ))
    );
  }, [lunes.getTime()]);

  const semanaId = semana?.id;

  const slots = useLiveQuery(
    () =>
      semanaId != null
        ? db.planSlots.where('semanaId').equals(semanaId).toArray()
        : [],
    [semanaId],
  );

  const platos = useLiveQuery(() => db.platos.orderBy('nombre').toArray());
  const etiquetas = useLiveQuery(() => db.etiquetas.toArray());

  const asignar = async (
    diaSemana: number,
    momento: MomentoSlot,
    platoId: number | '',
  ) => {
    if (semanaId == null) return;
    const existente = slots?.find(
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

  const getPlato = (dia: number, momento: MomentoSlot) => {
    const slot = slots?.find(
      (s) => s.diaSemana === dia && s.momento === momento,
    );
    if (!slot?.platoId || !platos) return null;
    return platos.find((p) => p.id === slot.platoId) ?? null;
  };

  return (
    <section className="page">
      <h1>Semana</h1>
      <p className="page__lead">
        Planifica comida y cena de lunes a domingo.
      </p>

      {semanaId == null || slots === undefined || !platos ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="semana-grid">
          {DIAS_SEMANA.map((diaLabel, diaSemana) => (
            <article key={diaLabel} className="semana-dia">
              <h2>{diaLabel}</h2>
              {MOMENTOS.map((momento) => {
                const plato = getPlato(diaSemana, momento);
                const opciones = platos.filter((p) =>
                  platoCompatible(p, momento),
                );
                const slot = slots.find(
                  (s) => s.diaSemana === diaSemana && s.momento === momento,
                );
                return (
                  <div key={momento} className="semana-slot">
                    <label>
                      <span className="semana-slot__label">
                        {momento === 'comida' ? 'Comida' : 'Cena'}
                      </span>
                      <select
                        value={slot?.platoId ?? ''}
                        onChange={(e) =>
                          asignar(
                            diaSemana,
                            momento,
                            e.target.value === ''
                              ? ''
                              : Number(e.target.value),
                          )
                        }
                      >
                        <option value="">— Sin plato —</option>
                        {opciones.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    {plato && (
                      <PlatoTags platoId={plato.id!} etiquetas={etiquetas} />
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

function PlatoTags({
  platoId,
  etiquetas,
}: {
  platoId: number;
  etiquetas: Etiqueta[] | undefined;
}) {
  const links = useLiveQuery(
    () => db.platoEtiquetas.where('platoId').equals(platoId).toArray(),
    [platoId],
  );
  if (!links || !etiquetas) return null;
  const ids = links.map((l) => l.etiquetaId);
  const tags = etiquetas.filter((e) => e.id != null && ids.includes(e.id));
  if (!tags.length) return null;
  return (
    <div className="tag-row">
      {tags.map((t) => (
        <TagChip key={t.id} etiqueta={t} small />
      ))}
    </div>
  );
}
