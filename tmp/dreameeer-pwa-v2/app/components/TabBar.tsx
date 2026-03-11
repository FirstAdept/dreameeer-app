'use client';

import React from 'react';
import { Moon, Book, BarChart, User } from './Icons';

type Screen = 'home' | 'analysis' | 'diary' | 'stats' | 'profile';

interface TabBarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as Screen, label: 'Главная', icon: Moon },
    { id: 'diary' as Screen, label: 'Дневник', icon: Book },
    { id: 'stats' as Screen, label: 'Статистика', icon: BarChart },
    { id: 'profile' as Screen, label: 'Профиль', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-[rgba(7,7,26,0.95)] border-t border-[rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-4 gap-1 relative group transition-colors duration-200"
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-all duration-200 ${
                    isActive ? 'text-[#7c5cfc]' : 'text-[#636b82] group-hover:text-[#9ba3b8]'
                  }`}
                />
                {isActive && (
                  <div className="absolute inset-0 blur-md bg-[#7c5cfc]/40 rounded-full -z-10" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#7c5cfc]' : 'text-[#636b82] group-hover:text-[#9ba3b8]'
                }`}
              >
                {tab.label}
              </span>

              {/* Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7c5cfc] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
