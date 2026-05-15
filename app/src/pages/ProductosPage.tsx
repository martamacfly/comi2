import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function ProductosPage() {
  const productos = useLiveQuery(() =>
    db.productos.orderBy('nombre').toArray(),
  );
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    if (!n) {
      setError('Escribe un nombre');
      return;
    }
    const dup = await db.productos.where('nombre').equals(n).first();
    if (dup) {
      setError('Ya existe ese producto');
      return;
    }
    await db.productos.add({ nombre: n });
    setNombre('');
    setError('');
  };

  const remove = async (id: number) => {
    const enUso = await db.platoProductos
      .where('productoId')
      .equals(id)
      .count();
    if (enUso > 0) {
      setError('No se puede eliminar: está en uno o más platos');
      return;
    }
    setError('');
    await db.productos.delete(id);
  };

  return (
    <section className="page">
      <h1>Productos</h1>
      <p className="page__lead">Ingredientes que usan tus platos.</p>

      <form className="form-inline" onSubmit={add}>
        <input
          type="text"
          placeholder="Nuevo producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">Añadir</button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {productos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : productos.length === 0 ? (
        <p className="muted">Aún no hay productos.</p>
      ) : (
        <ul className="list">
          {productos.map((p) => (
            <li key={p.id} className="list__row">
              <span>{p.nombre}</span>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => remove(p.id!)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
