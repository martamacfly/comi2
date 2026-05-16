export const PRODUCTO_EMOJIS_SUGERIDOS = [
  '🥕',
  '🍅',
  '🧅',
  '🥔',
  '🍚',
  '🍝',
  '🥩',
  '🐟',
  '🥚',
  '🧀',
  '🫒',
  '🧄',
  '🌶️',
  '🥬',
  '🍋',
  '🍎',
  '🍌',
  '🥛',
  '🫑',
  '🍞',
  '🧈',
  '🥑',
  '🍗',
  '🦐',
  '🍄',
  '🌽',
  '🥒',
  '🍇',
  '🫘',
  '🥖',
  '🍯',
] as const;

export function emojiPorDefecto(nombre?: string): string {
  if (!nombre?.trim()) return '🥕';
  let hash = 0;
  for (const c of nombre.trim()) hash = (hash + c.charCodeAt(0)) | 0;
  return PRODUCTO_EMOJIS_SUGERIDOS[Math.abs(hash) % PRODUCTO_EMOJIS_SUGERIDOS.length];
}

export function normalizarEmoji(emoji: string): string {
  const t = emoji.trim();
  if (!t) return emojiPorDefecto();
  return [...t][0] ?? emojiPorDefecto();
}
