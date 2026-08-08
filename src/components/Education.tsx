import { education } from '../data/resumeData'

export default function Education() {
  return (
    <section className="education" id="education">
      <h2 className="section-title">Education</h2>
      <div className="education__card">
        <h3>{education.degree}</h3>
        <p>
          {education.school}, {education.location}
        </p>
        <p className="education__date">{education.date}</p>
      </div>
    </section>
  )
}
