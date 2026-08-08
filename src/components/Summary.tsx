import { summary } from '../data/resumeData'

export default function Summary() {
  return (
    <section className="summary" aria-label="Professional summary">
      <p className="summary__text">{summary}</p>
    </section>
  )
}
