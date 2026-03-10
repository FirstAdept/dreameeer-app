'use client';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const [dreamCount, setDreamCount] = useState(0);

  useEffect(() => {
    try {
      const dreams = JSON.parse(localStorage.getItem('dreameeer_dreams') || '[]');
      setDreamCount(dreams.length);
    } catch {}
  }, []);

  return (
    <div className="screen" style={{ padding: '24px 20px', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
          boxShadow: '0 0 30px rgba(124,58,237,0.4)',
        }}>
          🌙
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Сновидец</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          {dreamCount} {dreamCount === 1 ? 'сон' : dreamCount < 5 ? 'сна' : 'снов'} записано
        </p>
      </div>

      {/* PRO card */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.15))',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '20px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          fontSize: '80px', opacity: 0.1,
        }}>⭐</div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--purple)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Dreameeer PRO
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>Разблокируй всё</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#000',
            }}>
              PRO
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {['🎬 Неограниченные видео', '📖 Безлимитный дневник', '🔮 Глубокий анализ'].map(f => (
              <div key={f} style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{f}</div>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
            Попробовать PRO — 299₽/мес
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="card" style={{ padding: '6px 0', marginBottom: '20px' }}>
        {[
          { icon: '🔔', label: 'Уведомления' },
          { icon: '🌙', label: 'Напоминание о дневнике' },
          { icon: '🔒', label: 'Конфиденциальность' },
          { icon: '💬', label: 'Отзыв и поддержка' },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px',
              cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '15px', color: 'var(--text)', flex: 1 }}>{item.label}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '18px' }}>›</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>
        Dreameeer v1.0 · Made with 🌙
      </div>
    </div>
  );
}
