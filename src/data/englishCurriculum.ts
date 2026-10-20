export interface RoleplayMission {
  id: string;
  title: string;
  category: string;
  iconName: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  partnerRole: string;
  userRole: string;
  goal: string;
  systemPrompt: string;
  starterPhrase: string;
  vocabulary: { word: string; translation: string }[];
  suggestedQuestions: string[];
}

export interface PronunciationTopic {
  id: string;
  title: string;
  phonetic: string;
  problem: string;
  tip: string;
  pairs: { word1: string; ipa1: string; trans1: string; word2: string; ipa2: string; trans2: string }[];
}

export interface CheatSheetCategory {
  title: string;
  phrases: { english: string; spanish: string; audioText: string }[];
}

export interface AccentOption {
  id: string;
  name: string;
  flag: string;
  region: string;
  voiceName: string;
  sampleDescription: string;
}

export const ENGLISH_ACCENTS: AccentOption[] = [
  {
    id: 'us-puck',
    name: 'Inglés Americano (General US)',
    flag: '🇺🇸',
    region: 'Estados Unidos',
    voiceName: 'Puck',
    sampleDescription: 'Acento claro, dinámico y estándar de la costa oeste / Silicon Valley.',
  },
  {
    id: 'uk-aoede',
    name: 'Inglés Británico (RP London)',
    flag: '🇬🇧',
    region: 'Reino Unido',
    voiceName: 'Aoede',
    sampleDescription: 'Pronunciación refinada, entonación musical y vocabulario británico.',
  },
  {
    id: 'us-fenrir',
    name: 'Inglés Americano Profundo',
    flag: '🇺🇸',
    region: 'Estados Unidos',
    voiceName: 'Fenrir',
    sampleDescription: 'Tono firme, profesional y pausado. Excelente para entrevistas ejecutivas.',
  },
  {
    id: 'global-kore',
    name: 'Inglés Internacional / Global',
    flag: '🌍',
    region: 'Internacional',
    voiceName: 'Kore',
    sampleDescription: 'Dicción muy clara y pausada, idónea para principiantes.',
  },
];

