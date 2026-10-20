import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  Globe, 
  Sparkles, 
  Mic, 
  Volume2, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Users, 
  CheckCircle2, 
  Headphones, 
  ShieldCheck, 
  Clock, 
  Compass, 
  MessageSquare, 
  HelpCircle, 
  Target, 
  Award, 
  Flame, 
  Zap, 
  ArrowRight, 
  Settings2, 
  VolumeX, 
  Play,
  Palette,
  Eye,
  Sliders
} from 'lucide-react';
import LiveSession from './components/LiveSession';
import PronunciationTrainer from './components/PronunciationTrainer';
import RoleplayMissionsList from './components/RoleplayMissionsList';
import CheatSheetDrawer from './components/CheatSheetDrawer';
import AppearanceModal from './components/AppearanceModal';
import UserProfileBanner from './components/UserProfileBanner';
import { 
  ENGLISH_ACCENTS, 
  ENGLISH_MISSIONS, 
  RoleplayMission, 
  AccentOption 
} from './data/englishCurriculum';
import { getSavedStats, UserStats, NextStepRecommendation } from './utils/progressStorage';
import { 
  ThemeSettings, 
  getSavedThemeSettings, 
  saveThemeSettings, 
  applyThemeToDocument 
} from './utils/themeSettings';

interface LanguageOption {
  id: string;
  name: string;
  flag: string;
  level: string;
  greeting: string;
  description: string;
  availableModulesCount: number;
}

const LANGUAGES: LanguageOption[] = [
  { 
    id: 'english', 
    name: 'Inglés', 
    flag: '🇺🇸 / 🇬🇧', 
    level: 'Estudio Completo Activo', 
    greeting: '"Hello! How can I help you practice today?"',
    description: 'Estudio intensivo con misiones de roleplay, fonética guiada y selección de acentos.',
    availableModulesCount: 6,
  },
  { 
    id: 'french', 
    name: 'Francés', 
    flag: '🇫🇷', 
    level: 'Principiante a Avanzado', 
    greeting: '"Bonjour! De quoi aimerais-tu parler?"',
    description: 'Mejora tu acento, cadencia y expresiones comunes de la vida cotidiana.',
    availableModulesCount: 4,
  },
  { 
    id: 'german', 
    name: 'Alemán', 
    flag: '🇩🇪', 
    level: 'Principiante a Avanzado', 
    greeting: '"Guten Tag! Wie läuft dein Deutsch heute?"',
    description: 'Domina las estructuras compuestas, la entonación y la pronunciación precisa.',
    availableModulesCount: 4,
  },
  { 
    id: 'italian', 
    name: 'Italiano', 
    flag: '🇮🇹', 
    level: 'Principiante a Intermedio', 
    greeting: '"Ciao! Pronto per fare un po\' di pratica?"',
    description: 'Aprende la melodía natural del idioma, expresiones idiomáticas y cultura.',
    availableModulesCount: 4,
  },
  { 
    id: 'portuguese', 
    name: 'Portugués', 
    flag: '🇧🇷', 
    level: 'Todos los niveles', 
    greeting: '"Olá! Vamos praticar um pouco hoje?"',
    description: 'Aprovecha la cercanía con el español puliendo los falsos amigos y sonidos nasales.',
    availableModulesCount: 3,
  },
  { 
    id: 'japanese', 
    name: 'Japonés', 
    flag: '🇯🇵', 
    level: 'Principiante a Intermedio', 
    greeting: '"こんにちは！日本語を練習しましょう。"',
    description: 'Practica cortesía formal, entonación suave y oraciones para viajes.',
    availableModulesCount: 3,
  },
  { 
    id: 'mandarin', 
    name: 'Mandarín', 
    flag: '🇨🇳', 
    level: 'Principiante', 
    greeting: '"你好！我们开始练习中文吧。"',
    description: 'Entrena los tonos con paciencia y aprende frases para comercio y viajes.',
    availableModulesCount: 3,
  },
  { 
    id: 'spanish', 
    name: 'Español (Avanzado)', 
    flag: '🇪🇸', 
    level: 'Avanzado / Oratoria', 
    greeting: '"¡Hola! ¿Sobre qué tema te gustaría debatir hoy?"',
    description: 'Práctica avanzada de vocabulario técnico, oratoria y giros dialectales.',
    availableModulesCount: 3,
  },
];

const GENERAL_SCENARIOS = [
  { id: 'free', name: 'Conversación libre y cotidiana', icon: MessageSquare },
  { id: 'travel', name: 'Viajes, aeropuertos y hotel', icon: Compass },
  { id: 'restaurant', name: 'Restaurante y pedir comida', icon: Star },
  { id: 'interview', name: 'Entrevista de trabajo y carrera', icon: Users },
];

