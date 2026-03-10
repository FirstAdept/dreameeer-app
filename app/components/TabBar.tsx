'use client';

interface Props {
  current: string;
  onChange: (screen: string) => void;
}

const tabs = [
  {
    id: 'home',
    label: 'Главная',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 9v13h7v-6h6v6h7V9L12 2z"
          stroke={active ? '#a78bfa' : '#475569'}
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'}
        />
      </svg>
    ),
  },
  {
    id: 'diary',
    label: 'Дневник',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="4" y="2" width="16" height="20" rx="2"
          stroke={active ? '#a78bfa' : '#475569'}
          strokeWidth="1.8"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'}
        />
        <line x1="8" y1="8" x2="16" y2="8" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="16" x2="12" y2="16" stroke={active ? '#a78bfa' : '#475569'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'stats',
    label: 'Статистика',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 1 : 0.6} />
        <rect x="10" y="7" width="4" height="14" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 0.8 : 0.4} />
        <rect x="17" y="3" width="4" height="18" rx="1" fill={active ? '#a78bfa' : '#475569'} opacity={active ? 0.6 : 0.25} />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12" cy="8" r="4"
          stroke={active ? '#a78bfa' : '#475569'}
          strokeWidth="1.8"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'}
        />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke={active ? '#a78bfa' : '#475569'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function TabBar({ current, onChange }: Props) {
  return (
    <div className="tab-bar">
      {tabs.map(tab => {
        const active = current === tab.id;
        return (
          <button
            key={tab.id}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon(active)}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
