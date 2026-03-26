import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import './Timeline.css'

const events = [
  {
    date: { ne: '२०८२ भाद्र १९', en: 'Bhadra 19, 2082' },
    title: { ne: 'सामाजिक सञ्जालमा प्रतिबन्ध', en: 'Social Media Ban' },
    desc: {
      ne: 'सरकारले TikTok, Facebook, YouTube लगायत सामाजिक सञ्जालहरूमा प्रतिबन्ध लगाउने निर्णय गर्‍यो।',
      en: 'Government banned TikTok, Facebook, YouTube and other platforms — sparking widespread outrage.',
    },
    detail: {
      ne: 'सरकारले सामाजिक सञ्जाल युवाहरूलाई "भड्काउने" माध्यम भएको आरोप लगाउँदै यो निर्णय गर्‍यो। तर यसले उल्टो प्रभाव पार्‍यो र युवाहरू सडकमा उत्रन बाध्य भए।',
      en: 'The government claimed social media was being used to "incite" youth. The ban backfired dramatically, becoming the immediate catalyst for mass street protests.',
    },
    type: 'trigger',
    icon: '📵',
    stat: null,
  },
  {
    date: { ne: '२०८२ भाद्र २२', en: 'Bhadra 22, 2082' },
    title: { ne: 'प्रदर्शनको घोषणा', en: 'Protest Announced' },
    desc: {
      ne: 'जेनजेड युवाहरूले भाद्र २३ गते काठमाडौंमा शान्तिपूर्ण प्रदर्शनको घोषणा गरे।',
      en: 'GenZ youth announced a peaceful protest for Bhadra 23 despite the social media ban.',
    },
    detail: {
      ne: 'प्रतिबन्धित सामाजिक सञ्जालको सट्टा VPN मार्फत र मुखैले खबर फैलाएर हजारौंले कार्यक्रम थाहा पाए।',
      en: 'Despite the ban, news spread via VPNs and word of mouth. Thousands knew about the protest before it began.',
    },
    type: 'event',
    icon: '📢',
    stat: null,
  },
  {
    date: { ne: '२०८२ भाद्र २३ — बिहान', en: 'Morning — Bhadra 23' },
    title: { ne: 'शान्तिपूर्ण जुलुस', en: 'Peaceful March Begins' },
    desc: {
      ne: 'माइतीघरबाट हजारौं युवाको शान्तिपूर्ण जुलुस शुरू भयो।',
      en: 'Thousands marched peacefully from Maitighar Mandala toward Parliament.',
    },
    detail: {
      ne: 'प्रदर्शनकारीहरू भ्रष्टाचार अन्त्य, लोकतन्त्रको सम्मान र बन्द गरिएका सामाजिक सञ्जालहरू पुनः खोल्ने माग गर्दै अघि बढे।',
      en: 'Protesters demanded an end to corruption, democratic accountability, and the lifting of the social media ban. The atmosphere was initially peaceful and festive.',
    },
    type: 'peaceful',
    icon: '✊',
    stat: null,
  },
  {
    date: { ne: '२०८२ भाद्र २३ — १२:४०', en: 'Bhadra 23 — 12:40 PM' },
    title: { ne: 'प्रहरीले गोली चलायो', en: 'Police Open Fire' },
    desc: {
      ne: 'कर्फ्यू घोषणाको ठीक १० मिनेटपछि संसद नजिक गोली चल्यो। काठमाडौंमा मात्र १७ मृत्यु।',
      en: 'Just 10 minutes after curfew, police opened fire near Parliament. 17 killed in Kathmandu Valley alone.',
    },
    detail: {
      ne: 'BBC अनुसन्धानले लिक भएका प्रहरी रेडियो लगहरू उद्घाटन गर्‍यो जसमा IGP चन्द्र कुबेर खपुङले "आवश्यक बल प्रयोग गर्नू" को आदेश दिएको देखिन्छ। सबैभन्दा कान्छो पीडित १७ वर्षीय श्रेयाम चौलागाईं स्कुले पोशाकमा टाउकोमा गोली लागेर ढले।',
      en: 'BBC\'s investigation revealed leaked police radio logs showing IGP Chandra Kuber Khapung ordered forces to "deploy necessary force." The youngest victim, 17-year-old Shreeyam Chaulagain, was shot in the head while in school uniform, walking away.',
    },
    type: 'critical',
    icon: '🚨',
    stat: { ne: '१७ मृत्यु', en: '17 killed' },
  },
  {
    date: { ne: '२०८२ भाद्र २३ — साँझ', en: 'Evening — Bhadra 23' },
    title: { ne: 'राष्ट्रव्यापी फैलियो', en: 'Spreads Nationwide' },
    desc: {
      ne: 'उपत्यकाबाहिर अन्य जिल्लामा पनि घटनाहरू भए। थप २ जनाको मृत्यु।',
      en: 'Violence spread beyond the valley. 2 more deaths reported in other districts.',
    },
    detail: {
      ne: 'बर्दिया, चितवन, झापा र अन्य जिल्लाहरूमा पनि प्रदर्शन र झडपहरू भए। सरकारले थप सुरक्षाकर्मी परिचालन गर्‍यो।',
      en: 'Protests and clashes spread to Bardiya, Chitwan, Jhapa and other districts. The government deployed additional security forces nationwide.',
    },
    type: 'critical',
    icon: '🌏',
    stat: { ne: '+२ मृत्यु', en: '+2 killed' },
  },
  {
    date: { ne: '२०८२ भाद्र २४', en: 'Bhadra 24, 2082' },
    title: { ne: 'व्यापक आगजनी', en: 'Arson & Looting' },
    desc: {
      ne: 'सिंहदरबार, सरकारी भवन र पार्टी कार्यालयहरूमा आक्रमण। सबैभन्दा घातक दिन।',
      en: 'Singha Durbar, government buildings, and party offices attacked. Deadliest day of the protests.',
    },
    detail: {
      ne: 'कर्फ्यू लागू भए पनि सरकारी भवनहरूमा आगो लगाइयो। एकै दिन ५७ जनाको मृत्यु। अनुमानित ८५ करोड रुपैयाँ बराबरको सम्पत्ति नष्ट।',
      en: 'Despite curfew, fires broke out at government buildings. 57 people died in a single day. An estimated NPR 85 crore of property was destroyed across the country.',
    },
    type: 'critical',
    icon: '🔥',
    stat: { ne: '+५७ मृत्यु', en: '+57 killed' },
  },
  {
    date: { ne: '२०८२ असोज ५', en: 'Ashoj 5, 2082' },
    title: { ne: 'जाँचबुझ आयोग गठन', en: 'Inquiry Commission Formed' },
    desc: {
      ne: 'नेपाल सरकारले मन्त्रिपरिषद् निर्णयबाट कार्की आयोग गठन गर्‍यो।',
      en: 'Nepal Government formed the Karki Commission to independently investigate the events.',
    },
    detail: {
      ne: 'आयोगको नेतृत्व पूर्व सर्वोच्च अदालतका न्यायाधीश गरे। आयोगलाई घटनाको यथार्थ अनुसन्धान गरी सुधारका सिफारिशहरू पेश गर्ने जिम्मेवारी दिइयो।',
      en: 'Led by a former Supreme Court judge, the commission was tasked with a full independent investigation and reform recommendations.',
    },
    type: 'official',
    icon: '🏛️',
    stat: null,
  },
  {
    date: { ne: '२०८२ फागुन', en: 'Falgun 2082' },
    title: { ne: '९०७ पृष्ठको प्रतिवेदन', en: '907-Page Report' },
    desc: {
      ne: 'विस्तृत अन्तिम प्रतिवेदन सरकारलाई पेश गरियो।',
      en: 'Final 907-page report submitted to the government.',
    },
    detail: {
      ne: '७६ मृत्यु, २,५२२ घाइते, ८५ करोड रुपैयाँको सम्पत्ति क्षति र भविष्यका लागि सुधारका विस्तृत सिफारिशहरू समावेश गरिएको ९०७ पृष्ठको प्रतिवेदन।',
      en: 'The report documented 76 deaths, 2,522 injuries, NPR 85 crore in damages, and included detailed reform recommendations to prevent future state violence against protesters.',
    },
    type: 'report',
    icon: '📖',
    stat: { ne: '९०७ पृष्ठ', en: '907 pages' },
  },
]

