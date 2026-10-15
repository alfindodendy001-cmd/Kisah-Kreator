import React, { useState, useEffect } from 'react';
import { ScriptPackage } from './types';
import { Header } from './components/Header';
import { TopicInputForm } from './components/TopicInputForm';
import { TitleAndThumbnailSection } from './components/TitleAndThumbnailSection';
import { MetadataSection } from './components/MetadataSection';
import { StoryboardTableSection } from './components/StoryboardTableSection';
import { TeleprompterModal } from './components/TeleprompterModal';
import { ScriptRefineModal } from './components/ScriptRefineModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { StorytellingGuide } from './components/StorytellingGuide';
import { AlertCircle, CheckCircle, Sparkles, RefreshCw, Layers } from 'lucide-react';

const STORAGE_KEY = 'kisahkreator_saved_scripts';

export default function App() {
  const [currentScript, setCurrentScript] = useState<ScriptPackage | null>(null);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedScripts, setSavedScripts] = useState<ScriptPackage[]>([]);

  // Load saved scripts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedScripts(parsed);
          // If no active script, set the first saved script if available
          if (parsed.length > 0 && !currentScript) {
            setCurrentScript(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca saved scripts dari localStorage:', e);
    }
  }, []);

  // Save scripts to localStorage when updated
  const saveScriptToStorage = (script: ScriptPackage) => {
    try {
      const updatedList = [
        script,
        ...savedScripts.filter((s) => s.id !== script.id && s.topicSummary !== script.topicSummary),
      ].slice(0, 20); // Keep last 20
      setSavedScripts(updatedList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Gagal menyimpan naskah ke localStorage:', e);
    }
  };

  // Simulated animated loading steps for engaging UX
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const steps = [
      'Menganalisis ide & merancang Hook 5 Detik pertama...',
      'Menyusun alur fakta menarik, analogi sains & plot twist unik...',
      'Mendesain 3 opsi judul high-CTR & konsep visual thumbnail...',
      'Merakit tabel storyboard narasi Voice Over & efek visual/SFX...',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % steps.length;
      setLoadingStep(current);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Handler for script generation
  const handleGenerateScript = async (params: {
    topic: string;
    duration: 'shorts' | 'medium' | 'deep';
    tone: string;
    targetAudience: string;
    additionalNotes: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Gagal menghasilkan naskah.');
      }

      const scriptData: ScriptPackage = {
        ...json.data,
        id: `script_${Date.now()}`,
        createdAt: new Date().toISOString(),
        originalTopic: params.topic,
        targetDuration: params.duration,
        toneStyle: params.tone,
      };

      setCurrentScript(scriptData);
      setSelectedTitleIndex(0);
      saveScriptToStorage(scriptData);

      // Smooth scroll to generated script
      setTimeout(() => {
        const target = document.getElementById('results-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Terjadi kesalahan pada server saat memproses naskah.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for refining current script
  const handleRefineScript = async (instruction: string, targetSection: string) => {
    if (!currentScript) return;
    setIsLoading(true);
    setError(null);
    setIsRefineOpen(false);

    try {
      const res = await fetch('/api/refine-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentScript,
          refineInstruction: instruction,
          targetSection,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Gagal merevisi naskah.');
      }

      const updatedScript: ScriptPackage = {
        ...json.data,
        id: `script_${Date.now()}`,
        createdAt: new Date().toISOString(),
        originalTopic: currentScript.originalTopic,
      };

      setCurrentScript(updatedScript);
      saveScriptToStorage(updatedScript);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal memperbarui naskah.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSavedScript = (id: string) => {
    const updated = savedScripts.filter((s) => s.id !== id);
    setSavedScripts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Hapus seluruh riwayat naskah tersimpan?')) {
      setSavedScripts([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const loadingMessages = [
    'Menganalisis ide & merancang Hook 5 Detik pertama...',
    'Menyusun alur fakta menarik, analogi sains & plot twist unik...',
    'Mendesain 3 opsi judul high-CTR & konsep visual thumbnail...',
    'Merakit tabel storyboard narasi Voice Over & efek visual/SFX...',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedScripts.length}
        currentMode={isTeleprompterOpen ? 'teleprompter' : 'studio'}
        onSwitchMode={(mode) => {
          if (mode === 'teleprompter') setIsTeleprompterOpen(true);
          else setIsTeleprompterOpen(false);
        }}
        hasScript={!!currentScript}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Terjadi Kendala:</strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold px-2 py-1 rounded bg-red-900/50 hover:bg-red-800 text-red-300"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Hero & Topic Input Workspace */}
        <section className="space-y-4">
          <div className="text-center sm:text-left max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Cabinet_Grotesk',sans-serif]">
              Studio Naskah Storytelling <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">YouTube Pengetahuan Umum</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ubah ide mentah menjadi naskah video retensi tinggi dengan formula Hook 5 Detik, 3 Opsi Judul & Thumbnail, Metadata SEO, dan Storyboard Audiovisual 3 Kolom.
            </p>
          </div>

          <TopicInputForm
            onGenerate={handleGenerateScript}
            isLoading={isLoading}
          />
        </section>

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/90 border border-red-500/30 text-center space-y-4 shadow-2xl backdrop-blur-md">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Sedang Meracik Naskah Storytelling Viral...
              </h3>
              <p className="text-xs sm:text-sm text-red-400 font-medium animate-pulse">
                {loadingMessages[loadingStep]}
              </p>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Menerapkan gaya bahasa kasual santai, formula hook 5 detik pertama, serta pertanyaan interaktif di akhir video.
            </p>
          </div>
        )}

        {/* Results Container */}
        {currentScript && !isLoading && (
          <div id="results-section" className="space-y-8 animate-in fade-in-50 duration-300">
            {/* Quick Summary Pill Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/40 animate-pulse" />
                <div>
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                    Naskah Siap Produksi:
                  </span>
                  <p className="text-sm font-bold text-slate-100">
                    {currentScript.topicSummary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRefineOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minta Revisi AI</span>
                </button>
                <button
                  onClick={() => setIsTeleprompterOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  <span>Mulai Teleprompter VO</span>
                </button>
              </div>
            </div>

            {/* Part 1: Opsi Judul & Thumbnail */}
            <TitleAndThumbnailSection
              titles={currentScript.titles}
              thumbnailConcept={currentScript.thumbnailConcept}
              durationText={currentScript.estimatedTotalDuration || '04:15'}
              selectedTitleIndex={selectedTitleIndex}
              onSelectTitle={(idx) => setSelectedTitleIndex(idx)}
            />

            {/* Part 2: Metadata & Deskripsi */}
            <MetadataSection metadata={currentScript.metadata} />

            {/* Part 3: Skrip Video (Tabel 3 Kolom) */}
            <StoryboardTableSection
              storyboard={currentScript.storyboardTable}
              closingQuestion={currentScript.closingDiscussionQuestion}
              totalDurationText={currentScript.estimatedTotalDuration || '3 - 5 Menit'}
              wordCount={currentScript.estimatedWordCount}
              onOpenTeleprompter={() => setIsTeleprompterOpen(true)}
              onOpenRefine={() => setIsRefineOpen(true)}
            />
          </div>
        )}

        {/* If no script yet, show the storytelling guide */}
        {!currentScript && !isLoading && <StorytellingGuide />}
      </main>

      {/* Teleprompter Modal */}
      {currentScript && (
        <TeleprompterModal
          isOpen={isTeleprompterOpen}
          onClose={() => setIsTeleprompterOpen(false)}
          storyboard={currentScript.storyboardTable}
          title={currentScript.titles[selectedTitleIndex]?.title || currentScript.topicSummary}
        />
      )}

      {/* Script Refine Modal */}
      <ScriptRefineModal
        isOpen={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        onRefine={handleRefineScript}
        isLoading={isLoading}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedScripts={savedScripts}
        onLoadScript={(s) => {
          setCurrentScript(s);
          setSelectedTitleIndex(0);
        }}
        onDeleteScript={handleDeleteSavedScript}
        onClearAll={handleClearAllHistory}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            KisahKreator — AI Scriptwriter & Content Strategist YouTube Pengetahuan Umum
          </p>
          <p className="text-slate-600">
            Format: Hook 5 Detik • Alur Bertahap • Opsi Judul & Thumbnail • Metadata SEO • Storyboard 3 Kolom
          </p>
        </div>
      </footer>
    </div>
  );
}
