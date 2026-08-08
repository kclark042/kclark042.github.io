import { contact } from '../data/resumeData'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <h2 className="section-title">Get in touch</h2>
      <div className="footer__grid">
        <a className="footer__link" href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="footer__link" href={contact.github} target="_blank" rel="noreferrer">
          Github
        </a>
      </div>

    </footer>
  )
}
