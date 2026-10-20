export interface UserStats {
  userName: string;
  totalMinutes: number;
  sessionsCompleted: number;
  streakDays: number;
  lastSessionDate: string | null;
  completedMissions: string[];
  lastLanguageId: string;
  lastLanguageName: string;
  lastTopicOrMission: string;
  lastMissionId?: string;
  lastTimestamp: number;
}

const STORAGE_KEY = 'lingolive_user_stats';

const DEFAULT_STATS: UserStats = {
  userName: '',
  totalMinutes: 0,
  sessionsCompleted: 0,
  streakDays: 1,
  lastSessionDate: null,
  completedMissions: [],
  lastLanguageId: 'english',
  lastLanguageName: 'Inglés',
  lastTopicOrMission: 'Control de Pasaportes en JFK',
  lastMissionId: 'jfk-immigration',
  lastTimestamp: Date.now(),
};

export function getSavedStats(): UserStats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_STATS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading stats from localStorage', e);
  }
  return DEFAULT_STATS;
}

export function saveUserName(name: string): UserStats {
  const current = getSavedStats();
  const updated = { ...current, userName: name.trim() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving user name to localStorage', e);
  }
  return updated;
}

export function recordPracticeSession(params: {
  durationMinutes: number;
  languageId: string;
  languageName: string;
  topicOrMission: string;
  missionId?: string;
}): UserStats {
  const current = getSavedStats();
  const today = new Date().toISOString().split('T')[0];

  let newStreak = current.streakDays;
  if (!current.lastSessionDate) {
    newStreak = 1;
  } else if (current.lastSessionDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (current.lastSessionDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const completed = new Set(current.completedMissions);
  if (params.missionId) {
    completed.add(params.missionId);
  }

  const durationToAdd = Math.max(1, Math.round(params.durationMinutes));

  const updated: UserStats = {
    ...current,
    totalMinutes: current.totalMinutes + durationToAdd,
    sessionsCompleted: current.sessionsCompleted + 1,
    streakDays: newStreak,
    lastSessionDate: today,
    completedMissions: Array.from(completed),
    lastLanguageId: params.languageId,
    lastLanguageName: params.languageName,
    lastTopicOrMission: params.topicOrMission,
    lastMissionId: params.missionId,
    lastTimestamp: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving stats to localStorage', e);
  }

  return updated;
}

// Para compatibilidad con código existente
export function saveSessionStats(durationMinutes: number, missionId?: string): UserStats {
  const current = getSavedStats();
  return recordPracticeSession({
    durationMinutes,
    languageId: current.lastLanguageId || 'english',
    languageName: current.lastLanguageName || 'Inglés',
    topicOrMission: current.lastTopicOrMission || 'Conversación libre',
    missionId,
  });
}

export interface NextStepRecommendation {
  nextTitle: string;
  nextDescription: string;
  actionText: string;
  languageId: string;
  missionId?: string;
  tab?: 'missions' | 'pronunciation';
}

export function getSmartNextStep(stats: UserStats): NextStepRecommendation {
  const completed = new Set(stats.completedMissions);

  // Si no ha hecho la misión de JFK
  if (!completed.has('jfk-immigration')) {
    return {
      nextTitle: 'Misión: Control de Pasaportes en JFK',
      nextDescription: 'El primer gran obstáculo al viajar. Practica responder al oficial de migración con total soltura.',
      actionText: 'Comenzar misión en JFK',
      languageId: 'english',
      missionId: 'jfk-immigration',
      tab: 'missions',
    };
  }

  // Si no ha hecho café en NYC
  if (!completed.has('nyc-coffee')) {
    return {
      nextTitle: 'Misión: Pedir café en Manhattan',
      nextDescription: 'Aprende a personalizar tipos de leche, tamaños y pagar con naturalidad en inglés casual.',
      actionText: 'Ir a la cafetería',
      languageId: 'english',
      missionId: 'nyc-coffee',
      tab: 'missions',
    };
  }

  // Si no ha hecho entrevista laboral
  if (!completed.has('tech-interview')) {
    return {
      nextTitle: 'Misión: Entrevista "Tell me about yourself"',
      nextDescription: 'Domina la respuesta más crucial en entrevistas de trabajo internacionales usando el método STAR.',
      actionText: 'Practicar mi presentación laboral',
      languageId: 'english',
      missionId: 'tech-interview',
      tab: 'missions',
    };
  }

  // Si completó las básicas, sugerir fonética
  if (stats.sessionsCompleted % 2 === 0) {
    return {
      nextTitle: 'Laboratorio de Fonética: El sonido "TH"',
      nextDescription: 'Aprende a colocar la lengua para pronunciar "think" y "this" sin sonar como una "S" o "D".',
      actionText: 'Entrenar sonido TH',
      languageId: 'english',
      tab: 'pronunciation',
    };
  }

  // Sugerir networking
  if (!completed.has('networking-happy-hour')) {
    return {
      nextTitle: 'Misión: Networking y romper el hielo',
      nextDescription: 'Aprende small talk para conferencias, eventos sociales y hacer amigos en inglés.',
      actionText: 'Romper el hielo',
      languageId: 'english',
      missionId: 'networking-happy-hour',
      tab: 'missions',
    };
  }

  // Misión avanzada de negociación
  return {
    nextTitle: 'Misión Avanzada: Negociación Salarial',
    nextDescription: 'Argumenta tu valor de mercado y negocia con seguridad un incremento o paquete de beneficios.',
    actionText: 'Negociar salario',
    languageId: 'english',
    missionId: 'salary-negotiation',
    tab: 'missions',
  };
}

export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return 'recientemente';
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 2) return 'hace un momento';
  if (mins < 60) return `hace ${mins} minutos`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
}
