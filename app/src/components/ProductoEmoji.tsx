import { emojiPorDefecto } from '../lib/producto-emoji';
import type { Producto } from '../db/types';

interface ProductoEmojiProps {
  producto: Pick<Producto, 'emoji' | 'nombre'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProductoEmoji({
  producto,
  size = 'md',
  className = '',
}: ProductoEmojiProps) {
  const emoji = producto.emoji || emojiPorDefecto(producto.nombre);
  return (
    <span
      className={`producto-emoji producto-emoji--${size}${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      {emoji}
    </span>
  );
}
