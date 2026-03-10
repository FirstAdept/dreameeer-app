'use client';
import { useState, useRef } from 'react';
import type { DreamAnalysis, AppSettings } from '../page';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const BACKEND_URL = 'https://dreameeer-backend-production.up.railway.app';

const tx = {
  ru: {
    subtitle: 'Расскажи мне свой сон',
    placeholder: 'Мне приснилось, что я летел над городом, видел огни и чувствовал свободу...',
    chars: 'символов',
    charsLeft: (n: number) => `ещё ${n}`,
    listening: 'Говори — я слушаю...',
    analyzing: 'Анализирую сон...',
    button: '🔮 Расшифровать сон',
    error: 'Нет соединения с сервером. Проверь подключение.',
    minChars: 'Расскажи сон подробнее (минимум 10 символов)',
  },
  en: {
    subtitle: 'Tell me your dream',
    placeholder: 'I was dreaming that I was flying over a city, seeing lights and feeling free...',
    chars: 'chars',
    charsLeft: (n: number) => `${n} more`,
    listening: 'Speak — I am listening...',
    analyzing: 'Analyzing dream...',
    button: '🔮 Interpret Dream',
    error: 'No server connection. Check your network.',
    minChars: 'Tell the dream in more detail (min 10 characters)',
  },
};

interface Props {
  onAnalysisComplete: (dreamText: string, analysis: DreamAnalysis, videoTaskId: string | null, imageUrl: string | null) => void;
  settings: AppSettings;
}

export default function HomeScreen({ onAnalysisComplete, settings }: Props) {
  const s = tx[settings.language];
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Голосовой ввод не поддерживается в этом браузере');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = settings.language === 'en' ? 'en-US' : 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) setDreamText(prev => prev + final);
      setInterimText(interim);
    };

    recognition.onerror = () => { setIsRecording(false); setInterimText(''); };
    recognition.onend = () => { setIsRecording(false); setInterimText(''); };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setError('');
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setInterimText('');
  };

  const analyze = async () => {
    const text = dreamText.trim();
    if (text.length < 10) { setError(s.minChars); return; }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/dream/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText: text,
          theme: settings.theme,
          mode: settings.interpretMode,
          language: settings.language,
        }),
      });

      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Неизвестная ошибка');
      onAnalysisComplete(text, data.analysis, data.videoTaskId || null, data.imageUrl || null);
    } catch (e: any) {
      setError(e.message.includes('fetch') || e.message.includes('Failed') ? s.error : e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = dreamText.length;
  const isReady = charCount >= 10 && !isLoading;

  return (
    <div className="screen" style={{ padding: '0 20px', paddingTop: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          fontSize: '52px', marginBottom: '12px',
          animation: 'float 4s ease-in-out infinite', display: 'inline-block',
          filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.5))',
        }}>🌙</div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}
          className="gradient-text">Dreameeer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{s.subtitle}</p>
      </div>

      {/* Input card */}
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <textarea
          className="dream-textarea"
          value={dreamText + (interimText || '')}
          onChange={e => setDreamText(e.target.value)}
          placeholder={s.placeholder}
          rows={7}
          style={{ padding: '14px' }}
          readOnly={isRecording}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <span style={{ fontSize: '13px', color: charCount >= 10 ? 'var(--text-muted)' : 'var(--text-dim)' }}>
            {charCount} {s.chars}{charCount < 10 && charCount > 0 ? ` (${s.charsLeft(10 - charCount)})` : ''}
          </span>
          <button
            className={`mic-btn ${isRecording ? 'recording' : 'idle'}`}
            style={{ width: '52px', height: '52px' }}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="rgba(167,139,250,0.9)" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="rgba(167,139,250,0.9)" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="19" x2="12" y2="23" stroke="rgba(167,139,250,0.9)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {isRecording && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px',
            padding: '10px 14px', background: 'rgba(236, 72, 153, 0.1)',
            borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.25)',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'pulse 1s ease-in-out infinite' }} />
            <span style={{ fontSize: '14px', color: '#f9a8d4' }}>{s.listening}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '14px 16px', background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px',
          color: '#fca5a5', fontSize: '14px', marginBottom: '16px',
        }}>⚠️ {error}</div>
      )}

      {/* Analyze button */}
      <button className="btn-primary" onClick={analyze} disabled={!isReady}
        style={{ width: '100%', padding: '18px', fontSize: '17px', opacity: isReady ? 1 : 0.4, marginBottom: '24px' }}>
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{
              width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block',
            }} />
            {s.analyzing}
          </span>
        ) : s.button}
      </button>
    </div>
  );
}
