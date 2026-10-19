import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { JuliusChat } from './components/JuliusChat';
import { DatingPlaybook } from './components/DatingPlaybook';
import { SettingsModal } from './components/SettingsModal';
import { MoodType, LengthType, AnalysisResult } from './types';
import {
  Flame,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'chat' | 'playbook'>('generator');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  useEffect(() => {
    const savedKey = localStorage.getItem('rizz_julius_custom_key');
    if (savedKey) {
      setUserApiKey(savedKey);
    }
  }, []);

  const handleAnalyze = async (payload: {
    text: string;
    screenshot: string | null;
    mood: MoodType;
    length: LengthType;
    context: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          userApiKey: userApiKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || 'Failed to analyze text.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

      // Trigger high rizz celebration
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // Scroll to results smoothly
      setTimeout(() => {
        const resultsEl = document.getElementById('rizz-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error analyzing message:', err);
      setError(err.message || 'Something went wrong while generating replies.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToChat = (replyText: string) => {
    setInitialChatPrompt(`Julius, I got this reply option: "${replyText}". How would you tweak it if she is usually dry or what should I say next if she replies positively?`);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero Section */}
        {activeTab === 'generator' && (
          <div className="relative text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              <span>Permanent Romantic Wingman • Powered by Google Gemini AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Paste Her Text.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400">
                Get 5 Romantic Replies.
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Upload a chat screenshot or paste her reply. Julius uses Google Gemini to read her genuine romantic signals,
              decode her subtext, and craft 5 swoon-worthy, magnetic replies that spark real chemistry.
            </p>

            {/* Quick feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3 h-3 text-violet-400" />
                Google Gemini API
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-1.5 font-medium">
                <Heart className="w-3 h-3 text-rose-400" />
                Swoon & Romantic Chemistry
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Romantic Interest Radar
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                6 Calibrated Moods
              </span>
            </div>
          </div>
        )}

        {/* Tab 1: Reply Generator (Core Feature) */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="flex-1">
                  <strong className="block font-semibold">Wingman Alert:</strong>
                  {error}
                </div>
                <button
                  onClick={() => setError(null)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Analysis Results Display */}
            {analysisResult && (
              <div id="rizz-results">
                <ResultsSection
                  result={analysisResult}
                  onSendToChat={handleSendToChat}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Julius Live Wingman Chat */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <span>Chat with Julius</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Ask your personal wingman anything: roast your bio, ask how to revive a dead chat, or when to ask for a date.
              </p>
            </div>
            <JuliusChat initialPrompt={initialChatPrompt} userApiKey={userApiKey} />
          </div>
        )}

        {/* Tab 3: Dating Playbook & Lingo */}
        {activeTab === 'playbook' && <DatingPlaybook />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#07080d] py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-300">rizzByJulius</span>
            <span>— Permanent AI Dating Wingman</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Calibrated for Tinder • Hinge • Bumble • iMessage • WhatsApp</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Built for dating confidence</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>

      {/* Settings & Deploy Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userApiKey={userApiKey}
        setUserApiKey={setUserApiKey}
      />
    </div>
  );
}
