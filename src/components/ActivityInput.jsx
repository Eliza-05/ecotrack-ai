import { useRef } from 'react'
import Icon from './Icon'
import { hasEnoughText, MIN_DESCRIPTION_LENGTH } from '../utils/analyzeActivity'

const example = 'Hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad.'
const maxLength = 2000

export default function ActivityInput({ description, onDescriptionChange, onAnalyze, isLoading, error }) {
  const inputRef = useRef(null)
  const canAnalyze = hasEnoughText(description)
  let availability = 'Simulación local disponible. El análisis con IA estará disponible próximamente.'
  if (!canAnalyze) availability = `Describe una actividad con al menos ${MIN_DESCRIPTION_LENGTH} caracteres e incluye cantidades y unidades.`
  if (isLoading) availability = 'Procesando tu descripción con reglas locales de demostración…'
  if (error) availability = error

  function useExample() {
    onDescriptionChange(example)
    inputRef.current?.focus()
  }

  return (
    <section className="card activity-card" aria-labelledby="activity-title">
      <div className="section-heading">
        <span className="icon-tile"><Icon name="edit" /></span>
        <div><span className="section-kicker">EL PRIMER PASO</span><h2 id="activity-title">Cuéntanos sobre tu día</h2></div>
      </div>
      <p className="card-description">Describe las actividades de tu negocio con tus propias palabras.</p>
      <div className="input-heading">
        <label htmlFor="activities">¿Qué hizo tu negocio hoy?</label>
        <span>En lenguaje natural</span>
      </div>
      <div className="textarea-wrap">
        <textarea
          ref={inputRef}
          id="activities"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          disabled={isLoading}
          maxLength={maxLength}
          placeholder="Por ejemplo: hoy usamos 5 camionetas de reparto y consumimos 200 kWh de electricidad…"
          aria-describedby="activity-help character-count analysis-availability"
        />
        <div className="textarea-footer">
          <span><Icon name="edit" size={14} /> Cada detalle cuenta</span>
          <span id="character-count">{description.length} / {maxLength}</span>
        </div>
      </div>
      <p id="activity-help" className="field-hint">Incluye cantidades y unidades si las conoces.</p>
      <div className="example-row">
        <span>¿Necesitas una idea?</span>
        <button className="text-button" type="button" onClick={useExample} disabled={isLoading}>Usar un ejemplo <Icon name="arrow" size={15} /></button>
      </div>
      <div className="category-section">
        <p>Puedes incluir actividades como</p>
        <ul className="category-list" aria-label="Categorías de actividades">
          <li><Icon name="energy" size={16} /> Energía</li>
          <li><Icon name="transport" size={16} /> Transporte</li>
          <li><Icon name="waste" size={16} /> Residuos</li>
        </ul>
      </div>
      <button className="analyze-button" type="button" onClick={onAnalyze} disabled={!canAnalyze || isLoading} aria-describedby="analysis-availability" aria-busy={isLoading}>
        <Icon name="sparkles" size={19} /> {isLoading ? 'Estimando tu impacto…' : 'Estimar mi impacto'} <Icon name="arrow" size={18} />
      </button>
      <p className="availability-note" id="analysis-availability" role="status"><Icon name="info" size={14} /> {availability}</p>
    </section>
  )
}
