export type EmojiCatalogoEntrada = {
  emoji: string;
  keywords: string[];
};

/** Catálogo orientado a ingredientes y compra (palabras clave en español). */
export const EMOJI_CATALOGO: EmojiCatalogoEntrada[] = [
  // — Verduras y hortalizas —
  { emoji: '🥕', keywords: ['zanahoria', 'verdura'] },
  { emoji: '🍅', keywords: ['tomate', 'verdura'] },
  { emoji: '🧅', keywords: ['cebolla', 'verdura'] },
  { emoji: '🥔', keywords: ['patata', 'papa', 'verdura'] },
  { emoji: '🥬', keywords: ['lechuga', 'verdura', 'ensalada', 'espinaca', 'acelga'] },
  { emoji: '🥒', keywords: ['pepino', 'verdura'] },
  { emoji: '🫑', keywords: ['pimiento', 'verdura'] },
  { emoji: '🌶️', keywords: ['chile', 'picante', 'guindilla', 'pimiento'] },
  { emoji: '🧄', keywords: ['ajo'] },
  { emoji: '🌽', keywords: ['maiz', 'elote', 'verdura'] },
  { emoji: '🍆', keywords: ['berenjena', 'verdura'] },
  { emoji: '🥦', keywords: ['brocoli', 'brocoli', 'verdura'] },
  { emoji: '🫛', keywords: ['guisante', 'vaina', 'verdura'] },
  { emoji: '🍄', keywords: ['champiñon', 'seta', 'hongo', 'verdura'] },
  { emoji: '🥑', keywords: ['aguacate'] },
  { emoji: '🫚', keywords: ['aceite', 'oliva'] },
  { emoji: '🫒', keywords: ['aceituna', 'oliva', 'aceite'] },
  { emoji: '🌿', keywords: ['hierbas', 'perejil', 'cilantro', 'albahaca', 'oregano', 'tomillo', 'romero', 'verdura'] },
  { emoji: '🌱', keywords: ['brote', 'germinado', 'verdura'] },
  { emoji: '🥜', keywords: ['cacahuete', 'fruto seco', 'mani'] },
  { emoji: '🌰', keywords: ['castaña', 'fruto seco'] },

  // — Frutas —
  { emoji: '🍋', keywords: ['limon', 'citrico', 'fruta'] },
  { emoji: '🍋‍🟩', keywords: ['lima', 'citrico', 'fruta'] },
  { emoji: '🍊', keywords: ['naranja', 'mandarina', 'citrico', 'fruta'] },
  { emoji: '🍎', keywords: ['manzana', 'fruta'] },
  { emoji: '🍏', keywords: ['manzana verde', 'fruta'] },
  { emoji: '🍌', keywords: ['platano', 'banana', 'fruta'] },
  { emoji: '🍇', keywords: ['uva', 'fruta'] },
  { emoji: '🍓', keywords: ['fresa', 'fruta'] },
  { emoji: '🫐', keywords: ['arandano', 'fruta'] },
  { emoji: '🍒', keywords: ['cereza', 'fruta'] },
  { emoji: '🍑', keywords: ['melocoton', 'nectarina', 'fruta'] },
  { emoji: '🍐', keywords: ['pera', 'fruta'] },
  { emoji: '🍉', keywords: ['sandia', 'fruta'] },
  { emoji: '🍈', keywords: ['melon', 'fruta'] },
  { emoji: '🍍', keywords: ['pina', 'anana', 'fruta'] },
  { emoji: '🥭', keywords: ['mango', 'fruta'] },
  { emoji: '🥝', keywords: ['kiwi', 'fruta'] },
  { emoji: '🍅', keywords: ['tomate cherry', 'fruta', 'verdura'] },
  { emoji: '🫙', keywords: ['mermelada', 'confitura', 'tarro'] },

  // — Carnes —
  { emoji: '🥩', keywords: ['carne', 'ternera', 'vacuno', 'filete', 'entrecot'] },
  { emoji: '🍗', keywords: ['pollo', 'ave', 'carne', 'muslo', 'pechuga'] },
  { emoji: '🍖', keywords: ['costilla', 'cerdo', 'carne', 'hueso'] },
  { emoji: '🥓', keywords: ['bacon', 'beicon', 'panceta', 'cerdo'] },
  { emoji: '🌭', keywords: ['salchicha', 'perrito', 'frankfurt'] },
  { emoji: '🍔', keywords: ['hamburguesa', 'carne'] },
  { emoji: '🥚', keywords: ['huevo'] },
  { emoji: '🍳', keywords: ['huevo frito', 'tortilla', 'desayuno'] },

  // — Pescados y mariscos —
  { emoji: '🐟', keywords: ['pescado', 'merluza', 'dorada', 'lubina', 'salmon'] },
  { emoji: '🐠', keywords: ['pescado', 'marisco'] },
  { emoji: '🐡', keywords: ['pescado', 'marisco'] },
  { emoji: '🦈', keywords: ['tiburon', 'pez espada', 'pescado'] },
  { emoji: '🎣', keywords: ['pescado', 'pesca'] },
  { emoji: '🦐', keywords: ['gamba', 'langostino', 'marisco'] },
  { emoji: '🦞', keywords: ['bogavante', 'langosta', 'marisco'] },
  { emoji: '🦀', keywords: ['cangrejo', 'marisco'] },
  { emoji: '🦑', keywords: ['calamar', 'marisco'] },
  { emoji: '🐙', keywords: ['pulpo', 'marisco'] },
  { emoji: '🦪', keywords: ['ostra', 'marisco', 'almeja', 'mejillon'] },
  { emoji: '🐚', keywords: ['berberecho', 'marisco', 'almeja'] },
  { emoji: '🐟', keywords: ['atun', 'bonito', 'pescado'] },
  { emoji: '🥫', keywords: ['atun lata', 'conserva', 'lata'] },

  // — Lácteos —
  { emoji: '🧀', keywords: ['queso', 'lacteo'] },
  { emoji: '🥛', keywords: ['leche', 'lacteo'] },
  { emoji: '🧈', keywords: ['mantequilla', 'margarina', 'lacteo'] },
  { emoji: '🍦', keywords: ['helado', 'dulce', 'lacteo'] },
  { emoji: '🍮', keywords: ['flan', 'natillas', 'postre'] },

  // — Pan, harinas y cereales —
  { emoji: '🍞', keywords: ['pan', 'bolleria', 'hogaza'] },
  { emoji: '🥖', keywords: ['baguette', 'pan frances', 'pan'] },
  { emoji: '🥐', keywords: ['croissant', 'bolleria'] },
  { emoji: '🥨', keywords: ['pretzel', 'pan'] },
  { emoji: '🧇', keywords: ['gofre', 'desayuno'] },
  { emoji: '🥞', keywords: ['tortita', 'pancake', 'desayuno'] },
  { emoji: '🍚', keywords: ['arroz', 'cereal', 'grano'] },
  { emoji: '🍝', keywords: ['pasta', 'espagueti', 'macarrones', 'fideo'] },
  { emoji: '🍜', keywords: ['fideos', 'ramen', 'pasta'] },
  { emoji: '🍛', keywords: ['curry', 'arroz'] },
  { emoji: '🌾', keywords: ['trigo', 'harina', 'cereal', 'avena'] },

  // — Legumbres —
  { emoji: '🫘', keywords: ['judia', 'alubia', 'garbanzo', 'lenteja', 'legumbre', 'haba'] },

  // — Condimentos, salsas y especias —
  { emoji: '🧂', keywords: ['sal', 'condimento'] },
  { emoji: '🫗', keywords: ['aceite', 'vinagre', 'condimento'] },
  { emoji: '🍶', keywords: ['salsa soja', 'soja'] },
  { emoji: '🍯', keywords: ['miel', 'dulce'] },
  { emoji: '🌶️', keywords: ['pimenton', 'paprika', 'picante', 'condimento'] },
  { emoji: '🧪', keywords: ['levadura', 'bicarbonato'] },

  // — Conservas y envasados —
  { emoji: '🥫', keywords: ['lata', 'conserva', 'tomate lata', 'bote'] },
  { emoji: '📦', keywords: ['paquete', 'envase', 'caja'] },

  // — Bebidas —
  { emoji: '☕', keywords: ['cafe', 'capuchino', 'bebida'] },
  { emoji: '🍵', keywords: ['te', 'infusion', 'bebida'] },
  { emoji: '🧃', keywords: ['zumo', 'jugo', 'bebida', 'nectar'] },
  { emoji: '🍷', keywords: ['vino', 'bebida'] },
  { emoji: '🍺', keywords: ['cerveza', 'bebida'] },
  { emoji: '🥤', keywords: ['refresco', 'bebida', 'cola'] },
  { emoji: '🧋', keywords: ['batido', 'bebida', 'leche'] },
  { emoji: '🍹', keywords: ['zumo tropical', 'bebida'] },
  { emoji: '🧊', keywords: ['hielo', 'agua'] },
  { emoji: '💧', keywords: ['agua', 'bebida'] },

  // — Dulces y postres —
  { emoji: '🍫', keywords: ['chocolate', 'dulce', 'cacao'] },
  { emoji: '🍪', keywords: ['galleta', 'dulce'] },
  { emoji: '🍰', keywords: ['tarta', 'pastel', 'dulce', 'bizcocho'] },
  { emoji: '🧁', keywords: ['magdalena', 'muffin', 'cupcake', 'dulce'] },
  { emoji: '🍮', keywords: ['flan', 'postre', 'dulce'] },
  { emoji: '🍨', keywords: ['helado', 'postre', 'dulce'] },
  { emoji: '🍧', keywords: ['granizado', 'postre', 'dulce'] },
  { emoji: '🎂', keywords: ['cumpleanos', 'tarta', 'dulce'] },
  { emoji: '🍩', keywords: ['donut', 'dulce', 'bolleria'] },
  { emoji: '🍬', keywords: ['caramelo', 'dulce', 'chuche'] },
  { emoji: '🍭', keywords: ['piruleta', 'dulce', 'chuche'] },
  { emoji: '🍡', keywords: ['mochi', 'dulce'] },

  // — Frutos secos y semillas —
  { emoji: '🥜', keywords: ['cacahuete', 'mani', 'fruto seco'] },
  { emoji: '🌰', keywords: ['castaña', 'fruto seco'] },
  { emoji: '🫚', keywords: ['aceite girasol', 'semilla'] },

  // — Platos preparados —
  { emoji: '🍕', keywords: ['pizza'] },
  { emoji: '🌮', keywords: ['taco', 'mexicano', 'tortilla'] },
  { emoji: '🌯', keywords: ['wrap', 'bocadillo', 'tortilla'] },
  { emoji: '🥗', keywords: ['ensalada', 'verdura'] },
  { emoji: '🍲', keywords: ['guiso', 'sopa', 'cocido', 'puchero', 'olla'] },
  { emoji: '🥘', keywords: ['paella', 'sarten', 'guiso', 'arroz'] },
  { emoji: '🫕', keywords: ['fondue', 'guiso', 'olla'] },
  { emoji: '🥙', keywords: ['kebab', 'falafel', 'bocadillo'] },
  { emoji: '🫔', keywords: ['burrito', 'tortilla'] },
  { emoji: '🍱', keywords: ['bento', 'tuper', 'comida'] },
  { emoji: '🥡', keywords: ['takeaway', 'comida', 'para llevar'] },
  { emoji: '🍣', keywords: ['sushi', 'japones'] },
  { emoji: '🍤', keywords: ['gamba rebozada', 'frito'] },
  { emoji: '🥟', keywords: ['empanadilla', 'dumplings'] },
  { emoji: '🧆', keywords: ['falafel', 'garbanzos'] },
  { emoji: '🧇', keywords: ['gofre'] },
  { emoji: '🥚', keywords: ['huevo cocido', 'huevo duro'] },
  { emoji: '🍿', keywords: ['palomitas', 'snack'] },
  { emoji: '🧈', keywords: ['tostada', 'desayuno'] },

  // — Compra —
  { emoji: '🛒', keywords: ['compra', 'supermercado', 'carrito'] },
  { emoji: '🧺', keywords: ['cesta', 'compra'] },
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
