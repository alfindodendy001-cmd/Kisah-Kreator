import React, { useState } from 'react';
import { Sparkles, Wand2, X, Flame, MessageSquare, Zap, Clock, RefreshCw } from 'lucide-react';

interface ScriptRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (instruction: string, targetSection: string) => void;
  isLoading: boolean;
}

export const ScriptRefineModal: React.FC<ScriptRefineModalProps> = ({
  isOpen,
  onClose,
  onRefine,
  isLoading,
}) => {
  const [instruction, setInstruction] = useState('');
  const [targetSection, setTargetSection] = useState('Seluruh Naskah');

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: '🔥 Bikin Hook 5 Detik Lebih Nendang',
      text: 'Ubah hook 0-5 detik pertama agar jauh lebih memicu rasa penasaran ("stop-scrolling"), pakai kalimat paradoks atau fakta tak terduga.',
      section: 'Hook (00:00 - 00:05)',
    },
    {
      label: '💬 Bikin Lebih Kasual & Santai',
      text: 'Gunakan gaya bahasa obrolan santai anak muda / nongkrong di cafe, hindari istilah ilmiah yang terlalu kaku tanpa analogi mudah.',
      section: 'Seluruh Naskah',
    },
    {
      label: '🤯 Perkuat Plot Twist & Sudut Pandang Unik',
      text: 'Berikan twist sudut pandang yang lebih mengejutkan (mindblown) sebelum kesimpulan, sehingga penonton tidak menyangka.',
      section: 'Twist & Sudut Pandang Unik',
    },
    {
      label: '⚡ Ringkas & Percepat Ritme',
      text: 'Pangkas kata-kata yang bertele-tele, percepat tempo kalimat, dan buat transisi antar segmen lebih tajam.',
      section: 'Seluruh Naskah',
    },
    {
      label: '🎯 Bikin 3 Opsi Judul Baru yang Lebih Viral',
      text: 'Buat 3 opsi judul baru dengan formula rasa penasaran yang berbeda (misal: "Kenapa Kita...", "Jangan Pernah...", atau angka rahasia).',
      section: 'Opsi Judul & Thumbnail',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isLoading) return;
    onRefine(instruction, targetSection);
  };

  const handleSelectQuick = (p: { text: string; section: string }) => {
    setInstruction(p.text);
    setTargetSection(p.section);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Revisi & Modifikasi Naskah AI</h3>
              <p className="text-xs text-slate-400">Sesuaikan tone, perkuat hook, atau minta sudut pandang berbeda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Pilihan Modifikasi Cepat:
          </label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuick(q)}
                className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-xl transition-all text-left cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target Bagian yang Diubah:
            </label>
            <select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="Seluruh Naskah">Seluruh Naskah (Judul, Deskripsi & Tabel)</option>
              <option value="Hook (00:00 - 00:05)">Hook 5 Detik Pertama</option>
              <option value="Opsi Judul & Thumbnail">Opsi Judul & Thumbnail</option>
              <option value="Twist & Sudut Pandang Unik">Bagian Twist / Mindblown</option>
              <option value="Kesimpulan & Pertanyaan Komentar">Kesimpulan & Pertanyaan Komentar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Instruksi Revisi Spesifik:
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              placeholder="Contoh: Buat analogi lebih dekat dengan kehidupan sehari-hari orang Indonesia, dan tambahkan humor santai di pembuka."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !instruction.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses Revisi...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Terapkan Revisi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
