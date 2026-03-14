'use client';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { AppSettings } from '../page';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dreameeer-backend-production.up.railway.app';

interface Props {
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
  deviceId?: string;
  isSubscribed?: boolean;
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
    trialBadge: '1 сон бесплатно',
    price: '499 ₽',
    pricePeriod: '/ месяц',
    proFeatures: [
      '30 видео-анимаций в месяц',
      'Неограниченный анализ снов',
      'Все стили толкования',
      'Дневник без ограничений',
      'Приоритетная генерация',
    ],
    ctaTrial: 'Купить месяц снов',
    ctaSub: 'Подписаться',
    currentPlan: 'Текущий план',
    freePlan: 'Бесплатный',
    freePlanDesc: '1 сон бесплатно',
    payingText: 'Создаём платёж...',
    payError: 'Ошибка создания платежа',
    noConnection: 'Нет соединения с сервером',
    restoreBtn: 'Восстановить подписку',
    restoring: 'Проверяем...',
    restoreOk: 'Подписка активирована! Перезагрузите страницу.',
    restoreNone: 'Оплаченный платёж не найден',
    proPlan: 'PRO',
    proPlanDesc: 'Активна',
    proActive: '✅ У вас активная PRO подписка',
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
    trialBadge: '1 dream free',
    price: '499 ₽',
    pricePeriod: '/ month',
    proFeatures: [
      '30 video animations per month',
      'Unlimited dream analysis',
      'All interpretation styles',
      'Unlimited dream diary',
      'Priority generation',
    ],
    ctaTrial: 'Buy a Month of Dreams',
    ctaSub: 'Subscribe',
    currentPlan: 'Current plan',
    freePlan: 'Free',
    freePlanDesc: '1 dream free',
    payingText: 'Creating payment...',
    payError: 'Failed to create payment',
    noConnection: 'No connection to server',
    restoreBtn: 'Restore subscription',
    restoring: 'Checking...',
    restoreOk: 'Subscription activated! Reload the page.',
    restoreNone: 'No paid payment found',
    proPlan: 'PRO',
    proPlanDesc: 'Active',
    proActive: '✅ You have an active PRO subscription',
    version: 'Dreameeer v1.0 · AI Dream Interpreter',
  },
};

export default function SettingsScreen({ settings, onSettingsChange, deviceId, isSubscribed }: Props) {
  const lang = settings.language;
  const tx = t[lang];
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState('');

  const set = (patch: Partial<AppSettings>) =>
    onSettingsChange({ ...settings, ...patch });

  const handleBuy = async () => {
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch(`${API_BASE}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: deviceId || '' }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        if (data.paymentId) localStorage.setItem('dreameeer_pending_payment', data.paymentId);
        window.location.href = data.redirectUrl;
      } else {
        setPayError(data.error || tx.payError);
      }
    } catch {
      setPayError(tx.noConnection);
    } finally {
      setPaying(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    setRestoreMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/subscription/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: deviceId || '' }),
      });
      const data = await res.json();
      if (data.activated) {
        setRestoreMsg(tx.restoreOk);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setRestoreMsg(tx.restoreNone);
      }
    } catch {
      setRestoreMsg(tx.noConnection);
    } finally {
      setRestoring(false);
    }
  };

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
          background: isSubscribed ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
          border: isSubscribed ? '1px solid rgba(168,85,247,0.5)' : '1px solid var(--border-subtle)',
          borderRadius: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>{isSubscribed ? '💎' : '📋'}</span>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.currentPlan}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: isSubscribed ? '#a855f7' : 'var(--text)' }}>
                {isSubscribed ? tx.proPlan : tx.freePlan}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: isSubscribed ? '#4ade80' : 'var(--text-dim)' }}>
            {isSubscribed ? tx.proPlanDesc : tx.freePlanDesc}
          </span>
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

          {/* CTA — если уже подписан, показываем статус; иначе — кнопку покупки */}
          {isSubscribed ? (
            <div style={{
              textAlign: 'center', padding: '14px',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: '14px',
              fontSize: '15px', fontWeight: '600', color: '#4ade80',
            }}>
              {tx.proActive}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary"
                style={{
                  width: '100%', padding: '16px', fontSize: '16px', borderRadius: '14px',
                  position: 'relative', opacity: paying ? 0.7 : 1,
                  cursor: paying ? 'not-allowed' : 'pointer',
                }}
                onClick={handleBuy}
                disabled={paying}
              >
                {paying ? tx.payingText : `✨ ${tx.ctaTrial}`}
              </button>
              {payError && (
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#f87171', margin: '4px 0 0' }}>
                  {payError}
                </p>
              )}
              <button
                onClick={handleRestore}
                disabled={restoring}
                style={{
                  width: '100%', padding: '12px', fontSize: '13px', fontWeight: '500',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-dim)', cursor: restoring ? 'not-allowed' : 'pointer',
                  opacity: restoring ? 0.6 : 1,
                }}
              >
                {restoring ? tx.restoring : tx.restoreBtn}
              </button>
              {restoreMsg && (
                <p style={{
                  textAlign: 'center', fontSize: '13px', margin: '0',
                  color: restoreMsg === tx.restoreOk ? '#4ade80' : '#f87171',
                }}>
                  {restoreMsg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* App version */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
        {tx.version}
      </p>
    </div>
  );
}
