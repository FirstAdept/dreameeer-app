'use client'
import { Screen } from '../page'

const MOODS: Record<string, string> = {
  'загадочный': '#8b5cf6', 'мечтательный': '#3b82f6',
  'тревожный': '#ef4444', 'трансформирующий': '#f59e0b', 'вдохновляющий': '#10b981',
}
const DREAMS = [
  { id: 1, title: 'Полёт над океаном', mood: 'мечтательный', date: '7 мар', emoji: '🌊', lucidity: 7, symbols: ['океан', 'полёт'] },
  { id: 2, title: 'Стеклянный лабиринт', mood: 'загадочный', date: '5 мар', emoji: '🔮', lucidity: 5, symbols: ['зеркала', 'лабиринт'] },
  { id: 3, title: 'Танец с тенями', mood: 'трансформирующий', date: '3 мар', emoji: '🌑', lucidity: 8, symbols: ['тени', 'огонь'] },
  { id: 4, title: 'Сад бесконечности', mood: 'вдохновляющий', date: '1 мар', emoji: '🌸', lucidity: 6, symbols: ['сад', 'цветы'] },
]

export default function DiaryScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div style={{ padding: '32px 20px 20px' }}>
      <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>Дневник снов</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{DREAMS.length} снов записано</p>
      </div>

      <div style={{ marginTop: 16, height: 46, borderRadius: 14, background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, animation: 'fadeInUp 0.4s ease 0.06s both' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span style={{ fontSize: 15, color: 'var(--text-ghost)' }}>Поиск по снам...</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4, animation: 'fadeInUp 0.4s ease 0.12s both' }}>
        {['Все', 'загадочный', 'мечтательный', 'тревожный', 'вдохновляющий'].map((m, i) => (
          <span key={m} style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', color: i === 0 ? '#fff' : 'var(--text-muted)', background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.04)', padding: '7px 16px', borderRadius: 99, border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}` }}>{m}</span>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {DREAMS.map((d, i) => (
          <div key={d.id} onClick={() => onNavigate('analysis')} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', marginBottom: 10, cursor: 'pointer', animation: `fadeInUp 0.4s ease ${0.18 + i * 0.06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{d.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{d.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: MOODS[d.mood], background: `${MOODS[d.mood]}20`, padding: '2px 9px', borderRadius: 99 }}>{d.mood}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{d.date}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', margin: 0 }}>{d.lucidity}</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', margin: 0 }}>балл</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {d.symbols.map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', background: 'var(--bg-input)', padding: '3px 10px', borderRadius: 8 }}>#{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
