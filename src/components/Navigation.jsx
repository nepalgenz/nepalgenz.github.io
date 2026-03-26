import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import structure from '../data/structure.json'
import './Navigation.css'

export default function Navigation({ isOpen, onClose }) {
  const { lang, t } = useLang()
  const { chapterId } = useParams()
  const [expandedParts, setExpandedParts] = useState({ 'part-1': true })

  function togglePart(partId) {
    setExpandedParts(prev => ({ ...prev, [partId]: !prev[partId] }))
  }

  return (
    <>
      {isOpen && <div className="nav-overlay" onClick={onClose} />}
      <aside className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <span className="nav-title">{t('विषयसूची', 'Contents')}</span>
          <button className="nav-close" onClick={onClose} aria-label="Close navigation">✕</button>
        </div>

        <div className="nav-body">
          {structure.parts.map(part => (
            <div key={part.id} className="nav-part">
              <button
                className={`nav-part-header ${expandedParts[part.id] ? 'expanded' : ''}`}
                onClick={() => togglePart(part.id)}
              >
                <span className="nav-part-title">
                  {lang === 'ne' ? part.title_ne : part.title_en}
                </span>
                <span className="nav-chevron">{expandedParts[part.id] ? '▾' : '▸'}</span>
              </button>

              {expandedParts[part.id] && (
                <div className="nav-chapters">
                  {part.chapters.map(ch => (
                    <div key={ch.id} className="nav-chapter">
                      <Link
                        to={`/report/${ch.id}`}
                        className={`nav-chapter-link ${chapterId === ch.id ? 'active' : ''}`}
                        onClick={onClose}
                      >
                        <span className="nav-ch-num">Ch. {ch.number}</span>
                        <span className="nav-ch-title">
                          {lang === 'ne' ? ch.title_ne : ch.title_en}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nav-footer">
          <div className="nav-stat">
            <span className="nav-stat-num text-red">76</span>
            <span>{t('मृत्यु', 'Deaths')}</span>
          </div>
          <div className="nav-stat">
            <span className="nav-stat-num">2,522</span>
            <span>{t('घाइते', 'Injured')}</span>
          </div>
          <div className="nav-stat">
            <span className="nav-stat-num">907</span>
            <span>{t('पृष्ठ', 'Pages')}</span>
          </div>
        </div>
      </aside>
    </>
  )
}
