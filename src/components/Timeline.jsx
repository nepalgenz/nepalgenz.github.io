import { useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import './Timeline.css'

const events = [
  {
    date: { ne: '२०८२ भाद्र १९', en: 'Bhadra 19, 2082' },
    title: { ne: 'सामाजिक सञ्जालमा प्रतिबन्ध', en: 'Social Media Ban' },
    desc: {
      ne: 'सरकारले TikTok, Facebook लगायत सामाजिक सञ्जालहरूमा प्रतिबन्ध लगाउने निर्णय गर्‍यो।',
      en: 'Government decided to ban TikTok, Facebook and other social media platforms.',
    },
    type: 'trigger',
  },
  {
    date: { ne: '२०८२ भाद्र २२', en: 'Bhadra 22, 2082' },
    title: { ne: 'प्रदर्शनको घोषणा', en: 'Protest Announced' },
    desc: {
      ne: 'जेनजेड युवाहरूले भाद्र २३ गते शान्तिपूर्ण प्रदर्शनको घोषणा गरे।',
      en: 'GenZ youth announced a peaceful protest for Bhadra 23.',
    },
    type: 'event',
  },
  {
    date: { ne: '२०८२ भाद्र २३ बिहान', en: 'Morning, Bhadra 23' },
    title: { ne: 'शान्तिपूर्ण जुलुस शुरू', en: 'Peaceful March Begins' },
    desc: {
      ne: 'माइतीघरबाट हजारौं युवाको शान्तिपूर्ण जुलुस शुरू भयो।',
      en: 'Thousands of youth began a peaceful march from Maitighar.',
    },
    type: 'peaceful',
  },
  {
    date: { ne: '२०८२ भाद्र २३ दिउँसो', en: 'Afternoon, Bhadra 23' },
    title: { ne: 'संसद भवन नजिक हिंसा', en: 'Violence Near Parliament' },
    desc: {
      ne: 'बानेश्वर संसद भवन नजिक जुलुस हिंसात्मक मोड लियो। काठमाडौं उपत्यकामा १७ जनाको मृत्यु।',
      en: 'March turned violent near Parliament at Baneswhor. 17 died in Kathmandu Valley.',
    },
    type: 'critical',
  },
  {
    date: { ne: '२०८२ भाद्र २३ साँझ', en: 'Evening, Bhadra 23' },
    title: { ne: 'राष्ट्रव्यापी फैलियो', en: 'Spread Nationwide' },
    desc: {
      ne: 'उपत्यकाबाहिर अन्य जिल्लामा पनि घटनाहरू भए। थप २ जनाको मृत्यु।',
      en: 'Events spread outside the valley to other districts. 2 more deaths.',
    },
    type: 'critical',
  },
  {
    date: { ne: '२०८२ भाद्र २४', en: 'Bhadra 24, 2082' },
    title: { ne: 'व्यापक आगजनी र लुटपाट', en: 'Widespread Arson & Looting' },
    desc: {
      ne: 'सरकारले कर्फ्यू जारी गर्दागर्दै सरकारी भवन, पार्टी कार्यालय, सिंहदरबारमा आक्रमण। ५७ थप मृत्यु।',
      en: 'Despite curfew, government buildings, party offices, and Singha Durbar attacked. 57 more deaths.',
    },
    type: 'critical',
  },
  {
    date: { ne: '२०८२ असोज ५', en: 'Ashoj 5, 2082' },
    title: { ne: 'जाँचबुझ आयोग गठन', en: 'Inquiry Commission Formed' },
    desc: {
      ne: 'नेपाल सरकारले मन्त्रिपरिषद् निर्णयबाट कार्की आयोग गठन गर्‍यो।',
      en: "Nepal Government formed the Karki Commission by Cabinet decision.",
    },
    type: 'official',
  },
  {
    date: { ne: '२०८२ असोज ९', en: 'Ashoj 9, 2082' },
    title: { ne: 'आयोगले काम शुरू गर्‍यो', en: 'Commission Begins Work' },
    desc: {
      ne: 'आयोगले औपचारिक रूपमा कार्य प्रारम्भ गर्‍यो। प्रारम्भमा तीन महिनाको अवधि।',
      en: 'Commission formally began work. Initially given three months.',
    },
    type: 'official',
  },
  {
    date: { ne: '२०८२ फागुन', en: 'Falgun 2082' },
    title: { ne: 'प्रतिवेदन पेश', en: 'Report Submitted' },
    desc: {
      ne: '९०७ पृष्ठको अन्तिम प्रतिवेदन सरकारलाई पेश गरियो।',
      en: '907-page final report submitted to the government.',
    },
    type: 'report',
  },
]

export default function Timeline() {
  const { lang, t } = useLang()
  const itemRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.2 }
    )
    itemRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="timeline-section">
      <div className="container">
        <div className="section-header">
          <h2>{t('घटनाक्रम', 'Timeline of Events')}</h2>
          <p>{t('२०८२ भाद्र-फागुन — मुख्य घटनाहरूको कालक्रम', 'Bhadra–Falgun 2082 — Chronology of key events')}</p>
        </div>

        <div className="timeline">
          {events.map((ev, i) => (
            <div
              key={i}
              ref={el => itemRefs.current[i] = el}
              className={`timeline-item ${ev.type} fade-in ${i % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-date">{lang === 'ne' ? ev.date.ne : ev.date.en}</div>
                <h4 className="timeline-title">{lang === 'ne' ? ev.title.ne : ev.title.en}</h4>
                <p className="timeline-desc">{lang === 'ne' ? ev.desc.ne : ev.desc.en}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}
