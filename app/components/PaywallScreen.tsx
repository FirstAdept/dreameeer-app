'use client';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dreameeer-backend-production.up.railway.app';

interface PaywallScreenProps {
  settings?: { theme?: string; language?: string };
  deviceId: string;
  onClose?: () => void;
}

export default function PaywallScreen({ settings, deviceId, onClose }: PaywallScreenProps) {
  const lang = settings?.language || 'ru';
  const isDark = settings?.theme !== 'light';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tx = {
    ru: {
      badge: 'Бесплатный лимит исчерпан',
      title: 'Продолжить путешествие\nв мир снов',
      subtitle: 'Вы использовали 3 бесплатных толкования',
      price: '499 ₽',
      period: 'в месяц',
      btn: 'Оформить подписку',
      loading: 'Создаём платёж...',
      emailPlaceholder: 'Email для чека (необязательно)',
      features: [
        { emoji: '🌙', text: 'Безлимитные толкования снов' },
        { emoji: '🎬', text: 'Видео-визуализации каждого сна' },
        { emoji: '🎨', text: 'AI-изображения к снам' },
        { emoji: '📖', text: 'Личный дневник снов' },
        { emoji: '✨', text: 'Все режимы интерпретации' },
      ],
      restore: 'Уже подписан? Восстановить',
      skip: 'Пропустить',
    },
    en: {
      badge: 'Free limit reached',
      title: 'Continue your journey\ninto the world of dreams',
      subtitle: 'You have used 3 free interpretations',
      price: '499 ₽',
      period: 'per month',
      btn: 'Subscribe Now',
      loading: 'Creating payment...',
      emailPlaceholder: 'Email for receipt (optional)',
      features: [
        { emoji: '🌙', text: 'Unlimited dream interpretations' },
        { emoji: '🎬', text: 'Video visualizations for each dream' },
        { emoji: '🎨', text: 'AI images for your dreams' },
        { emoji: '📖', text: 'Personal dream diary' },
        { emoji: '✨', text: 'All interpretation modes' },
      ],
      restore: 'Already subscribed? Restore',
      skip: 'Skip',
    },
  };
  const t = tx[lang] || tx.ru;

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Ошибка создания платежа');
      }
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: isDark
        ? 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1628 100%)'
        : 'linear-gradient(135deg, #f0f0ff 0%, #e8e0ff 50%, #f0f4ff 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%',
        borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-20%', width: '60%', height: '60%',
        borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Skip button */}
        {onClose && (
          <button onClick={onClose} style={{
            position: 'absolute', top: '-10px', right: '0',
            background: 'none', border: 'none', cursor: 'pointer',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
            fontSize: '14px', padding: '8px',
          }}>
            {t.skip} ✕
          </button>
        )}

        {/* Moon icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto',
            background: isDark
              ? 'radial-gradient(circle at 35% 35%, #7c3aed, #1e0a3c)'
              : 'radial-gradient(circle at 35% 35%, #8b5cf6, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '38px',
            boxShadow: isDark
              ? '0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.2)'
              : '0 0 20px rgba(124,58,237,0.3)',
          }}>
            🌙
          </div>
        </div>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
            color: isDark ? '#f87171' : '#dc2626',
            border: `1px solid ${isDark ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            {t.badge}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: '700',
          lineHeight: '1.3',
          marginBottom: '8px',
          color: isDark ? '#ffffff' : '#1a0a3c',
          whiteSpace: 'pre-line',
        }}>
          {t.title}
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
          marginBottom: '28px',
        }}>
          {t.subtitle}
        </p>

        {/* Features */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.15)'}`,
          padding: '20px',
          marginBottom: '20px',
        }}>
          {t.features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '8px 0',
              borderBottom: i < t.features.length - 1
                ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                : 'none',
            }}>
              <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{f.emoji}</span>
              <span style={{
                fontSize: '14px',
                color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
              }}>
                {f.text}
              </span>
              <span style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '16px' }}>✓</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            fontSize: '40px', fontWeight: '800',
            color: isDark ? '#ffffff' : '#1a0a3c',
          }}>
            {t.price}
          </span>
          <span style={{
            fontSize: '16px',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            marginLeft: '6px',
          }}>
            {t.period}
          </span>
        </div>

        {/* Email input */}
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '14px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.2)'}`,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
            color: isDark ? '#fff' : '#1a0a3c',
            fontSize: '15px',
            marginBottom: '12px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Error */}
        {error && (
          <p style={{
            textAlign: 'center', fontSize: '13px', color: '#f87171',
            marginBottom: '10px',
          }}>
            {error}
          </p>
        )}

        {/* Subscribe button */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? (isDark ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.3)')
              : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#fff',
            fontSize: '17px',
            fontWeight: '700',
            letterSpacing: '0.3px',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
            transition: 'all 0.2s ease',
            marginBottom: '14px',
          }}
        >
          {loading ? t.loading : t.btn}
        </button>

        {/* Restore */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={async () => {
              if (!deviceId) return;
              try {
                const res = await fetch(`${API_BASE}/api/user/init`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ deviceId }),
                });
                const data = await res.json();
                if (data.subscription?.status === 'active') {
                  window.location.reload();
                } else {
                  setError(lang === 'ru' ? 'Активная подписка не найдена' : 'No active subscription found');
                }
              } catch {
                setError(lang === 'ru' ? 'Ошибка проверки подписки' : 'Subscription check failed');
              }
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              fontSize: '13px', textDecoration: 'underline',
            }}
          >
            {t.restore}
          </button>
        </div>

        {/* Legal */}
        <p style={{
          textAlign: 'center', fontSize: '11px', marginTop: '16px',
          color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          lineHeight: '1.5',
        }}>
          {lang === 'ru'
            ? 'Оплата через ЮKassa. Автопродление каждые 30 дней.\nОтменить можно в любой момент.'
            : 'Payment via YooKassa. Auto-renews every 30 days.\nCancel anytime.'}
        </p>
      </div>
    </div>
  );
}
