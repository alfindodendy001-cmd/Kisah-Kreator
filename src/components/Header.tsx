import React from 'react';
import { Video, Sparkles, History, Radio, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  savedCount: number;
  currentMode: 'studio' | 'teleprompter';
  onSwitchMode: (mode: 'studio' | 'teleprompter') => void;
  hasScript: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  savedCount,
  currentMode,
  onSwitchMode,
  hasScript,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-red-400/30">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg lg:text-xl tracking-tight text-white font-['Cabinet_Grotesk',sans-serif]">
                Kisah<span className="text-red-500">Kreator</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 tracking-wide uppercase">
                Storyteller Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Scriptwriter & Content Strategist YouTube Pengetahuan Umum
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasScript && (
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => onSwitchMode('studio')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentMode === 'studio'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Studio Naskah
              </button>
              <button
                onClick={() => onSwitchMode('teleprompter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentMode === 'teleprompter'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-200" />
                Teleprompter VO
              </button>
            </div>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
            title="Lihat naskah yang tersimpan"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Riwayat Naskah</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/40">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
