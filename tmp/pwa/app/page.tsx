'use client'

import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import AnalysisScreen from './components/AnalysisScreen'
import DiaryScreen from './components/DiaryScreen'
import StatsScreen from './components/StatsScreen'
import ProfileScreen from './components/ProfileScreen'
import TabBar from './components/TabBar'

export type Screen = 'home' | 'analysis' | 'diary' | 'stats' | 'profile'

export type Analysis = {
  dreamTitle: string
  mood: string
  symbols: { name: string; emoji: string; meaning: string }[]
  interpretation: string
  recommendation: string
  lucidityScore: number
  emotionalTone: string
  videoPrompt: string
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [videoTaskId, setVideoTaskId] = useState<string | null>(null)

  const showTabBar = ['home', 'diary', 'stats', 'profile'].includes(screen)

  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{
        position: 'fixed', top: 80, left: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,252,0.15), transparent)',
        animation: 'float 10s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', top: 350, right: -60,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.1), transparent)',
        animation: 'float 12s ease-in-out infinite 2s',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Screen content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        {screen === 'home' && (
          <HomeScreen
            onNavigate={setScreen}
            onAnalysis={(a, taskId) => {
              setAnalysis(a)
              setVideoTaskId(taskId)
              setScreen('analysis')
            }}
          />
        )}
        {screen === 'analysis' && (
          <AnalysisScreen
            analysis={analysis}
            videoTaskId={videoTaskId}
            onNavigate={setScreen}
          />
        )}
        {screen === 'diary' && <DiaryScreen onNavigate={setScreen} />}
        {screen === 'stats' && <StatsScreen />}
        {screen === 'profile' && <ProfileScreen />}
      </div>

      {showTabBar && <TabBar active={screen} onNavigate={setScreen} />}
    </div>
  )
}
