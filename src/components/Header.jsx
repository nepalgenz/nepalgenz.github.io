import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import './Header.css'

export default function Header({ onMenuToggle }) {
  const { lang, setLang, t } = useLang()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t('मुख्य पृष्ठ', 'Home') },
    { to: '/report', label: t('प्रतिवेदन', 'Report') },
    { to: '/statistics', label: t('तथ्याङ्क', 'Statistics') },
    { to: '/timeline', label: t('समयरेखा', 'Timeline') },
    { to: '/pdf', label: t('मूल PDF', 'Original PDF') },
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle navigation">
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="brand-link">
            <div className="brand-emblem">का</div>
            <div className="brand-text">
              <span className="brand-title-ne">कार्की आयोग</span>
              <span className="brand-title-en">Karki Commission Report</span>
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
    </header>
  )
}
