import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { generarListaCompra } from '../lib/lista';
import { obtenerSemanaActiva } from '../lib/semana';
import type { Producto } from '../db/types';

export function ListaPage() {
  const [lista, setLista] = useState<Producto[] | null>(null);
  const [generando, setGenerando] = useState(false);

  const semana = useLiveQuery(() => obtenerSemanaActiva());

  const generar = async () => {
    if (!semana?.id) {
      setLista([]);
      return;
    }
    setGenerando(true);
    try {
      const items = await generarListaCompra(semana.id);
      setLista(items);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <section className="page">
      <h1>Lista de la compra</h1>
      <p className="page__lead">
        Productos de los platos planificados esta semana (sin cantidades).
      </p>

      <button
        type="button"
        className="btn-primary"
        onClick={generar}
        disabled={generando}
      >
        {generando ? 'Generando…' : 'Generar lista'}
      </button>

      {lista === null ? (
        <p className="muted">Pulsa el botón para generar la lista.</p>
      ) : lista.length === 0 ? (
        <p className="muted">
          No hay productos. Planifica platos en{' '}
          <Link to="/semana">Semana</Link> y asegúrate de que tengan productos.
        </p>
      ) : (
        <ul className="list lista-compra">
          {lista.map((p) => (
            <li key={p.id} className="list__row">
              {p.nombre}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
