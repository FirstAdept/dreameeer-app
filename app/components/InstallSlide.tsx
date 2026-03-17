'use client';
import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export default function InstallSlide({ onClose, theme = 'dark' }: Props) {
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
    { n: '1', icon: '□↑', text: 'Нажми «Поделиться»', sub: 'кнопка внизу Safari' },
    { n: '2', icon: '⊞',  text: 'Прокрути и найди «На экран Домой»', sub: 'в середине списка' },
    { n: '3', icon: '✓',  text: 'Нажми «Добавить»', sub: '' },
  ];

  const androidSteps = [
    { n: '1', icon: '⋮',  text: 'Нажми ⋮ в Chrome', sub: 'правый верхний угол' },
    { n: '2', icon: '⊞',  text: '«Добавить на гл. экран»', sub: 'или «Установить приложение»' },
    { n: '3', icon: '✓',  text: 'Подтверди «Добавить»', sub: '' },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;
  const isDark = theme === 'dark';

  const glassSheet: React.CSSProperties = {
    width: '100%',
    background: isDark
      ? 'rgba(12, 8, 24, 0.72)'
      : 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    borderRadius: '28px 28px 0 0',
    padding: '20px 20px 40px',
    transform: visible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
    border: isDark
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.08)',
    borderBottom: 'none',
    boxShadow: isDark
      ? '0 -20px 60px rgba(0,0,0,0.6)'
      : '0 -20px 60px rgba(0,0,0,0.12)',
  };

  const c = {
    handle:   isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    title:    isDark ? '#fff' : '#111',
    sub:      isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    stepBg:   isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    stepBdr:  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    numBg:    isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    numText:  isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
    text:     isDark ? 'rgba(255,255,255,0.88)' : '#111',
    textSub:  isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.35)',
    btnBg:    isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
    btnBdr:   isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    btnText:  isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)',
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'flex-end',
        background: visible
          ? (isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)')
          : 'rgba(0,0,0,0)',
        transition: 'background 0.35s ease',
        backdropFilter: visible ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: visible ? 'blur(6px)' : 'none',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={glassSheet}>

        {/* Handle */}
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          margin: '0 auto 20px',
          background: c.handle,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📲</div>
          <div style={{ fontSize: '19px', fontWeight: '700', color: c.title, marginBottom: '4px' }}>
            Добавь на экран домой
          </div>
          <div style={{ fontSize: '13px', color: c.sub }}>
            {platform === 'ios' ? 'Открывай как приложение без браузера' : 'Установи приложение за секунду'}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {steps.map(step => (
            <div
              key={step.n}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                borderRadius: '14px', padding: '12px 14px',
                background: c.stepBg,
                border: `1px solid ${c.stepBdr}`,
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '800',
                background: c.numBg, color: c.numText,
              }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: c.text }}>
                  {step.text}
                </div>
                {step.sub && (
                  <div style={{ fontSize: '11px', color: c.textSub, marginTop: '1px' }}>
                    {step.sub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            width: '100%', padding: '14px',
            borderRadius: '14px',
            fontSize: '14px', fontWeight: '600',
            cursor: 'pointer',
            background: c.btnBg,
            border: `1px solid ${c.btnBdr}`,
            color: c.btnText,
          }}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
