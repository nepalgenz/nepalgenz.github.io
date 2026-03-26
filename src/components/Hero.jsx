import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import './Hero.css'

function CountUp({ target, duration = 2000, suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>
}

export default function Hero() {
  const { lang, t } = useLang()

  const stats = [
    {
      value: 76,
      label: t('कुल मृत्यु', 'Total Deaths'),
      sub: t('४२ सुरक्षाकर्मीको गोलीबाट', '42 by security forces'),
      danger: true,
    },
    {
      value: 2522,
      label: t('घाइते', 'Injured'),
      sub: t('सुरक्षाकर्मी सहित', 'Including security personnel'),
      danger: false,
    },
    {
      value: 85,
      suffix: t(' करोड', ' Cr NPR'),
      label: t('भौतिक क्षति', 'Property Damage'),
      sub: t('अनुमानित', 'Estimated'),
      danger: false,
    },
    {
      value: 907,
      label: t('पृष्ठहरू', 'Report Pages'),
      sub: t('सम्पूर्ण प्रतिवेदन', 'Full commission report'),
      danger: false,
    },
  ]

  return (
    <section className="hero">
      <div className="hero-bg-image" />
      <div className="hero-bg-overlay" />

      <div className="hero-inner container">
        <div className="hero-eyebrow">
          <span className="hero-pill">
            {t('नेपाल सरकार', 'Government of Nepal')}
          </span>
          <span className="hero-pill hero-pill-muted">
            {t('जाँचबुझ आयोग', 'Inquiry Commission')}
          </span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-ne">नेपाल जेनजेड आन्दोलन प्रतिवेदन २०८२</span>
          <span className="hero-title-en">Nepal GenZ Protest Report 2082</span>
        </h1>

        <p className="hero-subtitle">
          {t(
            '२०८२ भाद्र २३ र २४ गते भएका जेनजेड आन्दोलनसँग सम्बन्धित घटनाहरूको यथार्थ जाँचबुझ गरी पेश गरिएको प्रतिवेदन।',
            'Official inquiry commission report documenting events of the GenZ protests of Bhadra 23–24, 2082 BS — casualties, property damage, and recommendations for reform.'
          )}
        </p>

        <div className="hero-meta">
          <span>📅 {t('२०८२ भाद्र', 'Bhadra 2082 BS')}</span>
          <span>📍 {t('नेपालभर — ७ प्रदेश', 'Nationwide — 7 Provinces')}</span>
          <span>🏛️ {t('जाँचबुझ आयोग, नेपाल सरकार', 'Inquiry Commission, Government of Nepal')}</span>
        </div>

        <div className="hero-stats">
          {stats.map((stat, i) => (
            <div key={i} className={`hero-stat-card ${stat.danger ? 'danger' : ''}`} style={{ '--delay': `${i * 0.1}s` }}>
              <div className={`stat-number ${stat.danger ? 'text-red' : 'text-gold'}`}>
                <CountUp target={stat.value} duration={2000 + i * 200} suffix={stat.suffix || ''} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sub">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="hero-actions">
          <Link to="/report" className="btn-primary">
            {t('प्रतिवेदन पढ्नुहोस्', 'Read the Report')} →
          </Link>
          <Link to="/statistics" className="btn-ghost">
            {t('तथ्याङ्क हेर्नुहोस्', 'View Statistics')}
          </Link>
          <Link to="/pdf" className="btn-ghost">
            {t('मूल PDF', 'Original PDF')}
          </Link>
        </div>

        {lang === 'en' && (
          <div className="hero-disclaimer">
            <span className="translation-badge">
              🔄 English text is machine-translated from the original Nepali. Refer to Original PDF for accuracy.
            </span>
          </div>
        )}
      </div>

      <div className="hero-photo-credit">
        Photo:{' '}
        <a href="https://commons.wikimedia.org/wiki/File:2025_Nepalese_Gen_Z_movement_protesters_in_Chitwan_District_02.jpg" target="_blank" rel="noopener noreferrer">
          Wikimedia Commons
        </a>{' '}
        · CC BY-SA 4.0
      </div>
    </section>
  )
}