export const ENGLISH_MISSIONS: RoleplayMission[] = [
  {
    id: 'jfk-immigration',
    title: 'Control de Pasaportes en JFK',
    category: 'Viajes',
    iconName: 'Plane',
    difficulty: 'Principiante',
    partnerRole: 'Oficial de Inmigración de EE.UU.',
    userRole: 'Turista recién aterrizado en Nueva York',
    goal: 'Responde sobre el motivo de tu viaje, hospedaje y duración de estancia con seguridad.',
    systemPrompt: `Actúa como un oficial de inmigración en el aeropuerto JFK de Nueva York. Eres formal, directo pero respetuoso. Haz preguntas típicas: motivo de viaje, dónde se alojará, cuánto tiempo se quedará y si lleva artículos declarables. Si el usuario titubea o comete un error, dale una corrección breve y continúa la entrevista.`,
    starterPhrase: "Next in line, please! Good afternoon. May I see your passport and declaration form?",
    vocabulary: [
      { word: 'Purpose of your visit', translation: 'Motivo de su visita' },
      { word: 'Duration of stay', translation: 'Duración de la estancia' },
      { word: 'Proof of accommodation', translation: 'Comprobante de hospedaje' },
      { word: 'Round-trip ticket', translation: 'Boleto de ida y vuelta' },
    ],
    suggestedQuestions: [
      "I'm here on vacation for two weeks.",
      "I'll be staying at a hotel near Times Square.",
      "Here is my return ticket, officer."
    ]
  },
  {
    id: 'tech-interview',
    title: 'Entrevista de Trabajo: "Tell Me About Yourself"',
    category: 'Laboral',
    iconName: 'Briefcase',
    difficulty: 'Intermedio',
    partnerRole: 'Headhunter / Reclutador Internacional',
    userRole: 'Candidato a un puesto profesional',
    goal: 'Presenta tu trayectoria profesional usando el método STAR y destaca tus fortalezas sin dudar.',
    systemPrompt: `Actúa como un reclutador senior internacional entrevistando al usuario en inglés para una posición corporativa o tecnológica. Comienza con una bienvenida cálida y pídele 'Tell me a little bit about yourself'. Evalúa su claridad, corrige pequeños errores gramaticales (como tiempos verbales en pasado) y haz preguntas de seguimiento profesionales.`,
    starterPhrase: "Hi there! Thanks for joining today's interview. Let's get right into it: could you please walk me through your background and tell me a bit about yourself?",
    vocabulary: [
      { word: 'Key strengths', translation: 'Puntos fuertes' },
      { word: 'Led a cross-functional team', translation: 'Lideré un equipo multidisciplinario' },
      { word: 'Achieved a milestone', translation: 'Alcancé un hito' },
      { word: 'Problem solver', translation: 'Resolutivo / solucionador de problemas' },
    ],
    suggestedQuestions: [
      "I have over 4 years of experience working in...",
      "One of my biggest achievements was...",
      "I'm looking for a new challenge where I can..."
    ]
  },
  {
    id: 'nyc-coffee',
    title: 'Pedir café en una Cafetería de Manhattan',
    category: 'Vida Diaria',
    iconName: 'Coffee',
    difficulty: 'Principiante',
    partnerRole: 'Barista neoyorquino ocupado pero amable',
    userRole: 'Cliente buscando su café matutino',
    goal: 'Pide un café con especificaciones (tipo de leche, tamaño, caliente/frío) y paga.',
    systemPrompt: `Actúa como un barista concurrido en una cafetería de Brooklyn o Manhattan. Habla con naturalidad casual: 'Hey, what can I get started for you today?'. Pregunta tamaño (small, medium, large), tipo de leche (oat, almond, whole), si lo quiere frío o caliente, y si desea agregar algún pastelillo.`,
    starterPhrase: "Hey, morning! What can I get started for you today?",
    vocabulary: [
      { word: 'Oat milk / Almond milk', translation: 'Leche de avena / de almendra' },
      { word: 'To go / For here', translation: 'Para llevar / Para tomar aquí' },
      { word: 'An extra shot of espresso', translation: 'Un shot extra de café expreso' },
      { word: 'Keep the change', translation: 'Quédese con el cambio' },
    ],
    suggestedQuestions: [
      "Can I get an iced latte with oat milk, please?",
      "Could I also get a blueberry muffin to go?",
      "Do you take contactless card payment?"
    ]
  },
  {
    id: 'salary-negotiation',
    title: 'Negociación Salarial y Beneficios',
    category: 'Avanzado',
    iconName: 'TrendingUp',
    difficulty: 'Avanzado',
    partnerRole: 'Gerente de Contratación (Hiring Manager)',
    userRole: 'Profesional negociando su oferta de empleo',
    goal: 'Argumenta tu valor de mercado y negocia un incremento del 15% o beneficios flexibles.',
    systemPrompt: `Actúa como un Hiring Manager que ha hecho una oferta inicial de salario. El usuario quiere negociar un rango más alto o más días de vacaciones. Sé profesional, escucha sus argumentos y haz preguntas sobre por qué considera que merece esa compensación. Corrige sutilmente muletillas o frases poco asertivas en inglés.`,
    starterPhrase: "We are thrilled to offer you the role! Based on our initial range, we're offering $75,000 annually. How does that sound to you?",
    vocabulary: [
      { word: 'Market rate benchmark', translation: 'Referencia del valor de mercado' },
      { word: 'Total compensation package', translation: 'Paquete de compensación total' },
      { word: 'Performance-based bonus', translation: 'Bono por desempeño' },
      { word: 'Flexible working arrangements', translation: 'Esquema de trabajo flexible' },
    ],
    suggestedQuestions: [
      "Based on my track record and current market data, I was targeting...",
      "Is there any flexibility in the base salary or equity options?",
      "Could we revisit this compensation after a 6-month review?"
    ]
  },
  {
    id: 'networking-happy-hour',
    title: 'Networking & Romper el Hielo',
    category: 'Social',
    iconName: 'Users',
    difficulty: 'Intermedio',
    partnerRole: 'Asistente a una conferencia internacional',
    userRole: 'Participante buscando expandir su red',
    goal: 'Inicia conversación, haz preguntas abiertas sobre su trabajo e intercambia contactos.',
    systemPrompt: `Actúa como un asistente amigable y extrovertido en una conferencia en San Francisco o Londres. Estás en la zona de café/cocktail. Haz small talk sobre las charlas del día, qué te trajo al evento y planes para la noche.`,
    starterPhrase: "Hey there! Mind if I join you at this table? That keynote speech was wild, wasn't it?",
    vocabulary: [
      { word: 'What brings you to the event?', translation: '¿Qué te trae al evento?' },
      { word: 'Connect on LinkedIn', translation: 'Conectar en LinkedIn' },
      { word: 'Fascinating perspective', translation: 'Perspectiva fascinante' },
      { word: 'Small talk', translation: 'Charla informal' },
    ],
    suggestedQuestions: [
      "I really enjoyed the session on AI innovation.",
      "What kind of projects are you currently working on?",
      "Let's connect on LinkedIn before we lose touch!"
    ]
  },
  {
    id: 'doctor-pharmacy',
    title: 'Consulta Médica y Farmacia',
    category: 'Salud',
    iconName: 'HeartPulse',
    difficulty: 'Intermedio',
    partnerRole: 'Farmacéutico o Médico de guardia',
    userRole: 'Paciente describiendo síntomas en el extranjero',
    goal: 'Explica dolores, duración de malestar y consulta posología de medicamentos.',
    systemPrompt: `Actúa como un farmacéutico en Londres o Nueva York. El usuario llega sintiéndose mal. Pregúntale qué síntomas tiene, desde cuándo, si tiene alergias a medicamentos y recomiéndale un remedio de venta libre explicándole cómo tomarlo.`,
    starterPhrase: "Good morning. How can I help you today? You don't look very well.",
    vocabulary: [
      { word: 'Sore throat & runny nose', translation: 'Dolor de garganta y congestión nasal' },
      { word: 'Over-the-counter medicine', translation: 'Medicamento de venta libre' },
      { word: 'Take one tablet every 8 hours', translation: 'Tomar una pastilla cada 8 horas' },
      { word: 'Drowsiness / Side effects', translation: 'Somnolencia / Efectos secundarios' },
    ],
    suggestedQuestions: [
      "I've had a bad headache and a cough since yesterday.",
      "Do I need a prescription for this painkiller?",
      "Does this medication make you feel sleepy?"
    ]
  }
];

