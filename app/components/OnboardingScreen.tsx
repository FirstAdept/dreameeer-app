'use client';
import { useState } from 'react';

interface Props {
  onDone: () => void;
}

const slides = [
  {
    emoji: '🌙',
    title: 'Добро пожаловать\nв Dreameeer',
    subtitle: 'Твой личный толкователь снов,\nсозданный с помощью ИИ',
    color: 'rgba(124, 58, 237, 0.3)',
  },
  {
    emoji: '🎙️',
    title: 'Расскажи\nсвой сон',
    subtitle: 'Говори или пиши — мы поймём\nкаждую деталь твоего сна',
    color: 'rgba(236, 72, 153, 0.3)',
  },
  {
    emoji: '✨',
    title: 'Раскрой\nскрытый смысл',
    subtitle: 'Символы, толкования и\nсюрреалистичная визуализация',
    color: 'rgba(96, 165, 250, 0.3)',
  },
];

export default function OnboardingScreen({ onDone }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    if (current < slides.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => c + 1);
        setAnimating(false);
      }, 200);
    } else {
      localStorage.setItem('dreameeer_onboarded', '1');
      onDone();
    }
  };

  const slide = slides[current];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 28px 50px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: slide.color,
        filter: 'blur(100px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 3 === 0 ? '3px' : '2px',
            height: i % 3 === 0 ? '3px' : '2px',
            borderRadius: '50%',
            background: 'white',
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      {/* Skip */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
        {current < slides.length - 1 && (
          <button
            onClick={() => { localStorage.setItem('dreameeer_onboarded', '1'); onDone(); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            Пропустить
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        position: 'relative',
        zIndex: 1,
        opacity: animating ? 0 : 1,
        transform: animating ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease',
      }}>
        {/* Emoji */}
        <div style={{
          fontSize: '100px',
          lineHeight: 1,
          animation: 'float 4s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(167, 139, 250, 0.4))',
        }}>
          {slide.emoji}
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', gap: '14px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
          }} className="gradient-text">
            {slide.title}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}>
            {slide.subtitle}
          </p>
        </div>

        {/* Features for slide 1 */}
        {current === 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            {['🔮 Символы', '🧠 Психология', '🎬 Видео'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(167, 139, 250, 0.1)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                borderRadius: '100px',
                padding: '7px 16px',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`onboarding-dot ${i === current ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          className="btn-primary"
          onClick={next}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '17px',
          }}
        >
          {current < slides.length - 1 ? 'Далее →' : '🌙 Начать'}
        </button>
      </div>
    </div>
  );
}
