'use client';
import type { CSSProperties } from 'react';
import type { AppSettings } from '../page';

interface Props {
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
}

const t = {
  ru: {
    title: 'Настройки',
    theme: 'Тема оформления',
    dark: 'Тёмная',
    darkDesc: 'Глубокий космос',
    light: 'Светлая',
    lightDesc: 'Мягкий рассвет',
    language: 'Язык',
    interpretMode: 'Стиль толкования',
    modes: {
      default: { label: 'Классический', desc: 'Юнг · Фрейд · Ванга · Миллер' },
      miller: { label: 'Соннник Миллера', desc: 'Практические предсказания событий' },
      freud: { label: 'Метод Фрейда', desc: 'Подсознание, желания, символы либидо' },
      loff: { label: 'Метод Лоффа', desc: 'Личностный рост и самопознание' },
    },
    pro: 'Подписка',
    proTitle: 'Dreameeer PRO',
    proSubtitle: 'Полный доступ ко всем возможностям',
    trialBadge: '1 день бесплатно',
    price: '499 ₽',
    pricePeriod: '/ месяц',
    proFeatures: [
      '30 видео-анимаций в месяц',
      'Неограниченный анализ снов',
      'Все стили толкования',
      'Дневник без ограничений',
      'Приоритетная генерация',
    ],
    ctaTrial: 'Попробовать бесплатно',
    ctaSub: 'Подписаться',
    currentPlan: 'Текущий план',
    freePlan: 'Бесплатный',
    freePlanDesc: '3 видео в месяц',
    comingSoon: 'Скоро',
    version: 'Dreameeer v1.0 · AI Dream Interpreter',
  },
  en: {
    title: 'Settings',
    theme: 'Appearance',
    dark: 'Dark',
    darkDesc: 'Deep cosmos',
    light: 'Light',
    lightDesc: 'Soft dawn',
    language: 'Language',
    interpretMode: 'Interpretation Style',
    modes: {
      default: { label: 'Classic', desc: 'Jung · Freud · Vanga · Miller' },
      miller: { label: "Miller's Dream Book", desc: 'Practical life predictions' },
      freud: { label: "Freud's Method", desc: 'Subconscious desires & symbols' },
      loff: { label: "Loff's Method", desc: 'Personal growth & self-discovery' },
    },
    pro: 'Subscription',
    proTitle: 'Dreameeer PRO',
    proSubtitle: 'Full access to all features',
    trialBadge: '1 day free',
    price: '499 ₽',
    pricePeriod: '/ month',
    proFeatures: [
      '30 video animations per month',
      'Unlimited dream analysis',
      'All interpretation styles',
      'Unlimited dream diary',
      'Priority generation',
    ],
    ctaTrial: 'Try for free',
    ctaSub: 'Subscribe',
    currentPlan: 'Current plan',
    freePlan: 'Free',
    freePlanDesc: '3 videos per month',
    comingSoon: 'Coming soon',
    version: 'Dreameeer v1.0 · AI Dream Interpreter',
  },
};

