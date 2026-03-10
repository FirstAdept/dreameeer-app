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
    <div style={{ padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease both' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: 'linear-gradient(135deg, #7c5cfc, #a18aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 36 }}>🌙</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 14 }}>Стас</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Мечтатель с марта 2026</p>
      </div>

      {/* PRO banner */}
      <div style={{
        marginTop: 24, borderRadius: 16, padding: 16,
        background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(245,166,35,0.1))',
        border: '1px solid rgba(124,92,252,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        animation: 'fadeInUp 0.4s ease 0.06s both',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#f5a623' }}>Dreameeer PRO</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Безлимитные анализы и видео</p>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c5cfc, #f5a623)', padding: '8px 14px', borderRadius: 10 }}>
          $6.99/мес
        </span>
      </div>

      {/* Menu */}
      <div style={{ marginTop: 24, animation: 'fadeInUp 0.4s ease 0.12s both' }}>
        {MENU.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 0',
            borderBottom: i < MENU.length - 1 ? '1px solid var(--border-light)' : 'none',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, color: 'var(--text)', margin: 0 }}>{item.label}</p>
              {item.sub && <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }}>{item.sub}</p>}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </div>
  )
}
