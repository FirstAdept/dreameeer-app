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
    { icon: '1', text: 'Нажми кнопку «Поделиться»', sub: 'значок □↑ внизу Safari' },
    { icon: '2', text: 'Прокрути список вниз', sub: 'до пункта «На экран «Домой»»' },
    { icon: '3', text: 'Нажми «Добавить»', sub: 'приложение появится на рабочем столе' },
  ];

  const androidSteps = [
    { icon: '1', text: 'Нажми ⋮ в Chrome', sub: 'три точки в правом верхнем углу' },
    { icon: '2', text: '«Добавить на гл. экран»', sub: 'или «Установить приложение»' },
    { icon: '3', text: 'Нажми «Добавить»', sub: 'приложение появится на рабочем столе' },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;
  const isDark = theme === 'dark';

  // ── Dark theme: frosted glass ──────────────────────────────
  const darkSheet: React.CSSProperties = {
    width: '100%',
    background: 'rgba(18, 10, 35, 0.55)',
    backdropFilter: 'blur(32px) saturate(180%)',
    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
    borderRadius: '28px 28px 0 0',
    padding: '28px 24px 48px',
    transform: visible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
    boxShadow: '0 -1px 0 rgba(255,255,255,0.08), 0 -20px 60px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderBottom: 'none',
  };

  const darkHandle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.18)',
  };

  const darkTitle: React.CSSProperties = { color: '#fff' };
  const darkSubtitle: React.CSSProperties = { color: 'rgba(255,255,255,0.45)' };

  const darkStep: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const darkStepNum: React.CSSProperties = {
    background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.9)',
  };

  const darkStepText: React.CSSProperties = { color: 'rgba(255,255,255,0.9)' };
  const darkStepSub: React.CSSProperties = { color: 'rgba(255,255,255,0.35)' };

  const darkTip: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const darkTipText: React.CSSProperties = { color: 'rgba(255,255,255,0.45)' };

  const darkBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.85)',
  };

  // ── Light theme: warm dawn ─────────────────────────────────
  const lightSheet: React.CSSProperties = {
    width: '100%',
    background: 'linear-gradient(180deg, #fffaf4 0%, #fff4e8 100%)',
    borderRadius: '28px 28px 0 0',
    padding: '28px 24px 48px',
    transform: visible ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
    boxShadow: '0 -4px 40px rgba(251, 146, 60, 0.15)',
    border: '1px solid rgba(251, 146, 60, 0.15)',
    borderBottom: 'none',
  };

  const lightHandle: React.CSSProperties = { background: 'rgba(0,0,0,0.12)' };
  const lightTitle: React.CSSProperties = { color: '#1a0a00' };
  const lightSubtitle: React.CSSProperties = { color: 'rgba(0,0,0,0.4)' };

  const lightStep: React.CSSProperties = {
    background: 'rgba(251,146,60,0.06)',
    border: '1px solid rgba(251,146,60,0.15)',
  };

  const lightStepNum: React.CSSProperties = {
    background: 'linear-gradient(135deg, #fb923c, #f59e0b)',
    color: '#fff',
  };

  const lightStepText: React.CSSProperties = { color: '#1a0a00' };
  const lightStepSub: React.CSSProperties = { color: 'rgba(0,0,0,0.38)' };

  const lightTip: React.CSSProperties = {
    background: 'rgba(251,146,60,0.07)',
    border: '1px solid rgba(251,146,60,0.15)',
  };

  const lightTipText: React.CSSProperties = { color: 'rgba(0,0,0,0.45)' };

  const lightBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #fb923c, #f59e0b)',
    border: 'none',
    color: '#fff',
  };

  const sheet     = isDark ? darkSheet     : lightSheet;
  const handle    = isDark ? darkHandle    : lightHandle;
  const titleSt   = isDark ? darkTitle     : lightTitle;
  const subtitleSt= isDark ? darkSubtitle  : lightSubtitle;
  const stepSt    = isDark ? darkStep      : lightStep;
  const stepNumSt = isDark ? darkStepNum   : lightStepNum;
  const stepTextSt= isDark ? darkStepText  : lightStepText;
  const stepSubSt = isDark ? darkStepSub   : lightStepSub;
  const tipSt     = isDark ? darkTip       : lightTip;
  const tipTextSt = isDark ? darkTipText   : lightTipText;
  const btnSt     = isDark ? darkBtn       : lightBtn;

  const overlayBg = isDark
    ? (visible ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0)')
    : (visible ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'flex-end',
      background: overlayBg,
      transition: 'background 0.35s ease',
      backdropFilter: visible ? 'blur(4px)' : 'none',
    }} onClick={handleClose}>
      <div onClick={e => e.stopPropagation()} style={sheet}>

        {/* Handle */}
        <div style={{
          width: '40px', height: '4px', borderRadius: '2px',
          margin: '0 auto 24px', ...handle,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '44px', marginBottom: '10px' }}>📲</div>
          <div style={{ fontSize: '21px', fontWeight: '800', marginBottom: '6px', ...titleSt }}>
            Добавь на экран домой
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.5, ...subtitleSt }}>
            {platform === 'ios'
              ? 'Открывай как приложение — без браузера'
              : 'Установи как приложение за секунду'}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '16px' }}>
          {steps.map(step => (
            <div key={step.icon} style={{
              display: 'flex', alignItems: 'center', gap: '13px',
              borderRadius: '16px', padding: '13px 15px', ...stepSt,
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '800', ...stepNumSt,
              }}>{step.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1px', ...stepTextSt }}>
                  {step.text}
                </div>
                <div style={{ fontSize: '12px', ...stepSubSt }}>
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* iOS hint */}
        {platform === 'ios' && (
          <div style={{
            borderRadius: '13px', padding: '11px 15px',
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '20px', ...tipSt,
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <span style={{ fontSize: '12px', lineHeight: 1.5, ...tipTextSt }}>
              Пункт «На экран "Домой"» — в середине списка,{' '}
              <strong style={isDark ? { color: 'rgba(255,255,255,0.75)' } : { color: '#92400e' }}>
                прокрути шторку вниз
              </strong>
            </span>
          </div>
        )}

        {/* Close button */}
        <button onClick={handleClose} style={{
          width: '100%', padding: '15px',
          borderRadius: '16px',
          fontSize: '15px', fontWeight: '700',
          cursor: 'pointer', ...btnSt,
        }}>
          Понятно, добавлю позже
        </button>
      </div>
    </div>
  );
}
