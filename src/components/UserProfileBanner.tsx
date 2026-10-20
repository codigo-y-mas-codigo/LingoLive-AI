import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Check, 
  Edit3, 
  Target, 
  Zap, 
  Flame,
  Award
} from 'lucide-react';
import { 
  UserStats, 
  saveUserName, 
  getSmartNextStep, 
  formatTimeAgo, 
  NextStepRecommendation 
} from '../utils/progressStorage';

interface UserProfileBannerProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onExecuteRecommendation: (recommendation: NextStepRecommendation) => void;
}

export default function UserProfileBanner({
  stats,
  onUpdateStats,
  onExecuteRecommendation,
}: UserProfileBannerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(stats.userName || '');

  const recommendation = getSmartNextStep(stats);
  const hasName = Boolean(stats.userName && stats.userName.trim().length > 0);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      const updated = saveUserName(inputName.trim());
      onUpdateStats(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white/[0.02] p-6 sm:p-8 backdrop-blur-md shadow-xl mb-12">
      {/* Luz decorativa */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />

      {/* CASO 1: Si no tiene nombre registrado aún o está editando */}
      {!hasName || isEditing ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-400">
              <Sparkles className="w-3.5 h-3.5" /> Personaliza tu experiencia
            </div>
            <h3 className="text-2xl font-serif italic text-white">
              ¿Cómo te gustaría que te llame tu tutor de IA?
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Tu tutor se dirigirá a ti por tu nombre en cada llamada de voz y recordará exactamente en qué punto dejaste tu práctica.
            </p>
          </div>

          <form onSubmit={handleSaveName} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Escribe tu nombre..."
                autoFocus
                maxLength={30}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-black/50 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs font-mono transition-colors"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      ) : (
        /* CASO 2: Usuario recurrente con nombre */
        <div className="space-y-6 relative z-10">
          {/* Fila de saludo y estado anterior */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-serif italic text-white">
                    ¡Hola de nuevo, <span className="text-orange-400 font-normal">{stats.userName}</span>! 👋
                  </h3>
                  <button
                    onClick={() => {
                      setInputName(stats.userName);
                      setIsEditing(true);
                    }}
                    title="Editar nombre"
                    className="w-6 h-6 rounded-full hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-white/60 flex items-center gap-2 mt-0.5">
                  <span>
                    La última vez estuviste practicando: <strong className="text-white font-medium">{stats.lastTopicOrMission}</strong> ({stats.lastLanguageName}).
                  </span>
                  <span className="text-white/30">&bull;</span>
                  <span className="text-orange-300 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatTimeAgo(stats.lastTimestamp)}
                  </span>
                </p>
              </div>
            </div>

            {/* Badges de racha y minutos */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-white/80">{stats.streakDays} días seguidos</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-white/80">{stats.sessionsCompleted} sesiones</span>
              </div>
            </div>
          </div>

          {/* Fila del siguiente paso recomendado */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-semibold">
                    ¿Qué debes seguir practicando hoy?
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  {recommendation.nextTitle}
                </h4>
                <p className="text-xs text-white/60 mt-0.5">
                  {recommendation.nextDescription}
                </p>
              </div>
            </div>

            <button
              onClick={() => onExecuteRecommendation(recommendation)}
              className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 shrink-0 group cursor-pointer"
            >
              <span>{recommendation.actionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
