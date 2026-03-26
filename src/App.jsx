import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Statistics from './components/Statistics'
import Timeline from './components/Timeline'
import ReportIndex from './components/ReportIndex'
import ChapterView from './components/ChapterView'
import PDFViewer from './components/PDFViewer'
import './App.css'

function HomePage() {
  return (
    <main>
      <Hero />
      <div className="home-sections">
        <Statistics />
        <Timeline />
      </div>
    </main>
  )
}

function ReportLayout({ navOpen, onNavClose }) {
  return (
    <div className="report-layout">
      <Navigation isOpen={navOpen} onClose={onNavClose} />
      <Routes>
        <Route path="/" element={<ReportIndex />} />
        <Route path="/:chapterId" element={<ChapterView />} />
      </Routes>
    </div>
  )
}

function AppContent() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="app">
      <Header onMenuToggle={() => setNavOpen(o => !o)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report/*" element={<ReportLayout navOpen={navOpen} onNavClose={() => setNavOpen(false)} />} />
        <Route path="/statistics" element={<main><div className="container" style={{ paddingTop: 'var(--space-xl)' }}><Statistics /></div></main>} />
        <Route path="/timeline" element={<main><Timeline /></main>} />
        <Route path="/pdf" element={<main><PDFViewer /></main>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LanguageProvider>
  )
}
