export type ColorTheme = 'sunset' | 'ocean' | 'forest' | 'amethyst' | 'highcontrast' | 'cream';
export type FontMode = 'editorial' | 'modern' | 'accessible' | 'dyslexic' | 'mono';
export type FontSizeScale = 'normal' | 'large' | 'xlarge';

export interface ThemeSettings {
  colorTheme: ColorTheme;
  fontMode: FontMode;
  fontSize: FontSizeScale;
  highContrastBorders: boolean;
  reducedMotion: boolean;
  accessibleSpacing: boolean;
}

const STORAGE_KEY = 'lingolive_theme_accessibility_settings';

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  colorTheme: 'sunset',
  fontMode: 'editorial',
  fontSize: 'normal',
  highContrastBorders: false,
  reducedMotion: false,
  accessibleSpacing: false,
};

export const COLOR_THEME_OPTIONS = [
  {
    id: 'sunset' as ColorTheme,
    name: 'Atardecer Ámbar (Original)',
    description: 'Fondo oscuro cálido con acento naranja y dorado.',
    bgHex: '#0a0502',
    accentHex: '#ff5500',
    type: 'dark',
  },
  {
    id: 'ocean' as ColorTheme,
    name: 'Medianoche Azul',
    description: 'Fondo azul zafiro profundo con acento cian.',
    bgHex: '#050b14',
    accentHex: '#0284c7',
    type: 'dark',
  },
  {
    id: 'forest' as ColorTheme,
    name: 'Bosque Esmeralda',
    description: 'Fondo verde bosque nocturno con acento esmeralda.',
    bgHex: '#03140c',
    accentHex: '#059669',
    type: 'dark',
  },
  {
    id: 'amethyst' as ColorTheme,
    name: 'Cíber Amatista',
    description: 'Fondo violeta cósmico con acento neón púrpura.',
    bgHex: '#0d0617',
    accentHex: '#9333ea',
    type: 'dark',
  },
  {
    id: 'highcontrast' as ColorTheme,
    name: 'Alto Contraste (WCAG AAA)',
    description: 'Negro puro con tipografía amarilla y bordes gruesos.',
    bgHex: '#000000',
    accentHex: '#facc15',
    type: 'high-contrast',
  },
  {
    id: 'cream' as ColorTheme,
    name: 'Marfil Suave (Modo Claro)',
    description: 'Fondo claro crema anti-fatiga con acento terracota.',
    bgHex: '#fcf9f2',
    accentHex: '#ea580c',
    type: 'light',
  },
];

export const FONT_MODE_OPTIONS = [
  {
    id: 'editorial' as FontMode,
    name: 'Editorial Clásico',
    fontFamily: '"Cormorant Garamond", serif',
    badge: 'Elegante',
    description: 'Serif artístico para títulos y sans-serif limpio para lectura.',
    example: 'Aa Bb Gg 123',
  },
  {
    id: 'modern' as FontMode,
    name: 'Sans-Serif Moderno (Inter)',
    fontFamily: '"Inter", sans-serif',
    badge: 'Máxima Nitidez',
    description: 'Geométrico, minimalista y libre de distracciones en pantalla.',
    example: 'Aa Bb Gg 123',
  },
  {
    id: 'accessible' as FontMode,
    name: 'Atkinson Hyperlegible',
    fontFamily: '"Atkinson Hyperlegible", sans-serif',
    badge: 'Instituto Braille',
    description: 'Diseñada específicamente para diferenciar caracteres ambiguos (I, l, 1, 0, O).',
    example: 'Il1 0O Qq 8B',
  },
  {
    id: 'dyslexic' as FontMode,
    name: 'Lexend (Amigable para Dislexia)',
    fontFamily: '"Lexend", sans-serif',
    badge: 'Lectura Fluida',
    description: 'Espaciado interlineal expandido y glifos con base ponderada.',
    example: 'bd pq mn 123',
  },
  {
    id: 'mono' as FontMode,
    name: 'JetBrains Mono',
    fontFamily: '"JetBrains Mono", monospace',
    badge: 'Espaciado Fijo',
    description: 'Ancho uniforme para cada glifo, ideal para precisión.',
    example: 'fn() => void',
  },
];

export function getSavedThemeSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading theme settings', e);
  }
  return DEFAULT_THEME_SETTINGS;
}

export function saveThemeSettings(settings: ThemeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyThemeToDocument(settings);
  } catch (e) {
    console.error('Error saving theme settings', e);
  }
}

export function applyThemeToDocument(settings: ThemeSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Remover temas previos
  COLOR_THEME_OPTIONS.forEach(t => root.classList.remove(`theme-${t.id}`));
  root.classList.add(`theme-${settings.colorTheme}`);

  // Remover fuentes previas
  FONT_MODE_OPTIONS.forEach(f => root.classList.remove(`font-mode-${f.id}`));
  root.classList.add(`font-mode-${settings.fontMode}`);

  // Escala de texto
  root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
  root.classList.add(`text-scale-${settings.fontSize}`);

  // Accesibilidad adicional
  if (settings.accessibleSpacing) {
    root.classList.add('accessible-spacing');
  } else {
    root.classList.remove('accessible-spacing');
  }

  if (settings.reducedMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
}
