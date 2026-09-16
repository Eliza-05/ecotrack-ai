import Icon from './Icon'

const formatNumber = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
const categoryIcons = { energía: 'energy', transporte: 'transport', residuos: 'waste' }

export default function ImpactPreview({ result, status }) {
  const activities = result?.actividadesDetectadas ?? []
  // One explanation per category and warning, even when several rejected
  // quantities belong to the same total/breakdown or ambiguous expression.
  const warnings = [...new Map(activities.filter((activity) => activity.advertencia).map((activity) => [
    JSON.stringify([activity.categoria, activity.advertencia.codigo, activity.advertencia.mensaje]),
    { categoria: activity.categoria, ...activity.advertencia },
  ])).entries()]
  const hasWarnings = warnings.length > 0
  const warningMessages = new Set(warnings.flatMap(([, warning]) => [
    warning.mensaje,
    `${warning.categoria}: ${warning.mensaje}`,
  ]))
  // The analyzer also includes these explanations in recommendations. Render
  // them beside the affected category once, while keeping the remaining tips.
  const recommendations = result?.recomendaciones.filter((message) => !warningMessages.has(message)) ?? []
  const isLoading = status === 'loading'
  const hasEstimate = result?.impactoEstimado != null
  const isPartial = hasEstimate && activities.some((activity) => activity.cantidad === null || activity.advertencia)
  let badge = 'Sin estimación'
  if (isLoading) badge = 'Procesando…'
  else if (isPartial) badge = 'Estimación parcial'
  else if (result) badge = hasEstimate ? 'Estimación demo' : (hasWarnings ? 'Requiere aclaración' : 'Faltan detalles')

  return (
    <section className="card impact-card" aria-labelledby="impact-title" aria-busy={isLoading} aria-live="polite">
      <div className="impact-header">
        <div className="section-heading">
          <span className="icon-tile neutral"><Icon name="chart" /></span>
          <h2 id="impact-title">Tu impacto, en perspectiva</h2>
        </div>
        <span className="pending-badge">{badge}</span>
      </div>
      <div className="empty-impact">
        <div className="impact-orbit" aria-hidden="true">
          <div className="orbit-core"><Icon name="leaf" size={39} /></div>
          <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" />
          <span className="orbit-spark"><Icon name="sparkles" size={19} /></span>
        </div>
        <h3>{result ? (hasEstimate ? 'Tu estimación simplificada' : (hasWarnings ? 'Aclaremos tus actividades' : 'Cuéntanos un poco más')) : 'Aquí comienza una huella más ligera'}</h3>
        {!result && <p>{isLoading ? 'Identificando actividades, cantidades y categorías…' : <>Este espacio reunirá las actividades identificadas<br className="desktop-break" /> y una estimación de su impacto ambiental.</>}</p>}
        {result && !hasEstimate && <p>{hasWarnings ? 'No calculamos un impacto para las actividades que necesitan aclaración. Revisa los mensajes de cada categoría.' : 'No encontramos cantidades suficientes para estimar tu impacto. Agrega cantidades y unidades, por ejemplo: 200 kWh o 10 kg de residuos.'}</p>}
        {result && result.categorias.length > 0 && (
          <ul className="category-list" aria-label="Categorías detectadas">
            {result.categorias.map((category) => <li key={category}><Icon name={categoryIcons[category]} size={16} /> {category}</li>)}
          </ul>
        )}
        {activities.filter((activity) => !activity.advertencia).map((activity, index) => (
          <p key={`${activity.categoria}-${index}`}>
            {activity.descripcion}: {activity.cantidad === null ? 'cantidad pendiente' : `${formatNumber.format(activity.cantidad)} ${activity.unidad}`}
          </p>
        ))}
        {warnings.map(([key, warning]) => (
          <p key={key}><strong>{warning.categoria}: </strong>{warning.mensaje}</p>
        ))}
        <div className="metric-placeholder">
          <span className="metric-dash">{hasEstimate ? formatNumber.format(result.impactoEstimado) : '—'}</span><span>{result?.unidadImpacto ?? 'kg de CO₂e'}</span>
          <small>{hasEstimate ? 'Huella de carbono estimada · Demostración' : 'Huella de carbono estimada'}</small>
        </div>
        {isPartial && <p>Estimación parcial: solo incluye las actividades con cantidades reconocidas. Las actividades por aclarar quedan excluidas.</p>}
      </div>
      <div className="recommendation-preview">
        <span className="recommendation-icon"><Icon name="bulb" size={21} /></span>
        <div><h3>Ideas para reducir tu huella</h3><p>{result ? (recommendations.join(' ') || 'Revisa las aclaraciones indicadas junto a cada categoría.') : 'Las recomendaciones aparecerán aquí cuando esté disponible el análisis.'}</p></div>
      </div>
      <p className="estimate-note"><Icon name="info" size={15} /><span>Una orientación para empezar. Las estimaciones no sustituyen una medición ambiental certificada.{result && ' Simulación con factores ficticios: 0,2 kg CO₂e/kWh, 10 kg CO₂e por vehículo por día y 0,5 kg CO₂e/kg de residuos. No representa una medición real.'}</span></p>
    </section>
  )
}
