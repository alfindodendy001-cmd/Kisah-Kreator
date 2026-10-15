import React from 'react';
import { Zap, AlertCircle, Sparkles, Compass, MessageCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export const StorytellingGuide: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Hook 5 Detik Pertama',
      time: '00:00 - 00:05',
      desc: 'Mencuri perhatian instan dengan paradoks, pertanyaan mengejutkan, atau kalimat provokatif ilmiah. Mencegah penonton swipe/skip.',
      color: 'border-red-500/40 text-red-400 bg-red-500/10',
    },
    {
      num: '02',
      title: 'Orientasi & Masalah Relatable',
      time: '00:05 - 00:30',
      desc: 'Membawa penonton ke situasi nyata yang sering mereka rasakan, membangun empati dan rasa "Wah iya ya, kenapa bisa gitu?".',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      num: '03',
      title: 'Fakta & Penjelasan Menarik',
      time: '00:30 - 02:30',
      desc: 'Mengupas sains, sejarah, atau riset dengan analogi membumi (bukan baca ensiklopedia). Visual B-roll & SFX dinamis tiap 4-7 detik.',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      num: '04',
      title: 'Twist / Sudut Pandang Unik',
      time: '02:30 - 03:45',
      desc: 'Momen "mindblown" yang mematahkan asumsi awam. Menghadirkan fakta yang jarang diketahui publik.',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      num: '05',
      title: 'Kesimpulan & CTA Interaktif',
      time: '03:45 - 04:30',
      desc: 'Pesan penutup filosofis dan pertanyaan diskusi spesifik untuk membanjiri kolom komentar dengan interaksi penonton.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Formula Alur Storytelling YouTube Viral
          </h3>
          <p className="text-xs text-slate-400">
            Standar struktur narasi retensi tinggi (high audience retention) yang digunakan di kanal edukasi kelas atas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((st, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${st.color}`}>
                  {st.num}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{st.time}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">{st.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center gap-3 text-xs text-slate-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Setiap naskah yang dihasilkan otomatis menyertakan <strong>3 Opsi Judul & Ide Thumbnail</strong>, <strong>Deskripsi & 5-8 Tag SEO</strong>, serta <strong>Tabel Naskah 3 Kolom (Timestamp, Visual/SFX/BGM, dan Voice Over)</strong>.
        </span>
      </div>
    </div>
  );
};
