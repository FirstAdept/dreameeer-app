'use client';
import { useEffect, useState } from 'react';
import type { DreamRecord } from '../page';

export default function StatsScreen({ settings }: { settings?: any }) {
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const lang = settings?.language || 'ru';

  const tx = {
    ru: {
      title: 'Статистика',
      subtitle: 'Твои паттерны сновидений',
      empty: 'Расшифруй хотя бы один сон\nдля статистики',
      totalDreams: 'Всего снов',
      avgScore: 'Средний балл',
      streak: 'Серия дней',
      totalWords: 'Слов записано',
      days: 'дн',
      frequentMoods: 'Частые настроения',
      recentScores: 'Осознанность последних снов',
      topSymbols: 'Топ символов',
      weekHeatmap: 'Активность по дням недели',
      weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      bestDay: 'Самый активный день',
      avgLength: 'Средняя длина сна',
      chars: 'символов',
    },
    en: {
      title: 'Statistics',
      subtitle: 'Your dream patterns',
      empty: 'Interpret at least one dream\nto see statistics',
      totalDreams: 'Total Dreams',
      avgScore: 'Avg Score',
      streak: 'Day Streak',
      totalWords: 'Words Written',
      days: 'd',
      frequentMoods: 'Frequent Moods',
      recentScores: 'Recent Lucidity Scores',
      topSymbols: 'Top Symbols',
      weekHeatmap: 'Activity by Day of Week',
      weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      bestDay: 'Most Active Day',
      avgLength: 'Avg Dream Length',
      chars: 'chars',
    },
  };
  const t = tx[lang as 'ru' | 'en'] || tx.ru;

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

  // Total words written
  const totalWords = dreams.reduce((acc, d) => acc + d.dreamText.split(/\s+/).filter(Boolean).length, 0);

  // Average dream length in chars
  const avgLength = total > 0
    ? Math.round(dreams.reduce((acc, d) => acc + d.dreamText.length, 0) / total)
    : 0;

  // Streak calculation
  const calcStreak = () => {
    if (total === 0) return 0;
    const dates = dreams
      .map(d => new Date(d.date).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const now = new Date();
    for (let i = 0; i < dates.length; i++) {
      const diff = Math.round((now.getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
      if (diff === i || diff === i + 1) streak++;
      else break;
    }
    return streak;
  };
  const streak = calcStreak();

  // Mood counts
  const moodCounts: Record<string, number> = {};
  dreams.forEach(d => {
    const m = d.analysis.mood || 'другой';
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });

  const moodEmoji: Record<string, string> = {
    'загадочный': '🔮',
    'мечтательный': '💫',
    'тревожный': '⚡',
    'трансформирующий': '🌀',
    'вдохновляющий': '✨',
    'mysterious': '🔮',
    'dreamy': '💫',
    'anxious': '⚡',
    'transformative': '🌀',
    'inspiring': '✨',
  };

  const moodColors: Record<string, string> = {
    'загадочный': '#a78bfa',
    'мечтательный': '#60a5fa',
    'тревожный': '#fb923c',
    'трансформирующий': '#34d399',
    'вдохновляющий': '#fbbf24',
    'mysterious': '#a78bfa',
    'dreamy': '#60a5fa',
    'anxious': '#fb923c',
    'transformative': '#34d399',
    'inspiring': '#fbbf24',
  };

  // Top symbols
  const symbolCounts: Record<string, { count: number; emoji: string }> = {};
  dreams.forEach(d => {
    (d.analysis.symbols || []).forEach((sym: any) => {
      if (!symbolCounts[sym.name]) symbolCounts[sym.name] = { count: 0, emoji: sym.emoji };
      symbolCounts[sym.name].count++;
    });
  });
  const topSymbols = Object.entries(symbolCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  // Weekly heatmap (day of week distribution)
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon=0 .. Sun=6
  dreams.forEach(d => {
    const day = new Date(d.date).getDay(); // 0=Sun
    const idx = day === 0 ? 6 : day - 1; // convert to Mon=0
    weekdayCounts[idx]++;
  });
  const maxWeekday = Math.max(...weekdayCounts, 1);
  const bestDayIdx = weekdayCounts.indexOf(Math.max(...weekdayCounts));

  return (
    <div className="screen" style={{ padding: '24px 20px', paddingTop: '60px', paddingBottom: '100px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }} className="gradient-text">
          {t.title}
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
          {t.subtitle}
        </p>
      </div>

      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>📊</div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{t.empty}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Summary cards — 2x2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: t.totalDreams, value: total, icon: '🌙', color: '#a78bfa' },
              { label: t.avgScore, value: `${avgScore}/10`, icon: '🔆', color: '#fbbf24' },
              { label: t.streak, value: `${streak} ${t.days}`, icon: '🔥', color: '#f97316' },
              { label: t.totalWords, value: totalWords.toLocaleString(), icon: '✍️', color: '#34d399' },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{stat.icon}</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color, marginBottom: '3px', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.3px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent lucidity scores bar chart */}
          {dreams.length >= 2 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                {t.recentScores}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px' }}>
                {dreams.slice(0, 10).reverse().map((d, i) => {
                  const score = d.analysis.lucidityScore || 0;
                  const color = score >= 8 ? '#34d399' : score >= 5 ? '#a78bfa' : '#f472b6';
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '100%',
                        height: `${(score / 10) * 64}px`,
                        background: `linear-gradient(180deg, ${color}, ${color}88)`,
                        borderRadius: '4px 4px 0 0',
                        minHeight: '4px',
                        transition: 'height 0.5s ease',
                      }} />
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mood distribution */}
          {Object.keys(moodCounts).length > 0 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {t.frequentMoods}
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
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{count}</span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }}>
                          <div style={{
                            height: '100%',
                            width: `${(count / total) * 100}%`,
                            background: moodColors[mood] || '#a78bfa',
                            borderRadius: '2px',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Weekly heatmap */}
          {total >= 2 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                {t.weekHeatmap}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                {t.weekDays.map((day, i) => {
                  const count = weekdayCounts[i];
                  const intensity = count / maxWeekday;
                  const isBest = i === bestDayIdx && count > 0;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '100%',
                        height: `${8 + intensity * 48}px`,
                        background: isBest
                          ? 'linear-gradient(180deg, #fbbf24, #f97316)'
                          : `rgba(167, 139, 250, ${0.15 + intensity * 0.65})`,
                        borderRadius: '6px',
                        transition: 'height 0.5s ease',
                        minHeight: '8px',
                        border: isBest ? '1px solid rgba(251,191,36,0.4)' : 'none',
                      }} />
                      <span style={{ fontSize: '10px', color: isBest ? '#fbbf24' : 'var(--text-dim)', fontWeight: isBest ? '700' : '400' }}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
              {weekdayCounts[bestDayIdx] > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🏆</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {t.bestDay}: <span style={{ color: '#fbbf24', fontWeight: '700' }}>{t.weekDays[bestDayIdx]}</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Top symbols */}
          {topSymbols.length > 0 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {t.topSymbols}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topSymbols.map(([name, data], i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dim)', width: '16px', textAlign: 'right' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '20px' }}>{data.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text)' }}>{name}</span>
                        <span style={{
                          fontSize: '12px', fontWeight: '700',
                          background: 'rgba(139,92,246,0.15)',
                          border: '1px solid rgba(139,92,246,0.25)',
                          borderRadius: '100px',
                          padding: '2px 10px',
                          color: 'var(--purple)',
                        }}>×{data.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avg length */}
          {total > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
            }}>
              <span style={{ fontSize: '24px' }}>📏</span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '2px' }}>{t.avgLength}</div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: 'var(--blue)' }}>
                  {avgLength} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>{t.chars}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
