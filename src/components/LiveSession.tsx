import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle,
  Subtitles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CheatSheetDrawer from './CheatSheetDrawer';
import { recordPracticeSession } from '../utils/progressStorage';

const MODEL_NAME = "gemini-2.5-flash-native-audio-preview-12-2025";

interface LiveSessionProps {
  language: string;
  topic?: string;
  level?: string;
  voiceName?: string;
  partnerRole?: string;
  userRole?: string;
  missionGoal?: string;
  customPrompt?: string;
  starterPhrase?: string;
  missionId?: string;
  userName?: string;
  onClose: () => void;
}

export default function LiveSession({ 
  language, 
  topic = 'Conversación libre', 
  level = 'Intermedio',
  voiceName = 'Puck',
  partnerRole,
  userRole,
  missionGoal,
  customPrompt,
  starterPhrase,
  missionId,
  userName,
  onClose 
}: LiveSessionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Transcripción y subtítulos en vivo
  const [subtitles, setSubtitles] = useState<string>("");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  // Temporizador de llamada
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionDurationFinal, setSessionDurationFinal] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const timerRef = useRef<any>(null);

  // Temporizador mientras está conectado
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  const stopAudio = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const cleanup = useCallback(() => {
    stopAudio();
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
  }, [stopAudio]);

  const playQueuedAudio = useCallback(async () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0 || isPlayingRef.current) return;

    isPlayingRef.current = true;
    const ctx = audioContextRef.current;

    while (audioQueueRef.current.length > 0) {
      const data = audioQueueRef.current.shift()!;
      const buffer = ctx.createBuffer(1, data.length, 24000);
      buffer.getChannelData(0).set(data);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + buffer.duration;

      await new Promise(resolve => setTimeout(resolve, (buffer.duration * 1000) - 10));
    }

    isPlayingRef.current = false;
  }, []);

  const startSession = useCallback(async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

      // Instrucción refinada y adaptada al escenario
      const finalSystemInstruction = customPrompt 
        ? `${customPrompt}\n${userName ? `El nombre del estudiante es ${userName}. Salúdalo cordialmente por su nombre al inicio.` : ''}`
        : `Eres un tutor y compañero de idiomas altamente calificado, entusiasta, paciente y motivador para un estudiante hispanohablante que está aprendiendo y practicando: ${language}.
${userName ? `El estudiante se llama "${userName}". Salúdalo con energía y calidez por su nombre al comenzar la conversación.` : ''}
Nivel de habilidad del usuario: ${level}.
Tema o situación de práctica: ${topic}.
${partnerRole ? `Tu rol en esta conversación: ${partnerRole}.` : ''}
${userRole ? `Rol del estudiante: ${userRole}.` : ''}
${missionGoal ? `Objetivo clave de la misión: ${missionGoal}.` : ''}

PAUTAS CRUCIALES DE CONVERSACIÓN:
1. Habla prioritariamente en ${language} con excelente dicción, naturalidad y entonación.
2. Mantén tus intervenciones cortas y dinámicas (1 a 3 oraciones por turno) para que el estudiante hable la mayor parte del tiempo y no monopolices la llamada.
3. Si el estudiante comete un error notable de pronunciación, vocabulario o gramática, dale una corrección amigable y rápida (puedes aclararla brevemente en español si es necesario) y anímalo a repetir la frase.
4. Si el estudiante se queda callado o dice frases como 'How do you say...' o pide auxilio en español, dale la palabra en inglés con paciencia y continúa.
5. Inicia la llamada saludando con energía en ${language}, introduciendo el escenario o diciendo: "${starterPhrase ? (userName ? `${starterPhrase.replace('Hello!', `Hello ${userName}!`).replace('Good afternoon.', `Good afternoon, ${userName}.`)}` : starterPhrase) : (userName ? `Hello ${userName}! It is great to practice with you today. What would you like to discuss?` : 'Hello! It is great to practice with you today. What would you like to discuss?')}"`;

      const session = await ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName || "Puck" } },
          },
          systemInstruction: finalSystemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            startRecording();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Manejo de Audio nativo
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const base64Data = part.inlineData.data;
                  const binaryString = atob(base64Data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  
                  const pcm16 = new Int16Array(bytes.buffer);
                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                    float32[i] = pcm16[i] / 32768.0;
                  }
                  
                  audioQueueRef.current.push(float32);
                  playQueuedAudio();
                }

                if (part.text) {
                  setSubtitles(prev => (prev + " " + part.text).trim().slice(-140));
                }
              }
            }

            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsConnected(false);
            cleanup();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Error de conexión con el tutor. Por favor intenta de nuevo.");
            cleanup();
          }
        }
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to start session:", err);
      setError("No se pudo iniciar la sesión con el tutor de IA. Verifica tu conexión.");
    }
  }, [language, topic, level, voiceName, partnerRole, userRole, missionGoal, customPrompt, starterPhrase, cleanup, playQueuedAudio]);

  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        
        if (sessionRef.current && isConnected) {
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      processorRef.current = processor;
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setError("Se requiere acceso al micrófono para hablar con el tutor.");
    }
  };

  useEffect(() => {
    startSession();
    return () => cleanup();
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSessionClick = () => {
    const finalSecs = elapsedSeconds;
    setSessionDurationFinal(finalSecs);
    cleanup();
    if (finalSecs > 10) {
      // Guardar en estadísticas con contexto del tema e idioma
      recordPracticeSession({
        durationMinutes: finalSecs / 60,
        languageId: language.toLowerCase().includes('inglés') || language.toLowerCase().includes('english') ? 'english' : 'other',
        languageName: language,
        topicOrMission: topic,
        missionId,
      });
      setShowSummaryModal(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[var(--color-bg)]/98 text-[var(--color-text-main)] backdrop-blur-2xl p-6 transition-colors"
      >
        {/* Barra superior con metadatos de sesión */}
        <div className="w-full max-w-5xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white/95">LingoLive AI</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {language}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                  Voz: {voiceName}
                </span>
              </div>
              <p className="text-xs text-white/50">{level} &bull; {topic}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Temporizador */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-white/80">
              <Clock className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Botón flotante para abrir Chuleta de frases */}
            <button
              onClick={() => setIsCheatSheetOpen(true)}
              className="px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Ver frases de auxilio"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Frases de auxilio</span>
            </button>

            {/* Finalizar llamada */}
            <button 
              onClick={handleEndSessionClick}
              className="px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-mono uppercase tracking-wider text-red-300 hover:bg-red-500 hover:text-white transition-all"
            >
              Finalizar sesión
            </button>
          </div>
        </div>

        {/* Misión y objetivo activo */}
        {missionGoal && (
          <div className="w-full max-w-xl p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-xs text-white/80 flex items-center justify-center gap-2">
            <Target className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="font-mono text-white/50">Tu misión:</span>
            <span className="text-orange-200">{missionGoal}</span>
          </div>
        )}

        {/* Avatar / Visualizador de voz central */}
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md my-auto">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isConnected ? (
                <motion.div 
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <p className="text-white/70 text-sm font-mono">Conectando con tu tutor ({voiceName})...</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="active"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Círculos de pulso y resplandor */}
                  <motion.div 
                    animate={{ 
                      scale: isPlayingRef.current ? [1, 1.35, 1] : [1, 1.05, 1],
                      opacity: isPlayingRef.current ? [0.45, 0.15, 0.45] : [0.15, 0.1, 0.15]
                    }}
                    transition={{ repeat: Infinity, duration: 2.2 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 blur-3xl"
                  />

                  <div className="relative w-52 h-52 rounded-full border border-white/15 flex flex-col items-center justify-center bg-white/[0.04] backdrop-blur-md overflow-hidden shadow-2xl">
                    <Sparkles className={`w-14 h-14 ${isPlayingRef.current ? 'text-orange-400 scale-110' : 'text-white/30'} transition-all duration-300`} />
                    
                    {/* Visualizador de ondas */}
                    {isPlayingRef.current && (
                      <div className="absolute bottom-10 flex items-end gap-1.5 h-10">
                        {[...Array(9)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, Math.random() * 32 + 6, 4] }}
                            transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.08 }}
                            className="w-1.5 bg-gradient-to-t from-orange-500 to-amber-300 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center max-w-sm">
              {error}
            </div>
          )}

          {/* Estado de conversación */}
          <div className="text-center space-y-2">
            <p className="text-xl font-serif italic text-white/90">
              {isPlayingRef.current 
                ? "El tutor está respondiendo..." 
                : isRecording 
                ? "Te escucha atentamente... Habla con libertad" 
                : "Listo para hablar"}
            </p>

            {/* Subtítulo dinámico si está activo */}
            {showSubtitles && subtitles && (
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 max-w-sm text-xs font-mono text-orange-200/90 leading-relaxed">
                "{subtitles}"
              </div>
            )}
          </div>
        </div>

        {/* Barra inferior de controles */}
        <div className="w-full max-w-md flex flex-col items-center gap-4 z-10 pb-4">
          <div className="flex items-center gap-6">
            {/* Silenciar micrófono */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
              aria-label={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                  : 'bg-white/5 text-white/70 hover:bg-white/15 border border-white/10'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Botón central de estatus */}
            <div 
              title="Transmisión de voz nativa activa"
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/30"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Alternar subtítulos */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              title={showSubtitles ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              aria-label={showSubtitles ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                showSubtitles
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Subtitles className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/40 font-mono">
            <span>{isMuted ? "Micrófono silenciado" : "Habla a tu ritmo"}</span>
            <span>&bull;</span>
            <button 
              onClick={() => setIsCheatSheetOpen(true)}
              className="text-orange-400 hover:underline cursor-pointer"
            >
              ¿Necesitas auxilio? Ver frases
            </button>
          </div>
        </div>
      </motion.div>

      {/* Drawer de Chuleta de Frases de emergencia durante la llamada */}
      <CheatSheetDrawer 
        isOpen={isCheatSheetOpen} 
        onClose={() => setIsCheatSheetOpen(false)} 
        isFloatingOverlay={true}
      />

      {/* Modal de resumen y felicitaciones al terminar la sesión */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#120a06] border border-orange-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                ¡Sesión Completada!
              </span>
              <h3 className="text-2xl font-serif italic text-white mt-1">
                Excelente práctica en {language}
              </h3>
              <p className="text-xs text-white/60 mt-2">
                Cada minuto que hablas sin miedo reconstruye tus conexiones neuronales de fluidez.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40">Tiempo hablado</span>
                <p className="text-xl font-serif italic text-orange-400">
                  {formatTimer(sessionDurationFinal)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40">Tema</span>
                <p className="text-xs font-medium text-white line-clamp-1 mt-1">
                  {topic}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              ✓ Tiempo guardado en tu progreso diario. ¡Sigue así mañana!
            </div>

            <button
              onClick={() => {
                setShowSummaryModal(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-lg shadow-orange-500/25"
            >
              Volver al panel de práctica
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
