import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import structure from '../data/structure.json'
import './ReportIndex.css'

const partColors = {
  'part-1': '#2A5FA8',
  'part-2': '#B83232',
  'part-3': '#C9902A',
  'part-4': '#5C8A3E',
  'part-5': '#7A4CA0',
}

export default function ReportIndex() {
  const { lang, t } = useLang()
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    cardRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="report-index">
      <div className="report-index-header">
        <h1>{t('प्रतिवेदन विषयसूची', 'Report Contents')}</h1>
        <p>{t(
          'कार्की आयोग प्रतिवेदन — ९०७ पृष्ठ, ५ भाग, १४+ परिच्छेद',
          'Karki Commission Report — 907 pages, 5 parts, 14+ chapters'
        )}</p>
      </div>

      <div className="parts-list">
        {structure.parts.map((part, pi) => (
          <div key={part.id} className="part-section">
            <div
              className="part-header"
              style={{ '--part-color': partColors[part.id] || 'var(--accent-gold)' }}
            >
              <div className="part-accent" />
              <h2 className="part-title">{lang === 'ne' ? part.title_ne : part.title_en}</h2>
              <span className="part-pages">
                {t('पृष्ठ', 'p.')} {part.start_page}+
              </span>
            </div>

            <div className="chapters-grid">
              {part.chapters.map((ch, ci) => {
                const refIndex = pi * 10 + ci
                return (
                  <Link
                    key={ch.id}
                    to={`/report/${ch.id}`}
                    className="chapter-card fade-in"
                    ref={el => cardRefs.current[refIndex] = el}
                    style={{ '--delay': `${(ci % 3) * 0.1}s` }}
                  >
                    <div className="chapter-card-top">
                      <span className="ch-badge" style={{ background: partColors[part.id] || 'var(--accent-gold)' }}>
                        {t('परिच्छेद', 'Ch.')} {ch.number}
                      </span>
                      <span className="ch-page-badge">p. {ch.start_page}</span>
                    </div>
                    <h3 className="ch-title">{lang === 'ne' ? ch.title_ne : ch.title_en}</h3>
                    {ch.sections && ch.sections.length > 0 && (
                      <div className="ch-sections-preview">
                        {ch.sections.slice(0, 3).map(sec => (
                          <span key={sec.id} className="ch-section-dot">
                            {lang === 'ne' ? sec.title_ne : sec.title_en}
                          </span>
                        ))}
                        {ch.sections.length > 3 && (
                          <span className="ch-section-more">+{ch.sections.length - 3} {t('खण्ड', 'more')}</span>
                        )}
                      </div>
                    )}
                    <div className="ch-arrow">→</div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
