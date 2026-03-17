'use client';
import { useState, useEffect } from 'react';
import type { DreamRecord } from '../page';

const moodEmoji: Record<string, string> = {
  'загадочный': '🔮',
  'мечтательный': '💫',
  'тревожный': '⚡',
  'трансформирующий': '🌀',
  'вдохновляющий': '✨',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);

  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  if (diff < 7) return `${diff} дня назад`;

  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export default function DiaryScreen({ settings }: { settings?: any }) {
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dreameeer_dreams') || '[]');
      setDreams(stored);
    } catch {
      setDreams([]);
    }
  }, []);

  const clearAll = () => {
    if (confirm('Удалить все сны из дневника?')) {
      localStorage.removeItem('dreameeer_dreams');
      setDreams([]);
    }
  };

  return (
    <div className="screen" style={{ padding: '24px 20px', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }} className="gradient-text">
            Дневник снов
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
            {dreams.length} {dreams.length === 1 ? 'сон' : dreams.length < 5 ? 'сна' : 'снов'}
          </p>
        </div>
        {dreams.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '12px',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Очистить
          </button>
        )}
      </div>

      {/* Empty state */}
      {dreams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>🌙</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '8px' }}>
            Дневник пустой
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
            Расшифруй свой первый сон —<br />он сохранится здесь автоматически
          </p>
        </div>
      )}

      {/* Dream list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {dreams.map((dream, idx) => {
          const isOpen = expanded === idx;
          return (
            <div
              key={`${dream.id}-${idx}`}
              className="diary-card"
              style={{ animation: `fadeInUp 0.3s ease ${idx * 0.05}s both` }}
              onClick={() => setExpanded(isOpen ? null : idx)}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>
                      {moodEmoji[dream.analysis.mood] || '🌙'}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text)' }}>
                      {dream.analysis.dreamTitle}
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: isOpen ? 'normal' : 'nowrap',
                  }}>
                    {dream.dreamText}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {formatDate(dream.date)}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  animation: 'fadeIn 0.25s ease',
                }}>
                  {/* Symbols */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {dream.analysis.symbols.map((sym, i) => (
                      <span key={i} className="symbol-chip" style={{ fontSize: '12px', padding: '5px 12px' }}>
                        {sym.emoji} {sym.name}
                      </span>
                    ))}
                  </div>

                  {/* Interpretation */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
                    {dream.analysis.interpretation}
                  </p>

                  {/* Recommendation */}
                  <div style={{
                    padding: '12px 14px',
                    background: 'rgba(251,191,36,0.07)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#fbbf24',
                  }}>
                    💡 {dream.analysis.recommendation}
                  </div>

                  {/* Image if available */}
                  {dream.imageUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <style>{`
                        @keyframes diaryDreamZoom {
                          0%   { transform: scale(1.0) translate(0%, 0%); }
                          30%  { transform: scale(1.07) translate(-1%, -0.8%); }
                          60%  { transform: scale(1.1)  translate(0.8%, -1.2%); }
                          100% { transform: scale(1.0) translate(0%, 0%); }
                        }
                        @keyframes diaryDreamHaze {
                          0%, 100% { opacity: 0; }
                          40%, 60% { opacity: 1; }
                        }
                        @keyframes diaryDreamGlowDark {
                          0%, 100% { box-shadow: 0 0 24px rgba(139,92,246,0.15), 0 8px 40px rgba(0,0,0,0.4); }
                          50%       { box-shadow: 0 0 80px rgba(139,92,246,0.55), 0 8px 60px rgba(109,40,217,0.25); }
                        }
                        @keyframes diaryDreamGlowLight {
                          0%, 100% { box-shadow: 0 0 24px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.1); }
                          50%       { box-shadow: 0 0 80px rgba(251,146,60,0.5), 0 8px 60px rgba(251,146,60,0.2); }
                        }
                      `}</style>
                      <div style={{
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        position: 'relative',
                        animation: settings?.theme === 'light' ? 'diaryDreamGlowLight 8s ease-in-out infinite' : 'diaryDreamGlowDark 8s ease-in-out infinite',
                      }}>
                        <img
                          src={dream.imageUrl}
                          alt="Визуализация сна"
                          style={{
                            width: '100%',
                            display: 'block',
                            animation: 'diaryDreamZoom 12s ease-in-out infinite',
                            transformOrigin: 'center center',
                            willChange: 'transform',
                          }}
                        />
                        <img
                          src={dream.imageUrl}
                          alt=""
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(18px) saturate(1.6) brightness(1.1)',
                            animation: 'diaryDreamHaze 8s ease-in-out infinite',
                            opacity: 0,
                            pointerEvents: 'none',
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: settings?.theme === 'light'
                            ? 'linear-gradient(135deg, rgba(251,146,60,0.3) 0%, rgba(236,72,153,0.15) 50%, rgba(251,191,36,0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(59,130,246,0.15) 50%, rgba(236,72,153,0.2) 100%)',
                          animation: 'diaryDreamHaze 8s ease-in-out infinite',
                          opacity: 0,
                          pointerEvents: 'none',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Video if available */}
                  {dream.videoUrl && (
                    <div style={{ marginTop: '12px', borderRadius: '14px', overflow: 'hidden' }}>
                      <video
                        src={dream.videoUrl}
                        controls
                        playsInline
                        style={{ width: '100%', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Expand arrow */}
              <div style={{
                textAlign: 'center',
                marginTop: '10px',
                color: 'var(--text-dim)',
                fontSize: '14px',
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}>
                ▾
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