const LEVELS = [
  { id: 'beginner', label: 'Principiante (A1-A2)', desc: 'Ritmo pausado, palabras claras y explicaciones sencillas' },
  { id: 'intermediate', label: 'Intermedio (B1-B2)', desc: 'Conversación fluida con corrección de errores gramaticales' },
  { id: 'advanced', label: 'Avanzado (C1-C2)', desc: 'Vocabulario rico, modismos nativos y velocidad real' },
];

export default function App() {
  const [selectedLang, setSelectedLang] = useState<string>('english');
  const [englishTab, setEnglishTab] = useState<'missions' | 'pronunciation' | 'cheatsheet' | 'accents'>('missions');
  
  // Configuración de Inglés
  const [selectedMission, setSelectedMission] = useState<RoleplayMission>(ENGLISH_MISSIONS[0]);
  const [selectedAccent, setSelectedAccent] = useState<AccentOption>(ENGLISH_ACCENTS[0]);
  const [selectedLevel, setSelectedLevel] = useState<string>('Intermedio (B1-B2)');
  
  // Configuración general para otros idiomas
  const [selectedGeneralTopic, setSelectedGeneralTopic] = useState<string>('Conversación libre y cotidiana');
  
  // Sesión y Drawer
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(getSavedStats());

  // Apariencia, Temas y Accesibilidad
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(getSavedThemeSettings());
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  useEffect(() => {
    applyThemeToDocument(themeSettings);
  }, [themeSettings]);

  const handleUpdateTheme = (newSettings: ThemeSettings) => {
    setThemeSettings(newSettings);
    saveThemeSettings(newSettings);
  };

  // Refrescar estadísticas cuando se termine una sesión
  const refreshStats = () => {
    setUserStats(getSavedStats());
  };

  const currentLangObj = LANGUAGES.find(l => l.id === selectedLang) || LANGUAGES[0];
  const isEnglish = selectedLang === 'english';

  const handleLaunchEnglishMission = (mission: RoleplayMission) => {
    setSelectedMission(mission);
    setIsSessionActive(true);
  };

  const handleStartGeneralCall = () => {
    setIsSessionActive(true);
  };

  const handleExecuteRecommendation = (rec: NextStepRecommendation) => {
    setSelectedLang(rec.languageId);
    if (rec.tab) {
      setEnglishTab(rec.tab);
    }
    if (rec.missionId) {
      const m = ENGLISH_MISSIONS.find(item => item.id === rec.missionId);
      if (m) {
        setSelectedMission(m);
      }
    }
    setTimeout(() => {
      const el = document.getElementById('estudio-ingles') || document.getElementById('idiomas');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] selection:bg-orange-500/30 font-sans transition-colors duration-300">
      {/* Modal de Apariencia & Accesibilidad */}
      <AppearanceModal 
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
        settings={themeSettings}
        onUpdateSettings={handleUpdateTheme}
      />

      {/* Sesión de Voz en Vivo */}
      <AnimatePresence>
        {isSessionActive && (
          <LiveSession 
            language={currentLangObj.name} 
            topic={isEnglish ? selectedMission.title : selectedGeneralTopic}
            level={selectedLevel}
            voiceName={isEnglish ? selectedAccent.voiceName : 'Puck'}
            partnerRole={isEnglish ? selectedMission.partnerRole : undefined}
            userRole={isEnglish ? selectedMission.userRole : undefined}
            missionGoal={isEnglish ? selectedMission.goal : undefined}
            customPrompt={isEnglish ? selectedMission.systemPrompt : undefined}
            starterPhrase={isEnglish ? selectedMission.starterPhrase : undefined}
            missionId={isEnglish ? selectedMission.id : undefined}
            userName={userStats.userName}
            onClose={() => {
              setIsSessionActive(false);
              refreshStats();
            }} 
          />
        )}
      </AnimatePresence>

      {/* Drawer de Chuleta de frases */}
      <CheatSheetDrawer 
        isOpen={isCheatSheetOpen} 
        onClose={() => setIsCheatSheetOpen(false)} 
      />

      {/* Barra de navegación superior */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)]/85 backdrop-blur-md border-b border-white/10 px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-serif italic tracking-wide font-medium">LingoLive AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/70">
            <a href="#idiomas" className="hover:text-orange-400 transition-colors">Idiomas</a>
            <a href="#estudio-ingles" className="hover:text-orange-400 transition-colors text-orange-400 font-semibold">
              ★ Estudio de Inglés
            </a>
            <a href="#como-funciona" className="hover:text-orange-400 transition-colors">¿Cómo funciona?</a>
            <a href="#ventajas" className="hover:text-orange-400 transition-colors">Ventajas</a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Saludo al usuario en la barra si tiene nombre registrado */}
            {userStats.userName && (
              <span className="hidden lg:inline text-xs font-mono text-orange-300 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                👤 {userStats.userName}
              </span>
            )}

            {/* Botón de Apariencia y Accesibilidad en Navbar */}
            <button
              onClick={() => setIsAppearanceOpen(true)}
              title="Personalizar colores y accesibilidad de tipografía"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Tema & Fuente</span>
            </button>

            {/* Widget de racha y minutos */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
              <span className="flex items-center gap-1 text-orange-400 font-semibold" title="Racha de días practicados">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> {userStats.streakDays} d
              </span>
              <span className="text-white/30">&bull;</span>
              <span className="text-white/70" title="Total de minutos hablados">
                <Clock className="w-3 h-3 inline mr-1 text-white/50" />
                {userStats.totalMinutes} min
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('estudio-ingles') || document.getElementById('idiomas');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-orange-500 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              Practicar ahora
            </button>
          </div>
        </div>
      </nav>

      {/* Sección Hero */}
      <header className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[34rem] h-[34rem] bg-orange-600/15 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-500/10 blur-[130px] rounded-full" />
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-white/80">
              Estudio Conversacional por Voz &bull; Gemini 2.5 Live
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif italic font-light tracking-tight leading-[0.92] mb-8">
            Habla con <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">Fluidez</span> <br />
            empezando por el Inglés.
          </h1>

          <p className="text-lg md:text-2xl text-white/60 font-light max-w-2xl mb-12 leading-relaxed">
            Misiones reales de conversación, entrenamiento fonético para hispanohablantes y tutores con acento nativo americano o británico.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => {
                const el = document.getElementById('estudio-ingles');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all duration-300 flex items-center gap-3 shadow-xl shadow-orange-500/25 group"
            >
              <Mic className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform" />
              <span>Explorar Estudio de Inglés</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setIsCheatSheetOpen(true)}
              className="px-6 py-4 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 text-white/80 hover:text-white transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Chuleta de frases</span>
            </button>
          </div>

          {/* Estadísticas de usuario */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 w-full max-w-3xl text-left">
            <div>
              <p className="text-2xl font-serif italic text-orange-400">🇺🇸 &bull; 🇬🇧</p>
              <p className="text-xs text-white/50 font-mono mt-0.5">Acentos US / UK</p>
            </div>
            <div>
              <p className="text-2xl font-serif italic text-orange-400">6 Misiones</p>
              <p className="text-xs text-white/50 font-mono mt-0.5">Roleplay profesional</p>
            </div>
            <div>
              <p className="text-2xl font-serif italic text-orange-400">Fonética</p>
              <p className="text-xs text-white/50 font-mono mt-0.5">Sonidos TH, vocales y -ED</p>
            </div>
            <div>
              <p className="text-2xl font-serif italic text-orange-400">Voz Nativa</p>
              <p className="text-xs text-white/50 font-mono mt-0.5">Gemini 2.5 Live API</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Sección Selección de Idiomas */}
      <section id="idiomas" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        {/* Banner de Bienvenida Personalizado y Continuación de Práctica */}
        <UserProfileBanner 
          stats={userStats}
          onUpdateStats={(newStats) => setUserStats(newStats)}
          onExecuteRecommendation={handleExecuteRecommendation}
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-500 font-mono text-xs uppercase tracking-widest mb-3">
              <Languages className="w-4 h-4" /> Selector de Idiomas
            </div>
            <h2 className="text-3xl md:text-5xl font-serif italic mb-2">Selecciona tu idioma objetivo</h2>
            <p className="text-white/60 max-w-xl text-sm sm:text-base">
              Comienza con nuestro módulo insignia en <strong className="text-orange-400 font-medium">Inglés</strong> o practica cualquiera de los idiomas disponibles.
            </p>
          </div>

          {isEnglish && (
            <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Estudio completo de Inglés activo abajo</span>
            </div>
          )}
        </div>

        {/* Tarjetas de Idiomas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLang(lang.id);
                  if (lang.id === 'english') {
                    setTimeout(() => {
                      document.getElementById('estudio-ingles')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className={`group relative p-5 rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-b from-orange-500/25 to-orange-500/5 border-orange-500 ring-2 ring-orange-500/50 shadow-xl shadow-orange-500/15' 
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isSelected 
                        ? 'bg-orange-500/30 text-orange-300 border-orange-500/40' 
                        : 'bg-white/5 text-white/50 border-white/10'
                    }`}>
                      {lang.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif italic text-white group-hover:text-orange-300 transition-colors mb-1">
                    {lang.name}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-3 line-clamp-2">
                    {lang.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className={isSelected ? 'text-orange-400 font-semibold' : 'text-white/40'}>
                    {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-orange-400' : 'text-white/30'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ESTUDIO DE INGLÉS ESPECIALIZADO (Cuando Inglés está seleccionado) */}
      {isEnglish ? (
        <section id="estudio-ingles" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-white/10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-orange-400 font-mono text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" /> Módulo Insignia
              </div>
              <h2 className="text-3xl md:text-5xl font-serif italic">Estudio Especializado de Inglés</h2>
              <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl">
                Diseñado para hispanohablantes. Domina las situaciones reales que más inseguridad generan y perfecciona los sonidos clave.
              </p>
            </div>

            {/* Pestañas del estudio de inglés */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setEnglishTab('missions')}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  englishTab === 'missions'
                    ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Misiones de Roleplay</span>
              </button>

              <button
                onClick={() => setEnglishTab('pronunciation')}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  englishTab === 'pronunciation'
                    ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Entrenador de Fonética</span>
              </button>

              <button
                onClick={() => setEnglishTab('accents')}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  englishTab === 'accents'
                    ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Acento & Voz ({selectedAccent.voiceName})</span>
              </button>

              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-amber-300 hover:text-white transition-all flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Chuleta de Frases</span>
              </button>
            </div>
          </div>

          {/* Contenido según pestaña */}
          {englishTab === 'missions' && (
            <div className="space-y-8">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-white/50">Misión activa para tu llamada:</span>
                    <h4 className="text-base font-semibold text-white">{selectedMission.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-white/60">
                    Acento: <strong className="text-orange-300">{selectedAccent.name}</strong>
                  </span>
                  <button
                    onClick={() => handleLaunchEnglishMission(selectedMission)}
                    className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25"
                  >
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>Llamar ahora</span>
                  </button>
                </div>
              </div>

              <RoleplayMissionsList 
                selectedMissionId={selectedMission.id}
                onSelectMission={(m) => setSelectedMission(m)}
                onLaunchMission={handleLaunchEnglishMission}
              />
            </div>
          )}

          {englishTab === 'pronunciation' && (
            <PronunciationTrainer 
              onStartPracticeWithTopic={(topicTitle) => {
                setSelectedGeneralTopic(topicTitle);
                setIsSessionActive(true);
              }}
            />
          )}

          {englishTab === 'accents' && (
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-serif italic text-white mb-2">Selecciona el Acento y Voz de tu Tutor</h3>
                <p className="text-xs text-white/60">
                  Gemini 2.5 Live adapta su dicción, entonación y giros léxicos según la región seleccionada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ENGLISH_ACCENTS.map((accent) => {
                  const isSelected = selectedAccent.id === accent.id;
                  return (
                    <button
                      key={accent.id}
                      onClick={() => setSelectedAccent(accent)}
                      className={`p-5 rounded-2xl border text-left transition-all flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/40 text-white shadow-lg'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-white/80'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{accent.flag}</span>
                          <span className="font-semibold text-sm text-white">{accent.name}</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                          {accent.sampleDescription}
                        </p>
                        <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-orange-400">
                          <span>Voz Gemini: {accent.voiceName}</span>
                          <span>&bull;</span>
                          <span>{accent.region}</span>
                        </div>
                      </div>

                      <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-orange-500 bg-orange-500' : 'border-white/30'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selector de nivel de dificultad para inglés */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-mono uppercase tracking-wider text-white/70 mb-4">
                  Nivel de adaptación del tutor de inglés:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.label)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedLevel === lvl.label
                          ? 'bg-orange-500/10 border-orange-500 text-white shadow-md'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white mb-1">{lvl.label}</div>
                      <div className="text-[11px] text-white/50">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setIsSessionActive(true)}
                  className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-xl shadow-orange-500/25"
                >
                  <Mic className="w-4 h-4" />
                  <span>Probar esta voz en vivo ({selectedAccent.voiceName})</span>
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Configuración para otros idiomas */
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 mb-12">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400">Práctica en {currentLangObj.name}</span>
                <h3 className="text-2xl font-serif italic text-white mt-1">Configura tu sesión de {currentLangObj.name}</h3>
              </div>
              <span className="text-4xl">{currentLangObj.flag}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Nivel */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 mb-4">
                  Nivel de habilidad:
                </h4>
                <div className="space-y-2.5">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.label)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                        selectedLevel === lvl.label
                          ? 'bg-orange-500/10 border-orange-500 text-white'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-medium text-white">{lvl.label}</div>
                      <div className="text-[11px] text-white/50">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tema de conversación */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/70 mb-4">
                  Situación de conversación:
                </h4>
                <div className="space-y-2.5">
                  {GENERAL_SCENARIOS.map((scen) => (
                    <button
                      key={scen.id}
                      onClick={() => setSelectedGeneralTopic(scen.name)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        selectedGeneralTopic === scen.name
                          ? 'bg-orange-500/10 border-orange-500 text-white'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <span className="text-xs font-medium">{scen.name}</span>
                      {selectedGeneralTopic === scen.name && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-white/50 font-mono">
                Tutor listo con modelo Gemini 2.5 Native Audio
              </span>
              <button
                onClick={handleStartGeneralCall}
                className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium flex items-center gap-2 transition-all shadow-xl shadow-orange-500/25"
              >
                <Mic className="w-4 h-4" />
                <span>Iniciar llamada en {currentLangObj.name}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Sección ¿Cómo funciona? */}
      <section id="como-funciona" className="py-24 px-6 bg-white/[0.015] border-y border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-orange-500 font-mono text-xs uppercase tracking-widest">Metodología Comprobada</span>
            <h2 className="text-4xl md:text-5xl font-serif italic mt-2 mb-4">¿Cómo funciona LingoLive?</h2>
            <p className="text-white/60">
              Aprender a hablar un idioma solo se logra hablando. Nuestro sistema replica una tutoría 1 a 1 en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
              <div className="text-3xl font-mono text-orange-500/40 mb-6">01</div>
              <h3 className="text-2xl font-serif italic mb-3">Elige tu reto</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Selecciona tu idioma o misión en inglés: desde pasar inmigración en JFK hasta negociar un aumento salarial.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
              <div className="text-3xl font-mono text-orange-500/40 mb-6">02</div>
              <h3 className="text-2xl font-serif italic mb-3">Habla libremente</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Usa tu voz normal. El modelo de audio nativo procesa tu pronunciación y modulación con latencia imperceptible.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
              <div className="text-3xl font-mono text-orange-500/40 mb-6">03</div>
              <h3 className="text-2xl font-serif italic mb-3">Aprende al instante</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                La IA responde de forma natural, te corrige amablemente los errores y te da retroalimentación para ganar confianza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Ventajas */}
      <section id="ventajas" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-mono text-xs uppercase tracking-widest">Ventajas Únicas</span>
          <h2 className="text-4xl md:text-5xl font-serif italic mt-2 mb-4">¿Por qué practicar con LingoLive?</h2>
          <p className="text-white/60">
            Diseñado especialmente para personas que entienden gramática pero se sienten paralizadas al momento de hablar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
              <Mic className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-xl font-serif italic mb-2">Voz Humana y Fluida</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Olvídate de las voces robóticas. Las respuestas tienen entonación, pausas naturales y emoción adaptativa.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <h4 className="text-xl font-serif italic mb-2">Cero Ansiedad o Vergüenza</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Practica tantas veces como quieras sin temor a equivocarte. La IA nunca se impacienta ni te hace sentir incómodo.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-xl font-serif italic mb-2">Inmersión Práctica</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Aprende jerga real, modismos de uso común y matices de conversación que no aparecen en los libros tradicionales.
            </p>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="py-16 px-6 border-t border-white/5 text-center text-white/40">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Languages className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-serif italic text-white">LingoLive AI</span>
        </div>
        <p className="text-xs font-mono mb-2">
          Tutor de idiomas conversacional impulsado por Gemini 2.5 Native Audio
        </p>
        <p className="text-xs text-white/60 mb-2">
          Desarrollado por{' '}
          <a
            href="http://x.com/luisangelmaciel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 font-mono font-medium hover:underline transition-colors inline-flex items-center gap-1"
          >
            @luisangelmaciel
          </a>
        </p>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
          &copy; {new Date().getFullYear()} LingoLive AI. Todos los derechos reservados.
        </p>
      </footer>

      {/* Botón flotante permanente de accesibilidad y temas */}
      <button
        onClick={() => setIsAppearanceOpen(true)}
        title="Personalizar color, contraste y tipografía accesible"
        aria-label="Personalizar color, contraste y tipografía accesible"
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-2xl shadow-orange-500/40 border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 font-mono text-xs cursor-pointer group"
      >
        <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform text-white" />
        <span className="hidden sm:inline font-medium">Accesibilidad & Color</span>
      </button>
    </div>
  );
}
