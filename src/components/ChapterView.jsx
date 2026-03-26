import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import structure from '../data/structure.json'
import './ChapterView.css'

// Flatten all chapters for prev/next navigation
const allChapters = structure.parts.flatMap(p => p.chapters)

function findChapterById(id) {
  return allChapters.find(c => c.id === id)
}

function PageText({ page, lang }) {
  if (!page) return null
  return (
    <div className={`page-block ${lang === 'ne' ? 'font-ne' : 'font-en'}`}>
      <span className="page-num">p. {page.page}</span>
      <p>{page.text || <em className="text-muted">[Empty page]</em>}</p>
    </div>
  )
}

export default function ChapterView() {
  const { chapterId } = useParams()
  const { lang, t } = useLang()
  const [pagesNe, setPagesNe] = useState(null)
  const [pagesEn, setPagesEn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  const chapter = findChapterById(chapterId)
  const chapterIndex = allChapters.indexOf(chapter)
  const prevChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex < allChapters.length - 1 ? allChapters[chapterIndex + 1] : null

  useEffect(() => {
    setLoading(true)
    setError(null)

    const loadData = async () => {
      try {
        if (!pagesNe) {
          const res = await fetch(`${import.meta.env.BASE_URL}data/pages_ne.json`)
          if (!res.ok) throw new Error('Could not load Nepali text data')
          const data = await res.json()
          setPagesNe(data)
        }
      } catch (e) {
        setError(e.message)
      }

      if (lang === 'en') {
        try {
          if (!pagesEn) {
            const res = await fetch(`${import.meta.env.BASE_URL}data/pages_en.json`)
            if (res.ok) {
              const data = await res.json()
              setPagesEn(data)
            }
          }
        } catch {
          // English translation may not exist yet — fall back to Nepali
        }
      }

      setLoading(false)
    }

    loadData()
  }, [lang]) // eslint-disable-line

  if (!chapter) {
    return (
      <div className="chapter-view">
        <div className="container chapter-inner">
          <div className="chapter-not-found">
            <h2>{t('अध्याय फेला परेन', 'Chapter Not Found')}</h2>
            <Link to="/report">{t('प्रतिवेदनमा फर्कनुहोस्', 'Back to Report')}</Link>
          </div>
        </div>
      </div>
    )
  }

  // Get pages for this chapter
  const pages = lang === 'en' && pagesEn ? pagesEn : pagesNe
  const chapterPages = pages
    ? pages.filter(p => {
        const start = chapter.start_page
        const nextCh = allChapters[chapterIndex + 1]
        const end = nextCh ? nextCh.start_page - 1 : 9999
        return p.page >= start && p.page <= end
      })
    : []

  const filteredPages = search.trim()
    ? chapterPages.filter(p => p.text?.toLowerCase().includes(search.toLowerCase()))
    : chapterPages

  return (
    <div className="chapter-view">
      {/* Chapter Header */}
      <div className="chapter-header">
        <div className="chapter-breadcrumb">
          <Link to="/report">{t('प्रतिवेदन', 'Report')}</Link>
          <span>›</span>
          <span>{lang === 'ne' ? chapter.title_ne : chapter.title_en}</span>
        </div>
        <h1 className="chapter-title">{lang === 'ne' ? chapter.title_ne : chapter.title_en}</h1>
        <div className="chapter-meta">
          <span>📄 {t('पृष्ठ', 'Pages')} {chapter.start_page}+</span>
          <span>{chapterPages.length} {t('पृष्ठ', 'pages')}</span>
          {lang === 'en' && !pagesEn && (
            <span className="translation-badge">
              ⏳ {t('', 'Translation pending — showing Nepali original')}
            </span>
          )}
          {lang === 'en' && pagesEn && (
            <span className="translation-badge">
              🔄 {t('', 'Machine translated')}
            </span>
          )}
        </div>
      </div>

      {/* Sections nav */}
      {chapter.sections && chapter.sections.length > 0 && (
        <div className="section-nav">
          <span className="section-nav-label">{t('खण्डहरू:', 'Sections:')}</span>
          {chapter.sections.map(sec => (
            <a key={sec.id} href={`#sec-${sec.id}`} className="section-chip">
              {lang === 'ne' ? sec.title_ne : sec.title_en}
            </a>
          ))}
        </div>
      )}

      {/* Search within chapter */}
      <div className="chapter-search">
        <input
          type="search"
          placeholder={t('यस अध्यायमा खोज्नुहोस्...', 'Search within this chapter...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <span className="search-result-count">
            {filteredPages.length} {t('पृष्ठ', 'pages')} {t('भेटियो', 'found')}
          </span>
        )}
      </div>

      {/* Page Content */}
      <div className="pages-container">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>{t('लोड हुँदैछ...', 'Loading...')}</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filteredPages.map((page) => (
          <PageText key={page.page} page={page} lang={lang === 'en' && pagesEn ? 'en' : 'ne'} />
        ))}

        {!loading && !error && filteredPages.length === 0 && search && (
          <div className="empty-state">
            <p>{t('कुनै नतिजा भेटिएन।', 'No results found.')}</p>
          </div>
        )}
      </div>

      {/* Chapter Navigation */}
      <div className="chapter-nav">
        {prevChapter ? (
          <Link to={`/report/${prevChapter.id}`} className="chapter-nav-btn prev">
            <span className="nav-arrow">←</span>
            <div>
              <span className="nav-label">{t('अघिल्लो', 'Previous')}</span>
              <span className="nav-title">{lang === 'ne' ? prevChapter.title_ne : prevChapter.title_en}</span>
            </div>
          </Link>
        ) : <div />}

        {nextChapter ? (
          <Link to={`/report/${nextChapter.id}`} className="chapter-nav-btn next">
            <div>
              <span className="nav-label">{t('अर्को', 'Next')}</span>
              <span className="nav-title">{lang === 'ne' ? nextChapter.title_ne : nextChapter.title_en}</span>
            </div>
            <span className="nav-arrow">→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