const BBC_SEARCH = 'https://www.youtube.com/results?search_query=Shot+Like+Enemies+Nepal+Gen+Z+Uprising+BBC+World+Service'

export default function Timeline() {
  const { lang, t } = useLang()
  const itemRefs = useRef([])
  const sectionRef = useRef(null)
  const scrubTrackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(null)
  const [scrubPos, setScrubPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Fade in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.15 }
    )
    itemRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // Scrubber position synced to scroll
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const { top, height } = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(100, (-top / Math.max(1, height - window.innerHeight)) * 100))
      setScrubPos(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrubber drag
  const scrubTo = (clientX) => {
    const track = scrubTrackRef.current
    const section = sectionRef.current
    if (!track || !section) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const targetY = section.offsetTop + ratio * Math.max(0, section.offsetHeight - window.innerHeight)
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  useEffect(() => {
    const onMouseMove = (e) => { if (isDragging) scrubTo(e.clientX) }
    const onMouseUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  const toggleCard = (i) => setActiveIdx(prev => prev === i ? null : i)

  const jumpToEvent = (i, e) => {
    e.stopPropagation()
    itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setActiveIdx(i)
  }

  return (
    <section className="timeline-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2>{t('घटनाक्रम', 'Timeline of Events')}</h2>
          <p>{t('२०८२ भाद्र-फागुन — मुख्य घटनाहरूको कालक्रम', 'Bhadra–Falgun 2082 — Chronology of key events')}</p>
        </div>

        {/* BBC Documentary */}
        <div className="bbc-feature">
          <div className="bbc-feature-inner">
            <div className="bbc-icon">🎬</div>
            <div className="bbc-text">
              <div className="bbc-badge-row">
                <span className="bbc-badge">BBC</span>
                <span className="bbc-tag">{t('विशेष वृत्तचित्र', 'Featured Documentary')}</span>
              </div>
              <h3>{t('"दुश्मन झैं गोली हानियो"', '"Shot Like Enemies"')}</h3>
              <p>{t(
                'BBC World Service को ४० मिनेटको वृत्तचित्र — लिक प्रहरी रेडियो लग, ४,००० भन्दा बढी प्रमाण।',
                '40-min BBC World Service documentary — leaked police radio logs, 4,000+ videos & photos as evidence.'
              )}</p>
              <a href={BBC_SEARCH} target="_blank" rel="noopener noreferrer" className="bbc-btn">
                ▶ {t('YouTube मा हेर्नुहोस्', 'Watch on YouTube')}
              </a>
            </div>
          </div>
        </div>

        {/* Casualties summary bar */}
        <div className="casualties-bar">
          <div className="cas-item danger">
            <span className="cas-num">76</span>
            <span className="cas-label">{t('कुल मृत्यु', 'Total Deaths')}</span>
          </div>
          <div className="cas-divider" />
          <div className="cas-item">
            <span className="cas-num">2,522</span>
            <span className="cas-label">{t('घाइते', 'Injured')}</span>
          </div>
          <div className="cas-divider" />
          <div className="cas-item">
            <span className="cas-num">85 {t('करोड', 'Cr NPR')}</span>
            <span className="cas-label">{t('सम्पत्ति क्षति', 'Property Damage')}</span>
          </div>
        </div>

        {/* Timeline events */}
        <div className="timeline">
          {/* Scrubber — sticky glass pill centred on the vertical line */}
          <div className="scrubber-center-wrapper">
            <div className="scrubber-center-pill">
              <span className="scrubber-pill-label">{t('घटनाक्रम', 'Timeline')}</span>
              <div
                className="scrubber-track"
                ref={scrubTrackRef}
                onClick={(e) => scrubTo(e.clientX)}
              >
                <div className="scrubber-fill" style={{ width: `${scrubPos}%` }} />
                {events.map((ev, i) => (
                  <button
                    key={i}
                    className={`scrubber-marker ${ev.type}`}
                    style={{ left: `${(i / (events.length - 1)) * 100}%` }}
                    onClick={(e) => jumpToEvent(i, e)}
                  >
                    <span className="scrubber-tooltip">{lang === 'ne' ? ev.title.ne : ev.title.en}</span>
                  </button>
                ))}
                <div
                  className="scrubber-thumb"
                  style={{ left: `${scrubPos}%` }}
                  onMouseDown={() => setIsDragging(true)}
                  onTouchMove={(e) => scrubTo(e.touches[0].clientX)}
                />
              </div>
              <span className="scrubber-pct">{Math.round(scrubPos)}%</span>
            </div>
          </div>

          {events.map((ev, i) => (
            <div
              key={i}
              ref={el => { if(el) itemRefs.current[i] = el }}
              className={`timeline-item ${ev.type} fade-in ${i % 2 === 0 ? 'left' : 'right'} ${activeIdx === i ? 'expanded' : ''}`}
              onClick={() => toggleCard(i)}
            >
              <div className={`timeline-dot ${ev.type}`}>
                <span className="dot-icon">{ev.icon}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-date">{lang === 'ne' ? ev.date.ne : ev.date.en}</div>
                <h4 className="timeline-title">{lang === 'ne' ? ev.title.ne : ev.title.en}</h4>
                <p className="timeline-desc">{lang === 'ne' ? ev.desc.ne : ev.desc.en}</p>

                {/* Expanded detail */}
                <div className="timeline-detail">
                  <div className="timeline-detail-inner">
                    <p>{lang === 'ne' ? ev.detail.ne : ev.detail.en}</p>
                  </div>
                </div>

                <div className="timeline-footer">
                  {ev.stat && (
                    <span className={`timeline-stat ${ev.type}`}>
                      {lang === 'ne' ? ev.stat.ne : ev.stat.en}
                    </span>
                  )}
                  <span className="expand-hint">
                    {activeIdx === i
                      ? t('▲ कम देखाउनुहोस्', '▲ Show less')
                      : t('▼ विस्तार', '▼ Details')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}
