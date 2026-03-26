import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useLang } from '../context/LanguageContext'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

// Use local worker via vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function PDFViewer() {
  const { t } = useLang()
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [inputPage, setInputPage] = useState('1')
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const pdfUrl = `${import.meta.env.BASE_URL}report.pdf`

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
  }, [])

  const onDocumentLoadError = useCallback((err) => {
    setError(err.message)
    setLoading(false)
  }, [])

  function goToPage(n) {
    const page = Math.max(1, Math.min(n, numPages || 1))
    setPageNumber(page)
    setInputPage(String(page))
  }

  function handlePageInput(e) {
    setInputPage(e.target.value)
  }

  function handlePageSubmit(e) {
    e.preventDefault()
    const n = parseInt(inputPage)
    if (!isNaN(n)) goToPage(n)
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h1>{t('मूल PDF प्रतिवेदन', 'Original PDF Report')}</h1>
        <p className="pdf-subtitle">
          {t(
            'यो मूल नेपाली भाषाको अधिकारिक प्रतिवेदन हो। सम्पूर्ण ९०७ पृष्ठ यहाँ उपलब्ध छन्।',
            'This is the official original Nepali language report. All 907 pages are available here.'
          )}
        </p>

        <div className="pdf-toolbar">
          <div className="pdf-page-controls">
            <button
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              className="pdf-btn"
              title={t('अघिल्लो पृष्ठ', 'Previous page')}
            >←</button>

            <form onSubmit={handlePageSubmit} className="page-input-form">
              <input
                type="number"
                value={inputPage}
                onChange={handlePageInput}
                min={1}
                max={numPages || 907}
                className="page-input"
              />
              <span className="page-total">/ {numPages || 907}</span>
            </form>

            <button
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= (numPages || 907)}
              className="pdf-btn"
              title={t('अर्को पृष्ठ', 'Next page')}
            >→</button>
          </div>

          <div className="pdf-zoom-controls">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="pdf-btn">−</button>
            <span className="zoom-label">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="pdf-btn">+</button>
            <button onClick={() => setScale(1.2)} className="pdf-btn-sm">{t('रिसेट', 'Reset')}</button>
          </div>

          <a
            href={pdfUrl}
            download="karki-aayog-pratibedan.pdf"
            className="pdf-download-btn"
            title={t('PDF डाउनलोड गर्नुहोस्', 'Download PDF')}
          >
            ⬇ {t('डाउनलोड', 'Download')}
          </a>
        </div>

        {/* Quick jump to sections */}
        <div className="pdf-jumps">
          <span className="pdf-jumps-label">{t('सिधा जानुहोस्:', 'Jump to:')}</span>
          {[
            { label: t('विषयसूची', 'TOC'), page: 4 },
            { label: t('परिचय', 'Intro'), page: 10 },
            { label: t('क्षतिको विवरण', 'Casualties'), page: 22 },
            { label: t('बयानहरू', 'Testimonies'), page: 28 },
            { label: t('विश्लेषण', 'Analysis'), page: 561 },
            { label: t('निष्कर्ष', 'Conclusion'), page: 635 },
            { label: t('सुझावहरू', 'Recommendations'), page: 700 },
          ].map(j => (
            <button key={j.page} onClick={() => goToPage(j.page)} className="jump-chip">
              {j.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pdf-document-wrapper">
        {loading && (
          <div className="pdf-loading">
            <div className="loading-spinner" />
            <p>{t('PDF लोड हुँदैछ...', 'Loading PDF...')}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
              {t('फाइल ठूलो छ, केही समय लाग्न सक्छ।', 'Large file, this may take a moment.')}
            </p>
          </div>
        )}

        {error && (
          <div className="pdf-error">
            <h3>{t('PDF लोड गर्न सकिएन', 'Could not load PDF')}</h3>
            <p>{error}</p>
            <p className="text-muted">
              {t(
                'PDF फाइल public/ फोल्डरमा report.pdf नामले राख्नुहोस्।',
                'Place the PDF file as report.pdf in the public/ folder.'
              )}
            </p>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="pdf-page"
            renderTextLayer={true}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  )
}
