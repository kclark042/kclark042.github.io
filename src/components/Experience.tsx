import { roles } from '../data/resumeData'

export default function Experience() {
  return (
    <section className="experience" id="work">
      <h2 className="section-title">Work history</h2>
      <ol className="timeline">
        {roles.map((role) => (
          <li className="timeline__item" key={`${role.org}-${role.start}`}>
            <div className="timeline__marker" aria-hidden="true" />
            <div className="timeline__card">
              <div className="timeline__head">
                <h3 className="timeline__title">
                  {role.title} - <a className='timeline__org' href={role.link} aria-label={`link to ${role.org} home page`}>{role.org}</a>
                </h3>
                <p className="timeline__meta">
                  {role.start} – {role.end} · {role.location}
                </p>
              </div>
              <ul className="timeline__bullets">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {role.projects && role.projects.length > 0 && (
                <ul className="timeline__projects">
                  {role.projects.map((project) => (
                    <li key={project.url}>
                      <a
                        className={`project-link project-link--${project.type}`}
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="project-link__icon" aria-hidden="true">
                          {project.type === 'video' ? (
                            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                              <path d="M4 2.5v11l10-5.5-10-5.5z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 16 16"
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                            >
                              <circle cx="8" cy="8" r="6.2" />
                              <path d="M2 8h12M8 1.8c1.8 1.7 2.8 4 2.8 6.2s-1 4.5-2.8 6.2c-1.8-1.7-2.8-4-2.8-6.2s1-4.5 2.8-6.2z" />
                            </svg>
                          )}
                        </span>
                        {project.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <ul className="timeline__tags">
                {role.tags.map((tag) => (
                  <li className="chip chip--small" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
