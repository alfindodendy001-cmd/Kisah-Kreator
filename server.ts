import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to handle transient spikes and retry with valid models
async function generateContentWithRetry(params: {
  prompt: string;
  systemInstruction: string;
  responseSchema: any;
  temperature?: number;
}) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.prompt,
        config: {
          systemInstruction: params.systemInstruction,
          temperature: params.temperature ?? 0.8,
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
        },
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next model:`, err?.message || err);
    }
  }

  throw lastError;
}

const SCRIPT_SYSTEM_INSTRUCTION = `Kamu adalah seorang Scriptwriter & Content Strategist profesional untuk kanal YouTube storytelling pengetahuan umum kelas atas (seperti format Kok Bisa?, Veritasium Indonesia, Hujan Tanda Tanya, Kamar Jeruk, Kurzgesagt versi lokal, dll).

Tugas utama kamu adalah mengubah topik atau ide kasar menjadi skrip video yang sangat menarik (engaging), akurat secara sains/fakta sejarah, dan terstruktur rapi.

Gaya Bahasa & Tone:
- Gunakan bahasa Indonesia kasual, komunikatif, dan santai (seperti storyteller profesional yang asik diajak ngobrol, bukan membaca buku teks kaku atau artikel Wikipedia).
- Gunakan teknik hook di 5 detik pertama untuk langsung mencuri perhatian penonton ("stop the scroll" & retain audience).
- Gunakan alur penceritaan bertahap yang rapi:
  1. Hook (00:00 - 00:05 detik pertama)
  2. Orientasi / Pengenalan Masalah yang Relatable
  3. Fakta / Penjelasan Menarik & Eksploratif
  4. Twist / Sudut Pandang Unik yang Bikin "Mindblown"
  5. Kesimpulan & Call to Action (CTA) yang memancing diskusi
- Selalu selipkan pertanyaan pemicu interaksi di akhir narasi untuk memancing debat sehat dan komentar penonton.
- Jika topik kurang detail, buat asumsi kreatif terbaik yang relevan tanpa menghilangkan keakuratan fakta.
- Berikan petunjuk Voice Over (VO) dengan kata-kata hidup, penekanan suara, serta visual & audio effect (SFX, BGM, B-roll) yang detail dan siap diproduksi oleh video editor.`;

// Endpoint to generate full script package
app.post('/api/generate-script', async (req, res) => {
  try {
    const { topic, duration = 'medium', tone = 'casual_curious', targetAudience = 'umum', additionalNotes = '' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Topik video tidak boleh kosong.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ 
        error: 'GEMINI_API_KEY belum terkonfigurasi pada environment server. Harap pastikan API Key aktif di Settings > Secrets.' 
      });
      return;
    }

    let durationGuideline = '';
    if (duration === 'shorts') {
      durationGuideline = 'Format Shorts / Reels / TikTok (Durasi total 45-60 detik). Narasi padat, cepat, langsung ke poin, sekitar 110-150 kata total, dengan 4-6 segmen cepat.';
    } else if (duration === 'deep') {
      durationGuideline = 'Format Video Panjang Deep Dive (Durasi 8 - 12 menit). Alur mendalam, multi-babak dengan eksplorasi analogi, studi kasus sejarah/sains, twist ganda, dan sekitar 1200-1600 kata VO.';
    } else {
      // medium: 3 - 5 menit
      durationGuideline = 'Format Standar YouTube Storytelling (Durasi 3 - 5 menit). Ritme seimbang, sekitar 400-650 kata VO, dibagi dalam 7-12 segmen narasi-visual yang dinamis.';
    }

    const prompt = `Topik Kasar / Ide dari Kreator: "${topic}"
Target Durasi: ${durationGuideline}
Tone / Vibe Pilihan: ${tone}
Target Audiens: ${targetAudience}
${additionalNotes ? `Catatan Tambahan Kreator: "${additionalNotes}"` : ''}

