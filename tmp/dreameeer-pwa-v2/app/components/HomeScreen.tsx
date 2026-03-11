'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles } from './Icons';

const BACKEND_URL = 'http://192.168.31.79:3001';

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

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'analysis' | 'diary' | 'stats' | 'profile') => void;
  onAnalysis: (analysis: Analysis, taskId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onAnalysis }) => {
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ru-RU';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setDreamText((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Ошибка: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError('Web Speech API не поддерживается');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setDreamText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleAnalysis = async () => {
    if (!dreamText.trim()) {
      setError('Пожалуйста, опишите ваш сон');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/dreams/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamDescription: dreamText }),
      });

      if (!response.ok) {
        throw new Error('Ошибка анализа сна');
      }

      const data = await response.json();
      onAnalysis(data.analysis, data.taskId);
    } catch (err) {
      setError('Не удалось проанализировать сон. Попробуйте позже.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07071a] to-[#0d0d2b] pb-24">
      {/* Header */}
      <div className="pt-8 px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#a18aff] flex items-center justify-center">
            <span className="text-white text-lg">🌙</span>
          </div>
          <h1 className="text-2xl font-bold text-[#eef0f6]">Dreameeer</h1>
        </div>
        <p className="text-[#9ba3b8]">Расшифруй значение своих снов</p>
      </div>

      {/* Main Content */}
      <div className="px-4">
        {/* Voice Input Card */}
        <div className="mb-6 backdrop-blur-xl bg-[rgba(255,255,255,0.03)] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          {/* Mic Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500/80 shadow-lg shadow-red-500/50 animate-pulse'
                  : 'bg-gradient-to-br from-[#7c5cfc] to-[#a18aff] shadow-lg shadow-[#7c5cfc]/50 hover:shadow-[#7c5cfc]/70'
              }`}
            >
              {isRecording ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
            </button>
          </div>

          {/* Status Text */}
          <div className="text-center mb-4">
            {isRecording ? (
              <p className="text-[#f5a623] font-medium">Слушаю...</p>
            ) : isListening ? (
              <p className="text-[#10b981] font-medium">Обработка...</p>
            ) : dreamText ? (
              <p className="text-[#9ba3b8] text-sm">Сон записан, готов к анализу</p>
            ) : (
              <p className="text-[#636b82] text-sm">Нажмите микрофон чтобы начать</p>
            )}
          </div>

          {/* Textarea */}
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="Или опишите сон текстом..."
            className="w-full bg-[#151530] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-[#eef0f6] placeholder-[#636b82] focus:outline-none focus:border-[#7c5cfc] transition-colors resize-none"
            rows={4}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Quick Access Cards */}
        <div className="mb-6">
          <h2 className="text-[#eef0f6] font-semibold mb-3 flex items-center gap-2">
            <Sparkles size={18} /> Быстро
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Последний сон', emoji: '📖' },
              { title: 'Мои символы', emoji: '✨' },
              { title: 'Статистика', emoji: '📊' },
              { title: 'Профиль', emoji: '👤' },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.title === 'Последний сон') onNavigate('diary');
                  else if (item.title === 'Статистика') onNavigate('stats');
                  else if (item.title === 'Профиль') onNavigate('profile');
                  else onNavigate('analysis');
                }}
                className="backdrop-blur-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 text-center hover:bg-[rgba(255,255,255,0.05)] transition-all active:scale-95"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="text-[#9ba3b8] text-sm">{item.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="backdrop-blur-xl bg-[rgba(124,92,252,0.08)] border border-[rgba(161,138,255,0.2)] rounded-xl p-4 mb-4">
          <p className="text-[#a18aff] text-sm">
            <span className="font-semibold">💡 Совет:</span> Чем больше деталей вы вспомните, тем точнее будет анализ. Вспомните эмоции, цвета, людей и места.
          </p>
        </div>
      </div>

      {/* Analyze Button - Sticky */}
      <div className="fixed bottom-24 left-0 right-0 px-4">
        <button
          onClick={handleAnalysis}
          disabled={!dreamText.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#a18aff] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#7c5cfc]/50 transition-all active:scale-95"
        >
          <Send size={20} />
          {isAnalyzing ? 'Анализирую...' : 'Анализировать сон'}
        </button>
      </div>
    </div>
  );
};
