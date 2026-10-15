import React from 'react';
import { ScriptPackage } from '../types';
import { X, Clock, Trash2, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedScripts: ScriptPackage[];
  onLoadScript: (script: ScriptPackage) => void;
  onDeleteScript: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedScripts,
  onLoadScript,
  onDeleteScript,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in-20">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right-40 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Riwayat Naskah Tersimpan</h3>
              <p className="text-xs text-slate-400">{savedScripts.length} naskah siap pakai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedScripts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3 text-slate-500">
              <Layers className="w-10 h-10 mx-auto text-slate-600 opacity-50" />
              <p className="text-sm">Belum ada naskah yang tersimpan.</p>
              <p className="text-xs text-slate-600">
                Setiap kali kamu membuat skrip baru, naskah akan otomatis tersimpan di sini.
              </p>
            </div>
          ) : (
            savedScripts.map((script) => {
              const primaryTitle = script.titles[0]?.title || script.topicSummary;
              return (
                <div
                  key={script.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 space-y-2 group transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-red-400" />
                      {script.estimatedTotalDuration || '3-5 menit'}
                    </span>
                    <span>{script.createdAt ? new Date(script.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                    {primaryTitle}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {script.topicSummary}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <button
                      onClick={() => onDeleteScript(script.id || '')}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Hapus naskah ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onLoadScript(script);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <span>Buka di Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedScripts.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
            >
              Hapus Semua Riwayat
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
