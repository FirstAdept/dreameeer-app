'use client';

import React, { useState } from 'react';
import { Book, Search, ChevronRight } from './Icons';

interface DreamEntry {
  id: string;
  title: string;
  date: string;
  mood: string;
  symbols: string[];
  text: string;
}

interface DiaryScreenProps {
  onNavigate: (screen: 'home' | 'analysis' | 'diary' | 'stats' | 'profile') => void;
}

// Mock data
const mockDreams: DreamEntry[] = [
  {
    id: '1',
    title: 'Полет над облаками',
    date: '10 марта 2026',
    mood: 'радостный',
    symbols: ['облака', 'полет', 'небо'],
    text: 'Я летел над облаками и чувствовал себя свободным...',
  },
  {
    id: '2',
    title: 'Забытый дом',
    date: '9 марта 2026',
    mood: 'тревожный',
    symbols: ['дом', 'лабиринт', 'забвение'],
    text: 'Я искал дорогу в старом знакомом доме, но комнаты постоянно менялись...',
  },
  {
    id: '3',
    title: 'Встреча с другом',
    date: '8 марта 2026',
    mood: 'спокойный',
    symbols: ['дружба', 'встреча', 'воспоминание'],
    text: 'Я встретил старого друга в уютном кафе и мы долго разговаривали...',
  },
];

export const DiaryScreen: React.FC<DiaryScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);

  const filteredDreams = mockDreams.filter(
    (dream) =>
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.symbols.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      'спокойный': '#10b981',
      'радостный': '#f5a623',
      'тревожный': '#ef4444',
      'грустный': '#6366f1',
    };
    return colors[mood] || '#9ba3b8';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07071a] to-[#0d0d2b] pb-24">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-[rgba(7,7,26,0.8)] border-b border-[rgba(255,255,255,0.06)] px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-[#eef0f6] flex items-center gap-2">
          <Book size={24} /> Дневник снов
        </h1>
        <p className="text-[#9ba3b8] text-sm mt-1">
          {filteredDreams.length} записей
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-[#636b82]" size={20} />
          <input
            type="text"
            placeholder="Поиск снов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151530] border border-[rgba(255,255,255,0.08)] rounded-xl pl-10 pr-4 py-3 text-[#eef0f6] placeholder-[#636b82] focus:outline-none focus:border-[#7c5cfc] transition-colors"
          />
        </div>

        {/* Dreams List */}
        {filteredDreams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#636b82]">Нет записей, соответствующих запросу</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDreams.map((dream, index) => (
              <button
                key={dream.id}
                onClick={() => setSelectedDream(dream)}
                className="w-full backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-left hover:bg-[rgba(255,255,255,0.05)] transition-all active:scale-98 animate-fadeInUp"
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-[#eef0f6] font-semibold">{dream.title}</h3>
                    <p className="text-[#9ba3b8] text-xs mt-1">{dream.date}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#636b82] flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {dream.symbols.slice(0, 2).map((symbol) => (
                      <span
                        key={symbol}
                        className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[#9ba3b8]"
                      >
                        {symbol}
                      </span>
                    ))}
                    {dream.symbols.length > 2 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[#9ba3b8]">
                        +{dream.symbols.length - 2}
                      </span>
                    )}
                  </div>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getMoodColor(dream.mood) }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dream Detail Modal */}
      {selectedDream && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-gradient-to-t from-[#07071a] to-[#0e0e24] rounded-t-2xl border-t border-[rgba(255,255,255,0.08)] animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.08)]">
              <h2 className="text-[#eef0f6] font-bold text-lg">{selectedDream.title}</h2>
              <button
                onClick={() => setSelectedDream(null)}
                className="text-[#9ba3b8] hover:text-[#eef0f6] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <p className="text-[#9ba3b8] text-sm mb-4">{selectedDream.date}</p>

              <div className="mb-4">
                <p className="text-[#eef0f6] leading-relaxed">{selectedDream.text}</p>
              </div>

              <div className="mb-4">
                <p className="text-[#9ba3b8] text-xs mb-2">СИМВОЛЫ</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDream.symbols.map((symbol) => (
                    <span
                      key={symbol}
                      className="px-3 py-1 rounded-full bg-[rgba(124,92,252,0.2)] text-[#a18aff] text-sm"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[#9ba3b8] text-xs mb-2">НАСТРОЕНИЕ</p>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getMoodColor(selectedDream.mood) }}
                />
                <span className="text-[#eef0f6] capitalize">{selectedDream.mood}</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#7c5cfc] text-white font-semibold py-3 rounded-lg transition-all active:scale-95">
                  Изменить
                </button>
                <button className="bg-red-500/20 text-red-400 font-semibold py-3 rounded-lg transition-all active:scale-95">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
