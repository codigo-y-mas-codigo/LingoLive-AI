import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Eye, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  Sliders, 
  ZoomIn, 
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { 
  ThemeSettings, 
  COLOR_THEME_OPTIONS, 
  FONT_MODE_OPTIONS, 
  DEFAULT_THEME_SETTINGS,
  ColorTheme,
  FontMode,
  FontSizeScale
} from '../utils/themeSettings';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: ThemeSettings) => void;
}

export default function AppearanceModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: AppearanceModalProps) {
  const [activeTab, setActiveTab] = useState<'theme' | 'typography' | 'accessibility'>('theme');

  if (!isOpen) return null;

  const handleColorChange = (colorTheme: ColorTheme) => {
    onUpdateSettings({ ...settings, colorTheme });
  };

  const handleFontChange = (fontMode: FontMode) => {
    onUpdateSettings({ ...settings, fontMode });
  };

  const handleFontSizeChange = (fontSize: FontSizeScale) => {
    onUpdateSettings({ ...settings, fontSize });
  };

  const handleToggle = (key: 'highContrastBorders' | 'reducedMotion' | 'accessibleSpacing') => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const handleReset = () => {
    onUpdateSettings(DEFAULT_THEME_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f0905] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col justify-between">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-white">Apariencia y Accesibilidad</h3>
              <p className="text-xs text-white/50">Personaliza los colores, tipografía y legibilidad de la interfaz</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de configuración */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 ${
              activeTab === 'theme'
                ? 'bg-orange-500 text-white font-medium shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colores ({COLOR_THEME_OPTIONS.find(t => t.id === settings.colorTheme)?.name.split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 ${
              activeTab === 'typography'
                ? 'bg-orange-500 text-white font-medium shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Tipografía ({FONT_MODE_OPTIONS.find(f => f.id === settings.fontMode)?.name.split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setActiveTab('accessibility')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 ${
              activeTab === 'accessibility'
                ? 'bg-orange-500 text-white font-medium shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Legibilidad & Tamaño</span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="space-y-6 overflow-y-auto pr-1 flex-1 py-2">
          {/* TAB 1: Temas de color */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                Selecciona la paleta visual para toda la aplicación:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {COLOR_THEME_OPTIONS.map((theme) => {
                  const isSelected = settings.colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleColorChange(theme.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 border-orange-500 ring-2 ring-orange-500/40 text-white shadow-lg'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        {/* Muestras de color */}
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: theme.bgHex }}
                          />
                          <span 
                            className="w-6 h-6 rounded-full shadow-md"
                            style={{ backgroundColor: theme.accentHex }}
                          />
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span>{theme.name}</span>
                          {theme.type === 'high-contrast' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-400 text-black font-bold">
                              AAA
                            </span>
                          )}
                          {theme.type === 'light' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                              Claro
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          {theme.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Tipografía */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                Selecciona la fuente que mejor se adapte a tu comodidad visual o estilo de aprendizaje:
              </span>

              <div className="space-y-3">
                {FONT_MODE_OPTIONS.map((font) => {
                  const isSelected = settings.fontMode === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => handleFontChange(font.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-white/10 border-orange-500 ring-2 ring-orange-500/40 text-white shadow-lg'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/80'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="text-base font-semibold text-white"
                            style={{ fontFamily: font.fontFamily }}
                          >
                            {font.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                            {font.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/50">
                          {font.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span 
                          className="text-lg text-orange-400 font-medium"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.example}
                        </span>
                        {isSelected && (
                          <div className="mt-1 flex items-center justify-end text-xs font-mono text-orange-400">
                            ✓ Activo
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Accesibilidad & Tamaño */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              {/* Escala de Tamaño de Texto */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-white/60 mb-3 block">
                  Tamaño de texto de la interfaz:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'normal' as FontSizeScale, label: 'Normal (100%)', sample: 'A' },
                    { id: 'large' as FontSizeScale, label: 'Grande (112%)', sample: 'A+' },
                    { id: 'xlarge' as FontSizeScale, label: 'Extra Grande (125%)', sample: 'A++' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleFontSizeChange(size.id)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        settings.fontSize === size.id
                          ? 'bg-orange-500 text-white font-medium shadow-md'
                          : 'bg-white/5 border-white/10 hover:border-white/25 text-white/70'
                      }`}
                    >
                      <span className="text-2xl font-bold block mb-1">{size.sample}</span>
                      <span className="text-xs font-mono">{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles de accesibilidad */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                  Ajustes ergonómicos y motores:
                </span>

                {/* Espaciado de lectura */}
                <div 
                  onClick={() => handleToggle('accessibleSpacing')}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/25 transition-all"
                >
                  <div>
                    <h5 className="text-sm font-medium text-white">Espaciado de lectura relajado</h5>
                    <p className="text-xs text-white/50">Incrementa el interlineado y la separación entre caracteres para reducir el amontonamiento visual.</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.accessibleSpacing ? 'bg-orange-500' : 'bg-white/20'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.accessibleSpacing ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </div>

                {/* Reducción de animaciones */}
                <div 
                  onClick={() => handleToggle('reducedMotion')}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/25 transition-all"
                >
                  <div>
                    <h5 className="text-sm font-medium text-white">Reducir animaciones y movimiento</h5>
                    <p className="text-xs text-white/50">Desactiva pulsos, destellos y transiciones rápidas para personas con sensibilidad visual o vestibular.</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.reducedMotion ? 'bg-orange-500' : 'bg-white/20'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta de Vista Previa en Vivo */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mt-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
              Vista previa con tus ajustes actuales:
            </span>
            <p className="text-base text-white/90 font-medium">
              "The quick brown fox jumps over the lazy dog."
            </p>
            <p className="text-xs text-white/50">
              Práctica de fluidez por voz sin barreras visuales.
            </p>
          </div>
        </div>

        {/* Pie con acciones */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-mono text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-all shadow-md shadow-orange-500/20"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
