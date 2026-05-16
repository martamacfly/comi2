import { PRODUCTO_EMOJIS_SUGERIDOS } from '../lib/producto-emoji';

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
  return (
    <div className="producto-emoji-picker" role="listbox" aria-label="Elegir emoji">
      {PRODUCTO_EMOJIS_SUGERIDOS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="option"
          aria-selected={value === emoji}
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
      ))}
    </div>
  );
}
