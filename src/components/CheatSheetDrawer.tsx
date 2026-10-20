import React, { useState } from 'react';
import { Volume2, X, BookOpen, Sparkles, Copy, Check } from 'lucide-react';
import { ENGLISH_CHEAT_SHEET } from '../data/englishCurriculum';

interface CheatSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isFloatingOverlay?: boolean;
}

export default function CheatSheetDrawer({ isOpen, onClose, isFloatingOverlay = false }: CheatSheetDrawerProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  if (!isOpen) return null;

  const playAudio = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        setPlayingPhrase(text);
        utterance.onend = () => setPlayingPhrase(null);
        utterance.onerror = () => setPlayingPhrase(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available', e);
      setPlayingPhrase(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className={`fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity`}>
      <div className="relative w-full max-w-lg bg-[#0e0804] border-l border-white/10 h-full flex flex-col shadow-2xl p-6 overflow-y-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif italic text-white">Chuleta de Supervivencia</h3>
              <p className="text-xs text-white/50">Frases clave para no quedarte en blanco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de frases por categoría */}
        <div className="py-6 space-y-6 flex-1">
          {ENGLISH_CHEAT_SHEET.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400/90 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {cat.title}
              </h4>

              <div className="space-y-2.5">
                {cat.phrases.map((phrase, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-orange-200 transition-colors">
                          "{phrase.english}"
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          {phrase.spanish}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => playAudio(phrase.audioText)}
                          title="Escuchar pronunciación"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            playingPhrase === phrase.audioText
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(phrase.english)}
                          title="Copiar frase"
                          className="w-8 h-8 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all"
                        >
                          {copiedText === phrase.english ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pie del modal */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-white/40 font-mono shrink-0">
          Tip: Úsalas en voz alta durante la llamada cuando necesites un respiro.
        </div>
      </div>
    </div>
  );
}
