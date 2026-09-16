import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { analyzeActivity, hasEnoughText } from './analyzeActivity.js'

describe('análisis local de actividades', { concurrency: true }, () => {
  it('extrae el ejemplo principal y calcula un total demostrativo', async () => {
    const result = await analyzeActivity('Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad.')
    assert.deepEqual(result.categorias, ['energía', 'transporte'])
    assert.equal(result.impactoEstimado, 90)
    assert.equal(result.unidadImpacto, 'kg de CO₂e')
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad, unidad }) => [cantidad, unidad]), [[200, 'kWh'], [5, 'vehículos']])
    assert.equal(result.recomendaciones.length, 2)
  })

  it('acepta mayúsculas, tildes y las tres categorías', async () => {
    const result = await analyzeActivity('Usamos 2 CAMIONES, 100 KWH y generamos 10 kg de RESIDUOS.')
    assert.deepEqual(result.categorias, ['energía', 'transporte', 'residuos'])
    assert.equal(result.impactoEstimado, 45)
  })

  it('reconoce una unidad escrita sin espacio tras la cantidad', async () => {
    const result = await analyzeActivity('Consumimos 200kWh y generamos 5kg de residuos.')
    assert.deepEqual(result.categorias, ['energía', 'residuos'])
    assert.equal(result.impactoEstimado, 42.5)
  })

  it('acepta coma decimal y miles en notación española', async () => {
    const result = await analyzeActivity('Consumimos 1.000,5 kWh y generamos 2,5 kg de basura.')
    assert.equal(result.impactoEstimado, 201.35)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [1000.5, 2.5])
  })

  it('acepta decimales con punto y suma consumos separados', async () => {
    const result = await analyzeActivity('Consumimos 10.5 kWh en la mañana y 20 kWh en la tarde.')
    assert.equal(result.actividadesDetectadas.length, 2)
    assert.equal(result.impactoEstimado, 6.1)
  })

  it('extrae residuos antes de la cantidad y no duplica coincidencias', async () => {
    const result = await analyzeActivity('Residuos: 10 kg de residuos; basura: 2 kilogramos.')
    assert.equal(result.actividadesDetectadas.length, 2)
    assert.equal(result.impactoEstimado, 6)
  })

  it('no confunde el peso de productos con residuos', async () => {
    const result = await analyzeActivity('Compramos 50 kg de arroz y separamos los residuos.')
    assert.deepEqual(result.categorias, ['residuos'])
    assert.equal(result.actividadesDetectadas[0].cantidad, null)
    assert.equal(result.impactoEstimado, null)
  })

  it('mantiene las categorías reconocidas aunque no haya cantidades', async () => {
    const result = await analyzeActivity('Hoy usamos electricidad y camionetas para el reparto.')
    assert.deepEqual(result.categorias, ['energía', 'transporte'])
    assert.ok(result.actividadesDetectadas.every(({ cantidad }) => cantidad === null))
    assert.equal(result.impactoEstimado, null)
    assert.match(result.recomendaciones[0], /Agrega más detalle/)
  })

  it('estima solo cantidades conocidas y conserva las actividades pendientes', async () => {
    const result = await analyzeActivity('Consumimos 200 kWh y generamos residuos.')
    assert.equal(result.impactoEstimado, 40)
    assert.equal(result.actividadesDetectadas[1].cantidad, null)
    assert.match(result.recomendaciones[1], /kg de residuos/)
  })

  it('conserva el contrato para texto vacío, irrelevante y entradas inválidas', async () => {
    for (const text of ['', 'Hoy tuvimos una reunión con el equipo.', undefined, null, 42]) {
      const result = await analyzeActivity(text)
      assert.deepEqual(Object.keys(result), ['actividadesDetectadas', 'categorias', 'impactoEstimado', 'unidadImpacto', 'recomendaciones'])
      assert.deepEqual(result.actividadesDetectadas, [])
      assert.deepEqual(result.categorias, [])
      assert.equal(result.impactoEstimado, null)
      assert.ok(result.recomendaciones.length > 0)
    }
  })

  it('distingue cero explícito de una cantidad desconocida', async () => {
    const result = await analyzeActivity('Consumimos 0 kWh y generamos 0 kg de residuos.')
    assert.equal(result.impactoEstimado, 0)
    assert.ok(result.actividadesDetectadas.every(({ cantidad }) => cantidad === 0))
  })

  it('no acepta cantidades negativas ni fracciones de vehículos', async () => {
    const result = await analyzeActivity('Usamos -200 kWh, 2,5 camionetas y -10 kg de residuos.')
    assert.equal(result.impactoEstimado, null)
    assert.ok(result.actividadesDetectadas.every(({ cantidad }) => cantidad === null))
  })

  it('no extrae fragmentos de números mal formados ni números sin unidades', async () => {
    const result = await analyzeActivity('Electricidad: 1,2,3 kWh. Transporte: 50. Residuos: 20.')
    assert.equal(result.impactoEstimado, null)
  })

  it('mantiene un intervalo asíncrono antes de entregar resultados', async () => {
    let resolved = false
    const pending = analyzeActivity('Consumimos 100 kWh.').then(() => { resolved = true })
    await Promise.resolve()
    assert.equal(resolved, false)
    await pending
    assert.equal(resolved, true)
  })

  it('valida la longitud útil antes de habilitar la acción', () => {
    assert.equal(hasEnoughText(''), false)
    assert.equal(hasEnoughText('          '), false)
    assert.equal(hasEnoughText('hola'), false)
    assert.equal(hasEnoughText('123456789012345'), false)
    assert.equal(hasEnoughText('..............'), false)
    assert.equal(hasEnoughText('Consumimos 200 kWh'), true)
  })

  const invalidAmounts = [
    ['miles separados por espacio', 'Consumimos 1 000 kWh.'],
    ['miles separados por espacio no separable', 'Consumimos 1\u00a0000 kWh.'],
    ['signo menos Unicode', 'Consumimos −200 kWh.'],
    ['signo menos separado', 'Consumimos - 200 kWh.'],
    ['signo Unicode separado', 'Consumimos − 200 kWh.'],
    ['fracción de vehículos', 'Usamos 1/2 camionetas.'],
    ['fracción con espacios', 'Usamos 1 / 2 camionetas.'],
    ['rango de cantidades', 'Consumimos 100-200 kWh.'],
    ['cantidad mal formada junto a residuos', 'Generamos 1 000 kg de residuos.'],
  ]
  for (const [name, description] of invalidAmounts) {
    it(`rechaza la expresión completa: ${name}`, async () => {
      const result = await analyzeActivity(description)
      assert.equal(result.impactoEstimado, null)
      assert.ok(result.actividadesDetectadas.length > 0)
      assert.ok(result.actividadesDetectadas.every(({ cantidad, impactoEstimado, advertencia }) => (
        cantidad === null && impactoEstimado === null && advertencia.codigo === 'CANTIDAD_INVALIDA'
      )))
    })
  }

  const unsafeDescriptions = [
    'No usamos 5 camionetas.',
    'Ahorramos 200 kWh.',
    'Evitamos usar 2 vehículos.',
    'No usamos 5 camionetas y 2 autos.',
    'Ahorramos 100 kWh y 200 kWh.',
  ]
  for (const description of unsafeDescriptions) {
    it(`solicita aclaración del contexto: ${description}`, async () => {
      const result = await analyzeActivity(description)
      assert.equal(result.impactoEstimado, null)
      assert.ok(result.actividadesDetectadas.length > 0)
      assert.ok(result.actividadesDetectadas.every(({ advertencia }) => advertencia.codigo === 'CONTEXTO_INSEGURO'))
      assert.ok(result.recomendaciones.some((message) => message.includes('Aclara qué actividad')))
    })
  }

  const breakdownDescriptions = [
    'Consumimos 200 kWh en total: 150 kWh de equipos y 50 kWh de luces.',
    'Consumimos 200 kWh en total. Equipos: 150 kWh. Luces: 50 kWh.',
    'Consumimos 200 kWh: 150 kWh de equipos y 50 kWh de luces.',
    'Usamos 5 vehículos en total: 3 camionetas y 2 autos.',
  ]
  for (const description of breakdownDescriptions) {
    it(`evita doble conteo: ${description}`, async () => {
      const result = await analyzeActivity(description)
      assert.equal(result.impactoEstimado, null)
      assert.ok(result.actividadesDetectadas.every(({ cantidad, advertencia }) => (
        cantidad === null && advertencia.codigo === 'POSIBLE_DOBLE_CONTEO'
      )))
    })
  }

  it('conserva una cantidad inválida junto a una válida de la misma categoría', async () => {
    const result = await analyzeActivity('Consumimos 100 kWh y -20 kWh.')
    assert.equal(result.impactoEstimado, 20)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [100, null])
    assert.equal(result.actividadesDetectadas[1].advertencia.codigo, 'CANTIDAD_INVALIDA')
    assert.ok(result.recomendaciones.some((message) => message.includes('inválida o ambigua')))
  })

  it('conserva consumo adicional sin medir dentro de la misma categoría', async () => {
    const result = await analyzeActivity('Consumimos 100 kWh y electricidad adicional sin medir.')
    assert.equal(result.impactoEstimado, 20)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [100, null])
    assert.equal(result.actividadesDetectadas[1].advertencia.codigo, 'CANTIDAD_PENDIENTE')
  })

  it('conserva una unidad sin cantidad en la misma cláusula', async () => {
    const result = await analyzeActivity('Electricidad: 100 kWh más otros kWh sin medir.')
    assert.equal(result.impactoEstimado, 20)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [100, null])
  })

  it('mantiene un consumo seguro de otra categoría al detectar una negación', async () => {
    const result = await analyzeActivity('No usamos 5 camionetas y consumimos 200 kWh.')
    assert.equal(result.impactoEstimado, 40)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [200, null])
  })

  it('mantiene una actividad segura en una oración independiente de la misma categoría', async () => {
    const result = await analyzeActivity('No usamos 5 camionetas. Usamos 2 autos.')
    assert.equal(result.impactoEstimado, 20)
    assert.deepEqual(result.actividadesDetectadas.map(({ cantidad }) => cantidad), [null, 2])
  })

  it('conserva otras categorías cuando un total con desglose resulta ambiguo', async () => {
    const result = await analyzeActivity('Consumimos 200 kWh en total: 150 kWh y 50 kWh. Usamos 2 camionetas.')
    assert.equal(result.impactoEstimado, 20)
    assert.ok(result.actividadesDetectadas.some(({ cantidad }) => cantidad === null))
    assert.equal(result.actividadesDetectadas.at(-1).cantidad, 2)
  })

  it('no rechaza un único total ni duplica las menciones de electricidad', async () => {
    const result = await analyzeActivity('Consumimos en total 200 kWh de electricidad.')
    assert.equal(result.impactoEstimado, 40)
    assert.equal(result.actividadesDetectadas.length, 1)
    assert.equal(result.actividadesDetectadas[0].advertencia, undefined)
  })

  it('no traslada un desglose ambiguo a cantidades independientes de otra categoría', async () => {
    const result = await analyzeActivity('Consumimos 200 kWh en total: 150 kWh y 50 kWh. Usamos 2 camionetas y 3 autos.')
    assert.equal(result.impactoEstimado, 50)
    const transport = result.actividadesDetectadas.filter(({ categoria }) => categoria === 'transporte')
    assert.deepEqual(transport.map(({ cantidad }) => cantidad), [2, 3])
    assert.ok(transport.every(({ advertencia }) => advertencia === undefined))
  })
})
