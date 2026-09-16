import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { analyzeActivity } from '../utils/analyzeActivity.js'

describe('presentación de advertencias en el panel de impacto', { concurrency: true }, () => {
  let server
  let ImpactPreview

  before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
    ;({ default: ImpactPreview } = await server.ssrLoadModule('/src/components/ImpactPreview.jsx'))
  })

  after(async () => { await server?.close() })

  function render(result, status = result?.impactoEstimado != null ? 'success' : 'insufficient') {
    return renderToStaticMarkup(createElement(ImpactPreview, { result, status }))
  }

  const rejectedCases = [
    ['negación', 'No usamos 5 camionetas.', 'transporte'],
    ['ahorro', 'Ahorramos 200 kWh.', 'energía'],
    ['cantidad ambigua', 'Usamos 1/2 camionetas.', 'transporte'],
    ['doble conteo', 'Consumimos 200 kWh en total: 150 kWh de equipos y 50 kWh de luces.', 'energía'],
  ]
  for (const [name, text, category] of rejectedCases) {
    it(`explica ${name} con la categoría y sin inventar una estimación`, async () => {
      const result = await analyzeActivity(text)
      const original = structuredClone(result)
      const html = render(result)
      const message = result.actividadesDetectadas[0].advertencia.mensaje

      assert.equal(html.split(message).length - 1, 1, 'El aviso debe aparecer una sola vez en todo el panel')
      assert.ok(html.includes(`<strong>${category}: </strong>${message}`))
      assert.match(html, /Requiere aclaración/)
      assert.match(html, /class="metric-dash">—</)
      assert.doesNotMatch(html, /cantidad pendiente|No encontramos cantidades suficientes/)
      assert.deepEqual(result, original, 'La presentación no debe alterar el resultado del analizador')
    })
  }

  it('conserva el subtotal seguro, el aviso y las recomendaciones en resultados parciales', async () => {
    const result = await analyzeActivity('Consumimos 100 kWh y -20 kWh.')
    const html = render(result)
    assert.match(html, /class="metric-dash">20</)
    assert.match(html, /Consumo eléctrico: 100 kWh/)
    assert.match(html, /Estimación parcial/)
    assert.match(html, /Las actividades por aclarar quedan excluidas/)
    assert.ok(html.includes(result.actividadesDetectadas[1].advertencia.mensaje))
    assert.ok(html.includes(result.recomendaciones[0]))
    assert.doesNotMatch(html, /cantidad pendiente/)
  })

  it('mantiene avisos de distintas categorías aunque tengan el mismo mensaje', async () => {
    const result = await analyzeActivity('Consumimos -100 kWh y usamos -2 camionetas.')
    const html = render(result)
    const message = result.actividadesDetectadas[0].advertencia.mensaje
    assert.equal(html.split(message).length - 1, 2)
    assert.ok(html.includes(`<strong>energía: </strong>${message}`))
    assert.ok(html.includes(`<strong>transporte: </strong>${message}`))
  })

  it('mantiene advertencias distintas dentro de la misma categoría', async () => {
    const result = await analyzeActivity('Consumimos -100 kWh. Electricidad adicional sin medir.')
    const html = render(result)
    assert.equal(result.actividadesDetectadas.length, 2)
    for (const activity of result.actividadesDetectadas) {
      assert.equal(html.split(activity.advertencia.mensaje).length - 1, 1)
    }
  })

  it('conserva cantidades independientes válidas sin agruparlas como advertencias', async () => {
    const result = await analyzeActivity('Consumimos 10 kWh por la mañana y 20 kWh por la tarde.')
    const html = render(result)
    assert.match(html, /Consumo eléctrico: 10 kWh/)
    assert.match(html, /Consumo eléctrico: 20 kWh/)
    assert.match(html, /class="metric-dash">6</)
    assert.doesNotMatch(html, /Requiere aclaración|Estimación parcial/)
  })

  it('mantiene el cero explícito como resultado válido', async () => {
    const result = await analyzeActivity('Consumimos 0 kWh.')
    assert.match(render(result), /class="metric-dash">0</)
    assert.doesNotMatch(render(result), /Requiere aclaración/)
  })

  it('conserva los estados inicial, de carga y sin información reconocida', async () => {
    assert.match(render(null, 'idle'), /Aquí comienza una huella más ligera/)
    assert.match(render(null, 'loading'), /Procesando…/)
    const html = render(await analyzeActivity('Hoy tuvimos una reunión.'))
    assert.match(html, /Faltan detalles/)
    assert.match(html, /Agrega cantidades y unidades/)
    assert.match(html, /class="metric-dash">—</)
  })
})
