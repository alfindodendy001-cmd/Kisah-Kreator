import React, { useState } from 'react';
import { ScriptMetadata } from '../types';
import { Copy, Check, Hash, Tag, FileText, Zap } from 'lucide-react';

interface MetadataSectionProps {
  metadata: ScriptMetadata;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata }) => {
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAllTags, setCopiedAllTags] = useState(false);
  const [copiedTagIdx, setCopiedTagIdx] = useState<number | null>(null);

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(metadata.description);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleCopyAllTags = () => {
    // Comma-separated format is exactly what YouTube Studio expects
    const tagString = metadata.tags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopiedAllTags(true);
    setTimeout(() => setCopiedAllTags(false), 2000);
  };

  const handleCopySingleTag = (tag: string, idx: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedTagIdx(idx);
    setTimeout(() => setCopiedTagIdx(null), 1500);
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              METADATA & DESKRIPSI
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SEO & Algoritma YouTube
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deskripsi ringkas 2-3 kalimat siap paste + rekomendasi 5-8 tag/keywords utama
            </p>
          </div>
        </div>

        {metadata.hookFormulaUsed && (
          <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Formula Hook:</span>
            <span className="font-semibold text-slate-200">{metadata.hookFormulaUsed}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Description Box */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Deskripsi YouTube (2-3 Kalimat):
            </label>
            <button
              onClick={handleCopyDesc}
              className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {copiedDesc ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Deskripsi</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans relative">
            <p className="whitespace-pre-line">{metadata.description}</p>

            {metadata.hashtags && metadata.hashtags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {metadata.hashtags.map((ht, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {ht.startsWith('#') ? ht : `#${ht}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags / Keywords Box */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Tag & Keywords Utama (5-8 Tag):
            </label>
            <button
              onClick={handleCopyAllTags}
              className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Salin dalam format koma siap paste di YouTube Studio"
            >
              {copiedAllTags ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Semua Tag Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Format YouTube Studio</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 min-h-[110px] flex flex-wrap content-start gap-1.5">
            {metadata.tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleCopySingleTag(tag, idx)}
                className="group text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="Klik untuk salin tag ini"
              >
                <span>{tag}</span>
                {copiedTagIdx === idx ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Klik tag satuan atau klik "Salin Format YouTube Studio" untuk paste langsung ke kolom tags saat upload.
          </p>
        </div>
      </div>
    </section>
  );
};
