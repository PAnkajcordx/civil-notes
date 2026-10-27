import React, { useState } from 'react';
import { BTEC_UNITS } from '../data/civilData';
import { BTECUnit } from '../types';
import { 
  Layers, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Compass, 
  Download, 
  FileText, 
  MoveRight, 
  Sparkles,
  BarChart3,
  HardHat
} from 'lucide-react';

interface DeckBoardProps {
  onPreviewUnit: (unit: BTECUnit) => void;
  onDownloadUnit: (unit: BTECUnit) => void;
}

type DeckTab = 'simulator' | 'kanban' | 'cards';

interface KanbanTask {
  id: string;
  unitCode: string;
  title: string;
  status: 'todo' | 'progress' | 'review' | 'done';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Critical';
}

export const DeckBoard: React.FC<DeckBoardProps> = ({ onPreviewUnit, onDownloadUnit }) => {
  const [activeDeckTab, setActiveDeckTab] = useState<DeckTab>('simulator');

  // Interactive Structural Deck Beam Simulator State
  const [spanLength, setSpanLength] = useState<number>(8); // meters
  const [deadLoadUDL, setDeadLoadUDL] = useState<number>(18); // kN/m
  const [pointLoadP, setPointLoadP] = useState<number>(45); // kN at midspan
  const [deckType, setDeckType] = useState<'rc_slab' | 'composite_steel' | 'prestressed' | 'timber_glulam'>('composite_steel');

  // Interactive Kanban Deck State
  const [tasks, setTasks] = useState<KanbanTask[]>([
    {
      id: 'k1',
      unitCode: 'Unit 1 • L3',
      title: 'Bending Moment & Shear Force Envelopes for Simply Supported Bridge Girder',
      status: 'done',
      dueDate: 'Submitted',
      priority: 'Critical'
    },
    {
      id: 'k2',
      unitCode: 'Unit 2 - L3',
      title: 'Two-Peg Level Collimation Reduction & Closed Traverse Bowditch Balance',
      status: 'review',
      dueDate: 'In 2 days',
      priority: 'High'
    },
    {
      id: 'k3',
      unitCode: 'Unit 3 • L3',
      title: 'Contiguous Bored Pile Wall & Basement Type B Waterproofing Detail',
      status: 'progress',
      dueDate: 'In 5 days',
      priority: 'Medium'
    },
    {
      id: 'k4',
      unitCode: 'Unit 4 • L3',
      title: 'CDM 2015 Pre-Construction Information & High-Risk Excavation RAMS',
      status: 'todo',
      dueDate: 'Next week',
      priority: 'High'
    },
    {
      id: 'k5',
      unitCode: 'Unit 30 • HNC',
      title: 'Triaxial Mohr-Coulomb Failure Envelope & Rankine Retaining Wall FOS',
      status: 'progress',
      dueDate: 'In 4 days',
      priority: 'Critical'
    },
    {
      id: 'k6',
      unitCode: 'Unit 29 • HND',
      title: 'Macaulay’s Singularity Bracket Beam Deflection Differential Equation',
      status: 'done',
      dueDate: 'Verified',
      priority: 'Critical'
    }
  ]);

  // Calculations for structural deck simulator
  // M_udl = w*L^2 / 8
  // M_point = P*L / 4
  const maxBM_UDL = (deadLoadUDL * Math.pow(spanLength, 2)) / 8;
  const maxBM_Point = (pointLoadP * spanLength) / 4;
  const totalMaxBM = Math.round((maxBM_UDL + maxBM_Point) * 10) / 10; // kN·m

  // Support reactions (symmetric)
  // R = (w*L)/2 + P/2
  const maxReaction = Math.round(((deadLoadUDL * spanLength) / 2 + pointLoadP / 2) * 10) / 10; // kN

  // Deflection approximation: delta = 5wL^4/(384EI) + PL^3/(48EI)
  // Elastic modulus & Inertia constants based on selected deck type
  const deckProperties = {
    rc_slab: { name: 'Reinforced Concrete Slab (C30/37)', EI: 145000, maxAllowableStress: 14.5, unitWeight: '25 kN/m³' },
    composite_steel: { name: 'Composite Steel-Concrete Deck (UB 457)', EI: 285000, maxAllowableStress: 275, unitWeight: '78.5 kN/m³' },
    prestressed: { name: 'Prestressed Concrete Precast T-Beam', EI: 395000, maxAllowableStress: 35.0, unitWeight: '24.5 kN/m³' },
    timber_glulam: { name: 'Glulam Timber Heavy Deck (GL28h)', EI: 78000, maxAllowableStress: 28.0, unitWeight: '4.8 kN/m³' },
  }[deckType];

  // Calculated deflection in mm
  const deflectionMM = Math.min(
    120,
    Math.round(
      ((5 * deadLoadUDL * Math.pow(spanLength * 1000, 4)) / (384 * deckProperties.EI * 1e6) +
        (pointLoadP * 1000 * Math.pow(spanLength * 1000, 3)) / (48 * deckProperties.EI * 1e6)) *
        10
    ) / 10
  );

  const allowableDeflectionLimit = Math.round((spanLength * 1000) / 250); // L/250 standard
  const isDeflectionPass = deflectionMM <= allowableDeflectionLimit;

  // Move task to next status in kanban
  const moveTaskStatus = (taskId: string) => {
    const statusFlow: ('todo' | 'progress' | 'review' | 'done')[] = ['todo', 'progress', 'review', 'done'];
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const currentIndex = statusFlow.indexOf(task.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...task, status: statusFlow[nextIndex] };
        }
        return task;
      })
    );
  };

  return (
    <div className="py-3 sm:py-5 space-y-5">
      {/* Deck Board Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-emerald-950/90 backdrop-blur-md border border-emerald-500/30 p-5 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>CivilNotes Engineering Deck</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Responsive Deck Board
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Real-time structural deck mechanics simulator, BTEC coursework kanban cards, and unit portfolio deck inspector.
            </p>
          </div>

          {/* Quick Deck Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveDeckTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDeckTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Deck Simulator</span>
            </button>
            <button
              onClick={() => setActiveDeckTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDeckTab === 'kanban'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Workflow Deck</span>
            </button>
            <button
              onClick={() => setActiveDeckTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDeckTab === 'cards'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unit Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: STRUCTURAL DECK & SLAB SIMULATOR */}
      {activeDeckTab === 'simulator' && (
        <div className="space-y-4">
          {/* Main Simulation Deck Canvas */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Eurocode 2 / 3 Limit State Simulator
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Structural Deck Beam &amp; Deflection Engine
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  isDeflectionPass 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isDeflectionPass ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                  <span>{isDeflectionPass ? 'SLS DEFLECTION: PASSED' : 'DEFLECTION EXCEEDED: FAIL'}</span>
                </span>
              </div>
            </div>

            {/* Live Visual Graphic of the Bridge / Building Deck under Load */}
            <div className="bg-slate-950 rounded-xl p-4 sm:p-6 border border-slate-800 text-white relative overflow-hidden shadow-inner">
              {/* Dynamic SVG Beam Visualizer */}
              <div className="h-44 sm:h-52 w-full flex flex-col justify-between relative">
                {/* Top: Load Arrows */}
                <div className="w-full flex items-center justify-between px-8 text-[11px] text-amber-400 font-mono">
                  <span>UDL: {deadLoadUDL} kN/m</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40 font-bold">
                    Point Load P = {pointLoadP} kN ↓
                  </span>
                  <span>Span L = {spanLength} m</span>
                </div>

                {/* SVG Deck Beam & Deflection Curve */}
                <svg className="w-full h-32" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="50%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="deflectGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor={isDeflectionPass ? '#22c55e' : '#ef4444'} />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>

                  {/* UDL Arrow Sprites */}
                  {Array.from({ length: 9 }).map((_, i) => {
                    const x = 50 + i * 49;
                    return (
                      <g key={i} opacity="0.6">
                        <line x1={x} y1="10" x2={x} y2="38" stroke="#f59e0b" strokeWidth="1.5" />
                        <polygon points={`${x},38 ${x - 3},30 ${x + 3},30`} fill="#f59e0b" />
                      </g>
                    );
                  })}

                  {/* Concentrated Point Load Arrow at Midspan */}
                  <g>
                    <line x1="250" y1="2" x2="250" y2="40" stroke="#ef4444" strokeWidth="3" />
                    <polygon points="250,42 244,30 256,30" fill="#ef4444" />
                    <text x="250" y="0" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">P</text>
                  </g>

                  {/* Beam Slab Initial Geometry */}
                  <rect x="40" y="42" width="420" height="12" rx="2" fill="url(#beamGrad)" stroke="#64748b" strokeWidth="1" />

                  {/* Dynamic Exaggerated Deflection Elastic Curve */}
                  <path
                    d={`M 40,48 Q 250,${48 + Math.min(50, deflectionMM * 0.9)} 460,48`}
                    fill="none"
                    stroke="url(#deflectGrad)"
                    strokeWidth="3.5"
                    strokeDasharray={isDeflectionPass ? 'none' : '4 2'}
                  />

                  {/* Pinned Support Left */}
                  <polygon points="40,54 28,78 52,78" fill="#94a3b8" />
                  <line x1="20" y1="78" x2="60" y2="78" stroke="#64748b" strokeWidth="2" />

                  {/* Roller Support Right */}
                  <polygon points="460,54 448,72 472,72" fill="#94a3b8" />
                  <circle cx="452" cy="76" r="3" fill="#cbd5e1" />
                  <circle cx="468" cy="76" r="3" fill="#cbd5e1" />
                  <line x1="440" y1="80" x2="480" y2="80" stroke="#64748b" strokeWidth="2" />

                  {/* Max Deflection Label */}
                  <text 
                    x="250" 
                    y={66 + Math.min(45, deflectionMM * 0.9)} 
                    textAnchor="middle" 
                    fill={isDeflectionPass ? '#4ade80' : '#f87171'} 
                    fontSize="11" 
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    δ_max = {deflectionMM} mm (Limit: {allowableDeflectionLimit} mm)
                  </text>
                </svg>

                {/* Bottom Formula Footnote */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-2 px-2">
                  <span>Support Reaction R_A = R_B = {maxReaction} kN</span>
                  <span className="text-emerald-400 font-bold">M_max = {totalMaxBM} kN·m</span>
                </div>
              </div>
            </div>

            {/* Interactive Control Deck Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Slider 1: Span Length */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Span Length (L)</label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {spanLength} meters
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="1"
                  value={spanLength}
                  onChange={(e) => setSpanLength(Number(e.target.value))}
                  className="w-full accent-[#185a36] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Bridge girder clear spacing</span>
              </div>

              {/* Slider 2: Dead Load UDL */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Uniform Load (w)</label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {deadLoadUDL} kN/m
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={deadLoadUDL}
                  onChange={(e) => setDeadLoadUDL(Number(e.target.value))}
                  className="w-full accent-[#185a36] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Slab self-weight + surfacing</span>
              </div>

              {/* Slider 3: Central Point Load P */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Wheel Point Load (P)</label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {pointLoadP} kN
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={pointLoadP}
                  onChange={(e) => setPointLoadP(Number(e.target.value))}
                  className="w-full accent-[#185a36] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">HA/HB vehicular axel loading</span>
              </div>
            </div>

            {/* Deck Material Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Structural Deck Profile Specification
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'composite_steel', label: 'Composite Steel UB' },
                  { id: 'rc_slab', label: 'RC Solid Slab C30/37' },
                  { id: 'prestressed', label: 'Prestressed T-Beam' },
                  { id: 'timber_glulam', label: 'Glulam Timber GL28h' }
                ].map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => setDeckType(mat.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                      deckType === mat.id
                        ? 'bg-[#185a36] text-white border-[#185a36] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Engineering Metric Outputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Max Moment</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">{totalMaxBM}</span>
                <span className="text-[10px] text-slate-400 block">kN·m</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">End Shear Force</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">{maxReaction}</span>
                <span className="text-[10px] text-slate-400 block">kN</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Actual Deflection</span>
                <span className={`text-base sm:text-lg font-extrabold font-mono ${isDeflectionPass ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {deflectionMM}
                </span>
                <span className="text-[10px] text-slate-400 block">mm</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Allowable Limit</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">{allowableDeflectionLimit}</span>
                <span className="text-[10px] text-slate-400 block">mm (L/250)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN WORKFLOW DECK */}
      {activeDeckTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                BTEC Civil Coursework Progress Deck
              </h3>
              <p className="text-xs text-slate-500">
                Track each assignment portfolio through Internal Verification (IV) sign-off.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {tasks.filter(t => t.status === 'done').length} / {tasks.length} Verified
            </span>
          </div>

          {/* Responsive 4-Column Deck Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'todo', label: 'Brief Issued', color: 'bg-slate-100 text-slate-800 border-slate-300' },
              { id: 'progress', label: 'Calculations Draft', color: 'bg-amber-100 text-amber-900 border-amber-300' },
              { id: 'review', label: 'Internal Verification', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
              { id: 'done', label: 'Distinction Achieved', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' }
            ].map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {task.unitCode}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'Critical' 
                              ? 'bg-rose-50 text-rose-700' 
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {task.title}
                        </p>

                        <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">
                            {task.dueDate}
                          </span>
                          <button
                            onClick={() => moveTaskStatus(task.id)}
                            className="p-1 text-slate-400 hover:text-emerald-700 cursor-pointer flex items-center gap-0.5 text-[10px] font-semibold"
                            title="Move to next stage"
                          >
                            <span>Advance</span>
                            <MoveRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: UNIT CARDS SLIDE DECK */}
      {activeDeckTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Interactive BTEC Unit Deck
            </h3>
            <span className="text-xs text-slate-500">
              Showing {BTEC_UNITS.length} accredited unit packs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BTEC_UNITS.map(unit => (
              <div
                key={unit.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {unit.unitCodeTag}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {unit.credits} Credits
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1">
                    {unit.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onPreviewUnit(unit)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View Spec</span>
                  </button>
                  <button
                    onClick={() => onDownloadUnit(unit)}
                    className="px-2.5 py-1 bg-[#185a36] text-white text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer hover:bg-[#13492c]"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
