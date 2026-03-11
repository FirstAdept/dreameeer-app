'use client'
import { useState, useEffect } from 'react'
import { Screen, Analysis } from '../page'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const MOOD_COLORS: Record<string, string> = {
  'загадочный': '#8b5cf6',
  'мечтательный': '#3b82f6',
  'тревожный': '#ef4444',
  'трансформирующий': '#f59e0b',
  'вдохновляющий': '#10b981',
}

const DEMO: Analysis = {
  dreamTitle: 'Полёт над Временем',
  mood: 'мечтательный',
  symbols: [
    { name: 'Фиолетовый океан', emoji: '🌊', meaning: 'Фиолетовый цвет символизирует духовность и трансформацию, а океан — подсознание и эмоции.' },
    { name: 'Полёт', emoji: '🕊️', meaning: 'Полёт во сне символизирует свободу и освобождение от ограничений.' },
    { name: 'Тающие часы', emoji: '⏳', meaning: 'Тающие часы символизируют текучесть времени и его иллюзорную природу.' },
  ],
  interpretation: 'Ваш сон рисует картину внутренней трансформации. Полёт над фиолетовым океаном — это путешествие к глубинам собственной души.',
  recommendation: 'Проведите 10 минут в тишине, наблюдая за своими мыслями без оценки.',
  lucidityScore: 7,
  emotionalTone: 'освобождение',
  videoPrompt: '',
}

export default function AnalysisScreen({
  analysis,
  videoTaskId,
  onNavigate,
}: {
  analysis: Analysis | null
  videoTaskId: string | null
  onNavigate: (s: Screen) => void
}) {
  const data = analysis || DEMO
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<'processing' | 'done' | 'failed' | null>(
    videoTaskId ? 'processing' : null
  )

  useEffect(() => {
    if (!videoTaskId) return
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`${BACKEND_URL}/api/dream/video/${videoTaskId}`)
        const data = await res.json()
        if (data.status === 'completed') {
          setVideoUrl(data.videoUrl)
          setVideoStatus('done')
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setVideoStatus('failed')
          clearInterval(interval)
        }
      } catch {}
      if (attempts >= 20) clearInterval(interval)
    }, 10000)
    return () => clearInterval(interval)
  }, [videoTaskId])

  const moodColor = MOOD_COLORS[data.mood] || '#7c5cfc'

  return (
    <div>
      {/* Video area */}
      <div style={{
        height: 220, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0533, #0d1b3e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {videoUrl ? (
          <video src={videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 60%, rgba(124,92,252,0.2), transparent)' }} />
            {videoStatus === 'processing' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#7c5cfc', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>Генерирую видео...</p>
              </div>
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            )}
          </>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#a18aff', background: 'rgba(124,92,252,0.2)', padding: '3px 10px', borderRadius: 99, letterSpacing: 0.5 }}>
            {videoStatus === 'done' ? '✓ ВИДЕО ГОТОВО' : videoStatus === 'processing' ? '⏳ ГЕНЕРАЦИЯ...' : '🎬 ПРЕВЬЮ'}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Title */}
        <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: moodColor, background: `${moodColor}18`, padding: '3px 10px', borderRadius: 99 }}>
            {data.mood}
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 8, letterSpacing: -0.3 }}>{data.dreamTitle}</h1>
        </div>

        {/* Lucidity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, animation: 'fadeInUp 0.3s ease 0.06s both' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Осознанность:</span>
          <div style={{ flex: 1, height: 6, background: 'var(--bg-input)', borderRadius: 3 }}>
            <div style={{ width: `${data.lucidityScore * 10}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #7c5cfc, #a18aff)', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{data.lucidityScore}/10</span>
        </div>

        {/* Symbols */}
        <div style={{ marginTop: 24, animation: 'fadeInUp 0.3s ease 0.12s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Символы сна</p>
          {data.symbols.map((sym, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', borderRadius: 14,
              border: '1px solid var(--border-light)', padding: 14, marginBottom: 10,
              animation: `fadeInUp 0.3s ease ${0.18 + i * 0.06}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{sym.emoji}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{sym.name}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{sym.meaning}</p>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div style={{ marginTop: 20, animation: 'fadeInUp 0.3s ease 0.36s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Толкование</p>
          <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border-light)', padding: 14, borderLeft: '3px solid var(--accent)' }}>
            <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{data.interpretation}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div style={{ marginTop: 16, animation: 'fadeInUp 0.3s ease 0.42s both' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>Рекомендация</p>
          <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 14, padding: 14, border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: 15, color: '#10b981', lineHeight: 1.6, margin: 0 }}>{data.recommendation}</p>
          </div>
        </div>

        {/* Back */}
        <button onClick={() => onNavigate('home')} style={{
          marginTop: 24, width: '100%', height: 48, borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-muted)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          animation: 'fadeInUp 0.3s ease 0.48s both',
        }}>
          ← На главную
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
