import Icon from './Icon'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <a className="brand" href="#" aria-label="EcoTrack AI, inicio">
          <span className="brand-mark"><Icon name="leaf" size={25} /></span>
          <span>EcoTrack<span className="brand-ai">AI</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona <Icon name="arrow" size={16} /></a>
          <span className="prototype-badge">Prototipo visual</span>
        </nav>
      </div>
    </header>
  )
}
