import React, { useState, useEffect, useRef } from 'react';
import { StoryboardRow } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  X,
  Volume2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyboard: StoryboardRow[];
  title: string;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  storyboard,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [fontSize, setFontSize] = useState<number>(32); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [showVisualCues, setShowVisualCues] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Timer while playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Smooth scroll loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const scrollLoop = () => {
      if (scrollContainerRef.current) {
        // speed: 1 to 10 => pixels per frame
        const delta = speed * 0.45;
        scrollContainerRef.current.scrollTop += delta;
      }
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setElapsedSeconds(0);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col text-white backdrop-blur-lg animate-in fade-in-20">
      {/* Top Controls Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
              Teleprompter VO: {title || 'Skrip Storytelling'}
            </h2>
          </div>
          <div className="font-mono text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            ⏱️ {formatTimer(elapsedSeconds)}
          </div>
        </div>

        {/* Center Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Mulai Gulir (Play)</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="Reset ke awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders & Toggles */}
        <div className="flex items-center gap-3 text-xs">
          {/* Speed slider */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Kecepatan:</span>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-16 accent-red-500 cursor-pointer"
            />
            <span className="font-mono text-red-400 font-bold">{speed}x</span>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFontSize((s) => Math.max(20, s - 4))}
              className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300"
              title="Perkecil teks"
            >
              A-
            </button>
            <span className="font-mono text-[11px] text-slate-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(56, s + 4))}
              className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300"
              title="Perbesar teks"
            >
              A+
            </button>
          </div>

          {/* Visual Cues Toggle */}
          <button
            onClick={() => setShowVisualCues(!showVisualCues)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showVisualCues
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan/sembunyikan petunjuk visual & SFX"
          >
            {showVisualCues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Mirror toggle for teleprompter hardware */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMirrored
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mirror mode (untuk kaca prompter reflektif)"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Reading Marker Focus Line */}
      <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 border-y border-red-500/20 bg-red-500/5 pointer-events-none z-10 flex items-center justify-between px-6">
        <span className="text-[10px] uppercase tracking-widest text-red-500/60 font-mono">FOKUS BACA VO ▶</span>
        <span className="text-[10px] uppercase tracking-widest text-red-500/60 font-mono">◀ FOKUS BACA VO</span>
      </div>

      {/* Prompter Scrolling Area */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-6 sm:px-16 md:px-28 py-48 text-center scroll-smooth ${
          isMirrored ? 'scale-x-[-1]' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-slate-500 text-sm font-semibold tracking-wider uppercase mb-8">
            — MULAI REKAMAN VOICE OVER —
          </div>

          {storyboard.map((row, idx) => (
            <div key={idx} className="space-y-3 group transition-all">
              {/* Stage indicator */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {row.timestamp}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                  {row.stage}
                </span>
                {row.toneDeliveryCue && (
                  <span className="text-xs italic text-amber-400">
                    ({row.toneDeliveryCue})
                  </span>
                )}
              </div>

              {/* Optional Visual / SFX cue for VO */}
              {showVisualCues && (
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-lg mx-auto italic">
                  🎬 {row.visualAndAudioEffect}
                </div>
              )}

              {/* Narration VO Text */}
              <p
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.55 }}
                className="font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] tracking-normal drop-shadow-md select-none"
              >
                {row.narrationText}
              </p>
            </div>
          ))}

          <div className="pt-20 pb-40 text-slate-500 text-sm font-semibold tracking-wider uppercase">
            — SELESAI / CALL TO ACTION —
          </div>
        </div>
      </div>
    </div>
  );
};
