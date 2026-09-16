import Icon from './Icon'

const steps = [
  { number: '01', icon: 'edit', title: 'Tú lo cuentas', description: 'Escribe lo que hizo tu negocio, como se lo contarías a alguien.' },
  { number: '02', icon: 'sparkles', title: 'La IA lo interpreta', description: 'Identificará las actividades, cantidades y categorías relevantes.' },
  { number: '03', icon: 'leaf', title: 'Entiendes tu impacto', description: 'Recibirás una estimación sencilla e ideas para mejorar.' },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="como-funciona" aria-labelledby="how-title">
      <div className="how-heading"><h2 id="how-title">De tus palabras a un cambio positivo</h2><span>Así funcionará EcoTrack AI</span></div>
      <ol className="steps">
        {steps.map((step) => (
          <li key={step.number}>
            <span className="step-icon"><Icon name={step.icon} size={21} /></span>
            <div><h3><span>{step.number}</span> {step.title}</h3><p>{step.description}</p></div>
          </li>
        ))}
      </ol>
    </section>
  )
}
