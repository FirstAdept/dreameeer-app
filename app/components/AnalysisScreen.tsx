'use client';
import { useState, useEffect } from 'react';
import type { DreamAnalysis, DreamRecord } from '../page';

// ⚠️ Update when tunnel restarts
const BACKEND_URL = 'https://fin-alpha-mac-dip.trycloudflare.com';

interface Props {
  dreamText: string;
  analysis: DreamAnalysis;
  videoTaskId: string | null;
  imageUrl: string | null;
  onBack: () => void;
}

const moodEmoji: Record<string, string> = {
  'загадочный': '🔮',
  'мечтательный': '💫',
  'тревожный': '⚡',
  'трансформирующий': '🌀',
  'вдохновляющий': '✨',
};

function saveToDiary(dreamText: string, analysis: DreamAnalysis, imageUrl?: string, videoUrl?: string) {
  try {
    const dreams: DreamRecord[] = JSON.parse(localStorage.getItem('dreameeer_dreams') || '[]');
    // Обновляем существующую запись если уже есть (по тексту сна)
    const existingIdx = dreams.findIndex(d => d.dreamText === dreamText);
    if (existingIdx >= 0) {
      if (imageUrl) dreams[existingIdx].imageUrl = imageUrl;
      if (videoUrl) dreams[existingIdx].videoUrl = videoUrl;
      localStorage.setItem('dreameeer_dreams', JSON.stringify(dreams));
      return;
    }
    // Иначе добавляем новую запись
    const newRecord: DreamRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      dreamText,
      analysis,
      imageUrl,
      videoUrl,
    };
    dreams.unshift(newRecord);
    localStorage.setItem('dreameeer_dreams', JSON.stringify(dreams.slice(0, 100)));
  } catch {}
}

export default function AnalysisScreen({ dreamText, analysis, videoTaskId, imageUrl, onBack }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'polling' | 'done' | 'failed'>(
    videoTaskId ? 'polling' : 'idle'
  );
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Auto-save on mount
  useEffect(() => {
    saveToDiary(dreamText, analysis, imageUrl || undefined);
    setSaved(true);
  }, []);

  // Poll video status
  useEffect(() => {
    if (!videoTaskId) return;
    let attempts = 0;
    const max = 40;

    const poll = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/dream/video/${videoTaskId}`);
        const data = await res.json();

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setVideoStatus('done');
          saveToDiary(dreamText, analysis, imageUrl || undefined, data.videoUrl);
          return;
        }
        if (data.status === 'failed') {
          setVideoStatus('failed');
          return;
        }
      } catch {}

      attempts++;
      if (attempts < max) {
        setTimeout(poll, 8000);
      } else {
        setVideoStatus('failed');
      }
    };

    const timer = setTimeout(poll, 5000);
    return () => clearTimeout(timer);
  }, [videoTaskId]);

  const scoreColor = analysis.lucidityScore >= 8
    ? '#34d399'
    : analysis.lucidityScore >= 5
      ? '#a78bfa'
      : '#f472b6';

  return (
    <div className="screen" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 10,
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            color: 'var(--text)',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Назад
        </button>
        <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          {saved && '✓ Сохранено в дневник'}
        </div>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Title card */}
        <div className="card-glow" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {moodEmoji[analysis.mood] || '🌙'}
          </div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '-0.3px',
            marginBottom: '12px',
          }} className="gradient-text">
            {analysis.dreamTitle}
          </h2>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className={`mood-badge mood-${analysis.mood}`}>
              {moodEmoji[analysis.mood]} {analysis.mood}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '100px',
              background: `${scoreColor}20`,
              border: `1px solid ${scoreColor}40`,
              fontSize: '13px', fontWeight: '600', color: scoreColor,
            }}>
              🔆 {analysis.lucidityScore}/10
            </span>
          </div>
        </div>

        {/* Symbols */}
        <div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Символы сна
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {analysis.symbols.map((sym, i) => (
              <button
                key={i}
                className="symbol-chip"
                onClick={() => setSelectedSymbol(selectedSymbol === i ? null : i)}
                style={{
                  background: selectedSymbol === i ? 'rgba(139,92,246,0.2)' : undefined,
                  borderColor: selectedSymbol === i ? 'rgba(139,92,246,0.5)' : undefined,
                }}
              >
                <span>{sym.emoji}</span>
                <span>{sym.name}</span>
              </button>
            ))}
          </div>

          {/* Symbol detail */}
          {selectedSymbol !== null && (
            <div className="card" style={{
              padding: '18px',
              animation: 'scaleIn 0.25s ease',
              borderColor: 'rgba(139,92,246,0.3)',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px' }}>{analysis.symbols[selectedSymbol].emoji}</span>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--purple)' }}>
                    {analysis.symbols[selectedSymbol].name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                    {analysis.symbols[selectedSymbol].meaning}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interpretation */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>🔮</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Толкование</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>
            {analysis.interpretation}
          </p>
        </div>

        {/* Recommendation */}
        <div style={{
          padding: '20px',
          background: 'rgba(251,191,36,0.07)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '20px',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fde68a' }}>Совет дня</h3>
          </div>
          <p style={{ color: '#fbbf24', fontSize: '14px', lineHeight: 1.6 }}>
            {analysis.recommendation}
          </p>
        </div>

        {/* Emotion */}
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'center',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
        }}>
          <span style={{ fontSize: '22px' }}>🎭</span>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '2px' }}>Эмоциональный тон</div>
            <div style={{ fontWeight: '600', color: 'var(--text)' }}>{analysis.emotionalTone}</div>
          </div>
        </div>

        {/* Image section — показываем сразу */}
        {imageUrl && (
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Визуализация сна</h3>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src={imageUrl}
                alt="Визуализация сна DALL-E"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        )}

        {/* Video section — показываем когда готово */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>🎬</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Видео-анимация</h3>
          </div>

          {videoStatus === 'polling' && (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--purple)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Генерируем анимацию...
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                Обычно 1–3 минуты
              </div>
            </div>
          )}

          {videoStatus === 'done' && videoUrl && (
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          )}

          {videoStatus === 'failed' && (
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.2)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                ⚠️ Видео не удалось сгенерировать
              </div>
            </div>
          )}

          {videoStatus === 'idle' && !videoTaskId && (
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                🎬 Видео недоступно
              </div>
            </div>
          )}
        </div>

        {/* Dream text */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Текст сна
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{dreamText}"
          </p>
        </div>

        <div style={{ paddingBottom: '20px' }} />
      </div>
    </div>
  );
}
