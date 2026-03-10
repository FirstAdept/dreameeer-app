'use client';
import { useState, useEffect } from 'react';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import AnalysisScreen from './components/AnalysisScreen';
import DiaryScreen from './components/DiaryScreen';
import StatsScreen from './components/StatsScreen';
import SettingsScreen from './components/SettingsScreen';
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentDream, setCurrentDream] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<DreamAnalysis | null>(null);
  const [currentVideoTaskId, setCurrentVideoTaskId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboarded = localStorage.getItem('dreameeer_onboarded');
    if (!onboarded) setScreen('onboarding');

    const saved = localStorage.getItem('dreameeer_settings');
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
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
    setCurrentDream(dreamText);
    setCurrentAnalysis(analysis);
    setCurrentVideoTaskId(videoTaskId);
    setCurrentImageUrl(imageUrl);
    setScreen('analysis');
  };

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
          <HomeScreen onAnalysisComplete={handleAnalysisComplete} settings={settings} />
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
