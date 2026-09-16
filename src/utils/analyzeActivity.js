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
  // Boundaries prevent reading the tail of a malformed number as a valid amount.
  const amount = `(?<![\\w.,+-])(${numberPattern})\\s*(?:${type.units})\\b`
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
      const quantity = parseQuantity(match[1])
      if (!Number.isFinite(quantity) || quantity < 0 || quantity > Number.MAX_SAFE_INTEGER) continue
      if (type.categoria === 'transporte' && !Number.isInteger(quantity)) continue
      quantities.push(quantity)
    }
  }
  return quantities
}

/**
 * Local async service boundary. A future API adapter must return this same shape.
 * actividadesDetectadas: { categoria, descripcion, cantidad: number|null,
 *   unidad, impactoEstimado: number|null }[]
 * categorias: string[]; impactoEstimado: number|null; unidadImpacto: string;
 * recomendaciones: string[]. null means insufficient data, never zero emissions.
 */
export async function analyzeActivity(description) {
  await new Promise((resolve) => setTimeout(resolve, 650))
  const text = normalizeText(description)
  const result = {
    actividadesDetectadas: [],
    categorias: [],
    impactoEstimado: null,
    unidadImpacto: 'kg de CO₂e',
    recomendaciones: [],
  }

  for (const type of activityTypes) {
    const quantities = extractQuantities(text, type)
    if (!type.keywords.test(text) && quantities.length === 0) continue
    result.categorias.push(type.categoria)
    const amounts = quantities.length ? quantities : [null]

    for (const cantidad of amounts) {
      result.actividadesDetectadas.push({
        categoria: type.categoria,
        descripcion: type.descripcion,
        cantidad,
        unidad: type.unidad,
        impactoEstimado: cantidad === null ? null : cantidad * type.factor,
      })
    }
    result.recomendaciones.push(quantities.length ? type.consejo : type.detalle)
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
