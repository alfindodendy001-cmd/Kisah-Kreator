import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Clock, Bug, Flame, Waves, Radio, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { PRESET_TOPICS } from '../data/presets';
import { PresetTopic } from '../types';

interface TopicInputFormProps {
  onGenerate: (data: {
    topic: string;
    duration: 'shorts' | 'medium' | 'deep';
    tone: string;
    targetAudience: string;
    additionalNotes: string;
  }) => void;
  isLoading: boolean;
}

const ICONS: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-3.5 h-3.5" />,
  Bug: <Bug className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />,
  Waves: <Waves className="w-3.5 h-3.5" />,
  Radio: <Radio className="w-3.5 h-3.5" />,
};

export const TopicInputForm: React.FC<TopicInputFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<'shorts' | 'medium' | 'deep'>('medium');
  const [tone, setTone] = useState('Kasual, komunikatif & santai (storyteller asik & engaging)');
  const [targetAudience, setTargetAudience] = useState('Audiens umum yang haus rasa penasaran & pengetahuan');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onGenerate({
      topic,
      duration,
      tone,
      targetAudience,
      additionalNotes,
    });
  };

  const handleSelectPreset = (preset: PresetTopic) => {
    setTopic(preset.roughPrompt);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-7 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Glow background decorative effects */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Ide Kasar atau Topik Video
            </label>
            <span className="text-xs text-slate-400">
              Bisa berupa pertanyaan penasaran, fenomena unik, atau fakta acak
            </span>
          </div>

          <textarea
            id="topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Kenapa kita merinding saat mendengar suara kuku menggores papan tulis? Atau: Kenapa peradaban Mesir Kuno tiba-tiba runtuh?"
            rows={3}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition-all resize-y min-h-[90px]"
            required
          />
        </div>

        {/* Preset Inspirations */}
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Ide Populer Siap Pakai (Klik untuk mengisi):
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="group text-left text-xs bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-2"
              >
                <span className="text-red-400 group-hover:scale-110 transition-transform">
                  {ICONS[preset.iconName] || <Sparkles className="w-3 h-3" />}
                </span>
                <span className="font-medium truncate max-w-[220px] sm:max-w-xs">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Target Duration Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setDuration('shorts')}
            className={`p-3 rounded-xl border text-left transition-all ${
              duration === 'shorts'
                ? 'bg-red-500/10 border-red-500/60 text-white shadow-md shadow-red-500/10 ring-1 ring-red-500/30'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">⚡ Shorts / Reels</span>
              <span className="text-[11px] font-medium text-slate-400">~60 Detik</span>
            </div>
            <p className="text-xs text-slate-300">Tempo cepat, hook instan 3-5 detik, narasi padat tanpa jeda.</p>
          </button>

          <button
            type="button"
            onClick={() => setDuration('medium')}
            className={`p-3 rounded-xl border text-left transition-all relative ${
              duration === 'medium'
                ? 'bg-red-500/10 border-red-500/60 text-white shadow-md shadow-red-500/10 ring-1 ring-red-500/30'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="absolute -top-2 right-3 px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-red-600 text-white rounded-full">
              Rekomendasi
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">🎬 Standar Story</span>
              <span className="text-[11px] font-medium text-slate-400">3 - 5 Menit</span>
            </div>
            <p className="text-xs text-slate-300">Format ideal YouTube: alur bertahap dengan analogi dan plot twist.</p>
          </button>

          <button
            type="button"
            onClick={() => setDuration('deep')}
            className={`p-3 rounded-xl border text-left transition-all ${
              duration === 'deep'
                ? 'bg-red-500/10 border-red-500/60 text-white shadow-md shadow-red-500/10 ring-1 ring-red-500/30'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">🔍 Deep Dive</span>
              <span className="text-[11px] font-medium text-slate-400">8 - 12 Menit</span>
            </div>
            <p className="text-xs text-slate-300">Format mini dokumenter mendalam, riset arsip, studi kasus detail.</p>
          </button>
        </div>

        {/* Advanced Accordion for Tone, Audience & Custom Directives */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium py-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Kustomisasi Gaya Bahasa & Audiens ({showAdvanced ? 'Tutup' : 'Buka'})</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3.5 animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Gaya Bahasa & Tone Narasi
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Kasual, komunikatif & santai (storyteller asik & engaging)">
                      Kasual & Santai (Seperti ngobrol di cafe / Kok Bisa style)
                    </option>
                    <option value="Misterius, menegangkan & bikin penasaran (Kamar Gelap / Nessie style)">
                      Misterius & Tegang (Fokus sensasi misteri & rasa penasaran)
                    </option>
                    <option value="Eksploratif, mindblown & sains seru (Veritasium / Kurzgesagt style)">
                      Mindblown & Sains Spektakuler (Analogi visual & wow-factor)
                    </option>
                    <option value="Reflektif, filosofis & membuka wawasan (Satu Persen style)">
                      Reflektif & Filosofis (Kaitan dengan hidup sehari-hari)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Audiens Penonton
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Audiens umum yang haus rasa penasaran & pengetahuan">
                      Audiens Umum (Bahasa mudah dimengerti, analogi membumi)
                    </option>
                    <option value="Remaja & Gen Z (Dinamis, visual meme-friendly, to the point)">
                      Remaja & Gen Z (Dinamis, tempo tinggi, relatable)
                    </option>
                    <option value="Mahasiswa & Curious Thinkers (Fakta ilmiah akurat & data statistik)">
                      Curious Thinkers (Riset lebih mendalam, data & fakta tajam)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Tambahan untuk AI Scriptwriter (Opsional)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Misal: 'Tolong beri analogi dengan segelas boba' atau 'Tekankan plot twist di menit kedua'"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-bold py-3.5 px-6 shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyusun Naskah Storytelling & Storyboard...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                <span>Rakit Skrip Video Storytelling Sekarang</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
