/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Lexicón Bilingüe (ES-AR + EN) de Huellas Mecánicas y Slop de IA.
 * Usado tanto en el Frontend (IG Content Lab) como en validaciones locales.
 */

export interface InvisibleRule {
  codePoint: string
  name: string
  regex: RegExp
  action: 'delete' | 'space'
}

export interface TypographicRule {
  from: string
  name: string
  to: string
}

export interface SlopEntry {
  find: string
  replace: string
  family: 'slop-es' | 'slop-ig-es' | 'slop-en' | 'slop-ig-en'
}

export interface StructuralTellRule {
  id: string
  name: string
  regex: RegExp
  fix: string
}

export const INVISIBLE_RULES: readonly InvisibleRule[] = [
  { codePoint: 'U+200B', name: 'ZERO WIDTH SPACE', regex: /\u200B/g, action: 'delete' },
  { codePoint: 'U+200C', name: 'ZERO WIDTH NON-JOINER', regex: /\u200C/g, action: 'delete' },
  { codePoint: 'U+200D', name: 'ZERO WIDTH JOINER', regex: /\u200D/g, action: 'delete' },
  { codePoint: 'U+2060', name: 'WORD JOINER', regex: /\u2060/g, action: 'delete' },
  { codePoint: 'U+FEFF', name: 'BOM / ZERO WIDTH NO-BREAK', regex: /\uFEFF/g, action: 'delete' },
  { codePoint: 'U+00AD', name: 'SOFT HYPHEN', regex: /\u00AD/g, action: 'delete' },
  { codePoint: 'U+200E', name: 'LEFT-TO-RIGHT MARK', regex: /\u200E/g, action: 'delete' },
  { codePoint: 'U+200F', name: 'RIGHT-TO-LEFT MARK', regex: /\u200F/g, action: 'delete' },
  { codePoint: 'U+2063', name: 'INVISIBLE SEPARATOR', regex: /\u2063/g, action: 'delete' },
  { codePoint: 'U+00A0', name: 'NO-BREAK SPACE', regex: /\u00A0/g, action: 'space' },
  { codePoint: 'U+202F', name: 'NARROW NO-BREAK SPACE', regex: /\u202F/g, action: 'space' },
  { codePoint: 'U+2009', name: 'THIN SPACE', regex: /\u2009/g, action: 'space' },
  { codePoint: 'U+2003', name: 'EM SPACE', regex: /\u2003/g, action: 'space' },
  { codePoint: 'U+2002', name: 'EN SPACE', regex: /\u2002/g, action: 'space' },
]

export const TYPOGRAPHIC_RULES: readonly TypographicRule[] = [
  { from: '—', name: 'Raya larga (Em dash)', to: ', ' },
  { from: '–', name: 'Semirraya (En dash)', to: '-' },
  { from: '‘', name: 'Comilla simple curva izq.', to: "'" },
  { from: '’', name: 'Comilla simple curva der.', to: "'" },
  { from: '“', name: 'Comilla doble curva izq.', to: '"' },
  { from: '”', name: 'Comilla doble curva der.', to: '"' },
  { from: '…', name: 'Elipsis Unicode', to: '...' },
]

