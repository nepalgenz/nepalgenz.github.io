import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import './Header.css'

export default function Header({ onMenuToggle }) {
  const { lang, setLang, t } = useLang()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: '/', label: t('मुख्य पृष्ठ', 'Home') },
    { to: '/report', label: t('प्रतिवेदन', 'Report') },
    { to: '/statistics', label: t('तथ्याङ्क', 'Statistics') },
    { to: '/timeline', label: t('समयरेखा', 'Timeline') },
    { to: '/pdf', label: t('मूल PDF', 'Original PDF') },
  ]

  function handleHamburger() {
    setMobileOpen(o => !o)
    onMenuToggle()
  }

  function handleMobileLinkClick() {
    setMobileOpen(false)
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <button
            className={`menu-toggle ${mobileOpen ? 'open' : ''}`}
            onClick={handleHamburger}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="brand-link" onClick={handleMobileLinkClick}>
            <div className="brand-emblem">ने</div>
            <div className="brand-text">
              <span className="brand-title-ne">नेपाल जेन ज़ी आन्दोलन प्रतिवेदन २०८२</span>
              <span className="brand-title-en">Nepal GenZ Protest Report 2082</span>
            </div>
          </Link>
        </div>

        <nav className="header-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className={`lang-toggle ${lang === 'ne' ? 'active-ne' : 'active-en'}`}
            onClick={() => setLang(lang === 'ne' ? 'en' : 'ne')}
            title={lang === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}
          >
            <span className={`lang-opt ${lang === 'ne' ? 'active' : ''}`}>ने</span>
            <span className="lang-sep">|</span>
            <span className={`lang-opt ${lang === 'en' ? 'active' : ''}`}>EN</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={handleMobileLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
