export const MIN_DESCRIPTION_LENGTH = 10

// Arbitrary demonstration factors, NOT published emission factors.
// Vehicle impact assumes one fictional day of use, without mileage or fuel data.
const activityTypes = [
  {
    categoria: 'energía',
    descripcion: 'Consumo eléctrico',
    unidad: 'kWh',
    factor: 0.2,
    keywords: /\b(?:kwh|electricidad|energia|electrico|electrica|luz)\b/,
    units: 'kwh',
    consejo: 'Apaga equipos que no estés usando y revisa el consumo de iluminación.',
    detalle: 'Indica cuántos kWh de electricidad consumiste.',
  },
  {
    categoria: 'transporte',
    descripcion: 'Uso de vehículos',
    unidad: 'vehículos',
    factor: 10,
    keywords: /\b(?:transporte|repartos?|camionetas?|camiones|camion|vehiculos?|autos?|carros?|furgonetas?|motos?|motocicletas?)\b/,
    units: 'camionetas?|camiones|camion|vehiculos?|autos?|carros?|furgonetas?|motos?|motocicletas?',
    consejo: 'Agrupa entregas y planifica recorridos para reducir desplazamientos.',
    detalle: 'Indica el número de vehículos utilizados con cifras enteras.',
  },
  {
    categoria: 'residuos',
    descripcion: 'Generación de residuos',
    unidad: 'kg',
    factor: 0.5,
    keywords: /\b(?:residuos|basura|desechos|reciclaje|reciclables)\b/,
    units: 'kg|kilogramos?',
    consejo: 'Separa los residuos aprovechables y busca reducir materiales de un solo uso.',
    detalle: 'Indica los kg de residuos, por ejemplo: 10 kg de residuos.',
  },
]

const numberPattern = '[-+]?(?:\\d{1,3}(?:\\.\\d{3})+(?:,\\d+)?|\\d+(?:[.,]\\d+)?)'
const wastePattern = '(?:residuos|basura|desechos|reciclaje|reciclables)'
const validNumber = new RegExp(`^${numberPattern}$`)
const unsafeContext = /\b(?:no|nunca|tampoco|ahorr\w*|evit\w*)\b/
const breakdownContext = /\b(?:total(?:es)?|desglose|desglosad[oa]s?|repartid[oa]s?|distribuid[oa]s?|incluye|incluyen|incluid[oa]s?)\b|\bde l[oa]s cuales\b/
const warnings = {
  CANTIDAD_INVALIDA: 'Hay una cantidad inválida o ambigua. Escríbela como un número no negativo, sin fracciones ni espacios internos; usa enteros para vehículos.',
  CONTEXTO_INSEGURO: 'Aclara qué actividad se realizó: las negaciones, los ahorros y las actividades evitadas no se contabilizan como consumo.',
  POSIBLE_DOBLE_CONTEO: 'Indica solo el total o solo las cantidades del desglose de esta categoría para evitar contarlas dos veces.',
  CANTIDAD_PENDIENTE: 'Hay una actividad sin cantidad reconocida en esta categoría. Añade su cantidad y unidad.',
}

function pendingQuantity(codigo) {
  return { cantidad: null, advertencia: { codigo, mensaje: warnings[codigo] } }
}

function normalizeText(text) {
  return typeof text === 'string'
    ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    : ''
}

export function hasEnoughText(text) {
  const normalized = normalizeText(text)
  return normalized.length >= MIN_DESCRIPTION_LENGTH && /[a-z]/.test(normalized)
}

function parseQuantity(value) {
  // Spanish thousands (1.000 / 1.000,5) and decimal comma or point (2,5 / 2.5).
  const normalized = /^[-+]?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(value)
    ? value.replaceAll('.', '').replace(',', '.')
    : value.replace(',', '.')
  return Number(normalized)
}

