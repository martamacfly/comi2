import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Carrot, Plus, Trash } from '@phosphor-icons/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { crearProducto } from '../lib/productos';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProductoEmoji } from '../components/ProductoEmoji';

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
    await crearProducto(n);
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
      <PageHeader
        title="Productos"
        lead="Ingredientes que usan tus platos."
        icon={Carrot}
        iconTone="peach"
      />

      <form className="form-inline" onSubmit={add}>
        <input
          type="text"
          placeholder="Nuevo producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit" className="btn-primary btn-primary--icon">
          <Plus size={20} weight="bold" aria-hidden />
          Añadir
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {productos === undefined ? (
        <p className="muted">Cargando…</p>
      ) : productos.length === 0 ? (
        <EmptyState icon={Carrot} iconTone="peach">
          <p className="muted">Aún no hay productos.</p>
        </EmptyState>
      ) : (
        <ul className="list">
          {productos.map((p) => (
            <li key={p.id} className="list__row">
              <Link to={`/productos/${p.id}`} className="list__row-link">
                <ProductoEmoji producto={p} size="sm" />
                {p.nombre}
              </Link>
              <button
                type="button"
                className="btn-ghost btn-ghost--icon"
                onClick={() => remove(p.id!)}
              >
                <Trash size={18} weight="regular" aria-hidden />
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
