'use client';

interface Props {
  current: string;
  onChange: (screen: string) => void;
  language?: 'ru' | 'en';
}

const labels = {
  ru: { home: 'Главная', diary: 'Дневник', stats: 'Статистика', settings: 'Настройки' },
  en: { home: 'Home', diary: 'Diary', stats: 'Stats', settings: 'Settings' },
};

const tabs = [
  {
    id: 'home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 9v13h7v-6h6v6h7V9L12 2z"
          stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinejoin="round"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'} />
      </svg>
    ),
  },
  {
    id: 'diary',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="16" height="20" rx="2"
          stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'} />
        <line x1="8" y1="8" x2="16" y2="8" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="16" x2="12" y2="16" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'stats',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 1 : 0.6} />
        <rect x="10" y="7" width="4" height="14" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 0.8 : 0.4} />
        <rect x="17" y="3" width="4" height="18" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 0.6 : 0.25} />
      </svg>
    ),
  },
  {
    id: 'settings',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3"
          stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'} />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" />
      </svg>
    ),
  },
];

export default function TabBar({ current, onChange, language = 'ru' }: Props) {
  const l = labels[language];
  const tabLabels = [l.home, l.diary, l.stats, l.settings];

  return (
    <div className="tab-bar">
      {tabs.map((tab, i) => {
        const active = current === tab.id;
        return (
          <button key={tab.id} className={`tab-item ${active ? 'active' : ''}`} onClick={() => onChange(tab.id)}>
            {tab.icon(active)}
            <span>{tabLabels[i]}</span>
          </button>
        );
      })}
    </div>
  );
}
