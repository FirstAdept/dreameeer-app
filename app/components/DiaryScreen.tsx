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
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                    {formatDate(dream.date)}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    color: 'var(--purple)',
                    fontWeight: '600',
                  }}>
                    {dream.analysis.lucidityScore}/10
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
                    <div style={{ marginTop: '12px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img
                        src={dream.imageUrl}
                        alt="Визуализация сна"
                        style={{ width: '100%', display: 'block' }}
                      />
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
