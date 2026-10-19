import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  MessageCircle,
  Eye,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisResult, ReplyOption } from '../types';

interface ResultsSectionProps {
  result: AnalysisResult;
  onSendToChat: (replyText: string) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  result,
  onSendToChat,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);

    // Fire joyful confetti burst!
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#a855f7', '#fbbf24', '#34d399'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      setCopiedId(null);
    }, 2200);
  };

  const getInterestBadge = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          indicator: 'bg-emerald-400',
          label: 'High Interest 🔥',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          indicator: 'bg-amber-400',
          label: 'Medium / Neutral ⚖️',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          indicator: 'bg-rose-400',
          label: 'Low / Guarded 🧊',
        };
    }
  };

  const badge = getInterestBadge(result.interestLevel);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Detected Exchange Banner */}
      {result.detectedChatSummary && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
            <span className="text-slate-400 flex-shrink-0 font-medium">Decoded Message:</span>
            <span className="font-semibold text-white truncate italic">
              "{result.detectedChatSummary.replace(/^Analyzed her message:\s*|^Exchange based on:\s*/i, '').replace(/["']/g, '')}"
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              {result.engine || 'Google Gemini AI'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30 flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
              Tailored to Her Words
            </span>
          </div>
        </div>
      )}

      {/* Overview Dashboard: Interest Level, Signal Decoder & Quick Tip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Interest Level Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -z-10" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                Interest Level
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.indicator} animate-ping`} />
                {badge.label}
              </span>
            </div>

            {/* Interest score progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Calculated Rizz Meter:</span>
                <span className="font-mono font-bold text-white">
                  {result.datingMetrics?.interestScore ?? 65}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(10, Math.min(100, result.datingMetrics?.interestScore ?? 65))}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              <strong className="text-white">Why: </strong>
              {result.interestWhy}
            </p>
          </div>

          {result.datingMetrics?.dryTexterWarning && (
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Dry Texter Alert detected — avoid long text essays!</span>
            </div>
          )}
        </div>

        {/* 2. What She Is Signaling Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -z-10" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-violet-400" />
                What She Is Signaling
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Subtext Decoded
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
              "{result.signaling}"
            </p>
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-slate-500">Next recommended move:</span>
            <span className="text-violet-300 font-semibold truncate">
              {result.datingMetrics?.recommendedNextMove || 'Match energy & tease'}
            </span>
          </div>
        </div>

        {/* 3. Julius's Quick Tip Card */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -z-10" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Wingman Quick Tip
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Rule of Thumb
              </span>
            </div>

            <p className="text-sm text-amber-100 font-medium leading-relaxed">
              {result.quickTip}
            </p>
          </div>

          {/* Green & Red Flag micro tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.datingMetrics?.greenFlags?.map((gf, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {gf}
              </span>
            ))}
            {result.datingMetrics?.redFlags?.map((rf, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20"
              >
                <ShieldAlert className="w-2.5 h-2.5" />
                {rf}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Five Reply Choices */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>5 Romantic High-Rizz Reply Options</span>
            </h3>
            <p className="text-xs text-slate-400">
              Handcrafted romantic banter and chemistry hooks powered by Google Gemini. 1-click copy directly to your clipboard.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            {result.replies?.length || 5} tailored romantic lines generated
          </span>
        </div>

        <div className="space-y-4">
          {result.replies?.map((reply, idx) => {
            const isCopied = copiedId === reply.id;

            return (
              <div
                key={reply.id || idx}
                className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-white/10 transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2.5">
                    {/* Badge and Option Number */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs uppercase tracking-wider text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                        {reply.label || `Option ${idx + 1}`}
                      </span>
                      {reply.vibe && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                          {reply.vibe}
                        </span>
                      )}
                    </div>

                    {/* The Reply Text Bubble */}
                    <div className="bg-[#0b0d18] border border-white/15 rounded-xl p-3.5 sm:p-4 text-white text-sm sm:text-base font-medium leading-relaxed select-all">
                      {reply.text}
                    </div>

                    {/* Why This Works note */}
                    <div className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">Why this works: </strong>
                        <span>{reply.whyItWorks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 sm:pt-1">
                    <button
                      onClick={() => handleCopy(reply.text, reply.id)}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-white/10 hover:bg-rose-500 hover:text-white text-slate-200 border border-white/15'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-scale" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Reply</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSendToChat(reply.text)}
                      title="Refine or ask Julius about this line"
                      className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-violet-300 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ask Julius</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
