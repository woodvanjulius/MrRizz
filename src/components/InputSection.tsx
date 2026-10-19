import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  X,
  Flame,
  Laugh,
  Coffee,
  HeartHandshake,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { MoodType, LengthType } from '../types';
import { SAMPLE_CHATS } from '../data/datingKnowledge';

interface InputSectionProps {
  onAnalyze: (payload: {
    text: string;
    screenshot: string | null;
    mood: MoodType;
    length: LengthType;
    context: string;
  }) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'text' | 'screenshot'>('text');
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [mood, setMood] = useState<MoodType>('romantic');
  const [length, setLength] = useState<LengthType>('medium');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler to paste screenshot anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            setActiveInputMode('screenshot');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSample = (sample: typeof SAMPLE_CHATS[0]) => {
    setText(sample.text);
    setContext(sample.context);
    setShowContext(true);
    setMood(sample.mood as MoodType);
    setActiveInputMode('text');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !screenshot) {
      alert('Please either type/paste her message or upload a screenshot.');
      return;
    }
    onAnalyze({
      text: text.trim(),
      screenshot,
      mood,
      length,
      context: context.trim(),
    });
  };

  const moods: {
    id: MoodType;
    label: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    bg: string;
    description: string;
    vibeTag: string;
  }[] = [
    {
      id: 'romantic',
      label: 'Romantic',
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      color: 'text-rose-400',
      border: 'border-rose-500/50',
      bg: 'bg-rose-500/15',
      description: 'Heartfelt, swoon-worthy charm, deep chemistry, making her feel cherished and special.',
      vibeTag: 'Swoon & Chemistry',
    },
    {
      id: 'flirty',
      label: 'Flirty',
      icon: <Flame className="w-4 h-4 text-pink-400" />,
      color: 'text-pink-400',
      border: 'border-pink-500/40',
      bg: 'bg-pink-500/10',
      description: 'Warm, teasing, curious. Intimate questions welcome (what was your first kiss like?).',
      vibeTag: 'Tease & Hook',
    },
    {
      id: 'spicy',
      label: 'Spicy',
      icon: <Zap className="w-4 h-4 text-rose-400" />,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      description: 'Noticeably bolder, electric tension & confident innuendo. Matches her energy, never creeps.',
      vibeTag: 'High Tension',
    },
    {
      id: 'funny',
      label: 'Funny',
      icon: <Laugh className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      description: 'Playful meme-style, nervous-cute, tiktok/late-night jokes, made-up percentages.',
      vibeTag: 'Playful Wit',
    },
    {
      id: 'casual',
      label: 'Casual',
      icon: <Coffee className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      description: 'Relaxed, natural, zero pressure, effortless cool.',
      vibeTag: 'Smooth & Chill',
    },
    {
      id: 'motivating',
      label: 'Motivating',
      icon: <HeartHandshake className="w-4 h-4 text-violet-400" />,
      color: 'text-violet-400',
      border: 'border-violet-500/40',
      bg: 'bg-violet-500/10',
      description: 'Encouraging, confident, supportive, hyping her up with charm.',
      vibeTag: 'Hype & Support',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Header bar of input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Decode & Generate Romantic High-Rizz Replies</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-violet-400" />
              Google Gemini API
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Paste her text or upload a screenshot. Julius uses Google Gemini to read her genuine romantic interest and craft 5 magnetic replies.
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveInputMode('text')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeInputMode === 'text'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('screenshot')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeInputMode === 'screenshot'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload Screenshot
            {screenshot && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {activeInputMode === 'text' ? (
          <div className="space-y-3">
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Her Message / What She Replied:
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. 'haha yeah it was fun, what are you doing this weekend? 👀' or 'k lol'"
                rows={3}
                className="w-full bg-[#0d0f1a] border border-white/15 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all resize-y"
              />
              <span className="absolute bottom-2.5 right-3 text-[11px] text-slate-500">
                Tip: Press Ctrl+V anytime to paste screenshots directly!
              </span>
            </div>

            {/* Optional Context toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showContext ? 'Hide extra context' : '+ Add extra context (Your last text, dating app bio, or backstory)'}
              </button>

              {showContext && (
                <div className="mt-2 animate-fadeIn">
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. 'We met on Hinge 2 days ago, she loves Italian food and live music. My last text was teasing her about pineapple pizza.'"
                    rows={2}
                    className="w-full bg-[#0d0f1a]/80 border border-white/10 focus:border-violet-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Screenshot Mode */
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Upload Chat Screenshot (iMessage, WhatsApp, Tinder, Hinge, Bumble, IG):
            </label>

            {!screenshot ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
                    : 'border-white/15 hover:border-violet-500/50 bg-[#0d0f1a]/60 hover:bg-[#0d0f1a]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3 text-violet-400">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  Click to browse or drag & drop screenshot here
                </p>
                <p className="text-xs text-slate-400">
                  Supports PNG, JPG, WEBP. You can also press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[11px] text-slate-200">Ctrl+V</kbd> anywhere!
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl border border-violet-500/40 bg-[#0d0f1a] p-3 flex items-center gap-4">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-white/20 bg-black flex-shrink-0">
                  <img
                    src={screenshot}
                    alt="Chat Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Screenshot Ready
                    </span>
                    <span className="text-xs text-slate-400 truncate">{screenshotName || 'Pasted image'}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Julius will read the entire visual chat history, timestamps, sender bubbles, and emojis.
                  </p>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Optional note: (e.g. 'I want to ask her out for coffee')"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-colors"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Testing Samples */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium flex-shrink-0">Try a sample:</span>
          {SAMPLE_CHATS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(sample)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Mood Selector (Flirty, Spicy, Funny, Casual, Motivating) */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              Select Target Mood:
            </label>
            <span className="text-xs text-slate-400">
              Selected: <strong className="text-white capitalize">{mood}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {moods.map((m) => {
              const isSelected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? `${m.bg} ${m.border} shadow-lg ring-1 ring-white/20 scale-[1.02]`
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                      {m.icon}
                      {m.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-mono">
                      {m.vibeTag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reply Length Selector (Short, Medium, Long) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Reply Length:
            </span>
            <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10">
              {(['short', 'medium', 'long'] as LengthType[]).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLength(len)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    length === len
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {len === 'short' ? '⚡ Short (<12 words)' : len === 'medium' ? '💬 Medium (1-2 lines)' : '📜 Detailed'}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemini is reading romantic signals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Generate 5 Romantic Replies • Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