export const SLOP_LEXICON: readonly SlopEntry[] = [
  // Español comercial / IA genérico
  { find: 'en el vertiginoso mundo actual', replace: 'hoy', family: 'slop-es' },
  { find: 'en el mundo digital actual', replace: 'hoy', family: 'slop-es' },
  {
    find: 'llevar tu negocio al siguiente nivel',
    replace: 'escalar tus ventas',
    family: 'slop-es',
  },
  {
    find: 'lleva tu negocio al siguiente nivel',
    replace: 'ordená tu operación',
    family: 'slop-es',
  },
  { find: 'una solución integral', replace: 'un sistema a medida', family: 'slop-es' },
  { find: 'solución integral', replace: 'sistema completo', family: 'slop-es' },
  { find: 'cabe destacar que', replace: '', family: 'slop-es' },
  { find: 'es importante destacar que', replace: '', family: 'slop-es' },
  { find: 'sin lugar a dudas', replace: '', family: 'slop-es' },
  { find: 'hoy en día', replace: 'hoy', family: 'slop-es' },
  { find: 'sumergirnos en', replace: 'ver', family: 'slop-es' },
  { find: 'desbloquear el potencial', replace: 'aprovechar', family: 'slop-es' },
  { find: 'revolucionar', replace: 'mejorar', family: 'slop-es' },
  { find: 'potenciar', replace: 'escalar', family: 'slop-es' },
  { find: 'disruptivo', replace: 'directo', family: 'slop-es' },
  { find: 'sinergia', replace: 'integración', family: 'slop-es' },
  { find: 'paradigma', replace: 'enfoque', family: 'slop-es' },
  // Instagram Slop ES-AR
  { find: 'dejá de scrollear', replace: '', family: 'slop-ig-es' },
  { find: 'deja de scrollear', replace: '', family: 'slop-ig-es' },
  { find: 'no sigas bajando', replace: '', family: 'slop-ig-es' },
  { find: 'en el video de hoy', replace: '', family: 'slop-ig-es' },
  { find: 'en este reel te muestro', replace: '', family: 'slop-ig-es' },
  { find: 'seguime para más consejos', replace: '', family: 'slop-ig-es' },
  { find: 'etiquetá a alguien que necesite esto', replace: '', family: 'slop-ig-es' },
  { find: 'al algoritmo le encanta', replace: '', family: 'slop-ig-es' },
  // English AI & IG Slop (compatibilidad completa con instagram-agent-skill)
  { find: 'stop scrolling', replace: '', family: 'slop-ig-en' },
  { find: "in today's video", replace: '', family: 'slop-ig-en' },
  { find: 'in this video', replace: '', family: 'slop-ig-en' },
  { find: 'follow for more', replace: '', family: 'slop-ig-en' },
  { find: 'tag someone who needs this', replace: '', family: 'slop-ig-en' },
  { find: 'the algorithm loves', replace: '', family: 'slop-ig-en' },
  { find: "run don't walk", replace: '', family: 'slop-ig-en' },
  { find: 'game-changer', replace: 'useful shift', family: 'slop-en' },
  { find: 'game changer', replace: 'useful shift', family: 'slop-en' },
  { find: 'delve into', replace: 'examine', family: 'slop-en' },
  { find: 'delve', replace: 'look', family: 'slop-en' },
  { find: 'tapestry', replace: 'mix', family: 'slop-en' },
  { find: 'leverage', replace: 'use', family: 'slop-en' },
  { find: 'unlock the power of', replace: 'use', family: 'slop-en' },
  { find: 'at the end of the day', replace: 'ultimately', family: 'slop-en' },
]

export const STRUCTURAL_TELLS: readonly StructuralTellRule[] = [
  {
    id: 'not-just-x-its-y',
    name: 'Estructura "No es solo X, es Y" / "Not just X, it\'s Y"',
    regex:
      /\b(?:no\s+es\s+(?:solo|únicamente|solamente)\s+[^,.!?]{2,45},\s*(?:sino\s+)?es\b|it'?s\s+not\s+just\s+[^,.!?]{2,45},\s*it'?s\b)/gi,
    fix: 'Decí directamente qué hace el sistema sin usar el cliché retórico "no es solo X, es Y".',
  },
  {
    id: 'video-preamble',
    name: 'Preámbulo de video',
    regex:
      /\b(?:hoy\s+(?:te\s+|les\s+)?voy\s+a\s+(?:contar|mostrar|enseñar)|en\s+este\s+post\s+vamos\s+a\s+ver|today\s+i\s+wanted\s+to\s+talk\s+about)\b/gi,
    fix: 'Borrá la introducción y arrancá directamente en el dato o conflicto.',
  },
  {
    id: 'emoji-bullet-list',
    name: 'Lista con emojis como viñetas',
    regex: /^(?:[ \t]*[\u{1F300}-\u{1FAFF}✅🔥🚀✨💡⚡]\s+.+\n?){3,}/gmu,
    fix: 'Cambiá las listas de emojis por oraciones corridas o guiones limpios.',
  },
  {
    id: 'hashtag-wall',
    name: 'Muro de hashtags (>5)',
    regex: /(?:(?:\s|^)#[A-Za-zÁÉÍÓÚáéíóúÑñ0-9_]+){6,}/g,
    fix: 'Instagram limita a 5 hashtags relevantes desde dic. 2025. Recortá el excedente.',
  },
]
