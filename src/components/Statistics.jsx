import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { useLang } from '../context/LanguageContext'
import './Statistics.css'

const COLORS = ['#B83232', '#C9902A', '#2A5FA8', '#5C8A3E', '#7A4CA0', '#3A8A8A', '#8A6A3A']

export default function Statistics() {
  const { t } = useLang()

  const deathsByCategory = [
    { name: t('सुरक्षाकर्मीको गोलीबाट', 'By Security Forces'), value: 42 },
    { name: t('प्रहरी (आन्दोलनकारीद्वारा)', 'Police (by protesters)'), value: 3 },
    { name: t('लुटपाटको क्रममा', 'During Looting'), value: 31 },
  ]

  const injuredBreakdown = [
    { name: t('आन्दोलनकारी', 'Protesters'), value: 1850 },
    { name: t('सुरक्षाकर्मी', 'Security Forces'), value: 450 },
    { name: t('सर्वसाधारण', 'Civilians'), value: 222 },
  ]

  const provinceData = [
    { name: t('बागमती', 'Bagmati'), deaths: 52, injured: 1800 },
    { name: t('कोशी', 'Koshi'), deaths: 6, injured: 180 },
    { name: t('मधेश', 'Madhesh'), deaths: 4, injured: 120 },
    { name: t('गण्डकी', 'Gandaki'), deaths: 5, injured: 150 },
    { name: t('लुम्बिनी', 'Lumbini'), deaths: 5, injured: 160 },
    { name: t('कर्णाली', 'Karnali'), deaths: 2, injured: 56 },
    { name: t('सुदूरपश्चिम', 'Sudurpashchim'), deaths: 2, injured: 56 },
  ]

  const damageByType = [
    { name: t('सरकारी कार्यालय', 'Govt. Offices'), value: 28 },
    { name: t('राजनैतिक दल', 'Political Parties'), value: 22 },
    { name: t('प्रहरी चौकी', 'Police Posts'), value: 18 },
    { name: t('निजी सम्पत्ति', 'Private Property'), value: 17 },
    { name: t('सार्वजनिक', 'Public'), value: 15 },
  ]

  return (
    <section className="statistics">
      <div className="container">
        <div className="section-header">
          <h2>{t('घटनाको तथ्याङ्क', 'Incident Statistics')}</h2>
          <p>{t(
            '२०८२ भाद्र २३-२४ को घटनाका मूल तथ्याङ्कहरू',
            'Key data from the events of Bhadra 23-24, 2082 BS'
          )}</p>
        </div>

        {/* Summary Cards */}
        <div className="stats-summary-grid">
          <div className="stat-card danger">
            <div className="stat-number text-red">76</div>
            <div className="stat-label">{t('कुल मृत्यु', 'Total Deaths')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-gold">2,522</div>
            <div className="stat-label">{t('कुल घाइते', 'Total Injured')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">85+</div>
            <div className="stat-label">{t('करोड रुपैयाँ क्षति', 'Crore NPR Damage')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7</div>
            <div className="stat-label">{t('प्रदेश प्रभावित', 'Provinces Affected')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">20+</div>
            <div className="stat-label">{t('जिल्ला प्रभावित', 'Districts Affected')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">907</div>
            <div className="stat-label">{t('पृष्ठ प्रतिवेदन', 'Report Pages')}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Deaths by Category - Pie */}
          <div className="chart-card">
            <h3>{t('मृत्युको कारण अनुसार वर्गीकरण', 'Deaths by Category')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={deathsByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {deathsByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Injured Breakdown - Pie */}
          <div className="chart-card">
            <h3>{t('घाइतेको वर्गीकरण', 'Injured by Category')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={injuredBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ value }) => value}
                  labelLine={false}
                >
                  {injuredBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i + 2]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Province Deaths - Bar */}
          <div className="chart-card chart-wide">
            <h3>{t('प्रदेशअनुसार मृत्यु र घाइते', 'Deaths & Injured by Province')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={provinceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="deaths" name={t('मृत्यु', 'Deaths')} fill="#B83232" radius={[3,3,0,0]} />
                <Bar yAxisId="right" dataKey="injured" name={t('घाइते', 'Injured')} fill="#C9902A" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Damage by Type - Bar */}
          <div className="chart-card chart-wide">
            <h3>{t('क्षतिको प्रकारअनुसार वितरण (% अनुमानित)', 'Damage Distribution by Type (%)')}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={damageByType} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" fill="#2A5FA8" radius={[0,3,3,0]}>
                  {damageByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key facts */}
        <div className="key-facts">
          <h3>{t('मुख्य तथ्यहरू', 'Key Facts')}</h3>
          <div className="facts-grid">
            {[
              { label: t('आयोग गठन', 'Commission Formed'), value: '2082/06/05' },
              { label: t('काम शुरू', 'Work Began'), value: '2082/06/09' },
              { label: t('काम अवधि', 'Duration'), value: t('~५ महिना', '~5 months') },
              { label: t('घटना मिति', 'Event Dates'), value: t('२०८२ भाद्र २३-२४', 'Bhadra 23-24, 2082') },
              { label: t('प्रभावित क्षेत्र', 'Affected Area'), value: t('राष्ट्रव्यापी', 'Nationwide') },
              { label: t('बयान संकलन', 'Testimonies'), value: '700+' },
            ].map((f, i) => (
              <div key={i} className="fact-item">
                <span className="fact-label">{f.label}</span>
                <span className="fact-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
