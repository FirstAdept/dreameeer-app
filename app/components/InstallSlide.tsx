'use client';
import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

export default function InstallSlide({ onClose }: Props) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('dreameeer_install_shown', '1');
    setTimeout(onClose, 350);
  };

  const iosSteps = [
    { icon: '1', text: 'Нажми кнопку «Поделиться»', sub: '(значок □↑ внизу Safari)' },
    { icon: '2', text: 'Прокрути список вниз', sub: 'до пункта «На экран «Домой»»' },
    { icon: '3', text: 'Нажми «Добавить»', sub: 'и приложение появится на рабочем столе' },
  ];

  const androidSteps = [
    { icon: '1', text: 'Нажми ⋮ в правом углу Chrome', sub: '(три точки вверху)' },
    { icon: '2', text: 'Выбери «Добавить на гл. экран»', sub: 'или «Установить приложение»' },
    { icon: '3', text: 'Нажми «Добавить»', sub: 'и приложение появится на рабочем столе' },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'flex-end',
      background: visible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
      transition: 'background 0.35s ease',
      backdropFilter: visible ? 'blur(4px)' : 'none',
    }} onClick={handleClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'linear-gradient(180deg, #0f0520 0%, #1a0535 100%)',
          borderRadius: '28px 28px 0 0',
          padding: '28px 24px 48px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: '0 -4px 60px rgba(124, 58, 237, 0.3)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderBottom: 'none',
        }}
      >
        {/* Handle */}
        <div style={{
          width: '40px', height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.2)', margin: '0 auto 24px',
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📲</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
            Добавь на экран домой
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            {platform === 'ios'
              ? 'Открой как приложение — без браузера'
              : 'Установи как приложение за секунду'}
          </div>
        </div>

        {/* Platform badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(167, 139, 250, 0.1)',
          border: '1px solid rgba(167, 139, 250, 0.25)',
          borderRadius: '100px', padding: '5px 14px',
          fontSize: '12px', color: '#a78bfa', fontWeight: '600',
          marginBottom: '20px',
        }}>
          {platform === 'ios' ? '🍎 iPhone / iPad' : '🤖 Android'}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {steps.map(step => (
            <div key={step.icon} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '14px 16px',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: '800', color: 'white',
              }}>{step.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                  {step.text}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* iOS visual hint */}
        {platform === 'ios' && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '22px' }}>💡</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Пункт «На экран "Домой"» находится в середине списка — <strong style={{ color: 'rgba(255,255,255,0.7)' }}>прокрути шторку вниз</strong>
            </span>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            border: 'none', borderRadius: '16px',
            fontSize: '16px', fontWeight: '700', color: 'white',
            cursor: 'pointer',
          }}
        >
          Понятно, добавлю позже
        </button>
      </div>
    </div>
  );
}
