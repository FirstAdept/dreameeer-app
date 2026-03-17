'use client';
import { useState, useEffect } from 'react';
import type { DreamAnalysis, DreamRecord } from '../page';

const BACKEND_URL = 'https://api.dreameeer.ru';

interface Props {
  dreamText: string;
  analysis: DreamAnalysis;
  videoTaskId: string | null;
  imageUrl: string | null;
  onBack: () => void;
  settings?: any;
  deviceId?: string;
  isSubscribed?: boolean;
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
    const existingIdx = dreams.findIndex(d => d.dreamText === dreamText);
    if (existingIdx >= 0) {
      if (imageUrl) dreams[existingIdx].imageUrl = imageUrl;
      if (videoUrl) dreams[existingIdx].videoUrl = videoUrl;
      localStorage.setItem('dreameeer_dreams', JSON.stringify(dreams));
      return;
    }
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

export default function AnalysisScreen({ dreamText, analysis, videoTaskId, imageUrl, onBack, settings, deviceId, isSubscribed }: Props) {
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const lang = settings?.language || 'ru';
  const isLight = settings?.theme === 'light';

  const tx = {
    ru: {
      back: '← Назад',
      saved: '✓ Сохранено в дневник',
      symbols: 'Символы сна',
      interpretation: 'Толкование',
      advice: 'Совет дня',
      emotion: 'Эмоциональный тон',
      image: 'Визуализация сна',
      dreamTextLabel: 'Текст сна',
    },
    en: {
      back: '← Back',
      saved: '✓ Saved to diary',
      symbols: 'Dream Symbols',
      interpretation: 'Interpretation',
      advice: 'Daily Tip',
      emotion: 'Emotional Tone',
      image: 'Dream Visualization',
      dreamTextLabel: 'Dream Text',
    },
  };
  const t = tx[lang as 'ru' | 'en'] || tx.ru;

  // Auto-save on mount
  useEffect(() => {
    saveToDiary(dreamText, analysis, imageUrl || undefined);
    setSaved(true);
  }, []);


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
        background: settings?.theme === 'light' ? 'rgba(255,252,248,0.9)' : 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 10,
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: settings?.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)',
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
          {t.back}
        </button>
        <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          {saved && t.saved}
        </div>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 1. Title card */}
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

        {/* 2. Dream visualization — живая анимация */}
        {imageUrl && (
          <div>
            <style>{`
              @keyframes dreamZoom {
                0%   { transform: scale(1.0) translate(0%, 0%); }
                30%  { transform: scale(1.07) translate(-1%, -0.8%); }
                60%  { transform: scale(1.1)  translate(0.8%, -1.2%); }
                100% { transform: scale(1.0) translate(0%, 0%); }
              }
              @keyframes dreamHaze {
                0%, 100% { opacity: 0; }
                40%, 60% { opacity: 1; }
              }
              @keyframes dreamGlowDark {
                0%, 100% { box-shadow: 0 0 24px rgba(139,92,246,0.15), 0 8px 40px rgba(0,0,0,0.4); }
                50%       { box-shadow: 0 0 80px rgba(139,92,246,0.55), 0 8px 60px rgba(109,40,217,0.25); }
              }
              @keyframes dreamGlowLight {
                0%, 100% { box-shadow: 0 0 24px rgba(251,146,60,0.15), 0 8px 32px rgba(0,0,0,0.1); }
                50%       { box-shadow: 0 0 80px rgba(251,146,60,0.5), 0 8px 60px rgba(251,146,60,0.2); }
              }
            `}</style>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{t.image}</h3>
            </div>

            {/* Контейнер с пульсирующим свечением */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              position: 'relative',
              animation: isLight ? 'dreamGlowLight 8s ease-in-out infinite' : 'dreamGlowDark 8s ease-in-out infinite',
            }}>
              {/* Основная картинка — Ken Burns */}
              <img
                src={imageUrl}
                alt="Dream visualization"
                style={{
                  width: '100%',
                  display: 'block',
                  animation: 'dreamZoom 12s ease-in-out infinite',
                  transformOrigin: 'center center',
                  willChange: 'transform',
                }}
              />

              {/* Размытая копия — эффект замутнения сна */}
              <img
                src={imageUrl}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(18px) saturate(1.6) brightness(1.1)',
                  animation: 'dreamHaze 8s ease-in-out infinite',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />

              {/* Цветовой туман */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isLight
                  ? 'linear-gradient(135deg, rgba(251,146,60,0.3) 0%, rgba(236,72,153,0.15) 50%, rgba(251,191,36,0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(59,130,246,0.15) 50%, rgba(236,72,153,0.2) 100%)',
                animation: 'dreamHaze 8s ease-in-out infinite',
                opacity: 0,
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        )}

        {/* 3. Dream text caption */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          borderLeft: '3px solid var(--purple)',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {t.dreamTextLabel}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{dreamText}"
          </p>
        </div>

        {/* 4. Symbols */}
        <div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
            {t.symbols}
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

        {/* 5. Interpretation */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>🔮</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{t.interpretation}</h3>
          </div>

          {/* Режим "Все сонники" — несколько блоков */}
          {analysis.interpretations && analysis.interpretations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {analysis.interpretations.map((item, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  borderLeft: '3px solid var(--purple)',
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '8px' }}>
                    {item.text}
                  </p>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: 'var(--purple)',
                    opacity: 0.8,
                  }}>
                    {item.source}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Одиночный режим — один текст + подпись */
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: analysis.interpretSource ? '10px' : '0' }}>
                {analysis.interpretation}
              </p>
              {analysis.interpretSource && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  color: 'var(--purple)',
                  opacity: 0.8,
                }}>
                  {analysis.interpretSource}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. Recommendation */}
        <div className="advice-card" style={{
          padding: '20px',
          background: 'rgba(251,191,36,0.07)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '20px',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <h3 className="advice-title" style={{ fontSize: '15px', fontWeight: '700', color: '#fde68a' }}>{t.advice}</h3>
          </div>
          <p className="advice-text" style={{ color: '#fbbf24', fontSize: '14px', lineHeight: 1.6 }}>
            {analysis.recommendation}
          </p>
        </div>

        {/* 7. Emotion */}
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'center',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
        }}>
          <span style={{ fontSize: '22px' }}>🎭</span>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '2px' }}>{t.emotion}</div>
            <div style={{ fontWeight: '600', color: 'var(--text)' }}>{analysis.emotionalTone}</div>
          </div>
        </div>


        <div style={{ paddingBottom: '100px' }} />
      </div>
    </div>
  );
}
