import { Tag } from '@phosphor-icons/react';
import { normalizeHex, textColorForBackground } from '../lib/color';
import type { Etiqueta } from '../db/types';

interface TagChipProps {
  etiqueta: Pick<Etiqueta, 'nombre' | 'color'>;
  onRemove?: () => void;
  onClick?: () => void;
  small?: boolean;
}

export function TagChip({ etiqueta, onRemove, onClick, small }: TagChipProps) {
  const bg = normalizeHex(etiqueta.color);
  const fg = textColorForBackground(bg);

  return (
    <span
      className={`tag-chip${small ? ' tag-chip--small' : ''}${onClick ? ' tag-chip--clickable' : ''}`}
      style={{ backgroundColor: bg, color: fg }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!small && <Tag size={14} weight="duotone" aria-hidden />}
      {etiqueta.nombre}
      {onRemove && (
        <button
          type="button"
          className="tag-chip__remove"
          style={{ color: fg }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Quitar ${etiqueta.nombre}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
