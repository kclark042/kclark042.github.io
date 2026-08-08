const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <a className="nav__mark" href="#top">
        KC
      </a>
      <ul className="nav__links">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