Buatkan paket lengkap naskah YouTube storytelling pengetahuan umum dengan 3 bagian wajib:
1. OPSI JUDUL & THUMBNAIL:
   - 3 pilihan judul yang memicu rasa penasaran (click-worthy tanpa jadi clickbait murahan).
   - Ide visual Thumbnail: Subjek utama, ekspresi wajah/karakter, teks singkat 3-4 kata di gambar, serta mood warna & efek visual.
2. METADATA & DESKRIPSI:
   - Deskripsi singkat 2-3 kalimat untuk kolom deskripsi YouTube.
   - Rekomendasi 5-8 tag/keywords utama SEO.
   - 3-5 hashtag relevan.
3. SKRIP VIDEO (Format Tabel Narasi & Visual):
   Tabel lengkap dengan:
   - [Durasi/Timestamp]: Perkiraan durasi tiap segmen (dimulai 00:00 - 00:05 untuk Hook 5 Detik).
   - [Visual & Audio Effect]: Arahan B-roll, animasi 2D/3D, sound effect (SFX) spesifik, petunjuk BGM (misal: BGM misteri pelan, SFX whoosh, riset arsip hitam-putih).
   - [Narasi Teks]: Teks Voice Over (VO) lengkap dalam bahasa Indonesia kasual, komunikatif, dan natural.
   - Tahap alur: tandai apakah segmen tersebut Hook, Orientasi, Fakta/Penjelasan, Twist, atau Kesimpulan & CTA.
   - Jangan lupa akhiri segmen terakhir dengan pertanyaan memancing interaksi komentar!`;

    const response = await generateContentWithRetry({
      prompt,
      systemInstruction: SCRIPT_SYSTEM_INSTRUCTION,
      temperature: 0.8,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicSummary: {
            type: Type.STRING,
            description: 'Ringkasan esensi topik yang diangkat dalam satu kalimat menarik.',
          },
          estimatedTotalDuration: {
            type: Type.STRING,
            description: 'Perkiraan total durasi video (misal: "4 menit 30 detik")',
          },
          estimatedWordCount: {
            type: Type.NUMBER,
            description: 'Perkiraan total kata voice over',
          },
          titles: {
            type: Type.ARRAY,
            description: '3 pilihan judul yang memicu rasa penasaran',
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Judul video' },
                angle: { type: Type.STRING, description: 'Sudut pandang/alasan psikologis mengapa judul ini efektif' },
                type: { type: Type.STRING, description: 'Kategori (misal: Rasa Penasaran / Fakta Mengejutkan / Kontradiksi)' },
              },
              required: ['title', 'angle'],
            },
          },
          thumbnailConcept: {
            type: Type.OBJECT,
            description: 'Ide visual untuk thumbnail YouTube',
            properties: {
              mainSubject: { type: Type.STRING, description: 'Subjek utama (orang, objek, ilustrasi)' },
              facialExpressionOrMood: { type: Type.STRING, description: 'Ekspresi wajah atau mood visual' },
              shortOverlayText: { type: Type.STRING, description: 'Teks singkat 3-4 kata di gambar (contoh: JANGAN PERNAH COBA!)' },
              backgroundAndColors: { type: Type.STRING, description: 'Deskripsi latar belakang, pencahayaan, dan kontras warna' },
              visualHookRationale: { type: Type.STRING, description: 'Kenapa visual ini ampuh menaikkan CTR (Click-Through Rate)' },
            },
            required: ['mainSubject', 'facialExpressionOrMood', 'shortOverlayText', 'backgroundAndColors'],
          },
          metadata: {
            type: Type.OBJECT,
            description: 'Metadata dan deskripsi YouTube',
            properties: {
              description: { type: Type.STRING, description: 'Deskripsi ringkas 2-3 kalimat untuk kolom deskripsi YouTube' },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '5-8 tag/keywords utama SEO',
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Hashtags YouTube',
              },
              hookFormulaUsed: {
                type: Type.STRING,
                description: 'Formula hook yang digunakan di 5 detik pertama',
              },
            },
            required: ['description', 'tags'],
          },
          storyboardTable: {
            type: Type.ARRAY,
            description: 'Tabel Skrip Video 3 Kolom',
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING, description: 'Perkiraan rentang waktu/timestamp (contoh: 00:00 - 00:05)' },
                stage: {
                  type: Type.STRING,
                  description: 'Tahapan: Hook (0-5s) / Orientasi & Masalah / Penjelasan & Fakta / Twist & Sudut Pandang / Kesimpulan & CTA',
                },
                visualAndAudioEffect: {
                  type: Type.STRING,
                  description: 'Petunjuk gambar/video B-roll, animasi visual, Sound Effect (SFX), dan latar musik (BGM)',
                },
                narrationText: {
                  type: Type.STRING,
                  description: 'Teks narasi kata demi kata yang dibaca oleh Voice Over (VO)',
                },
                toneDeliveryCue: {
                  type: Type.STRING,
                  description: 'Petunjuk intonasi VO (misal: Berbisik cepat, Antusias, Nada heran)',
                },
              },
              required: ['timestamp', 'stage', 'visualAndAudioEffect', 'narrationText'],
            },
          },
          closingDiscussionQuestion: {
            type: Type.STRING,
            description: 'Pertanyaan interaktif di akhir video untuk memancing komentar penonton',
          },
        },
        required: ['topicSummary', 'estimatedTotalDuration', 'titles', 'thumbnailConcept', 'metadata', 'storyboardTable', 'closingDiscussionQuestion'],
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error generating script:', err);
    res.status(500).json({
      error: err?.message || 'Terjadi kesalahan saat memproses naskah dengan Gemini AI.',
    });
  }
});

// Endpoint to refine or adjust a part of the script
app.post('/api/refine-script', async (req, res) => {
  try {
    const { currentScript, refineInstruction, targetSection } = req.body;

    if (!currentScript || !refineInstruction) {
      res.status(400).json({ error: 'Naskah saat ini dan instruksi perbaikan diperlukan.' });
      return;
    }

    const prompt = `Berikut adalah naskah YouTube storytelling saat ini:
