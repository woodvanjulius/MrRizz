import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Globe,
  Github,
  Key,
  Check,
  Save,
  Server,
  Zap,
  Download,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userApiKey: string;
  setUserApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userApiKey,
  setUserApiKey,
}) => {
  const [tempKey, setTempKey] = useState(userApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setUserApiKey(tempKey.trim());
    localStorage.setItem('rizz_julius_custom_key', tempKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setTempKey('');
    setUserApiKey('');
    localStorage.removeItem('rizz_julius_custom_key');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-2xl border border-white/15 max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Deployment & API Resilience
              </h3>
              <p className="text-xs text-slate-400">
                Permanent Wingman Engine for AI Studio, Vercel & GitHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200">
            <strong className="text-white block font-semibold mb-0.5">
              Current Mode: Server-Side AI Studio Active
            </strong>
            The server automatically routes all screenshot vision and romantic reply generations via the official Google Gemini AI (@google/genai) SDK.
          </div>
        </div>

        {/* Vercel & GitHub Deployment Instructions */}
        <div className="space-y-2 text-xs text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Github className="w-3.5 h-3.5 text-purple-400" />
            How to deploy to Vercel & GitHub:
          </h4>
          <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 leading-relaxed">
            <li>Push this repository to your GitHub account.</li>
            <li>Import the project into Vercel or your hosting platform.</li>
            <li>
              Add the environment variable <code className="text-rose-300 font-mono">GEMINI_API_KEY</code> in Vercel project settings.
            </li>
            <li>
              Or alternatively, paste your personal Gemini API key below to enable standalone client fallback!
            </li>
          </ol>
        </div>

        {/* Export / Download Project Files */}
        <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-violet-400" />
              Extract / Export Source Code:
            </span>
            <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Ready to Download
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Download the complete source package with all components, Gemini backend server, and dependencies.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="/api/download-zip"
              download="rizzByJulius.zip"
              className="flex-1 py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download ZIP (.zip)
            </a>
            <a
              href="/api/download-tar"
              download="rizzByJulius.tar.gz"
              className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              Download TAR (.tar.gz)
            </a>
          </div>
        </div>

        {/* Optional Custom API Key (for external / standalone hosting) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            Optional Custom Gemini Key (for Vercel/Static Deploy):
          </label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIzaSy... (leave blank to use default server key)"
            className="w-full bg-[#0d0f1a] border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
          />
          <p className="text-[11px] text-slate-400">
            Saved securely in your browser's local storage for your personal deployment.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear custom key
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/20"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
