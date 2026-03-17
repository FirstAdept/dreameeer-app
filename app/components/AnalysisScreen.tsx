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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'polling' | 'done' | 'failed'>(
    videoTaskId ? 'polling' : 'idle'
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(videoTaskId);
  const [creating, setCreating] = useState(false);
  const [videoLimitError, setVideoLimitError] = useState<string | null>(null);
  const [boomerang, setBoomerang] = useState(false);
  const [boomerangUrl, setBoomerangUrl] = useState<string | null>(null);
  const [boomerangLoading, setBoomerangLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const lang = settings?.language || 'ru';

  const tx = {
    ru: {
      back: '← Назад',
      saved: '✓ Сохранено в дневник',
      symbols: 'Символы сна',
      interpretation: 'Толкование',
      advice: 'Совет дня',
      emotion: 'Эмоциональный тон',
      image: 'Визуализация сна',
      video: 'Видео-анимация',
      dreamTextLabel: 'Текст сна',
      generating: 'Генерируем анимацию...',
      generatingTime: 'Обычно 2–4 минуты',
      videoFailed: '⚠️ Видео не удалось сгенерировать',
      videoUnavailable: '🎬 Видео недоступно',
      createVideo: '🎬 Создать видео',
      createVideoSub: 'Анимация сна · ~3 мин',
      boomerang: '🔁 Boomerang',
      boomerangSub: 'Анимация туда-обратно',
      boomerangLoading: 'Создаём loop...',
    },
    en: {
      back: '← Back',
      saved: '✓ Saved to diary',
      symbols: 'Dream Symbols',
      interpretation: 'Interpretation',
      advice: 'Daily Tip',
      emotion: 'Emotional Tone',
      image: 'Dream Visualization',
      video: 'Video Animation',
      dreamTextLabel: 'Dream Text',
      generating: 'Generating animation...',
      generatingTime: 'Usually 2–4 minutes',
      videoFailed: '⚠️ Video generation failed',
      videoUnavailable: '🎬 Video unavailable',
      createVideo: '🎬 Create Video',
      createVideoSub: 'Dream animation · ~3 min',
      boomerang: '🔁 Boomerang',
      boomerangSub: 'Forward-backward loop',
      boomerangLoading: 'Creating loop...',
    },
  };
  const t = tx[lang as 'ru' | 'en'] || tx.ru;

  // Auto-save on mount
  useEffect(() => {
    saveToDiary(dreamText, analysis, imageUrl || undefined);
    setSaved(true);
  }, []);

  const handleCreateVideo = async () => {
    if (creating) return;
    setCreating(true);
    setVideoStatus('polling');
    try {
      const res = await fetch(`${BACKEND_URL}/api/dream/video/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoPrompt: analysis.videoPrompt || '',
          imageUrl: imageUrl || null,   // ← передаём уже готовую картинку
          theme: settings?.theme || 'dark',
          mood: analysis.mood || '',
          deviceId: deviceId || '',
        }),
      });
      const data = await res.json();
      if (res.status === 429 || data.error === 'video_limit_reached') {
        setVideoStatus('idle');
        setVideoLimitError(lang === 'ru'
          ? `Лимит видео на этот месяц исчерпан (30/мес). Обновится 1-го числа.`
          : `Monthly video limit reached (30/month). Resets on the 1st.`
        );
      } else if (data.taskId) {
        setVideoLimitError(null);
        setActiveTaskId(data.taskId);
      } else {
        setVideoStatus('failed');
      }
    } catch {
      setVideoStatus('failed');
    } finally {
      setCreating(false);
    }
  };

  // Poll video status + background save via localStorage
  useEffect(() => {
    if (!activeTaskId) return;
    // Сохраняем taskId чтобы можно было восстановить если закрыли приложение
    localStorage.setItem('dreameeer_pending_video', JSON.stringify({
      taskId: activeTaskId,
      dreamText,
      imageUrl: imageUrl || null,
      analysis,
      savedAt: Date.now(),
    }));

    let attempts = 0;
    const max = 75;

    const poll = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/dream/video/${activeTaskId}`);
        const data = await res.json();

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setVideoStatus('done');
          saveToDiary(dreamText, analysis, imageUrl || undefined, data.videoUrl);
          localStorage.removeItem('dreameeer_pending_video');
          return;
        }
        if (data.status === 'failed') {
          setVideoStatus('failed');
          localStorage.removeItem('dreameeer_pending_video');
          return;
        }
      } catch {}

      attempts++;
      if (attempts < max) {
        setTimeout(poll, 8000);
      } else {
        setVideoStatus('failed');
        localStorage.removeItem('dreameeer_pending_video');
      }
    };

    const timer = setTimeout(poll, 5000);
    return () => clearTimeout(timer);
  }, [activeTaskId]);

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

        {/* 2. Dream visualization image */}
        {imageUrl && (
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{t.image}</h3>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src={imageUrl}
                alt="Dream visualization"
                style={{ width: '100%', display: 'block' }}
              />
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

        {/* 8. Video section */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>🎬</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{t.video}</h3>
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
                {t.generating}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                {t.generatingTime}
              </div>
            </div>
          )}

          {videoStatus === 'done' && videoUrl && (
            <div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <video
                  src={boomerangUrl || videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              {/* Boomerang button */}
              {!boomerangUrl && (
                <button
                  onClick={async () => {
                    setBoomerangLoading(true);
                    try {
                      const r = await fetch(`${BACKEND_URL}/api/dream/video/boomerang`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ videoUrl }),
                      });
                      const d = await r.json();
                      if (d.videoDataUrl) setBoomerangUrl(d.videoDataUrl);
                    } catch {}
                    setBoomerangLoading(false);
                  }}
                  disabled={boomerangLoading}
                  style={{
                    marginTop: '8px', width: '100%', padding: '12px',
                    borderRadius: '14px', cursor: boomerangLoading ? 'not-allowed' : 'pointer',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-dim)', fontSize: '13px', fontWeight: '600',
                  }}
                >
                  {boomerangLoading ? t.boomerangLoading : t.boomerang}
                  {!boomerangLoading && <span style={{ fontSize: '11px', display: 'block', opacity: 0.6 }}>{t.boomerangSub}</span>}
                </button>
              )}
            </div>
          )}

          {videoStatus === 'failed' && (
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.2)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                {t.videoFailed}
              </div>
            </div>
          )}

          {videoLimitError && (
            <div style={{ textAlign: 'center', color: 'rgba(239,68,68,0.85)', fontSize: '13px', padding: '8px 0 4px' }}>
              {videoLimitError}
            </div>
          )}

          {videoStatus === 'idle' && !activeTaskId && (
            <button
              onClick={handleCreateVideo}
              disabled={creating || (!analysis.videoPrompt && !imageUrl) || !!videoLimitError}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '18px',
                background: creating
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(168,85,247,0.15))',
                border: creating
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(139,92,246,0.4)',
                color: creating ? 'var(--text-dim)' : 'var(--text)',
                cursor: creating ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: '700' }}>
                {creating ? '...' : t.createVideo}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                {t.createVideoSub}
              </span>
            </button>
          )}
        </div>

        <div style={{ paddingBottom: '100px' }} />
      </div>
    </div>
  );
}
