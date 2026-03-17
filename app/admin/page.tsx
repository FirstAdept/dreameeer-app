'use client';
import { useState, useEffect } from 'react';

const API = 'https://api.dreameeer.ru';
const TOKEN = 'dreameeer-admin-2024';

interface Dream {
  _id: string;
  deviceId: string;
  dreamText: string;
  analysis?: { dreamTitle?: string; mood?: string; interpretation?: string; emotionalTone?: string };
  imageUrl?: string;
  createdAt: string;
  language?: string;
  theme?: string;
}

interface Stats {
  totalUsers?: number;
  subscribers?: number;
  totalDreams?: number;
  recentDreams?: number;
}

export default function AdminPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Dream | null>(null);
  const [resetting, setResetting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/admin/dreams?token=${TOKEN}`).then(r => r.json()),
      fetch(`${API}/api/admin/stats?token=${TOKEN}`).then(r => r.json()),
    ]).then(([dreamsData, statsData]) => {
      if (dreamsData.error) { setError(dreamsData.error); return; }
      setDreams(dreamsData.dreams || dreamsData || []);
      setStats(statsData);
    }).catch(() => setError('Ошибка соединения с сервером'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleReset = async () => {
    if (!confirm('Удалить всех пользователей без подписки и все сны? Это необратимо.')) return;
    setResetting(true);
    try {
      const r = await fetch(`${API}/api/admin/reset?token=${TOKEN}`, { method: 'POST' });
      const data = await r.json();
      alert(data.message || 'Готово');
      loadData();
    } catch {
      alert('Ошибка сброса');
    } finally {
      setResetting(false);
    }
  };

  const moodEmoji: Record<string, string> = {
    загадочный: '🔮', мечтательный: '✨', тревожный: '😰',
    трансформирующий: '🦋', вдохновляющий: '🌟',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0015', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#a78bfa', fontSize: '18px' }}>Загрузка...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0a0015', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '48px' }}>🔐</div>
      <div style={{ color: '#f87171', fontSize: '16px' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0015', color: '#e2d9f3', fontFamily: '-apple-system, sans-serif', padding: '24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
          🌙 Dreameeer Admin
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Личный кабинет снов</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Пользователей', value: (stats as any).users?.total ?? stats.totalUsers ?? '—', icon: '👤' },
          { label: 'PRO подписок', value: (stats as any).users?.subscribers ?? stats.subscribers ?? '—', icon: '💎' },
          { label: 'Снов всего', value: (stats as any).dreams?.total ?? stats.totalDreams ?? dreams.length, icon: '🌙' },
          { label: 'За 7 дней', value: (stats as any).dreams?.recent ?? stats.recentDreams ?? '—', icon: '📅' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#a78bfa' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reset button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleReset}
          disabled={resetting}
          style={{
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '10px 20px', color: '#f87171',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', opacity: resetting ? 0.5 : 1,
          }}
        >
          {resetting ? '⏳ Сбрасываю...' : '🗑️ Сбросить тестовые данные'}
        </button>
      </div>

      {/* Dreams list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dreams.map(dream => (
          <div key={dream._id}
            onClick={() => setSelected(selected?._id === dream._id ? null : dream)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '16px', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{moodEmoji[dream.analysis?.mood || ''] || '🌙'}</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                    {dream.analysis?.dreamTitle || 'Без названия'}
                  </span>
                </div>
                <p style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.5)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}>
                  {dream.dreamText}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  {new Date(dream.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                {dream.imageUrl && <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '2px' }}>🖼 Есть фото</div>}
              </div>
            </div>

            {/* Expanded */}
            {selected?._id === dream._id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {dream.imageUrl && (
                  <img src={dream.imageUrl} alt="" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', marginBottom: '12px' }} />
                )}
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '10px' }}>
                  <strong style={{ color: '#a78bfa' }}>Сон:</strong> {dream.dreamText}
                </p>
                {dream.analysis?.interpretation && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '8px' }}>
                    <strong style={{ color: '#a78bfa' }}>Толкование:</strong> {dream.analysis.interpretation}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {dream.analysis?.mood && (
                    <span style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#a78bfa' }}>
                      {dream.analysis.mood}
                    </span>
                  )}
                  {dream.analysis?.emotionalTone && (
                    <span style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: '#4ade80' }}>
                      {dream.analysis.emotionalTone}
                    </span>
                  )}
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '3px 10px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    {dream.deviceId.slice(0, 8)}…
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {dreams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌙</div>
          <div>Снов пока нет</div>
        </div>
      )}
    </div>
  );
}
