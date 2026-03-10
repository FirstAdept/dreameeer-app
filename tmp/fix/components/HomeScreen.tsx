'use client'
import { useState, useEffect, useRef } from 'react'
import { Screen, Analysis } from '../page'

declare global {
  interface Window { SpeechRecognition: any; webkitSpeechRecognition: any; }
}

const BACKEND_URL = 'http://192.168.31.79:3001'

const MOODS: Record<string, string> = {
  'загадочный': '#8b5cf6', 'мечтательный': '#3b82f6',
  'тревожный': '#ef4444', 'трансформирующий': '#f59e0b', 'вдохновляющий': '#10b981',
}

const RECENT = [
  { id: 1, title: 'Полёт над океаном', mood: 'мечтательный', date: '7 мар', emoji: '🌊' },
  { id: 2, title: 'Стеклянный лабиринт', mood: 'загадочный', date: '5 мар', emoji: '🔮' },
  { id: 3, title: 'Танец с тенями', mood: 'трансформирующий', date: '3 мар', emoji: '🌑' },
]

export default function HomeScreen({ onNavigate, onAnalysis }: {
  onNavigate: (s: Screen) => void
  onAnalysis: (a: Analysis, t: string | null) => void
}) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const recogRef = useRef<any>(null)

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError('Голосовой ввод не поддерживается'); return }
    const r = new SR()
    r.lang = 'ru-RU'; r.continuous = true; r.interimResults = true
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((x: any) => x[0].transcript).join('')
      setText(t)
    }
    r.onend = () => setListening(false)
    r.start(); recogRef.current = r; setListening(true)
  }

  const stopVoice = () => {
    recogRef.current?.stop(); setListening(false)
  }

  const handleMic = () => listening ? stopVoice() : startVoice()

  const handleAnalyze = async () => {
    if (text.trim().length < 10) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/dream/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText: text }),
      })
      const data = await res.json()
      if (data.success) onAnalysis(data.analysis, data.videoTaskId)
      else setError(data.error || 'Ошибка анализа')
    } catch { setError('Нет соединения с сервером') }
    finally { setLoading(false) }
  }

  const canSend = text.trim().length >= 10 && !loading

  return (
    <div style={{ padding: '32px 20px 20px' }}>
      {/* Header */}
      <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', letterSpacing: 0.3 }}>Доброй ночи 🌙</p>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', marginTop: 6, letterSpacing: -0.8, lineHeight: 1.2 }}>
          Расскажи<br />свой сон ✨
        </h1>
      </div>

      {/* Input card */}
      <div style={{
        marginTop: 24, borderRadius: 24,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        padding: 20, animation: 'fadeInUp 0.4s ease 0.06s both',
      }}>
        {/* Mic button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={handleMic} style={{
            width: 64, height: 64, borderRadius: 32,
            background: listening
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #7c5cfc, #a18aff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: listening
              ? '0 0 0 0 rgba(239,68,68,0.5)'
              : '0 4px 20px rgba(124,92,252,0.4)',
            animation: listening ? 'micPulse 1.5s ease infinite' : 'glow 3s ease infinite',
            transition: 'all 0.3s ease',
          }}>
            {listening ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="1" width="6" height="11" rx="3"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        </div>

        {listening && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#ef4444', marginBottom: 12, fontWeight: 600, letterSpacing: 0.5 }}>
            ● Слушаю...
          </p>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Или опиши сон текстом..."
          rows={4}
          style={{
            width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-light)',
            borderRadius: 14, padding: '12px 14px',
            color: 'var(--text)', fontSize: 15, lineHeight: 1.6, resize: 'none',
          }}
        />

        {error && (
          <p style={{ color: 'var(--error)', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>
        )}

        <button onClick={handleAnalyze} disabled={!canSend} style={{
          width: '100%', height: 52, borderRadius: 16, marginTop: 14,
          background: canSend
            ? 'linear-gradient(135deg, #7c5cfc 0%, #a18aff 100%)'
            : 'var(--bg-input)',
          color: canSend ? '#fff' : 'var(--text-ghost)',
          fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
          boxShadow: canSend ? '0 4px 24px rgba(124,92,252,0.4)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.2s ease',
        }}>
          {loading ? (
            <>
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Анализирую...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Разгадать сон
            </>
          )}
        </button>
      </div>

      {/* Recent */}
      <div style={{ marginTop: 32, animation: 'fadeInUp 0.4s ease 0.18s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.3 }}>Недавние сны</h2>
          <button onClick={() => onNavigate('diary')} style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>Все →</button>
        </div>
        {RECENT.map((d, i) => (
          <div key={d.id} onClick={() => onNavigate('analysis')} style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '14px 16px', marginBottom: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            animation: `fadeInUp 0.4s ease ${0.24 + i * 0.06}s both`,
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{d.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{d.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: MOODS[d.mood], background: `${MOODS[d.mood]}20`, padding: '2px 9px', borderRadius: 99 }}>{d.mood}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{d.date}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-ghost)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}
