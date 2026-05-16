import { useEffect, useRef, useState } from 'react';
import { PencilSimple, X } from '@phosphor-icons/react';
import { ProductoEmoji } from './ProductoEmoji';
import { ProductoEmojiPicker } from './ProductoEmojiPicker';
import { actualizarProducto } from '../lib/productos';
import type { Producto } from '../db/types';

interface ProductoInlineTitleProps {
  producto: Producto;
  productoId: number;
}

export function ProductoInlineTitle({
  producto,
  productoId,
}: ProductoInlineTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [nombre, setNombre] = useState(producto.nombre);
  const [emoji, setEmoji] = useState(producto.emoji);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNombre(producto.nombre);
    setEmoji(producto.emoji);
    setEditandoNombre(false);
    setMostrarEmojis(false);
  }, [producto.id, producto.nombre, producto.emoji]);

  useEffect(() => {
    if (editandoNombre) inputRef.current?.focus();
  }, [editandoNombre]);

  useEffect(() => {
    if (!mostrarEmojis) return;
    const cerrar = (e: MouseEvent) => {
      const wrap = document.querySelector('.producto-inline-title__emoji-wrap');
      if (wrap && !wrap.contains(e.target as Node)) setMostrarEmojis(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, [mostrarEmojis]);

  const guardarNombre = async () => {
    const n = nombre.trim();
    if (n === producto.nombre) {
      setEditandoNombre(false);
      setError('');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await actualizarProducto(productoId, { nombre: n });
      setEditandoNombre(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
      setNombre(producto.nombre);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarNombre = () => {
    setNombre(producto.nombre);
    setEditandoNombre(false);
    setError('');
  };

  const cambiarEmoji = async (nuevo: string) => {
    if (nuevo === producto.emoji) return;
    setGuardando(true);
    setError('');
    try {
      await actualizarProducto(productoId, { emoji: nuevo });
      setEmoji(nuevo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="producto-inline-title">
      <div className="producto-inline-title__emoji-wrap">
        <button
          type="button"
          className="producto-inline-title__emoji-btn"
          onClick={() => setMostrarEmojis((v) => !v)}
          disabled={guardando}
          aria-label="Cambiar emoji del producto"
          aria-expanded={mostrarEmojis}
        >
          <ProductoEmoji producto={{ emoji, nombre }} size="lg" />
        </button>
        {mostrarEmojis && (
          <ProductoEmojiPicker
            value={emoji}
            onChange={(e) => void cambiarEmoji(e)}
            onClose={() => setMostrarEmojis(false)}
          />
        )}
      </div>

      <div className="producto-inline-title__name-wrap">
        {editandoNombre ? (
          <input
            ref={inputRef}
            type="text"
            className="producto-inline-title__input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={guardando}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void guardarNombre();
              if (e.key === 'Escape') cancelarNombre();
            }}
            onBlur={() => void guardarNombre()}
            aria-label="Nombre del producto"
          />
        ) : (
          <>
            <h1 className="producto-inline-title__name">{producto.nombre}</h1>
            <button
              type="button"
              className="producto-inline-title__edit"
              onClick={() => setEditandoNombre(true)}
              disabled={guardando}
              aria-label="Editar nombre"
            >
              <PencilSimple size={20} weight="regular" aria-hidden />
            </button>
          </>
        )}
      </div>

      {editandoNombre && (
        <button
          type="button"
          className="producto-inline-title__cancel"
          onClick={cancelarNombre}
          aria-label="Cancelar edición"
        >
          <X size={18} weight="bold" aria-hidden />
        </button>
      )}

      {error && <p className="form-error producto-inline-title__error">{error}</p>}
    </div>
  );
}
