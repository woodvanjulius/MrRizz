import React from 'react';
import { Flame, MessageSquare, Sparkles, BookOpen, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'chat' | 'playbook';
  setActiveTab: (tab: 'generator' | 'chat' | 'playbook') => void;
  openSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090a10]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-rose-500/20 blur-sm -z-10 group-hover:bg-rose-500/40 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                rizz<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400">ByJulius</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                Romantic Wingman
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300">
                <Sparkles className="w-2.5 h-2.5 text-violet-400" />
                Google Gemini
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Permanent Romantic Dating Intelligence powered by Google Gemini AI
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Reply Gen</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="relative">
              Julius Live
              <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
              <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-emerald-400" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab('playbook')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'playbook'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Dating Playbook</span>
            <span className="sm:hidden">Playbook</span>
          </button>
        </nav>

        {/* Deploy & Key Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={openSettings}
            title="Deploy & Settings"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
