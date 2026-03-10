'use client';

import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { DiaryScreen } from './components/DiaryScreen';
import { StatsScreen } from './components/StatsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TabBar } from './components/TabBar';
import './globals.css';

type Screen = 'home' | 'analysis' | 'diary' | 'stats' | 'profile';

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

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);

  const handleNavigate = (screen: Screen) => {
    setActiveScreen(screen);
  };

  const handleAnalysis = (analysis: Analysis, taskId: string) => {
    setCurrentAnalysis(analysis);
    setActiveScreen('analysis');
  };

  return (
    <div className="bg-gradient-to-b from-[#07071a] to-[#0d0d2b] min-h-screen">
      {/* Screen Router */}
      {activeScreen === 'home' && (
        <HomeScreen onNavigate={handleNavigate} onAnalysis={handleAnalysis} />
      )}

      {activeScreen === 'analysis' && currentAnalysis && (
        <AnalysisScreen
          analysis={currentAnalysis}
          onNavigate={handleNavigate}
          onBack={() => setActiveScreen('home')}
        />
      )}

      {activeScreen === 'diary' && <DiaryScreen onNavigate={handleNavigate} />}

      {activeScreen === 'stats' && <StatsScreen onNavigate={handleNavigate} />}

      {activeScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}

      {/* Tab Bar Navigation */}
      <TabBar activeScreen={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}
