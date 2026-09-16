import Icon from './Icon'

const formatNumber = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
const categoryIcons = { energía: 'energy', transporte: 'transport', residuos: 'waste' }

export default function ImpactPreview({ result, status }) {
  const isLoading = status === 'loading'
  const hasEstimate = result?.impactoEstimado != null
  const isPartial = hasEstimate && result.actividadesDetectadas.some((activity) => activity.cantidad === null)
  let badge = 'Sin estimación'
  if (isLoading) badge = 'Procesando…'
  else if (result) badge = hasEstimate ? 'Estimación demo' : 'Faltan detalles'

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
        <h3>{result ? (hasEstimate ? 'Tu estimación simplificada' : 'Cuéntanos un poco más') : 'Aquí comienza una huella más ligera'}</h3>
        {!result && <p>{isLoading ? 'Identificando actividades, cantidades y categorías…' : <>Este espacio reunirá las actividades identificadas<br className="desktop-break" /> y una estimación de su impacto ambiental.</>}</p>}
        {result && !hasEstimate && <p>No encontramos cantidades suficientes para estimar tu impacto. Agrega cantidades y unidades, por ejemplo: 200 kWh o 10 kg de residuos.</p>}
        {result && result.categorias.length > 0 && (
          <ul className="category-list" aria-label="Categorías detectadas">
            {result.categorias.map((category) => <li key={category}><Icon name={categoryIcons[category]} size={16} /> {category}</li>)}
          </ul>
        )}
        {result?.actividadesDetectadas.map((activity, index) => (
          <p key={`${activity.categoria}-${index}`}>
            {activity.descripcion}: {activity.cantidad === null ? 'cantidad pendiente' : `${formatNumber.format(activity.cantidad)} ${activity.unidad}`}
          </p>
        ))}
        <div className="metric-placeholder">
          <span className="metric-dash">{hasEstimate ? formatNumber.format(result.impactoEstimado) : '—'}</span><span>{result?.unidadImpacto ?? 'kg de CO₂e'}</span>
          <small>{hasEstimate ? 'Huella de carbono estimada · Demostración' : 'Huella de carbono estimada'}</small>
        </div>
        {isPartial && <p>Estimación parcial: solo incluye las actividades con cantidades reconocidas.</p>}
      </div>
      <div className="recommendation-preview">
        <span className="recommendation-icon"><Icon name="bulb" size={21} /></span>
        <div><h3>Ideas para reducir tu huella</h3><p>{result ? result.recomendaciones.join(' ') : 'Las recomendaciones aparecerán aquí cuando esté disponible el análisis.'}</p></div>
      </div>
      <p className="estimate-note"><Icon name="info" size={15} /><span>Una orientación para empezar. Las estimaciones no sustituyen una medición ambiental certificada.{result && ' Simulación con factores ficticios: 0,2 kg CO₂e/kWh, 10 kg CO₂e por vehículo por día y 0,5 kg CO₂e/kg de residuos. No representa una medición real.'}</span></p>
    </section>
  )
}
