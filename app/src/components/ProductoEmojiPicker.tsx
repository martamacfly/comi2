import { useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { buscarEmojisEnCatalogo } from '../lib/producto-emoji';

interface ProductoEmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  onClose?: () => void;
}

export function ProductoEmojiPicker({
  value,
  onChange,
  onClose,
}: ProductoEmojiPickerProps) {
  const [consulta, setConsulta] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  const resultados = useMemo(
    () => buscarEmojisEnCatalogo(consulta),
    [consulta],
  );

  return (
    <div
      className="producto-emoji-picker"
      role="dialog"
      aria-label="Elegir emoji"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="producto-emoji-picker__search">
        <MagnifyingGlass size={18} weight="regular" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          className="producto-emoji-picker__input"
          placeholder="Buscar…"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          aria-label="Buscar emoji"
          autoComplete="off"
        />
      </div>
      <div
        className="producto-emoji-picker__grid"
        role="listbox"
        aria-label="Resultados"
      >
        {resultados.length === 0 ? (
          <p className="producto-emoji-picker__empty muted">
            No hay emojis para «{consulta}»
          </p>
        ) : (
          resultados.map((emoji) => (
            <button
              key={emoji}
              type="button"
              role="option"
              aria-selected={value === emoji}
              aria-label={emoji}
              className={
                value === emoji
                  ? 'producto-emoji-picker__btn producto-emoji-picker__btn--active'
                  : 'producto-emoji-picker__btn'
              }
              onClick={() => {
                onChange(emoji);
                onClose?.();
              }}
            >
              {emoji}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