export const ENGLISH_PRONUNCIATION_TOPICS: PronunciationTopic[] = [
  {
    id: 'th-sound',
    title: 'El sonido "TH" (/θ/ y /ð/)',
    phonetic: 'think vs this',
    problem: 'Los hispanohablantes suelen sustituirlo por una "S", "D" o "T", lo cual dificulta la comprensión.',
    tip: 'Coloca suavemente la punta de la lengua entre los dientes incisivos y sopla aire sin morderte. Haz vibrar las cuerdas vocales en "this" y déjala sorda en "think".',
    pairs: [
      { word1: 'Think', ipa1: '/θɪŋk/', trans1: 'Pensar', word2: 'Sink', ipa2: '/sɪŋk/', trans2: 'Hundirse / Fregadero' },
      { word1: 'Three', ipa1: '/θriː/', trans1: 'Tres', word2: 'Tree', ipa2: '/triː/', trans2: 'Árbol' },
      { word1: 'This', ipa1: '/ðɪs/', trans1: 'Este/Esta', word2: 'Dis', ipa2: '/dɪs/', trans2: 'Despreciar (slang)' },
      { word1: 'Faith', ipa1: '/feɪθ/', trans1: 'Fe', word2: 'Fate', ipa2: '/feɪt/', trans2: 'Destino' },
    ]
  },
  {
    id: 'short-i-vs-long-ee',
    title: 'Vocal Corta "I" vs Larga "EE"',
    phonetic: '/ɪ/ vs /iː/ (Ship vs Sheep)',
    problem: 'En español solo existe una "I". En inglés, /ɪ/ es relajada y corta, mientras que /iː/ es tensa y sonriente.',
    tip: 'Para /ɪ/ (ship), relaja la mandíbula y no sonrías. Para /iː/ (sheep), estira los labios como una sonrisa amplia.',
    pairs: [
      { word1: 'Ship', ipa1: '/ʃɪp/', trans1: 'Barco', word2: 'Sheep', ipa2: '/ʃiːp/', trans2: 'Oveja' },
      { word1: 'Live', ipa1: '/lɪv/', trans1: 'Vivir', word2: 'Leave', ipa2: '/liːv/', trans2: 'Irse / Dejar' },
      { word1: 'Sit', ipa1: '/sɪt/', trans1: 'Sentarse', word2: 'Seat', ipa2: '/siːt/', trans2: 'Asiento' },
      { word1: 'Bitch', ipa1: '/bɪtʃ/', trans1: 'Perra / Grosería', word2: 'Beach', ipa2: '/biːtʃ/', trans2: 'Playa' },
    ]
  },
  {
    id: 'ed-endings',
    title: 'Terminaciones en "-ED" del Pasado',
    phonetic: '/t/, /d/ o /ɪd/',
    problem: 'Casi todos intentan pronunciar la "e" de "-ed", diciendo "work-ed" en vez de /wɜːrkt/.',
    tip: 'Solo pronuncias la "E" (como /ɪd/) si el verbo termina en sonido "T" o "D" (ej. "wanted", "needed"). En los demás casos, la "e" es muda.',
    pairs: [
      { word1: 'Worked', ipa1: '/wɜːrkt/', trans1: 'Trabajó (sonido T final)', word2: 'Wanted', ipa2: '/ˈwɒn.tɪd/', trans2: 'Quiso (sonido ID)' },
      { word1: 'Played', ipa1: '/pleɪd/', trans1: 'Jugó (sonido D final)', word2: 'Decided', ipa2: '/dɪˈsaɪ.dɪd/', trans2: 'Decidió (sonido ID)' },
      { word1: 'Watched', ipa1: '/wɒtʃt/', trans1: 'Miró (sonido T final)', word2: 'Needed', ipa2: '/ˈniː.dɪd/', trans2: 'Necesitó (sonido ID)' },
      { word1: 'Stopped', ipa1: '/stɒpt/', trans1: 'Se detuvo (sonido T)', word2: 'Started', ipa2: '/ˈstɑː.tɪd/', trans2: 'Comenzó (sonido ID)' },
    ]
  },
  {
    id: 'b-vs-v',
    title: 'Diferencia entre "B" y "V"',
    phonetic: '/b/ (bilabial) vs /v/ (labiodental)',
    problem: 'En español moderno la B y la V suenan idénticas. En inglés son dos fonemas totalmente distintos.',
    tip: 'Para la "B", junta ambos labios y suelta aire (explosivo). Para la "V", toca los dientes superiores con el labio inferior y haz vibrar como una pequeña avispa.',
    pairs: [
      { word1: 'Berry', ipa1: '/ˈber.i/', trans1: 'Baya / Fruto', word2: 'Very', ipa2: '/ˈver.i/', trans2: 'Muy' },
      { word1: 'Best', ipa1: '/best/', trans1: 'El mejor', word2: 'Vest', ipa2: '/vest/', trans2: 'Chaleco' },
      { word1: 'Bat', ipa1: '/bæt/', trans1: 'Murciélago / Bate', word2: 'Vat', ipa2: '/væt/', trans2: 'Tina / Cuba' },
      { word1: 'Ban', ipa1: '/bæn/', trans1: 'Prohibir', word2: 'Van', ipa2: '/væn/', trans2: 'Furgoneta' },
    ]
  }
];

