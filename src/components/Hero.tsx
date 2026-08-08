import EmbeddingCanvas from './EmbeddingCanvas'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__canvas">
        <EmbeddingCanvas />
      </div>
      <div className="hero__content">
        <p className="eyebrow">Software Engineer · Salt Lake City, UT</p>
        <h1 className="hero__name">Kristin Clark</h1>
        <p className="hero__line">
          I map complicated systems — embedding spaces, satellite telemetry, AI feedback loops —
          into interfaces people can actually read.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#work">
            See the work
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}