function extractQuantities(text, type) {
  // Capture the WHOLE numeric expression, even when invalid. Never recover a
  // positive suffix from grouped numbers, fractions or separated/Unicode signs.
  const amount = `(?<![\\w.,/+−–—-])(?<quantity>[+−–—-]?\\s*\\d[\\d.,/+−–—\\s-]*)\\s*(?:${type.units})\\b`
  const patterns = type.categoria === 'residuos'
    ? [
        `${amount}\\s+(?:de\\s+)?${wastePattern}\\b`,
        `\\b${wastePattern}\\s*(?::|=|de)?\\s*${amount}`,
      ]
    : [amount]
  const ranges = []
  const quantities = []

  for (const pattern of patterns) {
    for (const match of text.matchAll(new RegExp(pattern, 'g'))) {
      const start = match.index
      const end = start + match[0].length
      if (ranges.some(([from, to]) => start < to && end > from)) continue
      ranges.push([start, end])
      const value = match.groups.quantity.trim()
      const quantity = validNumber.test(value) ? parseQuantity(value) : NaN
      const invalid = !Number.isFinite(quantity) || quantity < 0 || quantity > Number.MAX_SAFE_INTEGER
        || (type.categoria === 'transporte' && !Number.isInteger(quantity))
      quantities.push(invalid ? pendingQuantity('CANTIDAD_INVALIDA') : { cantidad: quantity })
    }
  }

  // Keep unsupported/missing amounts visible even alongside a valid amount.
  // For waste, only consider bare kg when the clause also identifies waste.
  const unitMentions = [...text.matchAll(new RegExp(`(?<![a-z])(?:${type.units})\\b`, 'g'))]
  const hasUnmatchedUnit = unitMentions.some((match) => !ranges.some(([from, to]) => match.index >= from && match.index < to))
  const recognized = type.keywords.test(text) || quantities.length > 0
    || (type.categoria !== 'residuos' && unitMentions.length > 0)
  if (!recognized) return []
  if (!quantities.length || hasUnmatchedUnit) quantities.push(pendingQuantity('CANTIDAD_PENDIENTE'))

  // Conservative clause-level guard; this is not general language understanding.
  return unsafeContext.test(text)
    ? quantities.map(() => pendingQuantity('CONTEXTO_INSEGURO'))
    : quantities
}

/**
 * Local async service boundary. A future API adapter must return this same shape.
 * actividadesDetectadas: { categoria, descripcion, cantidad: number|null,
 *   unidad, impactoEstimado: number|null }[]
 * Pending activities also carry advertencia: { codigo, mensaje }.
 * A numeric total plus pending activities is partial, as the existing UI expects.
 * categorias: string[]; impactoEstimado: number|null; unidadImpacto: string;
 * recomendaciones: string[]. null means insufficient data, never zero emissions.
 */
export async function analyzeActivity(description) {
  await new Promise((resolve) => setTimeout(resolve, 650))
  const text = normalizeText(description)
  // Preserve punctuation/whitespace within numbers so malformed expressions are
  // rejected whole. Conjunctions separate safe activities from unsafe mentions.
  const sentences = text.split(/[;!?]+|\.(?!\s*\d)/)
  const result = {
    actividadesDetectadas: [],
    categorias: [],
    impactoEstimado: null,
    unidadImpacto: 'kg de CO₂e',
    recomendaciones: [],
  }

  for (const type of activityTypes) {
    let quantities = sentences.flatMap((sentence) => {
      const mentions = sentence.split(/\b(?:y|pero|ademas)\b/).flatMap((clause) => extractQuantities(clause, type))
      // Do not lose the scope of "no" / "ahorramos" in coordinated mentions
      // such as "No usamos 5 camionetas y 2 autos". A separate sentence can
      // still contribute a safe amount in the same category.
      return mentions.some(({ advertencia }) => advertencia?.codigo === 'CONTEXTO_INSEGURO')
        ? mentions.map(() => pendingQuantity('CONTEXTO_INSEGURO'))
        : mentions
    })
    if (!quantities.length) continue
    result.categorias.push(type.categoria)

    // A total and its breakdown may span clauses. Withhold this category rather
    // than guessing which amounts overlap; independent categories remain usable.
    const unitCount = [...text.matchAll(new RegExp(`(?<![a-z])(?:${type.units})\\b`, 'g'))].length
    const unitMention = new RegExp(`(?<![a-z])(?:${type.units})\\b`)
    const hasBreakdown = sentences.some((sentence) => unitMention.test(sentence) && (
      breakdownContext.test(sentence) || new RegExp(`(?:${type.units})\\s*[:=(]`).test(sentence)
    ))
    if (unitCount > 1 && hasBreakdown) {
      quantities = quantities.map(() => pendingQuantity('POSIBLE_DOBLE_CONTEO'))
    }

    for (const { cantidad, advertencia } of quantities) {
      result.actividadesDetectadas.push({
        categoria: type.categoria,
        descripcion: type.descripcion,
        cantidad,
        unidad: type.unidad,
        impactoEstimado: cantidad === null ? null : cantidad * type.factor,
        ...(advertencia ? { advertencia } : {}),
      })
    }
    result.recomendaciones.push(quantities.some(({ cantidad }) => cantidad !== null) ? type.consejo : type.detalle)
    const messages = new Set(quantities.filter(({ advertencia }) => advertencia).map(({ advertencia }) => advertencia.mensaje))
    for (const message of messages) result.recomendaciones.push(`${type.categoria}: ${message}`)
  }

  const measured = result.actividadesDetectadas.filter((activity) => activity.impactoEstimado !== null)
  if (measured.length) {
    const total = measured.reduce((sum, activity) => sum + activity.impactoEstimado, 0)
    result.impactoEstimado = Number(total.toFixed(2))
  } else {
    result.recomendaciones.unshift('Agrega más detalle: una cantidad y su unidad, por ejemplo 200 kWh, 5 camionetas o 10 kg de residuos.')
  }

  return result
}
