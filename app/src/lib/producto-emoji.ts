export type EmojiCatalogoEntrada = {
  emoji: string;
  keywords: string[];
};

/** Catálogo orientado a ingredientes y compra (palabras clave en español). */
export const EMOJI_CATALOGO: EmojiCatalogoEntrada[] = [
  { emoji: '🥕', keywords: ['zanahoria', 'verdura'] },
  { emoji: '🍅', keywords: ['tomate', 'verdura'] },
  { emoji: '🧅', keywords: ['cebolla', 'verdura'] },
  { emoji: '🥔', keywords: ['patata', 'papa', 'verdura'] },
  { emoji: '🥬', keywords: ['lechuga', 'verdura', 'ensalada'] },
  { emoji: '🥒', keywords: ['pepino', 'verdura'] },
  { emoji: '🫑', keywords: ['pimiento', 'verdura'] },
  { emoji: '🌶️', keywords: ['chile', 'picante', 'guindilla'] },
  { emoji: '🧄', keywords: ['ajo'] },
  { emoji: '🌽', keywords: ['maiz', 'elote'] },
  { emoji: '🍆', keywords: ['berenjena', 'verdura'] },
  { emoji: '🥦', keywords: ['brocoli', 'verdura'] },
  { emoji: '🫛', keywords: ['guisante', 'verdura'] },
  { emoji: '🍄', keywords: ['champiñon', 'seta', 'hongo'] },
  { emoji: '🥑', keywords: ['aguacate'] },
  { emoji: '🍋', keywords: ['limon', 'citrico', 'fruta'] },
  { emoji: '🍊', keywords: ['naranja', 'citrico', 'fruta'] },
  { emoji: '🍎', keywords: ['manzana', 'fruta'] },
  { emoji: '🍌', keywords: ['platano', 'banana', 'fruta'] },
  { emoji: '🍇', keywords: ['uva', 'fruta'] },
  { emoji: '🍓', keywords: ['fresa', 'fruta'] },
  { emoji: '🫐', keywords: ['arandano', 'fruta'] },
  { emoji: '🍑', keywords: ['melocoton', 'fruta'] },
  { emoji: '🍐', keywords: ['pera', 'fruta'] },
  { emoji: '🍉', keywords: ['sandia', 'fruta'] },
  { emoji: '🥩', keywords: ['carne', 'ternera', 'vacuno'] },
  { emoji: '🍗', keywords: ['pollo', 'ave', 'carne'] },
  { emoji: '🥓', keywords: ['bacon', 'beicon', 'panceta'] },
  { emoji: '🌭', keywords: ['salchicha', 'perrito'] },
  { emoji: '🐟', keywords: ['pescado', 'marisco'] },
  { emoji: '🦐', keywords: ['gamba', 'marisco', 'langostino'] },
  { emoji: '🦑', keywords: ['calamar', 'marisco'] },
  { emoji: '🥚', keywords: ['huevo'] },
  { emoji: '🧀', keywords: ['queso', 'lacteo'] },
  { emoji: '🥛', keywords: ['leche', 'lacteo'] },
  { emoji: '🧈', keywords: ['mantequilla', 'lacteo'] },
  { emoji: '🫒', keywords: ['aceituna', 'aceite'] },
  { emoji: '🍞', keywords: ['pan', 'bolleria'] },
  { emoji: '🥖', keywords: ['baguette', 'pan'] },
  { emoji: '🥐', keywords: ['croissant', 'bolleria'] },
  { emoji: '🍚', keywords: ['arroz', 'cereal'] },
  { emoji: '🍝', keywords: ['pasta', 'espagueti', 'macarrones'] },
  { emoji: '🫘', keywords: ['judia', 'legumbre', 'lenteja'] },
  { emoji: '🥫', keywords: ['lata', 'conserva'] },
  { emoji: '🍯', keywords: ['miel'] },
  { emoji: '🧂', keywords: ['sal', 'condimento'] },
  { emoji: '🫙', keywords: ['tarro', 'salsa', 'yogur'] },
  { emoji: '🍶', keywords: ['salsa', 'soja'] },
  { emoji: '🫗', keywords: ['aceite', 'vinagre'] },
  { emoji: '☕', keywords: ['cafe', 'bebida'] },
  { emoji: '🍵', keywords: ['te', 'infusion', 'bebida'] },
  { emoji: '🧃', keywords: ['zumo', 'jugo', 'bebida'] },
  { emoji: '🍷', keywords: ['vino', 'bebida'] },
  { emoji: '🍺', keywords: ['cerveza', 'bebida'] },
  { emoji: '🧊', keywords: ['hielo'] },
  { emoji: '🍫', keywords: ['chocolate', 'dulce'] },
  { emoji: '🍪', keywords: ['galleta', 'dulce'] },
  { emoji: '🍰', keywords: ['tarta', 'pastel', 'dulce'] },
  { emoji: '🧁', keywords: ['magdalena', 'cupcake', 'dulce'] },
  { emoji: '🍦', keywords: ['helado', 'dulce'] },
  { emoji: '🥜', keywords: ['cacahuete', 'fruto seco'] },
  { emoji: '🌰', keywords: ['castaña', 'fruto seco'] },
  { emoji: '🍕', keywords: ['pizza'] },
  { emoji: '🍔', keywords: ['hamburguesa'] },
  { emoji: '🌮', keywords: ['taco', 'mexicano'] },
  { emoji: '🥗', keywords: ['ensalada'] },
  { emoji: '🍲', keywords: ['guiso', 'sopa', 'cocido'] },
  { emoji: '🥘', keywords: ['paella', 'sarten', 'guiso'] },
  { emoji: '🍳', keywords: ['huevo', 'frito', 'desayuno'] },
  { emoji: '🥡', keywords: ['takeaway', 'comida'] },
  { emoji: '🛒', keywords: ['compra', 'super', 'carrito'] },
  { emoji: '🧺', keywords: ['cesta', 'compra'] },
  { emoji: '📦', keywords: ['paquete', 'envase'] },
];

export const PRODUCTO_EMOJIS_SUGERIDOS = EMOJI_CATALOGO.map((e) => e.emoji);

function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export function buscarEmojisEnCatalogo(consulta: string): string[] {
  const q = normalizarBusqueda(consulta);
  if (!q) return PRODUCTO_EMOJIS_SUGERIDOS;
  return EMOJI_CATALOGO.filter((entrada) =>
    entrada.keywords.some((palabra) => normalizarBusqueda(palabra).includes(q)),
  ).map((entrada) => entrada.emoji);
}

export function emojiPorDefecto(nombre?: string): string {
  if (!nombre?.trim()) return '🥕';
  const n = normalizarBusqueda(nombre);
  const porNombre = EMOJI_CATALOGO.find((e) =>
    e.keywords.some((k) => n.includes(normalizarBusqueda(k)) || normalizarBusqueda(k).includes(n)),
  );
  if (porNombre) return porNombre.emoji;
  let hash = 0;
  for (const c of nombre.trim()) hash = (hash + c.charCodeAt(0)) | 0;
  return PRODUCTO_EMOJIS_SUGERIDOS[Math.abs(hash) % PRODUCTO_EMOJIS_SUGERIDOS.length];
}

export function normalizarEmoji(emoji: string): string {
  const t = emoji.trim();
  if (!t) return emojiPorDefecto();
  return [...t][0] ?? emojiPorDefecto();
}
