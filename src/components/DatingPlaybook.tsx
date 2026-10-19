import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Flame,
  ShieldCheck,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { DATING_CONCEPTS } from '../data/datingKnowledge';
import confetti from 'canvas-confetti';

export const DatingPlaybook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const tags = ['All', 'Core Charisma', 'Technique', 'Closing Technique', 'Red Flag', 'Danger Warning', 'Phase 1', 'Strategy'];

  const filteredConcepts = DATING_CONCEPTS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wingmanRule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === 'All' || item.tag.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const handleCopy = (text: string, term: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(term);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Playbook Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-transparent blur-3xl -z-10" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Julius's Modern Dating & Texting Playbook
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Master the vocabulary, psychological red & green flags, and high-conversion texting tactics.
              From banishing dry texters to smoothly securing dates without needy double texting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
              {DATING_CONCEPTS.length} Tactical Rules
            </span>
          </div>
        </div>

        {/* Search & Tag Filter */}
        <div className="mt-5 space-y-3 pt-4 border-t border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts: 'ghosting', 'breadcrumbing', 'asking for date', 'red flag'..."
              className="w-full bg-[#0d0f1a] border border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex-shrink-0 text-xs px-3 py-1 rounded-lg border transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConcepts.map((item) => {
          const isCopied = copiedTerm === item.term;

          return (
            <div
              key={item.term}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>{item.term}</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
                  {item.definition}
                </p>

                {/* Wingman Rule */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-3 text-xs text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Wingman Rule:</span>
                  </div>
                  <p className="leading-relaxed">{item.wingmanRule}</p>
                </div>
              </div>

              {/* Example Line */}
              <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Field-Tested Line:
                  </span>
                  <p className="text-xs text-white font-medium italic truncate">
                    {item.example}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(item.example, item.term)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                  }`}
                  title="Copy example line"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Line</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
