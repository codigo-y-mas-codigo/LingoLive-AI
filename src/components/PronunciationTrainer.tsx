import React, { useState } from 'react';
import { Volume2, Sparkles, Check, Info, ArrowRight } from 'lucide-react';
import { ENGLISH_PRONUNCIATION_TOPICS, PronunciationTopic } from '../data/englishCurriculum';

export default function PronunciationTrainer({ onStartPracticeWithTopic }: { onStartPracticeWithTopic?: (topicTitle: string) => void }) {
  const [activeTopicId, setActiveTopicId] = useState<string>(ENGLISH_PRONUNCIATION_TOPICS[0].id);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const activeTopic = ENGLISH_PRONUNCIATION_TOPICS.find(t => t.id === activeTopicId) || ENGLISH_PRONUNCIATION_TOPICS[0];

  const playAudioWord = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85; // slightly slower for instructional clarity
        setPlayingWord(text);
        utterance.onend = () => setPlayingWord(null);
        utterance.onerror = () => setPlayingWord(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available', e);
      setPlayingWord(null);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8">
      {/* Selector de fonemas */}
      <div className="flex flex-wrap gap-2.5 mb-8 pb-6 border-b border-white/10">
        {ENGLISH_PRONUNCIATION_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTopicId === topic.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-medium'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            <span>{topic.title}</span>
            <span className="text-[10px] opacity-75">{topic.phonetic}</span>
          </button>
        ))}
      </div>

      {/* Contenido activo del fonema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Explicación y consejos para hispanohablantes */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400">
              Laboratorio de Fonética
            </span>
            <h3 className="text-2xl font-serif italic text-white mt-1">
              {activeTopic.title}
            </h3>
            <p className="text-sm font-mono text-orange-400/80 mt-1">
              {activeTopic.phonetic}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-300 mb-1">
              <Info className="w-4 h-4 shrink-0" />
              <span>Dificultad común para hispanohablantes:</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {activeTopic.problem}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Técnica de colocación de boca y lengua:</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {activeTopic.tip}
            </p>
          </div>

          {onStartPracticeWithTopic && (
            <button
              onClick={() => onStartPracticeWithTopic(`Entrenamiento de pronunciación: ${activeTopic.title}`)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-orange-500 hover:text-white text-white/90 text-xs font-medium transition-all flex items-center justify-center gap-2 group"
            >
              <span>Practicar este fonema en vivo con la IA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Pares mínimos interactivos para escuchar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/60">
              Pares Mínimos (Haz clic en el altavoz para escuchar la diferencia)
            </h4>
          </div>

          <div className="space-y-3">
            {activeTopic.pairs.map((pair, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
              >
                {/* Palabra 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-white">{pair.word1}</span>
                      <span className="text-xs font-mono text-orange-400">{pair.ipa1}</span>
                    </div>
                    <span className="text-xs text-white/50">{pair.trans1}</span>
                  </div>
                  <button
                    onClick={() => playAudioWord(pair.word1)}
                    title={`Escuchar ${pair.word1}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      playingWord === pair.word1
                        ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30'
                        : 'bg-white/10 text-white/70 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Palabra 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-white">{pair.word2}</span>
                      <span className="text-xs font-mono text-amber-400">{pair.ipa2}</span>
                    </div>
                    <span className="text-xs text-white/50">{pair.trans2}</span>
                  </div>
                  <button
                    onClick={() => playAudioWord(pair.word2)}
                    title={`Escuchar ${pair.word2}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      playingWord === pair.word2
                        ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30'
                        : 'bg-white/10 text-white/70 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
