'use client'
import { Screen } from '../page'

const tabs = [
  { id: 'home', label: 'Главная', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#636b82'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )},
  { id: 'diary', label: 'Дневник', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#636b82'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )},
  { id: 'stats', label: 'Статистика', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#636b82'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
  { id: 'profile', label: 'Профиль', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#636b82'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

export default function TabBar({ active, onNavigate }: { active: string; onNavigate: (s: Screen) => void }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 60, borderTop: '1px solid var(--border)',
      background: 'var(--bg)', paddingBottom: 'env(safe-area-inset-bottom)',
      position: 'sticky', bottom: 0, zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNavigate(t.id as Screen)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          {t.icon(active === t.id)}
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: active === t.id ? '#7c5cfc' : '#636b82' }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  )
}
