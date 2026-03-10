'use client'
import { useState } from 'react'
import { Screen, Analysis } from '../page'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const SAMPLE_DREAMS = [
  { id: 1, title: 'Полёт над океаном', mood: 'мечтательный', date: '7 мар', emoji: '🌊' },
  { id: 2, title: 'Стеклянный лабиринт', mood: 'загадочный', date: '5 мар', emoji: '🔮' },
  { id: 3, title: 'Танец с тенями', mood: 'трансформирующий', date: '3 мар', emoji: '🌑' },
]

const MOOD_COLORS: Record<string, string> = {
  'загадочный': '#8b5cf6',
  'мечтательный': '#3b82f6',
  'тревожный': '#ef4444',
  'трансформирующий': '#f59e0b',
  'вдохновляющий': '#10b981',
}

export default function HomeScreen({
  onNavigate,
  onAnalysis,
}: {
  onNavigate: (s: Screen) => void
  onAnalysis: (a: Analysis, taskId: string | null) => void
}) {
  const [dreamText, setDreamText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (dreamText.trim().length < 10) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/dream/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText }),
      })
      const data = await res.json()
      if (data.success) {
        onAnalysis(data.analysis, data.videoTaskId)
      } else {
        setError(data.error || 'Ошибка анализа')
      }
    } catch {
      setError('Нет соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Доброй ночи 🌙</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginTop: 4, letterSpacing: -0.5 }}>
          Расскажи свой сон ✨
        </h1>
      </div>

      {/* Input */}
      <div style={{
        marginTop: 24, background: 'var(--bg-card)', borderRadius: 20,
        border: '1px solid var(--border)', padding: 16,
        animation: 'fadeInUp 0.4s ease 0.06s both',
      }}>
        <textarea
          value={dreamText}
          onChange={e => setDreamText(e.target.value)}
          placeholder="Опиши свой сон... Чем подробнее, тем глубже анализ ✨"
          rows={5}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            color: 'var(--text)', fontSize: 15, lineHeight: 1.6, resize: 'none',
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'var(--bg-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="1" width="6" height="11" rx="3"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={dreamText.trim().length < 10 || loading}
            style={{
              height: 48, padding: '0 24px', borderRadius: 14, border: 'none',
              background: dreamText.trim().length >= 10
                ? 'linear-gradient(135deg, #7c5cfc, #a18aff)'
                : 'var(--bg-input)',
              color: dreamText.trim().length >= 10 ? '#fff' : 'var(--text-dim)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              boxShadow: dreamText.trim().length >= 10 ? '0 4px 20px rgba(124,92,252,0.3)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Анализирую...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Разгадать
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent dreams */}
      <div style={{ marginTop: 32, animation: 'fadeInUp 0.4s ease 0.12s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Недавние сны</h2>
          <button onClick={() => onNavigate('diary')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 14, cursor: 'pointer' }}>
            Все →
          </button>
        </div>
        {SAMPLE_DREAMS.map((dream, i) => (
          <div key={dream.id} onClick={() => onNavigate('analysis')} style={{
            background: 'var(--bg-card)', borderRadius: 16,
            border: '1px solid var(--border-light)', padding: 14,
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', animation: `fadeInUp 0.4s ease ${0.18 + i * 0.06}s both`,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'var(--accent-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>{dream.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{dream.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                  color: MOOD_COLORS[dream.mood] || '#7c5cfc',
                  background: `${MOOD_COLORS[dream.mood] || '#7c5cfc'}18`,
                  padding: '2px 8px', borderRadius: 99,
                }}>{dream.mood}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{dream.date}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </div>
  )
}
