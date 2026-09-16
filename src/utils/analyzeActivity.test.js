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
})
