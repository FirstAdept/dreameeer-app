'use client'
import { useState, useEffect } from 'react'
import { Screen, Analysis } from '../page'

const BACKEND_URL = 'http://192.168.31.79:3001'

const MOODS: Record<string, string> = {
  'загадочный': '#8b5cf6', 'мечтательный': '#3b82f6',
  'тревожный': '#ef4444', 'трансформирующий': '#f59e0b', 'вдохновляющий': '#10b981',
}

const DEMO: Analysis = {
  dreamTitle: 'Полёт над Временем', mood: 'мечтательный', lucidityScore: 7, emotionalTone: 'освобождение', videoPrompt: '',
  symbols: [
    { name: 'Фиолетовый океан', emoji: '🌊', meaning: 'Символизирует духовность и трансформацию. Океан — это твоё подсознание.' },
    { name: 'Полёт', emoji: '🕊️', meaning: 'Символ свободы и преодоления ограничений.' },
    { name: 'Тающие часы', emoji: '⏳', meaning: 'Текучесть времени — ты готов отпустить контроль.' },
  ],
  interpretation: 'Твой сон — это путешествие к глубинам собственной души. Полёт над фиолетовым океаном отражает стремление к свободе и духовному росту.',
  recommendation: 'Проведи 10 минут в тишине, наблюдая за своими мыслями без оценки.',
}

export default function AnalysisScreen({ analysis, videoTaskId, onNavigate }: {
  analysis: Analysis | null; videoTaskId: string | null; onNavigate: (s: Screen) => void
}) {
  const d = analysis || DEMO
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<'processing' | 'done' | 'failed' | null>(videoTaskId ? 'processing' : null)
  const moodColor = MOODS[d.mood] || '#7c5cfc'

  useEffect(() => {
    if (!videoTaskId) return
    let attempts = 0
    const iv = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`${BACKEND_URL}/api/dream/video/${videoTaskId}`)
        const data = await res.json()
        if (data.status === 'completed') { setVideoUrl(data.videoUrl); setVideoStatus('done'); clearInterval(iv) }
        else if (data.status === 'failed') { setVideoStatus('failed'); clearInterval(iv) }
      } catch {}
      if (attempts >= 20) clearInterval(iv)
    }, 10000)
    return () => clearInterval(iv)
  }, [videoTaskId])

  return (
    <div>
      {/* Video area */}
      <div style={{ height: 240, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a0533, #0d1b3e, #07071a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 60%, rgba(124,92,252,0.25), transparent 60%)' }} />
        {videoUrl ? (
          <video src={videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : videoStatus === 'processing' ? (
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#7c5cfc', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>Генерирую видео...</p>
          </div>
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 14, left: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#a18aff', background: 'rgba(124,92,252,0.2)', padding: '4px 12px', borderRadius: 99, letterSpacing: 0.5 }}>
            {videoStatus === 'done' ? '✓ ВИДЕО ГОТОВО' : videoStatus === 'processing' ? '⏳ ГЕНЕРАЦИЯ...' : '🎬 ВИЗУАЛИЗАЦИЯ'}
          </span>
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Mood + title */}
        <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: moodColor, background: `${moodColor}20`, padding: '4px 12px', borderRadius: 99 }}>{d.mood}</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginTop: 10, letterSpacing: -0.4, lineHeight: 1.2 }}>{d.dreamTitle}</h1>
        </div>

        {/* Lucidity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, animation: 'fadeInUp 0.3s ease 0.06s both' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Осознанность</span>
          <div style={{ flex: 1, height: 6, background: 'var(--bg-input)', borderRadius: 3 }}>
            <div style={{ width: `${d.lucidityScore * 10}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #7c5cfc, #a18aff)', transition: 'width 0.8s ease' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{d.lucidityScore}/10</span>
        </div>

        {/* Symbols */}
        <div style={{ marginTop: 28, animation: 'fadeInUp 0.3s ease 0.12s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 14 }}>Символы сна</p>
          {d.symbols.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 16, marginBottom: 10,
              animation: `fadeInUp 0.3s ease ${0.18 + i * 0.06}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{s.emoji}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{s.name}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{s.meaning}</p>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div style={{ marginTop: 24, animation: 'fadeInUp 0.3s ease 0.36s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 14 }}>Толкование</p>
          <div style={{ background: 'rgba(124,92,252,0.06)', borderRadius: 18, padding: 18, borderLeft: '3px solid var(--accent)' }}>
            <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{d.interpretation}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div style={{ marginTop: 16, animation: 'fadeInUp 0.3s ease 0.42s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 14 }}>Рекомендация</p>
          <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 18, padding: 18, border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: 15, color: 'var(--success)', lineHeight: 1.7, margin: 0 }}>{d.recommendation}</p>
          </div>
        </div>

        <button onClick={() => onNavigate('home')} style={{
          marginTop: 24, width: '100%', height: 52, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
          color: 'var(--text-muted)', fontSize: 15, fontWeight: 600,
          animation: 'fadeInUp 0.3s ease 0.48s both',
        }}>← На главную</button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
