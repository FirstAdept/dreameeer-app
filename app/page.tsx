'use client';
import { useState, useEffect } from 'react';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import AnalysisScreen from './components/AnalysisScreen';
import DiaryScreen from './components/DiaryScreen';
import StatsScreen from './components/StatsScreen';
import SettingsScreen from './components/SettingsScreen';
import PaywallScreen from './components/PaywallScreen';
import TabBar from './components/TabBar';

export type Screen = 'onboarding' | 'home' | 'analysis' | 'diary' | 'stats' | 'settings';

export interface AppSettings {
  theme: 'dark' | 'light';
  language: 'ru' | 'en';
  interpretMode: 'default' | 'miller' | 'freud' | 'loff';
}

export interface DreamAnalysis {
  dreamTitle: string;
  mood: string;
  symbols: { name: string; emoji: string; meaning: string }[];
  interpretation: string;
  recommendation: string;
  videoPrompt: string;
  lucidityScore: number;
  emotionalTone: string;
}

export interface DreamRecord {
  id: number;
  date: string;
  dreamText: string;
  analysis: DreamAnalysis;
  imageUrl?: string;
  videoUrl?: string;
  videoTaskId?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'ru',
  interpretMode: 'default',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dreameeer-production.up.railway.app';
const FREE_LIMIT = 3;

function generateDeviceId(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentDream, setCurrentDream] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<DreamAnalysis | null>(null);
  const [currentVideoTaskId, setCurrentVideoTaskId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Subscription state
  const [deviceId, setDeviceId] = useState<string>('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dreamCount, setDreamCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Settings
    const onboarded = localStorage.getItem('dreameeer_onboarded');
    if (!onboarded) setScreen('onboarding');
    const saved = localStorage.getItem('dreameeer_settings');
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }

    // DeviceId
    let id = localStorage.getItem('dreameeer_device_id');
    if (!id) {
      id = generateDeviceId();
      localStorage.setItem('dreameeer_device_id', id);
    }
    setDeviceId(id);

    // Check subscription from server
    fetch(`${API_BASE}/api/user/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: id }),
    })
      .then(r => r.json())
      .then(data => {
        setDreamCount(data.dreamCount || 0);
        setIsSubscribed(data.subscription?.status === 'active');
      })
      .catch(() => {
        // Fallback: use local count
        const localCount = parseInt(localStorage.getItem('dreameeer_dream_count') || '0', 10);
        setDreamCount(localCount);
      });

    // Handle return from payment
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      // Re-check subscription status after payment return
      setTimeout(() => {
        fetch(`${API_BASE}/api/user/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId: id }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.subscription?.status === 'active') {
              setIsSubscribed(true);
              setShowPaywall(false);
            }
          })
          .catch(() => {});
      }, 1500);
      // Clean URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('dreameeer_settings', JSON.stringify(settings));
  }, [settings, mounted]);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    );
  }

  const handleAnalysisComplete = (
    dreamText: string,
    analysis: DreamAnalysis,
    videoTaskId: string | null,
    imageUrl: string | null
  ) => {
    // Increment local count as backup
    const newCount = dreamCount + 1;
    setDreamCount(newCount);
    localStorage.setItem('dreameeer_dream_count', String(newCount));

    setCurrentDream(dreamText);
    setCurrentAnalysis(analysis);
    setCurrentVideoTaskId(videoTaskId);
    setCurrentImageUrl(imageUrl);
    setScreen('analysis');
  };

  const handleSubscriptionRequired = () => {
    setShowPaywall(true);
  };

  // Show paywall screen (fullscreen, no tabs)
  if (showPaywall) {
    return (
      <PaywallScreen
        settings={settings}
        deviceId={deviceId}
        onClose={isSubscribed ? () => setShowPaywall(false) : undefined}
      />
    );
  }

  const showTabs = screen !== 'onboarding' && screen !== 'analysis';

  return (
    <div className="app-container">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: showTabs ? '80px' : '0' }}>
        {screen === 'onboarding' && (
          <OnboardingScreen onDone={() => setScreen('home')} />
        )}
        {screen === 'home' && (
          <HomeScreen
            onAnalysisComplete={handleAnalysisComplete}
            onSubscriptionRequired={handleSubscriptionRequired}
            settings={settings}
            deviceId={deviceId}
            isSubscribed={isSubscribed}
            dreamCount={dreamCount}
            freeLimit={FREE_LIMIT}
            onThemeToggle={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}
          />
        )}
        {screen === 'analysis' && currentAnalysis && (
          <AnalysisScreen
            dreamText={currentDream}
            analysis={currentAnalysis}
            videoTaskId={currentVideoTaskId}
            imageUrl={currentImageUrl}
            onBack={() => setScreen('home')}
            settings={settings}
          />
        )}
        {screen === 'diary' && <DiaryScreen settings={settings} />}
        {screen === 'stats' && <StatsScreen settings={settings} />}
        {screen === 'settings' && (
          <SettingsScreen settings={settings} onSettingsChange={setSettings} />
        )}
      </div>

      {showTabs && (
        <TabBar current={screen} onChange={(s) => setScreen(s as Screen)} language={settings.language} />
      )}
    </div>
  );
}
