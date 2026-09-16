import Header from './components/Header'
import { useRef, useState } from 'react'
import ActivityInput from './components/ActivityInput'
import ImpactPreview from './components/ImpactPreview'
import HowItWorks from './components/HowItWorks'
import Icon from './components/Icon'
import { analyzeActivity, hasEnoughText } from './utils/analyzeActivity'
import './App.css'

function App() {
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const processing = useRef(false)

  function handleDescriptionChange(value) {
    if (processing.current) return
    setDescription(value)
    setResult(null)
    setError('')
    setStatus('idle')
  }

  async function handleAnalyze() {
    if (processing.current || !hasEnoughText(description)) return
    processing.current = true
    setStatus('loading')
    setResult(null)
    setError('')
    try {
      const analysis = await analyzeActivity(description)
      setResult(analysis)
      setStatus(analysis.impactoEstimado === null ? 'insufficient' : 'success')
    } catch {
      setError('No pudimos completar la estimación. Inténtalo de nuevo.')
      setStatus('error')
    } finally {
      processing.current = false
    }
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido" className="page-shell">
        <section className="intro" aria-labelledby="page-title">
          <span className="eyebrow"><span className="status-dot" /> GRANDES CAMBIOS, PEQUEÑOS NEGOCIOS</span>
          <h1 id="page-title">Tu día a día, con una<br /><span>huella más consciente.</span></h1>
          <p>Entender el impacto de tu negocio empieza con algo simple:<br className="desktop-break" /> contarnos qué hiciste hoy. Sin formularios complicados.</p>
        </section>
        <div className="workspace">
          <ActivityInput
            description={description}
            onDescriptionChange={handleDescriptionChange}
            onAnalyze={handleAnalyze}
            isLoading={status === 'loading'}
            error={error}
          />
          <ImpactPreview result={result} status={status} />
        </div>
        <HowItWorks />
        <aside className="purpose-note">
          <Icon name="leaf" size={19} />
          <p>No necesitas ser experto para dar el primer paso hacia un negocio más sostenible.</p>
        </aside>
      </main>
      <footer className="site-footer page-shell">
        <span>EcoTrack AI <span className="footer-divider">/</span> Pequeños pasos. Menos huella.</span>
        <span>Hecho para un futuro más verde <Icon name="leaf" size={14} /></span>
      </footer>
    </>
  )
}

export default App
