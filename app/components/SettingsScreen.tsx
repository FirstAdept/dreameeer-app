'use client';
import type { AppSettings } from '../page';

interface Props {
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
}

const t = {
  ru: {
    title: 'Настройки',
    theme: 'Тема оформления',
    dark: 'Тёмная',
    darkDesc: 'Глубокий космос',
    light: 'Светлая',
    lightDesc: 'Мягкий рассвет',
    language: 'Язык',
    interpretMode: 'Стиль толкования',
    modes: {
      default: { label: 'Классический', desc: 'Юнг · Фрейд · Ванга · Миллер' },
      miller: { label: 'Соннник Миллера', desc: 'Практические предсказания событий' },
      freud: { label: 'Метод Фрейда', desc: 'Подсознание, желания, символы либидо' },
      loff: { label: 'Метод Лоффа', desc: 'Личностный рост и самопознание' },
    },
  },
  en: {
    title: 'Settings',
    theme: 'Appearance',
    dark: 'Dark',
    darkDesc: 'Deep cosmos',
    light: 'Light',
    lightDesc: 'Soft dawn',
    language: 'Language',
    interpretMode: 'Interpretation Style',
    modes: {
      default: { label: 'Classic', desc: 'Jung · Freud · Vanga · Miller' },
      miller: { label: "Miller's Dream Book", desc: 'Practical life predictions' },
      freud: { label: "Freud's Method", desc: 'Subconscious desires & symbols' },
      loff: { label: "Loff's Method", desc: 'Personal growth & self-discovery' },
    },
  },
};

export default function SettingsScreen({ settings, onSettingsChange }: Props) {
  const lang = settings.language;
  const tx = t[lang];

  const set = (patch: Partial<AppSettings>) =>
    onSettingsChange({ ...settings, ...patch });

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    marginBottom: '10px',
    paddingLeft: '4px',
  };

  const rowStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: active ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
    borderLeft: active ? '3px solid var(--purple)' : '3px solid transparent',
  });

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'var(--border-subtle)',
    margin: '0 18px',
  };

  const radioCircle = (active: boolean) => (
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%',
      border: `2px solid ${active ? 'var(--purple)' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s ease',
    }}>
      {active && (
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: 'var(--purple)',
        }} />
      )}
    </div>
  );

  return (
    <div className="screen" style={{ padding: '0 20px', paddingTop: '60px', paddingBottom: '20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }} className="gradient-text">
          {tx.title}
        </h1>
      </div>

      {/* Theme */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.theme}</p>
        <div style={rowStyle}>
          {/* Dark */}
          <div style={itemStyle(settings.theme === 'dark')} onClick={() => set({ theme: 'dark' })}>
            <span style={{ fontSize: '22px' }}>🌑</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>{tx.dark}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.darkDesc}</div>
            </div>
            {radioCircle(settings.theme === 'dark')}
          </div>
          <div style={dividerStyle} />
          {/* Light */}
          <div style={itemStyle(settings.theme === 'light')} onClick={() => set({ theme: 'light' })}>
            <span style={{ fontSize: '22px' }}>☀️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>{tx.light}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{tx.lightDesc}</div>
            </div>
            {radioCircle(settings.theme === 'light')}
          </div>
        </div>
      </div>

      {/* Language */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.language}</p>
        <div style={rowStyle}>
          <div style={itemStyle(settings.language === 'ru')} onClick={() => set({ language: 'ru' })}>
            <span style={{ fontSize: '22px' }}>🇷🇺</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>Русский</div>
            </div>
            {radioCircle(settings.language === 'ru')}
          </div>
          <div style={dividerStyle} />
          <div style={itemStyle(settings.language === 'en')} onClick={() => set({ language: 'en' })}>
            <span style={{ fontSize: '22px' }}>🇬🇧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>English</div>
            </div>
            {radioCircle(settings.language === 'en')}
          </div>
        </div>
      </div>

      {/* Interpretation mode */}
      <div style={sectionStyle}>
        <p style={labelStyle}>{tx.interpretMode}</p>
        <div style={rowStyle}>
          {(['default', 'miller', 'freud', 'loff'] as const).map((mode, i) => (
            <div key={mode}>
              {i > 0 && <div style={dividerStyle} />}
              <div style={itemStyle(settings.interpretMode === mode)} onClick={() => set({ interpretMode: mode })}>
                <span style={{ fontSize: '22px' }}>
                  {mode === 'default' ? '🔮' : mode === 'miller' ? '📖' : mode === 'freud' ? '🧠' : '🌱'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>
                    {tx.modes[mode].label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {tx.modes[mode].desc}
                  </div>
                </div>
                {radioCircle(settings.interpretMode === mode)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App version */}
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', marginTop: '16px' }}>
        Dreameeer v1.0 · AI Dream Interpreter
      </p>
    </div>
  );
}
