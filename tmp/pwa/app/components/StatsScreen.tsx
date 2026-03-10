'use client'

const MOOD_STATS = [
  { mood: 'Загадочный', pct: 35, color: '#8b5cf6' },
  { mood: 'Мечтательный', pct: 28, color: '#3b82f6' },
  { mood: 'Вдохновляющий', pct: 20, color: '#10b981' },
  { mood: 'Трансформирующий', pct: 12, color: '#f59e0b' },
  { mood: 'Тревожный', pct: 5, color: '#ef4444' },
]

const WEEK = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
const HEIGHTS = [60, 40, 80, 0, 90, 50, 70]

export default function StatsScreen() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.3, animation: 'fadeInUp 0.4s ease both' }}>Статистика</h1>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, animation: 'fadeInUp 0.4s ease 0.06s both' }}>
        {[
          { label: 'Всего снов', value: '47', icon: '🌙' },
          { label: 'Этот месяц', value: '12', icon: '📅' },
          { label: 'Ср. осознанность', value: '6.8', icon: '🧠' },
          { label: 'Серия дней', value: '5', icon: '🔥' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '8px 0 0 0' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mood distribution */}
      <div style={{ marginTop: 24, animation: 'fadeInUp 0.4s ease 0.18s both' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Настроения снов</p>
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 16 }}>
          {MOOD_STATS.map((m, i) => (
            <div key={i} style={{ marginBottom: i < MOOD_STATS.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{m.mood}</span>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{m.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3 }}>
                <div style={{ width: `${m.pct}%`, height: '100%', borderRadius: 3, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly chart */}
      <div style={{ marginTop: 24, animation: 'fadeInUp 0.4s ease 0.24s both' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Активность за неделю</p>
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 }}>
            {WEEK.map((day, i) => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: HEIGHTS[i] || 4, borderRadius: 6, background: HEIGHTS[i] ? 'linear-gradient(180deg, #7c5cfc, #a18aff)' : 'var(--bg-input)', opacity: HEIGHTS[i] ? 1 : 0.3 }} />
                <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
