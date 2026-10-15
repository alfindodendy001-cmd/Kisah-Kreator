import React, { useState } from 'react';
import { StoryboardRow } from '../types';
import {
  Copy,
  Check,
  Clapperboard,
  Music,
  Volume2,
  Mic,
  MessageSquare,
  FileDown,
  Download,
  Printer,
  Sparkles,
  Flame,
  HelpCircle,
  Clock,
  Eye,
  Radio,
} from 'lucide-react';

interface StoryboardTableSectionProps {
  storyboard: StoryboardRow[];
  closingQuestion: string;
  totalDurationText: string;
  wordCount?: number;
  onOpenTeleprompter: () => void;
  onOpenRefine: () => void;
}

export const StoryboardTableSection: React.FC<StoryboardTableSectionProps> = ({
  storyboard,
  closingQuestion,
  totalDurationText,
  wordCount,
  onOpenTeleprompter,
  onOpenRefine,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedRowIdx, setCopiedRowIdx] = useState<number | null>(null);

  // Calculate estimated speaking time at 140 WPM
  const computedWords = wordCount || storyboard.reduce((acc, row) => acc + row.narrationText.split(/\s+/).filter(Boolean).length, 0);
  const estimatedVoMinutes = (computedWords / 140).toFixed(1);

  const getStageBadgeColor = (stage: string) => {
    const s = stage.toLowerCase();
    if (s.includes('hook')) return 'bg-red-500/20 text-red-300 border-red-500/40 ring-1 ring-red-500/30';
    if (s.includes('orientasi') || s.includes('masalah')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (s.includes('fakta') || s.includes('penjelasan')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (s.includes('twist') || s.includes('sudut')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30';
    if (s.includes('kesimpulan') || s.includes('cta')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const handleCopyAllScript = () => {
    let text = `# SKRIP STORYTELLING YOUTUBE\n\n`;
    text += `| Durasi/Timestamp | Visual & Audio Effect | Narasi Teks (VO) |\n`;
    text += `| :--- | :--- | :--- |\n`;
    storyboard.forEach((row) => {
      text += `| **${row.timestamp}**<br>_[${row.stage}]_ | ${row.visualAndAudioEffect.replace(/\n/g, ' ')} | ${row.narrationText.replace(/\n/g, ' ')} |\n`;
    });
    text += `\n\n### PERTANYAAN INTERAKSI KOMENTAR:\n"${closingQuestion}"\n`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let content = `# SKRIP STORYTELLING YOUTUBE\n\n`;
    content += `Perkiraan Durasi: ${totalDurationText} | Estimasi Kata VO: ${computedWords} kata\n\n`;
    content += `| Durasi/Timestamp | Visual & Audio Effect | Narasi Teks (VO) |\n`;
    content += `| :--- | :--- | :--- |\n`;
    storyboard.forEach((row) => {
      content += `| ${row.timestamp} [${row.stage}] | ${row.visualAndAudioEffect} | ${row.narrationText} |\n`;
    });
    content += `\n---\n### Pertanyaan Diskusi Komentar:\n${closingQuestion}\n`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skrip-youtube-storytelling.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRow = (row: StoryboardRow, idx: number) => {
    const text = `[${row.timestamp}] (${row.stage})\nVISUAL & AUDIO: ${row.visualAndAudioEffect}\nNARASI VO: ${row.narrationText}`;
    navigator.clipboard.writeText(text);
    setCopiedRowIdx(idx);
    setTimeout(() => setCopiedRowIdx(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              SKRIP VIDEO (Tabel Narasi & Visual)
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Format 3 Kolom Standar Industri
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hook 5 detik, orientasi masalah, fakta & analogi, twist unik, hingga kesimpulan & CTA
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTeleprompter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 transition-all cursor-pointer"
            title="Buka naskah dalam mode teleprompter untuk rekaman VO"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Mode Teleprompter VO</span>
          </button>

          <button
            onClick={onOpenRefine}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="Minta AI memodifikasi atau memperbaiki naskah"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Revisi AI</span>
          </button>

          <button
            onClick={handleCopyAllScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Salin seluruh naskah tabel ke clipboard"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Download file naskah .md"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Cetak atau simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Voice Over Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span>Estimasi Durasi Video: <strong className="text-white">{totalDurationText}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Kata VO: <strong className="text-white">{computedWords} kata</strong> (~{estimatedVoMinutes} menit bicara santai)</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Target pacing VO: <span className="text-slate-200 font-medium">130-150 kata per menit</span>
        </div>
      </div>

      {/* The 3-Column Storyboard Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-inner">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="py-3.5 px-4 w-[160px] font-bold">
                [Durasi / Timestamp]
              </th>
              <th className="py-3.5 px-4 w-[35%] font-bold">
                [Visual & Audio Effect]
              </th>
              <th className="py-3.5 px-4 font-bold">
                [Narasi Teks - Voice Over]
              </th>
              <th className="py-3.5 px-2 w-[40px] text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
            {storyboard.map((row, idx) => {
              const isHook = row.stage.toLowerCase().includes('hook') || idx === 0;
              const isTwist = row.stage.toLowerCase().includes('twist');

              return (
                <tr
                  key={idx}
                  className={`group transition-colors ${
                    isHook
                      ? 'bg-red-950/20 hover:bg-red-950/30'
                      : isTwist
                      ? 'bg-purple-950/15 hover:bg-purple-950/25'
                      : idx % 2 === 0
                      ? 'bg-slate-900/50 hover:bg-slate-850'
                      : 'bg-slate-950/40 hover:bg-slate-850'
                  }`}
                >
                  {/* Column 1: Timestamp & Stage */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1.5">
                      <span className="font-mono text-xs font-bold text-slate-100 block bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 w-fit">
                        {row.timestamp}
                      </span>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStageBadgeColor(
                          row.stage
                        )}`}
                      >
                        {row.stage}
                      </span>
                      {row.toneDeliveryCue && (
                        <div className="text-[10px] text-amber-300/90 italic flex items-center gap-1">
                          <Mic className="w-2.5 h-2.5 shrink-0" />
                          <span>{row.toneDeliveryCue}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Visual & Audio Effect */}
                  <td className="py-3.5 px-4 align-top text-slate-300 leading-relaxed font-sans">
                    <div className="space-y-2">
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/90 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1 text-[11px]">
                          <Clapperboard className="w-3 h-3 text-red-400 shrink-0" />
                          <span>Arahan Visual & Audio:</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-line">
                          {row.visualAndAudioEffect}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Voice Over Text */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="text-slate-100 font-normal leading-relaxed text-xs sm:text-sm pl-2 border-l-2 border-red-500/40">
                      <p className="whitespace-pre-line selection:bg-red-500/40 font-['Plus_Jakarta_Sans',sans-serif]">
                        {row.narrationText}
                      </p>
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 px-2 align-top text-center">
                    <button
                      onClick={() => handleCopyRow(row, idx)}
                      className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Salin baris ini"
                    >
                      {copiedRowIdx === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Special Callout: Closing Discussion Question for Comment Engagement */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-950 border border-red-500/30 flex items-start gap-3.5 shadow-lg">
        <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
              Pertanyaan Pancingan Interaksi Komentar
            </h4>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.2 rounded-full border border-red-500/30">
              Menaikkan Algoritma YouTube
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-white leading-snug">
            "{closingQuestion}"
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan pertanyaan ini tepat sebelum penutup/outro video dan sematkan juga di komentar pertama (pinned comment) untuk memicu ratusan komentar penonton.
          </p>
        </div>
      </div>
    </section>
  );
};
