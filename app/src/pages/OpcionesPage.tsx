import { useEffect, useState } from 'react';
import { CheckCircle, GearSix } from '@phosphor-icons/react';
import { BackupPanel } from '../components/BackupPanel';
import { PageHeader } from '../components/PageHeader';
import { activarModulo, MODULOS, useModulos } from '../lib/opciones';

export function OpcionesPage() {
  const modulos = useModulos();
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!mensaje) return;
    const t = window.setTimeout(() => setMensaje(null), 5000);
    return () => window.clearTimeout(t);
  }, [mensaje]);

  return (
    <section className="page">
      <PageHeader
        title="Opciones"
        lead="Elige qué secciones quieres usar. Al desactivar una no se borra nada: sus datos siguen ahí si la vuelves a activar."
        icon={GearSix}
        iconTone="sage"
      />

      {mensaje && (
        <p className="alert alert--success alert--with-icon" role="status">
          <CheckCircle size={22} weight="duotone" aria-hidden />
          <span>{mensaje}</span>
        </p>
      )}

      {modulos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : (
        <ul className="list opciones-lista">
          {MODULOS.map((m) => (
            <li key={m.clave} className="list__row opciones-lista__item">
              <label className="opciones-lista__label">
                <span className="opciones-lista__texto">
                  <span className="opciones-lista__nombre">{m.nombre}</span>
                  <span className="opciones-lista__descripcion muted">
                    {m.descripcion}
                  </span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  className="interruptor"
                  aria-label={m.nombre}
                  checked={modulos[m.clave]}
                  onChange={(e) => void activarModulo(m.clave, e.target.checked)}
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <BackupPanel onImportSuccess={() => setMensaje('Respaldo importado correctamente.')} />
    </section>
  );
}
