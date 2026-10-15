import React, { useState } from 'react';
import { TitleOption, ThumbnailConcept } from '../types';
import { ThumbnailMockup } from './ThumbnailMockup';
import { Check, Copy, Flame, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface TitleAndThumbnailSectionProps {
  titles: TitleOption[];
  thumbnailConcept: ThumbnailConcept;
  durationText: string;
  selectedTitleIndex: number;
  onSelectTitle: (index: number) => void;
}

export const TitleAndThumbnailSection: React.FC<TitleAndThumbnailSectionProps> = ({
  titles,
  thumbnailConcept,
  durationText,
  selectedTitleIndex,
  onSelectTitle,
}) => {
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  const handleCopyTitle = (text: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(index);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const activeTitle = titles[selectedTitleIndex]?.title || titles[0]?.title || '';

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              OPSI JUDUL & THUMBNAIL
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Click-Worthy & High CTR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              3 pilihan judul pemancing rasa penasaran tanpa clickbait murahan + konsep visual thumbnail
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3 Titles */}
        <div className="lg:col-span-6 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Pilihan Judul (Pilih satu untuk preview):
          </h4>

          <div className="space-y-3">
            {titles.map((item, idx) => {
              const isSelected = selectedTitleIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectTitle(idx)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500/60 shadow-lg shadow-red-500/10 ring-1 ring-red-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      {item.type && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {item.type}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Dipilih
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyTitle(item.title, idx, e)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
                      title="Salin judul ini"
                    >
                      {copiedTitleIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-slate-100 mt-2 leading-snug">
                    {item.title}
                  </p>

                  <div className="mt-2 text-xs text-slate-400 border-t border-slate-800/60 pt-2 flex items-start gap-1.5">
                    <span className="text-slate-500 font-semibold shrink-0">Alasan Psikologis:</span>
                    <span className="text-slate-300">{item.angle}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Thumbnail Concept Breakdown */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-400" />
              Rincian Spesifikasi Visual Thumbnail:
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Subjek Utama:</span>
                <span className="text-slate-200 font-medium">{thumbnailConcept.mainSubject}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Ekspresi / Mood:</span>
                <span className="text-slate-200 font-medium">{thumbnailConcept.facialExpressionOrMood}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-semibold text-amber-400 block mb-0.5">Teks di Gambar (3-4 Kata):</span>
                <span className="text-amber-200 font-black tracking-wide">{thumbnailConcept.shortOverlayText}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Pencahayaan & Latar:</span>
                <span className="text-slate-200 font-medium">{thumbnailConcept.backgroundAndColors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup */}
        <div className="lg:col-span-6">
          <ThumbnailMockup
            concept={thumbnailConcept}
            selectedTitle={activeTitle}
            durationText={durationText}
          />
        </div>
      </div>
    </section>
  );
};
