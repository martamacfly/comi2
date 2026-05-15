import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { crearProducto } from '../lib/productos';

interface InlineProductoAddProps {
  onCreated: (productoId: number) => void;
}

export function InlineProductoAdd({ onCreated }: InlineProductoAddProps) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (adding) return;
    setAdding(true);
    setError('');
    try {
      const id = await crearProducto(nombre);
      onCreated(id);
      setNombre('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="inline-add">
      <span className="field-hint">Añadir producto al catálogo</span>
      <div className="form-inline">
        <input
          type="text"
          placeholder="Ej. tomate, arroz…"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void add();
            }
          }}
          disabled={adding}
          aria-label="Nombre del nuevo producto"
        />
        <button
          type="button"
          className="btn-secondary"
          disabled={adding}
          onClick={() => void add()}
        >
          <Plus size={18} weight="bold" aria-hidden />
          {adding ? 'Añadiendo…' : 'Añadir'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
