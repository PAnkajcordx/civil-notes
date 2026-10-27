import React, { useState } from 'react';
import { Palette, Check, Sparkles, Compass, Grid, Layers, Moon } from 'lucide-react';

export type BackgroundTheme = 'blueprint' | 'midnight_truss' | 'drafting_parchment' | 'emerald_matrix';

interface BackgroundCustomizerProps {
  currentTheme: BackgroundTheme;
  onThemeChange: (theme: BackgroundTheme) => void;
}

export const THEMES: { id: BackgroundTheme; name: string; description: string; previewColor: string; accentColor: string }[] = [
  {
    id: 'blueprint',
    name: 'CAD Cyan Blueprint',
    description: 'Technical drafting grid with coordinate crosshairs & contour lines',
    previewColor: '#0a192f',
    accentColor: '#38bdf8'
  },
  {
    id: 'midnight_truss',
    name: 'Midnight Steel Truss',
    description: 'Obsidian architectural space with illuminated structural bridge cables',
    previewColor: '#090d16',
    accentColor: '#10b981'
  },
  {
    id: 'drafting_parchment',
    name: 'Architectural Vellum',
    description: 'Warm engineering drafting board with millimeter grid & compass marks',
    previewColor: '#f1ede4',
    accentColor: '#b45309'
  },
  {
    id: 'emerald_matrix',
    name: 'Civil BIM Matrix',
    description: 'Deep forest terrain with structural digital coordinate nodes',
    previewColor: '#052117',
    accentColor: '#34d399'
  }
];

export const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Quick Background Switcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 text-white rounded-full text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all border border-slate-700/80 cursor-pointer backdrop-blur-md group"
        title="Change Background Style"
      >
        <Palette className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Theme: </span>
        <span className="text-emerald-300 font-bold capitalize">
          {currentTheme.replace('_', ' ')}
        </span>
      </button>

      {/* Theme Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Select Background Style</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-slate-500">
                Choose an architectural backdrop with live technical grids and structural engineering visual motifs.
              </p>

              <div className="space-y-2.5">
                {THEMES.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        onThemeChange(theme.id);
                        setIsOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border border-black/20 shadow-xs shrink-0"
                          style={{ backgroundColor: theme.previewColor }}
                        >
                          <Grid className="w-5 h-5 text-white/80" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {theme.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Apply &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const BackgroundCanvas: React.FC<{ theme: BackgroundTheme }> = ({ theme }) => {
  switch (theme) {
    case 'blueprint':
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Deep Cyan/Navy Technical Blueprint Grid */}
          <div className="absolute inset-0 bg-[#071626]" />
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
              <pattern id="largeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#largeGrid)" />
            {/* Elevation Contours & Engineering Lines */}
            <path d="M-100,200 C300,50 600,350 1400,100" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
            <path d="M-50,450 C400,250 800,550 1600,300" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.3" />
            {/* Coordinate Crosshairs */}
            <circle cx="120" cy="180" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <line x1="100" y1="180" x2="140" y2="180" stroke="#38bdf8" strokeWidth="1" />
            <line x1="120" y1="160" x2="120" y2="200" stroke="#38bdf8" strokeWidth="1" />
            <text x="145" y="185" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.7">X: 120.40 Y: 180.00</text>
            <circle cx="850" cy="350" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <line x1="830" y1="350" x2="870" y2="350" stroke="#38bdf8" strokeWidth="1" />
            <line x1="850" y1="330" x2="850" y2="370" stroke="#38bdf8" strokeWidth="1" />
          </svg>
          <div className="absolute inset-0 bg-radial from-transparent via-[#071626]/40 to-[#071626]/80" />
        </div>
      );

    case 'midnight_truss':
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Midnight Obsidian Slate with Truss Shadows */}
          <div className="absolute inset-0 bg-[#090d16]" />
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trussPattern" width="120" height="80" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="120" y2="0" stroke="#10b981" strokeWidth="1" />
                <line x1="0" y1="80" x2="120" y2="80" stroke="#10b981" strokeWidth="1" />
                <line x1="0" y1="0" x2="60" y2="80" stroke="#10b981" strokeWidth="1.2" />
                <line x1="60" y1="80" x2="120" y2="0" stroke="#10b981" strokeWidth="1.2" />
                <line x1="60" y1="0" x2="60" y2="80" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trussPattern)" />
            {/* Monumental suspension bridge curve */}
            <path d="M0,150 Q500,500 1200,180 T2400,200" fill="none" stroke="#34d399" strokeWidth="2.5" opacity="0.3" />
            <path d="M0,155 Q500,505 1200,185 T2400,205" fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.2" />
          </svg>
          {/* Ambient luminous glow */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      );

    case 'drafting_parchment':
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Warm Technical Engineering Vellum */}
          <div className="absolute inset-0 bg-[#f4efe6]" />
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="parchmentGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#b45309" strokeWidth="0.4" />
              </pattern>
              <pattern id="parchmentMajor" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#parchmentGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#92400e" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#parchmentMajor)" />
            {/* Structural Draft Notes & Compass Mark */}
            <circle cx="200" cy="180" r="40" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="200" cy="180" r="3" fill="#b45309" />
            <line x1="140" y1="180" x2="260" y2="180" stroke="#b45309" strokeWidth="0.75" />
            <line x1="200" y1="120" x2="200" y2="240" stroke="#b45309" strokeWidth="0.75" />
            <text x="210" y="170" fill="#92400e" fontSize="9" fontFamily="monospace">R = 40.0m</text>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f4efe6]/10 to-[#f4efe6]/60" />
        </div>
      );

    case 'emerald_matrix':
    default:
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Deep Forest Emerald BIM Matrix */}
          <div className="absolute inset-0 bg-[#041d14]" />
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="matrixPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#34d399" />
                <line x1="20" y1="0" x2="20" y2="40" stroke="#065f46" strokeWidth="0.5" strokeDasharray="2 6" />
                <line x1="0" y1="20" x2="40" y2="20" stroke="#065f46" strokeWidth="0.5" strokeDasharray="2 6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#matrixPattern)" />
            {/* Topographic 3D terrain wireframe */}
            <path d="M-100,300 Q400,100 800,400 T1800,200" fill="none" stroke="#10b981" strokeWidth="1.8" />
            <path d="M-100,340 Q400,140 800,440 T1800,240" fill="none" stroke="#059669" strokeWidth="1.2" opacity="0.6" />
            <path d="M-100,380 Q400,180 800,480 T1800,280" fill="none" stroke="#047857" strokeWidth="0.8" opacity="0.4" />
          </svg>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      );
  }
};
