'use client'

const MENU = [
  { icon: '🔔', label: 'Уведомления', sub: 'Напоминание записать сон' },
  { icon: '🎨', label: 'Тема оформления', sub: 'Тёмная' },
  { icon: '☁️', label: 'Синхронизация', sub: 'iCloud' },
  { icon: '🔒', label: 'Приватность', sub: 'Защита Face ID' },
  { icon: '⭐', label: 'Оценить приложение', sub: '' },
  { icon: '💬', label: 'Обратная связь', sub: '' },
]

export default function ProfileScreen() {
  return (
    <div style={{ padding: '32px 20px 20px' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease both' }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, background: 'linear-gradient(135deg, #7c5cfc, #a18aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 38, boxShadow: '0 8px 32px rgba(124,92,252,0.4)' }}>🌙</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginTop: 16, letterSpacing: -0.3 }}>Стас</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Мечтатель с марта 2026</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          {[['47', 'снов'], ['6.8', 'осознанность'], ['5', 'серия']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', margin: 0 }}>{v}</p>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: '2px 0 0' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, background: 'linear-gradient(135deg, rgba(124,92,252,0.12), rgba(245,166,35,0.08))', borderRadius: 20, border: '1px solid rgba(124,92,252,0.25)', padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeInUp 0.4s ease 0.06s both' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#f5a623' }}>Dreameeer PRO</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Безлимитные анализы и видео</p>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c5cfc, #f5a623)', padding: '9px 16px', borderRadius: 12 }}>$6.99/мес</span>
      </div>

      <div style={{ marginTop: 24, animation: 'fadeInUp 0.4s ease 0.12s both' }}>
        {MENU.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 0', borderBottom: i < MENU.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 24, width: 32, textAlign: 'center' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, color: 'var(--text)', margin: 0, fontWeight: 500 }}>{item.label}</p>
              {item.sub && <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '2px 0 0' }}>{item.sub}</p>}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-ghost)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </div>
  )
}