export const ENGLISH_CHEAT_SHEET: CheatSheetCategory[] = [
  {
    title: 'Para ganar tiempo sin quedarte en blanco',
    phrases: [
      { english: 'Let me think for a second...', spanish: 'Déjame pensar un segundo...', audioText: 'Let me think for a second' },
      { english: 'What I mean to say is...', spanish: 'Lo que quiero decir es...', audioText: 'What I mean to say is' },
      { english: 'How can I put this into words...', spanish: '¿Cómo puedo poner esto en palabras?...', audioText: 'How can I put this into words' },
      { english: 'That is a really great question.', spanish: 'Esa es una muy buena pregunta.', audioText: 'That is a really great question' },
    ]
  },
  {
    title: 'Si no entendiste o necesitas que repita',
    phrases: [
      { english: 'Could you repeat that a bit slower, please?', spanish: '¿Podrías repetir eso un poco más lento, por favor?', audioText: 'Could you repeat that a bit slower please?' },
      { english: "Sorry, I didn't quite catch that.", spanish: 'Disculpa, no llegué a escuchar bien eso.', audioText: "Sorry, I didn't quite catch that." },
      { english: 'What does that word mean in Spanish?', spanish: '¿Qué significa esa palabra en español?', audioText: 'What does that word mean in Spanish?' },
      { english: 'Could you rephrase that in other words?', spanish: '¿Podrías decir eso con otras palabras?', audioText: 'Could you rephrase that in other words?' },
    ]
  },
  {
    title: 'Para sonar fluido y natural (Conectores nativos)',
    phrases: [
      { english: 'To be completely honest with you...', spanish: 'Para serte totalmente sincero...', audioText: 'To be completely honest with you' },
      { english: 'As far as I know...', spanish: 'Hasta donde yo sé...', audioText: 'As far as I know' },
      { english: 'On the other hand...', spanish: 'Por otra parte / Por otro lado...', audioText: 'On the other hand' },
      { english: 'That totally makes sense to me.', spanish: 'Eso tiene todo el sentido para mí.', audioText: 'That totally makes sense to me.' },
    ]
  },
  {
    title: 'Para pedir correcciones al tutor',
    phrases: [
      { english: 'Did I pronounce that correctly?', spanish: '¿Pronuncié eso de forma correcta?', audioText: 'Did I pronounce that correctly?' },
      { english: 'Is this the natural way a native would say it?', spanish: '¿Es esta la forma natural en que lo diría un nativo?', audioText: 'Is this the natural way a native would say it?' },
      { english: 'Could you give me a quick example?', spanish: '¿Podrías darme un ejemplo rápido?', audioText: 'Could you give me a quick example?' },
    ]
  }
];
