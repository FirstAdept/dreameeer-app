'use client';

import React, { useState } from 'react';
import { Shield, Bell, Cloud, MessageCircle, Check } from './Icons';

interface ProfileScreenProps {
  onNavigate: (screen: 'home' | 'analysis' | 'diary' | 'stats' | 'profile') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);

  const user = {
    name: 'Александр',
    email: 'alex@example.com',
    joinDate: 'март 2024',
    avatar: '👤',
  };

  const menuItems = [
    { title: 'Уведомления', icon: Bell, value: isNotificationsEnabled, onChange: setIsNotificationsEnabled },
    { title: 'Облачное хранилище', icon: Cloud, value: isCloudEnabled, onChange: setIsCloudEnabled },
  ];

  const supportItems = [
    { title: 'Справка и поддержка', icon: MessageCircle },
    { title: 'Конфиденциальность', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07071a] to-[#0d0d2b] pb-24">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-[rgba(7,7,26,0.8)] border-b border-[rgba(255,255,255,0.06)] px-4 py-4 z-10">
        <h1 className="text-2xl font-bold text-[#eef0f6]">Профиль</h1>
      </div>

      {/* Content */}
      <div className="px-4 pt-6">
        {/* User Card */}
        <div
          className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(124,92,252,0.12)_0%,rgba(161,138,255,0.06)_100%)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 mb-6 text-center animate-fadeInUp"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="text-6xl mb-4">{user.avatar}</div>
          <h2 className="text-2xl font-bold text-[#eef0f6] mb-1">{user.name}</h2>
          <p className="text-[#9ba3b8] mb-4">{user.email}</p>
          <p className="text-[#636b82] text-sm">Участник с {user.joinDate}</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: 'Снов', value: '23' },
            { label: 'Символов', value: '156' },
            { label: 'Серия', value: '5 дней' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-center"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              <p className="text-[#636b82] text-xs mb-1">{stat.label}</p>
              <p className="text-[#eef0f6] font-bold text-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mb-6">
          <h2 className="text-[#eef0f6] font-semibold mb-3">Настройки</h2>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.05)] transition-all"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-[#7c5cfc]" />
                    <span className="text-[#eef0f6]">{item.title}</span>
                  </div>
                  <button
                    onClick={() => item.onChange(!item.value)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      item.value
                        ? 'bg-[#10b981]'
                        : 'bg-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-all ${
                        item.value ? 'ml-6' : 'ml-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription */}
        <div
          className="backdrop-blur-xl bg-[linear-gradient(135deg,rgba(245,166,35,0.12)_0%,rgba(255,215,0,0.06)_100%)] border border-[rgba(245,166,35,0.3)] rounded-xl p-4 mb-6"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#f5a623] font-semibold">Базовый план</p>
              <p className="text-[#9ba3b8] text-sm">Бесплатно</p>
            </div>
            <span className="text-2xl">🎁</span>
          </div>
          <button className="w-full bg-[#f5a623] text-[#07071a] font-semibold py-3 rounded-lg transition-all active:scale-95 mt-3">
            Обновить на Premium
          </button>
        </div>

        {/* Support */}
        <div className="mb-6">
          <h2 className="text-[#eef0f6] font-semibold mb-3">Помощь</h2>
          <div className="space-y-2">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  className="w-full backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.05)] transition-all text-left"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-[#a18aff]" />
                    <span className="text-[#eef0f6]">{item.title}</span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#636b82]"
                  >
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button className="w-full backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-xl py-3 text-red-400 font-semibold transition-all active:scale-95">
          Выход
        </button>

        {/* Version */}
        <p className="text-center text-[#636b82] text-xs mt-6">Dreameeer v2.0.0</p>
      </div>
    </div>
  );
};
