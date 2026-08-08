import { skillGroups } from '../data/resumeData'

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <h2 className="section-title">
        <span className="section-title">Skills</span>
      </h2>
      <div className="skills__grid">
        {skillGroups.map((group) => (
          <div className="skills__group" key={group.label}>
            <h3 className="skills__label">{group.label}</h3>
            <ul className="skills__items">
              {group.items.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
