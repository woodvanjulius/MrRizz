import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Flame,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface JuliusChatProps {
  initialPrompt?: string;
  userApiKey?: string;
}

export const JuliusChat: React.FC<JuliusChatProps> = ({
  initialPrompt,
  userApiKey,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `What's good! I'm Julius, your romantic AI wingman powered by Google Gemini.

Whether you want to spark butterflies, turn friendly banter into deep romantic chemistry, craft an unforgettable date invite, or revive a dry conversation, I'm locked in.

Paste her text, share the situation, or ask me for a line — let's make magic happen.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const quickPrompts = [
    'How do I give her butterflies with a romantic text?',
    'What is a smooth, romantic way to ask her out for dinner?',
    'She gave me a 1-word "haha". How do I revive the romantic spark?',
    'How do I transition friendly banter into deep romantic tension?',
    'Give me a charming, swoon-worthy opener for a girl who loves travel',
    'How do I double-text romantically without looking needy?',
  ];

  const handleSend = async (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userApiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get wingman reply');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `julius-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Let me recalibrate that. Send me her last text again!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Julius Chat Error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `My bad, connection stuttered: ${err.message || 'Check connection'}. Hit me with that question again!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    if (confirm('Start a fresh wingman session with Julius?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: "Clean slate! Who are we texting now? Drop the details or paste her message.",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 flex flex-col h-[650px] shadow-2xl overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Flame className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Julius
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-violet-400" />
                Google Gemini
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Online & analyzing romantic chemistry 24/7
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          title="Reset conversation"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-b border-white/5 bg-black/20 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] text-slate-500 font-medium flex-shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Tactics:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0 text-violet-300">
                  <Flame className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-xs shadow-md shadow-rose-500/10'
                      : 'bg-[#121526] border border-white/10 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 pl-1">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied advice</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-rose-500/30 border border-rose-500/40 flex items-center justify-center flex-shrink-0 text-rose-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0 text-violet-300">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-[#121526] border border-white/10 p-3 rounded-2xl rounded-bl-xs text-xs text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Julius is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-[#090a10]/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Julius: 'How do I reply to this?' or 'Give me a witty date invite'..."
            className="flex-1 bg-[#121526] border border-white/15 focus:border-violet-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-violet-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