${JSON.stringify(currentScript, null, 2)}

Target Bagian yang Ingin Diperbaiki: ${targetSection || 'Seluruh Naskah'}
Instruksi Modifikasi / Perbaikan dari Kreator: "${refineInstruction}"

Tolong modifikasi dan perbarui paket naskah ini dengan tetap mematuhi seluruh aturan:
- Bahasa Indonesia kasual santai komunikatif storyteller
- Hook 5 detik pertama tetap menonjol
- Format 3 bagian lengkap (Judul & Thumbnail, Metadata Deskripsi & Tags, Tabel Skrip 3 Kolom)
- Pertanyaan memancing komentar di akhir`;

    const response = await generateContentWithRetry({
      prompt,
      systemInstruction: SCRIPT_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicSummary: { type: Type.STRING },
          estimatedTotalDuration: { type: Type.STRING },
          estimatedWordCount: { type: Type.NUMBER },
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  angle: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ['title', 'angle'],
              },
            },
            thumbnailConcept: {
              type: Type.OBJECT,
              properties: {
                mainSubject: { type: Type.STRING },
                facialExpressionOrMood: { type: Type.STRING },
                shortOverlayText: { type: Type.STRING },
                backgroundAndColors: { type: Type.STRING },
                visualHookRationale: { type: Type.STRING },
              },
              required: ['mainSubject', 'facialExpressionOrMood', 'shortOverlayText', 'backgroundAndColors'],
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                hookFormulaUsed: { type: Type.STRING },
              },
              required: ['description', 'tags'],
            },
            storyboardTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  stage: { type: Type.STRING },
                  visualAndAudioEffect: { type: Type.STRING },
                  narrationText: { type: Type.STRING },
                  toneDeliveryCue: { type: Type.STRING },
                },
                required: ['timestamp', 'stage', 'visualAndAudioEffect', 'narrationText'],
              },
            },
            closingDiscussionQuestion: { type: Type.STRING },
          },
          required: ['topicSummary', 'estimatedTotalDuration', 'titles', 'thumbnailConcept', 'metadata', 'storyboardTable', 'closingDiscussionQuestion'],
        },
      });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error refining script:', err);
    res.status(500).json({
      error: err?.message || 'Gagal memproses perbaikan naskah.',
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YouTube Scriptwriter Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
