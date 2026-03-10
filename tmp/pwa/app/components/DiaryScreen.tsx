'use client'
import { Screen } from '../page'

const MOOD_COLORS: Record<string, string> = {
  'загадочный': '#8b5cf6', 'мечтательный': '#3b82f6',
  'тревожный': '#ef4444', 'трансформирующий': '#f59e0b', 'вдохновляющий': '#10b981',
}

const DREAMS = [
  { id: 1, title: 'Полёт над океаном', mood: 'мечтательный', date: '7 мар', emoji: '🌊', lucidity: 7, symbols: ['океан', 'полёт', 'закат'] },
  { id: 2, title: 'Стеклянный лабиринт', mood: 'загадочный', date: '5 мар', emoji: '🔮', lucidity: 5, symbols: ['зеркала', 'лабиринт'] },
  { id: 3, title: 'Танец с тенями', mood: 'трансформирующий', date: '3 мар', emoji: '🌑', lucidity: 8, symbols: ['тени', 'огонь'] },
  { id: 4, title: 'Сад бесконечности', mood: 'вдохновляющий', date: '1 мар', emoji: '🌸', lucidity: 6, symbols: ['сад', 'цветы'] },
]

export default function DiaryScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.3 }}>Дневник снов</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{DREAMS.length} снов записано</p>
      </div>

      <div style={{ marginTop: 16, animation: 'fadeInUp 0.4s ease 0.06s both' }}>
        <div style={{ height: 44, borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ fontSize: 15, color: 'var(--text-ghost)' }}>Поиск по снам...</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4, animation: 'fadeInUp 0.4s ease 0.12s both' }}>
        {['Все', 'загадочный', 'мечтательный', 'тревожный'].map((m, i) => (
          <span key={m} style={{
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            color: i === 0 ? '#fff' : 'var(--text-muted)',
            background: i === 0 ? 'var(--accent)' : 'var(--bg-card)',
            padding: '6px 14px', borderRadius: 99,
            border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
          }}>{m}</span>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {DREAMS.map((dream, i) => (
          <div key={dream.id} onClick={() => onNavigate('analysis')} style={{
            background: 'var(--bg-card)', borderRadius: 16,
            border: '1px solid var(--border-light)', padding: 14,
            marginBottom: 10, cursor: 'pointer',
            animation: `fadeInUp 0.4s ease ${0.18 + i * 0.06}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{dream.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{dream.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: MOOD_COLORS[dream.mood], background: `${MOOD_COLORS[dream.mood]}18`, padding: '2px 8px', borderRadius: 99 }}>{dream.mood}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{dream.date}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{dream.lucidity}</span>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', margin: 0 }}>балл</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {dream.symbols.map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', background: 'var(--bg-input)', padding: '3px 8px', borderRadius: 6 }}>#{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
