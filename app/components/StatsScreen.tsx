'use client';
import { useEffect, useState } from 'react';
import type { DreamRecord } from '../page';

export default function StatsScreen() {
  const [dreams, setDreams] = useState<DreamRecord[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dreameeer_dreams') || '[]');
      setDreams(stored);
    } catch {}
  }, []);

  const total = dreams.length;
  const avgScore = total > 0
    ? Math.round(dreams.reduce((acc, d) => acc + (d.analysis.lucidityScore || 0), 0) / total * 10) / 10
    : 0;

  const moodCounts: Record<string, number> = {};
  dreams.forEach(d => {
    const m = d.analysis.mood || 'другой';
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  const moodEmoji: Record<string, string> = {
    'загадочный': '🔮',
    'мечтательный': '💫',
    'тревожный': '⚡',
    'трансформирующий': '🌀',
    'вдохновляющий': '✨',
  };

  const moodColors: Record<string, string> = {
    'загадочный': '#a78bfa',
    'мечтательный': '#60a5fa',
    'тревожный': '#fb923c',
    'трансформирующий': '#34d399',
    'вдохновляющий': '#fbbf24',
  };

  return (
    <div className="screen" style={{ padding: '24px 20px', paddingTop: '60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }} className="gradient-text">
          Статистика
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
          Твои паттерны сновидений
        </p>
      </div>

      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>📊</div>
          <p style={{ color: 'var(--text-muted)' }}>Расшифруй хотя бы один сон<br />для статистики</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Всего снов', value: total, icon: '🌙', color: '#a78bfa' },
              { label: 'Средний балл', value: `${avgScore}/10`, icon: '🔆', color: '#fbbf24' },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Top mood */}
          {topMood && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                Частые настроения
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(moodCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([mood, count]) => (
                    <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px', width: '24px' }}>{moodEmoji[mood] || '😶'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{mood}</span>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{count}</span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }}>
                          <div style={{
                            height: '100%',
                            width: `${(count / total) * 100}%`,
                            background: moodColors[mood] || '#a78bfa',
                            borderRadius: '2px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent scores */}
          {dreams.length > 1 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                Осознанность последних снов
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
                {dreams.slice(0, 7).reverse().map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%',
                      height: `${(d.analysis.lucidityScore / 10) * 60}px`,
                      background: `linear-gradient(180deg, #a78bfa, #7c3aed)`,
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                    }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                      {d.analysis.lucidityScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
