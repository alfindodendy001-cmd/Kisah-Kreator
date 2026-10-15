import React, { useState } from 'react';
import { ThumbnailConcept } from '../types';
import { Image, Copy, Check, Sparkles, Sliders, Eye } from 'lucide-react';

interface ThumbnailMockupProps {
  concept: ThumbnailConcept;
  selectedTitle: string;
  durationText?: string;
}

export const ThumbnailMockup: React.FC<ThumbnailMockupProps> = ({
  concept,
  selectedTitle,
  durationText = '04:15',
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [theme, setTheme] = useState<'danger' | 'mystery' | 'shock' | 'cosmic'>('danger');

  const themes = {
    danger: {
      bg: 'from-zinc-950 via-neutral-900 to-red-950',
      accentGlow: 'bg-red-500/25',
      badgeBg: 'bg-red-600',
      textColor: 'text-amber-300',
      tagText: 'Merah Dramatis',
    },
    mystery: {
      bg: 'from-slate-950 via-slate-900 to-blue-950',
      accentGlow: 'bg-cyan-500/25',
      badgeBg: 'bg-cyan-600',
      textColor: 'text-cyan-300',
      tagText: 'Misteri Dingin',
    },
    shock: {
      bg: 'from-zinc-950 via-neutral-900 to-amber-950',
      accentGlow: 'bg-yellow-500/30',
      badgeBg: 'bg-amber-500',
      textColor: 'text-yellow-400',
      tagText: 'Peringatan / Syok',
    },
    cosmic: {
      bg: 'from-black via-purple-950 to-indigo-950',
      accentGlow: 'bg-purple-500/30',
      badgeBg: 'bg-purple-600',
      textColor: 'text-fuchsia-300',
      tagText: 'Kosmik & Fiksi Ilmiah',
    },
  };

  const currentTheme = themes[theme];

  const handleCopyPrompt = () => {
    const promptText = `YouTube thumbnail photography, cinematic lighting: ${concept.mainSubject}, ${concept.facialExpressionOrMood}, high contrast, dramatic background: ${concept.backgroundAndColors}, YouTube storytelling aesthetic, rule of thirds, photorealistic, 8k resolution, Unreal Engine 5 render style.`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-red-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Preview Visual Mockup Thumbnail
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Palet:</span>
          {(['danger', 'mystery', 'shock', 'cosmic'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                theme === t
                  ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-500'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {themes[t].tagText}
            </button>
          ))}
        </div>
      </div>

      {/* 16:9 Thumbnail Canvas Mockup */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-gradient-to-br select-none">
        {/* Background gradient simulating lighting */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentTheme.bg}`} />
        
        {/* Cinematic atmospheric glowing orbs */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${currentTheme.accentGlow}`} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl bg-black/60" />

        {/* Diagonal vignette line */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

        {/* Subject representation zone */}
        <div className="absolute inset-y-0 right-4 sm:right-8 w-1/2 flex items-center justify-center">
          <div className="text-center p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl max-w-[200px] sm:max-w-xs animate-in zoom-in-95">
            <span className="inline-block text-2xl sm:text-3xl mb-1">🎭</span>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-200 line-clamp-2">
              {concept.mainSubject}
            </p>
            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-slate-300">
              {concept.facialExpressionOrMood}
            </span>
          </div>
        </div>

        {/* Punchy Text Overlay (The 3-4 Words in Bold Impact Style) */}
        <div className="absolute bottom-6 left-4 sm:left-6 max-w-[65%] sm:max-w-[55%] z-10">
          <div className="inline-block">
            <span className="inline-block bg-black/80 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-wider mb-1 border border-red-500/30">
              FAKTA MENGEJUTKAN
            </span>
          </div>
          <h3
            className={`text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] ${currentTheme.textColor} font-['Cabinet_Grotesk',sans-serif]`}
            style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}
          >
            {concept.shortOverlayText || 'JANGAN DICOBA!'}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-300 mt-1 line-clamp-1 drop-shadow-md bg-black/40 px-1.5 py-0.5 rounded inline-block">
            Latar: {concept.backgroundAndColors}
          </p>
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[10px] font-bold tracking-wider border border-white/10">
          {durationText}
        </div>

        {/* 4K Badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-slate-300 text-[9px] font-bold tracking-wider border border-white/10">
          4K ULTRA HD
        </div>
      </div>

      {/* Simulated YouTube Feed Video Card underneath */}
      <div className="mt-3.5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
          KK
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 leading-snug">
            {selectedTitle || 'Judul Video YouTube Pilihan'}
          </h5>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <span>KisahKreator ID</span>
            <span>•</span>
            <span>128 rb x ditonton</span>
            <span>•</span>
            <span>4 jam yang lalu</span>
          </div>
        </div>
      </div>

      {/* Prompt generator copy button */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Tips CTR:</span> {concept.visualHookRationale || 'Kontras subjek ekspresif & teks 3-4 kata menaikkan rasio klik hingga 2-3x.'}
        </div>
        <button
          onClick={handleCopyPrompt}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
        >
          {copiedPrompt ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Prompt AI Disalin!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Salin Prompt AI Image Generator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
