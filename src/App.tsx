import Nav from './components/Nav'
import Hero from './components/Hero'
import Summary from './components/Summary'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Education from './components/Education'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <main>
        <Summary />
        <Experience />
        <Skills />
        <Education />
      </main>
      <Footer />
    </div>
  )
}
