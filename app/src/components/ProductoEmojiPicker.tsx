import { useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
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
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const resultados = useMemo(
    () => buscarEmojisEnCatalogo(consulta),
    [consulta],
  );

  return (
    <div
      className="emoji-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="emoji-modal"
        role="dialog"
        aria-label="Elegir emoji"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="emoji-modal__header">
          <span className="emoji-modal__title">Elegir emoji</span>
          <button
            type="button"
            className="emoji-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} weight="bold" aria-hidden />
          </button>
        </div>

        <div className="emoji-modal__search">
          <MagnifyingGlass size={18} weight="regular" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            className="emoji-modal__input"
            placeholder="Buscar…"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            aria-label="Buscar emoji"
            autoComplete="off"
          />
        </div>

        <div
          className="emoji-modal__grid"
          role="listbox"
          aria-label="Resultados"
        >
          {resultados.length === 0 ? (
            <p className="emoji-modal__empty muted">
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
                    ? 'emoji-modal__btn emoji-modal__btn--active'
                    : 'emoji-modal__btn'
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
    </div>
  );
}