export default function SettingsScreen({ settings, onSettingsChange }: Props) {
  const lang = settings.language;
  const tx = t[lang];

  const set = (patch: Partial<AppSettings>) =>
    onSettingsChange({ ...settings, ...patch });

  const sectionStyle: CSSProperties = {
    marginBottom: '24px',
  };

  const labelStyle: CSSProperties = {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    marginBottom: '10px',
    paddingLeft: '4px',
  };

  const rowStyle: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  const itemStyle = (active: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: active ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
    borderLeft: active ? '3px solid var(--purple)' : '3px solid transparent',
  });

  const dividerStyle: CSSProperties = {
    height: '1px',
    background: 'var(--border-subtle)',
    margin: '0 18px',
  };

  const radioCircle = (active: boolean) => (
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%',
      border: `2px solid ${active ? 'var(--purple)' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s ease',
    }}>
      {active && (
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: 'var(--purple)',
        }} />
      )}
    </div>
  );

  return (
    <div className="screen" style={{ padding: '0 20px', paddingTop: '60px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }} className="gradient-text">
          {tx.title}
        </h1>
      </div>

      {/* Theme */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.theme}</p>
        <div style={rowStyle}>
          {/* Dark */}
          <div style={itemStyle(settings.theme === 'dark')} onClick={() => set({ theme: 'dark' })}>
            <span style={{ fontSize: '22px' }}>🌑</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>{tx.dark}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.darkDesc}</div>
            </div>
            {radioCircle(settings.theme === 'dark')}
          </div>
          <div style={dividerStyle} />
          {/* Light */}
          <div style={itemStyle(settings.theme === 'light')} onClick={() => set({ theme: 'light' })}>
            <span style={{ fontSize: '22px' }}>☀️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>{tx.light}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.lightDesc}</div>
            </div>
            {radioCircle(settings.theme === 'light')}
          </div>
        </div>
      </div>

      {/* Language */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.language}</p>
        <div style={rowStyle}>
          <div style={itemStyle(settings.language === 'ru')} onClick={() => set({ language: 'ru' })}>
            <span style={{ fontSize: '22px' }}>🇷🇺</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>Русский</div>
            </div>
            {radioCircle(settings.language === 'ru')}
          </div>
          <div style={dividerStyle} />
          <div style={itemStyle(settings.language === 'en')} onClick={() => set({ language: 'en' })}>
            <span style={{ fontSize: '22px' }}>🇬🇧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>English</div>
            </div>
            {radioCircle(settings.language === 'en')}
          </div>
        </div>
      </div>

      {/* Interpretation mode */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.interpretMode}</p>
        <div style={rowStyle}>
          {(['default', 'miller', 'freud', 'loff'] as const).map((mode, i) => (
            <div key={mode}>
              {i > 0 && <div style={dividerStyle} />}
              <div style={itemStyle(settings.interpretMode === mode)} onClick={() => set({ interpretMode: mode })}>
                <span style={{ fontSize: '22px' }}>
                  {mode === 'default' ? '🔮' : mode === 'miller' ? '📖' : mode === 'freud' ? '🧠' : '🌱'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>
                    {tx.modes[mode].label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {tx.modes[mode].desc}
                  </div>
                </div>
                {radioCircle(settings.interpretMode === mode)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRO Subscription */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.pro}</p>

        {/* Current plan badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.currentPlan}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{tx.freePlan}</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.freePlanDesc}</span>
        </div>

        {/* PRO card */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.14) 50%, rgba(236,72,153,0.12) 100%)',
          border: '1px solid rgba(168,85,247,0.4)',
          padding: '24px',
        }}>
          {/* Shimmer top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899, #a855f7, #7c3aed)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px' }}>💎</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text)' }}>{tx.proTitle}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{tx.proSubtitle}</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              borderRadius: '100px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'white',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {tx.trialBadge}
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-1px' }}>
              {tx.price}
            </span>
            <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>{tx.pricePeriod}</span>
          </div>

          {/* Features list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {tx.proFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{feat}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Trial button */}
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px', position: 'relative' }}
              onClick={() => alert('Coming soon!')}
            >
              ✨ {tx.ctaTrial}
            </button>
            {/* Subscribe button */}
            <button
              onClick={() => alert('Coming soon!')}
              style={{
                width: '100%', padding: '14px', fontSize: '14px', fontWeight: '600',
                background: 'transparent',
                border: '1px solid rgba(168,85,247,0.4)',
                borderRadius: '14px', color: 'var(--purple)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {tx.ctaSub}
            </button>
          </div>

          {/* Coming soon label */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)', marginTop: '12px', letterSpacing: '0.5px' }}>
            {tx.comingSoon} · In-App Purchase
          </p>
        </div>
      </div>

      {/* App version */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
        {tx.version}
      </p>
    </div>
  );
}
