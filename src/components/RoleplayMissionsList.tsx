import React, { useState } from 'react';
import { 
  Plane, 
  Briefcase, 
  Coffee, 
  TrendingUp, 
  Users, 
  HeartPulse, 
  ChevronRight, 
  Target, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ENGLISH_MISSIONS, RoleplayMission } from '../data/englishCurriculum';

interface RoleplayMissionsListProps {
  selectedMissionId: string;
  onSelectMission: (mission: RoleplayMission) => void;
  onLaunchMission: (mission: RoleplayMission) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Plane,
  Briefcase,
  Coffee,
  TrendingUp,
  Users,
  HeartPulse,
};

export default function RoleplayMissionsList({ 
  selectedMissionId, 
  onSelectMission, 
  onLaunchMission 
}: RoleplayMissionsListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Viajes', 'Laboral', 'Vida Diaria', 'Social', 'Salud', 'Avanzado'];

  const filteredMissions = activeCategory === 'Todos'
    ? ENGLISH_MISSIONS
    : ENGLISH_MISSIONS.filter(m => m.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Filtros de categoría */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              activeCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de misiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMissions.map((mission) => {
          const IconComponent = ICON_MAP[mission.iconName] || Target;
          const isSelected = selectedMissionId === mission.id;

          return (
            <div
              key={mission.id}
              onClick={() => onSelectMission(mission)}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-gradient-to-b from-orange-500/15 to-orange-500/5 border-orange-500 ring-2 ring-orange-500/40 shadow-xl shadow-orange-500/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
              }`}
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {mission.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                      mission.difficulty === 'Principiante'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : mission.difficulty === 'Intermedio'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}>
                      {mission.difficulty}
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-serif italic text-white group-hover:text-orange-200 transition-colors mb-2">
                  {mission.title}
                </h4>

                <div className="space-y-1.5 mb-4">
                  <p className="text-xs text-white/60 flex items-center gap-1.5">
                    <span className="text-white/40 font-mono">Tutor:</span> 
                    <span className="text-orange-300 font-medium">{mission.partnerRole}</span>
                  </p>
                  <p className="text-xs text-white/60 flex items-center gap-1.5">
                    <span className="text-white/40 font-mono">Tú eres:</span> 
                    <span className="text-white/90">{mission.userRole}</span>
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange-400 mb-1">
                    <Target className="w-3.5 h-3.5" /> Misión clave:
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {mission.goal}
                  </p>
                </div>

                {/* Vocabulario clave */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Vocabulario que usarás:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.vocabulary.slice(0, 3).map((v, vIdx) => (
                      <span 
                        key={vIdx} 
                        title={v.translation}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-white/70 hover:text-white hover:border-orange-500/40 cursor-help transition-colors"
                      >
                        {v.word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-white/50">
                  {isSelected ? '✓ Misión Activa' : 'Seleccionar'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchMission(mission);
                  }}
                  className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20"
                >
                  <span>Iniciar reto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
