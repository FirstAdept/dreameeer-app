'use client';

import React, { useState } from 'react';
import { ChevronRight, Play, Star, Sparkles, X } from './Icons';

interface Symbol {
  name: string;
  emoji: string;
  meaning: string;
}

interface Analysis {
  dreamTitle: string;
  mood: string;
  symbols: Symbol[];
  interpretation: string;
  recommendation: string;
  lucidityScore: number;
  emotionalTone: string;
  videoPrompt: string;
}

interface AnalysisScreenProps {
  analysis: Analysis;
  onNavigate: (screen: 'home' | 'analysis' | 'diary' | 'stats' | 'profile') => void;
  onBack: () => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ analysis, onNavigate, onBack }) => {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  const getLucidityColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f5a623';
    return '#ef4444';
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      'спокойный': '😌',
      'радостный': '😊',
      'нейтральный': '😐',
      'грустный': '😢',
      'тревожный': '😰',
      'возбужденный': '🤩',
    };
    return moodMap[mood.toLowerCase()] || '😶';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07071a] to-[#0d0d2b] pb-24">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-[rgba(7,7,26,0.8)] border-b border-[rgba(255,255,255,0.06)] px-4 py-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#7c5cfc] hover:text-[#a18aff] transition-colors"
        >
          <X size={20} />
          <span className="text-sm">Закрыть</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pt-6">
        {/* Dream Title */}
        <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-bold text-[#eef0f6] mb-2">{analysis.dreamTitle}</h1>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji(analysis.mood)}</span>
            <span className="text-[#9ba3b8] capitalize">{analysis.mood}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Lucidity Score */}
          <div
            className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
          >
            <p className="text-[#9ba3b8] text-xs mb-2">ЯСНОСТЬ</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#eef0f6]">{analysis.lucidityScore}%</span>
            </div>
            <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${analysis.lucidityScore}%`,
                  background: `linear-gradient(90deg, ${getLucidityColor(analysis.lucidityScore)} 0%, ${getLucidityColor(analysis.lucidityScore)}dd 100%)`,
                }}
              />
            </div>
          </div>

          {/* Emotional Tone */}
          <div
            className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
          >
            <p className="text-[#9ba3b8] text-xs mb-2">ТОНАЛЬНОСТЬ</p>
            <p className="text-[#eef0f6] font-semibold capitalize">{analysis.emotionalTone}</p>
          </div>
        </div>

        {/* Interpretation */}
        <div
          className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(124,92,252,0.08)_0%,rgba(161,138,255,0.04)_100%)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-6 animate-fadeInUp"
          style={{ animationDelay: '0.2s', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#a18aff]" />
            <h2 className="text-[#eef0f6] font-semibold">Значение</h2>
          </div>
          <p className="text-[#9ba3b8] leading-relaxed text-sm">{analysis.interpretation}</p>
        </div>

        {/* Symbols */}
        <div className="mb-6">
          <h2 className="text-[#eef0f6] font-semibold mb-3 flex items-center gap-2">
            <Star size={18} className="text-[#f5a623]" />
            Ключевые символы
          </h2>
          <div className="space-y-2">
            {analysis.symbols.map((symbol) => (
              <button
                key={symbol.name}
                onClick={() => setExpandedSymbol(expandedSymbol === symbol.name ? null : symbol.name)}
                className="w-full backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-left hover:bg-[rgba(255,255,255,0.05)] transition-all active:scale-98"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{symbol.emoji}</span>
                    <span className="text-[#eef0f6] font-medium capitalize">{symbol.name}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`text-[#9ba3b8] transition-transform ${expandedSymbol === symbol.name ? 'rotate-90' : ''}`}
                  />
                </div>
                {expandedSymbol === symbol.name && (
                  <p className="text-[#9ba3b8] text-sm mt-3 ml-11">{symbol.meaning}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div
          className="backdrop-blur-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-xl p-4 mb-6 animate-fadeInUp"
          style={{ animationDelay: '0.3s', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#10b981] font-semibold mb-2">Рекомендация</h2>
          <p className="text-[#9ba3b8] text-sm leading-relaxed">{analysis.recommendation}</p>
        </div>

        {/* Video Generation */}
        <div
          className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(245,166,35,0.12)_0%,rgba(255,215,0,0.06)_100%)] border border-[rgba(245,166,35,0.3)] rounded-xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[#f5a623] font-semibold mb-2">Визуализация сна</h2>
          <p className="text-[#9ba3b8] text-sm mb-4">{analysis.videoPrompt}</p>
          <button className="w-full bg-[#f5a623] text-[#07071a] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ffd700] transition-all active:scale-95">
            <Play size={18} />
            Создать видео (Premium)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('diary')}
            className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 text-[#eef0f6] font-medium hover:bg-[rgba(255,255,255,0.05)] transition-all"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
          >
            📖 Дневник
          </button>
          <button
            onClick={() => onNavigate('stats')}
            className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 text-[#eef0f6] font-medium hover:bg-[rgba(255,255,255,0.05)] transition-all"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
          >
            📊 Статистика
          </button>
        </div>
      </div>
    </div>
  );
};
