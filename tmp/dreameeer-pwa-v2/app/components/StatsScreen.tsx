'use client';

import React from 'react';
import { BarChart, TrendingUp, Calendar } from 'lucide-react';

interface StatsScreenProps {
  onNavigate: (screen: 'home' | 'analysis' | 'diary' | 'stats' | 'profile') => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Всего снов', value: '23', emoji: '🌙' },
    { label: 'Эта неделя', value: '5', emoji: '📊' },
    { label: 'Средняя ясность', value: '68%', emoji: '✨' },
    { label: 'Любимый символ', value: 'Полет', emoji: '🦅' },
  ];

  const moods = [
    { name: 'Спокойный', count: 10, color: '#10b981' },
    { name: 'Радостный', count: 8, color: '#f5a623' },
    { name: 'Тревожный', count: 3, color: '#ef4444' },
    { name: 'Грустный', count: 2, color: '#6366f1' },
  ];

  const symbols = [
    { name: 'Полет', count: 8 },
    { name: 'Вода', count: 6 },
    { name: 'Дом', count: 5 },
    { name: 'Люди', count: 7 },
    { name: 'Животные', count: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07071a] to-[#0d0d2b] pb-24">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-[rgba(7,7,26,0.8)] border-b border-[rgba(255,255,255,0.06)] px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-[#eef0f6] flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c5cfc]">
            <line x1="12" y1="2" x2="12" y2="22"/>
            <path d="M17 5h4v14h-4"/>
            <path d="M3 9h4v10H3z"/>
          </svg>
          Статистика
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 animate-fadeInUp"
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <p className="text-[#9ba3b8] text-xs mb-2">{stat.label.toUpperCase()}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl">{stat.emoji}</span>
                <span className="text-2xl font-bold text-[#eef0f6]">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mood Distribution */}
        <div
          className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(124,92,252,0.08)_0%,rgba(161,138,255,0.04)_100%)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#eef0f6] font-semibold mb-4">Распределение настроений</h2>
          <div className="space-y-3">
            {moods.map((mood) => (
              <div key={mood.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#9ba3b8] text-sm">{mood.name}</span>
                  <span className="text-[#eef0f6] text-sm font-semibold">{mood.count}</span>
                </div>
                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(mood.count / 10) * 100}%`,
                      backgroundColor: mood.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Symbols */}
        <div
          className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#eef0f6] font-semibold mb-4">Топ символы</h2>
          <div className="space-y-3">
            {symbols.map((symbol, index) => (
              <div
                key={symbol.name}
                className="flex items-center gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)] last:border-b-0"
              >
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#a18aff] flex items-center justify-center text-white font-semibold text-sm"
                >
                  {index + 1}
                </div>
                <span className="text-[#eef0f6] flex-1">{symbol.name}</span>
                <span className="text-[#9ba3b8] text-sm">{symbol.count} раз</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div
          className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#eef0f6] font-semibold mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#f5a623]">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Эта неделя
          </h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {[3, 4, 5, 2, 5, 1, 0].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-[#7c5cfc] to-[#a18aff] rounded-t-lg transition-all duration-300 hover:from-[#a18aff] hover:to-[#c4b8ff]"
                  style={{ height: `${value * 25}px` }}
                />
                <span className="text-[#636b82] text-xs mt-2">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div
          className="backdrop-blur-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-xl p-4"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#10b981] font-semibold mb-2">Понимание</h2>
          <p className="text-[#9ba3b8] text-sm">
            Вы видели в среднем 3.3 сна в неделю за последний месяц. Символы полета появляются в 35% ваших снов, что может указывать на стремление к свободе и прогрессу.
          </p>
        </div>
      </div>
    </div>
  );
};
