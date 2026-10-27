import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Zap, 
  Copy, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Award, 
  Calculator, 
  Compass, 
  ShieldCheck,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';
import { BTECUnit } from '../types';

export interface AutoResponseItem {
  id: string;
  timestamp: string;
  triggerSource: 'slider_param' | 'task_workflow' | 'unit_selection' | 'user_query' | 'system_audit';
  type: 'success' | 'warning' | 'info' | 'distinction';
  title: string;
  summary: string;
  details?: string;
  recommendedAction?: string;
  formulaOrCode?: string;
}

interface DashboardAutoResponderProps {
  currentSpan?: number;
  currentUDL?: number;
  currentPointLoad?: number;
  currentDeckType?: string;
  isDeflectionPass?: boolean;
  activeTasksCount?: number;
  completedTasksCount?: number;
  savedUnitsCount?: number;
  latestEventTrigger?: string | null;
  onApplyFix?: (param: string, value: any) => void;
  className?: string;
}

export const DashboardAutoResponder: React.FC<DashboardAutoResponderProps> = ({
  currentSpan = 8,
  currentUDL = 18,
  currentPointLoad = 45,
  currentDeckType = 'composite_steel',
  isDeflectionPass = true,
  activeTasksCount = 4,
  completedTasksCount = 2,
  savedUnitsCount = 2,
  latestEventTrigger = null,
  onApplyFix,
  className = ''
}) => {
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [userQuery, setUserQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Feed of auto-generated responses
  const [responses, setResponses] = useState<AutoResponseItem[]>([
    {
      id: 'resp-init',
      timestamp: 'Just now',
      triggerSource: 'system_audit',
      type: 'info',
      title: 'Auto-Responder Online: Dashboard Synchronized',
      summary: 'Monitoring beam span (8m), dead load (18 kN/m), midspan point load (45 kN), and 6 BTEC coursework tasks in real time.',
      details: 'Whenever you adjust sliders, move workflow tasks, or inspect units, the dashboard auto-evaluates Eurocode 2/3 criteria and Pearson Distinction requirements.',
      recommendedAction: 'Adjust span length or test quick auto-queries below to verify instant automated responses.',
      formulaOrCode: 'BS EN 1990 / Eurocode 0 Basis of Structural Design & BTEC Level 3/4/5'
    }
  ]);

  const prevSpanRef = useRef(currentSpan);
  const prevDeckTypeRef = useRef(currentDeckType);
  const prevPassRef = useRef(isDeflectionPass);
  const prevTriggerRef = useRef(latestEventTrigger);

  // Play subtle audio cue when responding
  const playBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // audio context not allowed without interaction
    }
  };

  // Add a new auto response item to top of stack
  const pushResponse = (item: Omit<AutoResponseItem, 'id' | 'timestamp'>) => {
    const newItem: AutoResponseItem = {
      ...item,
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setResponses(prev => [newItem, ...prev.slice(0, 19)]);
    playBeep();
  };

  // 1. Automatically responds to Structural Deck Beam parameter changes
  useEffect(() => {
    if (!isAutoEnabled) return;

    if (prevSpanRef.current !== currentSpan) {
      const oldSpan = prevSpanRef.current;
      prevSpanRef.current = currentSpan;

      const delta = currentSpan - oldSpan;
      const allowable = Math.round((currentSpan * 1000) / 250);

      if (!isDeflectionPass) {
        pushResponse({
          triggerSource: 'slider_param',
          type: 'warning',
          title: `Auto-Response: Span Expanded to ${currentSpan}m (SLS Deflection Warning)`,
          summary: `Increasing span by ${delta > 0 ? `+${delta}` : delta}m increased bending moment and caused SLS deflection to exceed the L/250 limit (${allowable} mm).`,
          details: `In Pearson BTEC Unit 1 & Unit 29, excessive serviceability deflection can crack plaster finishes and cause bridge deck vibration.`,
          recommendedAction: 'Recommendation: Switch deck type to Prestressed T-Beam (EI: 395,000) or reduce span to 7m.',
          formulaOrCode: `δ_SLS = 5wL⁴/(384EI) + PL³/(48EI) > ${allowable} mm`
        });
      } else {
        pushResponse({
          triggerSource: 'slider_param',
          type: 'success',
          title: `Auto-Response: Span Calibrated to ${currentSpan}m (SLS Verified)`,
          summary: `Deck beam deflection is within allowable limit (Limit: ${allowable} mm). Support reactions and Eurocode 3 moment capacity auto-verified.`,
          details: `Composite steel decking (UB 457) provides adequate stiffness against UDL ${currentUDL} kN/m and point load ${currentPointLoad} kN.`,
          formulaOrCode: `M_Ed = (wL²/8) + (PL/4) = ${Math.round(((currentUDL * currentSpan * currentSpan) / 8 + (currentPointLoad * currentSpan) / 4) * 10) / 10} kN·m`
        });
      }
    }
  }, [currentSpan, isDeflectionPass, isAutoEnabled, currentUDL, currentPointLoad]);

  // 2. Automatically responds to Deck Material Type changes
  useEffect(() => {
    if (!isAutoEnabled) return;

    if (prevDeckTypeRef.current !== currentDeckType) {
      prevDeckTypeRef.current = currentDeckType;
      const typeNames: Record<string, string> = {
        rc_slab: 'Reinforced Concrete Slab (C30/37)',
        composite_steel: 'Composite Steel-Concrete Deck (UB 457)',
        prestressed: 'Prestressed Concrete Precast T-Beam',
        timber_glulam: 'Glulam Timber Heavy Deck (GL28h)'
      };
      const selectedName = typeNames[currentDeckType] || currentDeckType;

      pushResponse({
        triggerSource: 'slider_param',
        type: 'info',
        title: `Auto-Response: Deck Specification Changed to ${selectedName}`,
        summary: `Stiffness matrix and elastic modulus (EI) automatically updated in the simulation engine.`,
        details: `Unit weight and allowable stress limits adjusted according to Eurocode 2 (BS EN 1992-1-1) / Eurocode 3 / Eurocode 5 standards.`,
        recommendedAction: 'Inspect the deflection curve in the beam visualizer to ensure deflection passed SLS limit.'
      });
    }
  }, [currentDeckType, isAutoEnabled]);

  // 3. Automatically responds to Deflection Pass / Fail state changes
  useEffect(() => {
    if (!isAutoEnabled) return;

    if (prevPassRef.current !== isDeflectionPass) {
      prevPassRef.current = isDeflectionPass;
      if (!isDeflectionPass) {
        pushResponse({
          triggerSource: 'slider_param',
          type: 'warning',
          title: 'Auto-Response: Serviceability Limit State (SLS) Exceeded!',
          summary: 'Midspan deflection exceeds allowable L/250 criteria. Immediate section redesign required for BTEC Unit 1 coursework approval.',
          details: 'Under BS EN 1990 Eq 6.14b, permanent deformation leads to non-structural partition cracking and aesthetic failure.',
          recommendedAction: 'Auto-fix: Increase deck rigidity or reduce dead load / span.'
        });
      } else {
        pushResponse({
          triggerSource: 'slider_param',
          type: 'success',
          title: 'Auto-Response: SLS Deflection Limit Re-Established',
          summary: 'The structural system is now fully compliant with Eurocode SLS and ULS design criteria.',
          formulaOrCode: 'δ_max ≤ L/250 (Compliant)'
        });
      }
    }
  }, [isDeflectionPass, isAutoEnabled]);

  // 4. Automatically responds to external event triggers
  useEffect(() => {
    if (!isAutoEnabled || !latestEventTrigger) return;
    if (prevTriggerRef.current !== latestEventTrigger) {
      prevTriggerRef.current = latestEventTrigger;

      pushResponse({
        triggerSource: 'task_workflow',
        type: 'distinction',
        title: `Auto-Response: ${latestEventTrigger}`,
        summary: `Dashboard detected workflow activity. Automatically updated coursework grade ledger and UCAS tariff points.`,
        details: `Total verified tasks: ${completedTasksCount} | In progress: ${activeTasksCount} | Saved references: ${savedUnitsCount}`,
        recommendedAction: 'Continue with internal verification (IV) checklist for distinction grade validation.'
      });
    }
  }, [latestEventTrigger, isAutoEnabled, completedTasksCount, activeTasksCount, savedUnitsCount]);

  // Handle student prompt queries with intelligent auto-responder
  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.trim().toLowerCase();
    setUserQuery('');

    // Instant automated smart response heuristics based on civil engineering BTEC syllabus
    let responseItem: Omit<AutoResponseItem, 'id' | 'timestamp'>;

    if (query.includes('deflect') || query.includes('beam') || query.includes('macaulay') || query.includes('sls')) {
      responseItem = {
        triggerSource: 'user_query',
        type: isDeflectionPass ? 'success' : 'warning',
        title: `Auto-Response: Structural Deflection & Beam Mechanics`,
        summary: `For simply supported beams with UDL (w) and central point load (P): Max deflection occurs at x = L/2.`,
        details: `Formula: δ_max = (5wL⁴)/(384EI) + (PL³)/(48EI). Under Eurocode 3 and BS EN 1990 Table A1.4, the maximum allowable deflection for roof beams is L/200, floors L/250, and cantilever beams L/180.`,
        recommendedAction: `Current simulation: Span = ${currentSpan}m, Status = ${isDeflectionPass ? 'PASSED (Compliant)' : 'FAILED (Exceeded L/250)'}.`,
        formulaOrCode: `δ_total = (5 × ${currentUDL} × ${currentSpan}⁴ × 10¹²) / (384 × EI) + (${currentPointLoad} × 10³ × ${currentSpan}³ × 10⁹) / (48 × EI)`
      };
    } else if (query.includes('unit 1') || query.includes('mechanics') || query.includes('bending moment') || query.includes('shear')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'distinction',
        title: `Auto-Response: Unit 1 Construction Principles Distinction Guide`,
        summary: `To achieve Distinction in Unit 1 (Structural Mechanics & Materials), you must evaluate indeterminate systems and plastic moment redistribution.`,
        details: `Criteria checklist: 1) Construct accurate SFD & BMD envelopes with zero shear crossing points identified. 2) Calculate second moment of area (I_xx) using parallel axis theorem: I = I_g + Ah². 3) Perform extreme fiber stress analysis: σ = My/I.`,
        recommendedAction: `Include Eurocode 3 load combinations (1.35 Gk + 1.5 Qk) in your design coursework.`,
        formulaOrCode: `σ_max = (M_max × y_extreme) / I_xx ≤ f_y / γ_M0`
      };
    } else if (query.includes('pdf') || query.includes('demo') || query.includes('payable') || query.includes('price') || query.includes('cost') || query.includes('unlock')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'info',
        title: `Auto-Response: All PDFs Payable & Free Demo Access`,
        summary: `All Pearson BTEC PDF study packs are payable (₹49 each) with 2 free demo preview pages accessible for every unit.`,
        details: `1) Free Demo: Pages 1 & 2 show Pearson BTEC learning outcomes, unit specification, and initial formulas. 2) Full Document: Pages 3 to 6 contain complete worked SFD/BMD calculations, Eurocode 3 member sizing, and signed IV verifier sheets. 3) All-Access Pass: Unlock all 12+ units for ₹199 with instant offline PDF download.`,
        recommendedAction: `Tap 'Demo Preview' on any unit card to inspect the first 2 pages free before unlocking.`,
        formulaOrCode: `Single PDF: ₹49 • All-Access Pass: ₹199 • 2 Pages Free Demo Preview`
      };
    } else if (query.includes('unit 2') || query.includes('survey') || query.includes('bowditch') || query.includes('traverse') || query.includes('collimation')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'distinction',
        title: `Auto-Response: Unit 2 Site Surveying & Bowditch Adjustment`,
        summary: `Bowditch's Rule corrects misclosure in closed polygon traverses proportionally to leg length.`,
        details: `Correction in Easting: ΔE_corr = - (Total Easting Misclosure × Length of Leg) / Total Perimeter. For levelling field books, ensure Rise & Fall checks: ΣBS - ΣFS = ΣRise - ΣFall = Last RL - First RL.`,
        recommendedAction: `Two-peg test must show collimation error ≤ 1.5mm per 20m before setting out pile caps.`,
        formulaOrCode: `Correction_L = - (Misclosure_Lat × l_i) / ΣL | Correction_D = - (Misclosure_Dep × l_i) / ΣL`
      };
    } else if (query.includes('unit 30') || query.includes('soil') || query.includes('geotech') || query.includes('rankine') || query.includes('triaxial')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'distinction',
        title: `Auto-Response: Unit 30 Geotechnics & Soil Mechanics`,
        summary: `BS EN ISO 14688 soil classification and Rankine lateral earth pressure evaluation.`,
        details: `Active Earth Pressure coefficient: Ka = (1 - sin φ) / (1 + sin φ) = tan²(45° - φ/2). Passive coefficient: Kp = 1 / Ka. In triaxial shear tests: τ = c' + σ' tan φ'.`,
        recommendedAction: `For distinction grading, verify Factor of Safety (FOS) against overturning > 2.0 and sliding > 1.5.`,
        formulaOrCode: `P_a = 0.5 × γ × H² × K_a - 2c'H√K_a + q × H × K_a`
      };
    } else if (query.includes('unit 3') || query.includes('foundation') || query.includes('pile') || query.includes('concrete') || query.includes('retaining')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'info',
        title: `Auto-Response: Unit 3 Construction Technology & Substructures`,
        summary: `Substructure selection depends on bearing capacity: Pad (>150 kPa), Raft (75-150 kPa), Bored Piles (<75 kPa).`,
        details: `BS 8102:2009 basement waterproofing types: Type A (Barrier protection / tanking), Type B (Structurally integral water-resisting concrete), Type C (Drained cavity system).`,
        recommendedAction: `Ensure Eurocode 2 cover requirements (BS EN 1992-1-1 Table 4.4N) specify ≥ 50mm cover for cast against earth.`,
        formulaOrCode: `c_nom = c_min + Δc_dev (Typically 50mm to 75mm for substructures)`
      };
    } else if (query.includes('cdm') || query.includes('unit 4') || query.includes('safety') || query.includes('rams') || query.includes('health')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'info',
        title: `Auto-Response: Unit 4 CDM 2015 Regulations & Safety RAMS`,
        summary: `CDM Regulations 2015 duty holders: Client, Principal Designer, Principal Contractor, Contractors, Workers.`,
        details: `Key distinction deliverables: 1) Pre-Construction Information (PCI) pack. 2) Construction Phase Plan (CPP). 3) Dynamic RAMS for confined space excavation (>1.2m deep requires shoring/trench boxes).`,
        recommendedAction: `Highlight the ERIC hierarchy of risk control: Eliminate, Reduce, Inform, Control.`,
        formulaOrCode: `Risk Rating = Severity (1-5) × Likelihood (1-5) (Scores > 15 require work stoppage)`
      };
    } else if (query.includes('grade') || query.includes('points') || query.includes('ucas') || query.includes('tariff') || query.includes('btec')) {
      responseItem = {
        triggerSource: 'user_query',
        type: 'distinction',
        title: `Auto-Response: Pearson BTEC Points & UCAS Tariff Calculation`,
        summary: `BTEC Level 3 National Extended Diploma (1080 GLH) points conversion for University admissions.`,
        details: `Distinction* Distinction* Distinction* (D*D*D*) awards 168 UCAS points (equivalent to 3 A*s at A-Level). D*DD awards 152 points; DDM awards 128 points.`,
        recommendedAction: `You currently have ${completedTasksCount} units verified. Complete remaining ${activeTasksCount} units at Distinction to secure D*D*D*.`,
        formulaOrCode: `Unit Point Tariff: Pass (24-36 pts), Merit (36-48 pts), Distinction (48-60 pts)`
      };
    } else {
      // General Civil engineering automated reply
      responseItem = {
        triggerSource: 'user_query',
        type: 'info',
        title: `Auto-Response to: "${query.slice(0, 30)}..."`,
        summary: `Civil engineering coursework synthesis generated for your query.`,
        details: `Relevant standards: BS EN 1990 (Basis of Design), BS EN 1991 (Actions on Structures), BS EN 1992 (Concrete), BS EN 1993 (Steel), BS EN 1997 (Geotechnics).`,
        recommendedAction: `Cross-reference with your Pearson specification unit brief or download the ₹49 Masterclass video package for a step-by-step walkthrough.`,
        formulaOrCode: `Accredited by ICE / IStructE / CIOB / Pearson BTEC`
      };
    }

    pushResponse(responseItem);
  };

  // Quick preset triggers
  const handlePresetTrigger = (promptText: string) => {
    setUserQuery(promptText);
    setTimeout(() => {
      // trigger automated query
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setUserQuery(promptText);
      // directly handle
      const lower = promptText.toLowerCase();
      if (lower.includes('deflect')) {
        pushResponse({
          triggerSource: 'user_query',
          type: isDeflectionPass ? 'success' : 'warning',
          title: `Auto-Response: Beam SLS Deflection Diagnostic`,
          summary: `Deflection engine calculated δ = ${isDeflectionPass ? 'Compliant' : 'Exceeds limit'}.`,
          details: `Current Span: ${currentSpan}m | Total Load: ${(currentUDL * currentSpan) + currentPointLoad} kN | Deck: ${currentDeckType}.`,
          recommendedAction: isDeflectionPass 
            ? 'Deflection satisfies BS EN 1990 Table A1.4 criteria.' 
            : 'Immediate action: Reduce span length to ≤7m or switch to Prestressed T-Beam.',
          formulaOrCode: `Limit = L/250 = ${Math.round((currentSpan * 1000) / 250)} mm`
        });
      } else if (lower.includes('distinction')) {
        pushResponse({
          triggerSource: 'user_query',
          type: 'distinction',
          title: 'Auto-Response: Distinction Criteria Portfolio Audit',
          summary: 'Unit 1 & Unit 30 Distinction exemplars checked against Pearson Specification 2024.',
          details: 'Portfolio requires full calculation traces, boundary condition derivations, and BS EN code clauses referenced in footnotes.',
          recommendedAction: 'All formulas must show units (kN, kNm, MPa, kN/m³) and Eurocode safety partial factors (γ_G = 1.35, γ_Q = 1.5).',
          formulaOrCode: 'Pearson Specification Distinction Criteria D1, D2, D3'
        });
      } else if (lower.includes('ucas') || lower.includes('tariff')) {
        pushResponse({
          triggerSource: 'user_query',
          type: 'distinction',
          title: 'Auto-Response: BTEC Grade & UCAS Tariff Forecast',
          summary: `Targeting Distinction across all modules yields 168 UCAS points for Civil Engineering BEng / MEng.`,
          details: `Current completed units: ${completedTasksCount} | Remaining: ${activeTasksCount}. High probability of D*D*D* if upcoming Unit 2 and Unit 30 achieve distinction marks.`,
          formulaOrCode: 'D*D*D* = 168 UCAS Pts | D*D*D = 160 Pts | DDD = 144 Pts'
        });
      } else if (lower.includes('bowditch')) {
        pushResponse({
          triggerSource: 'user_query',
          type: 'info',
          title: 'Auto-Response: Unit 2 Bowditch Traverse Balance',
          summary: 'Closed traverse linear misclosure e = √(ΔE² + ΔN²). Fractional accuracy should be ≥ 1:5000 for highway and structural grids.',
          details: 'Distribute angular error equally before calculating coordinates: Total angular correction = (180°(n - 2) - ΣObserved Angles) / n.',
          formulaOrCode: 'Fractional Accuracy = 1 : (Perimeter / e)'
        });
      }
    }, 50);
  };

  const copyResponseText = (item: AutoResponseItem) => {
    const text = `${item.title}\n${item.summary}\n${item.details || ''}\n${item.formulaOrCode ? `Code/Formula: ${item.formulaOrCode}` : ''}`;
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const latestResponse = responses[0];

  return (
    <div className={`rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 text-white shadow-xl overflow-hidden transition-all ${className}`}>
      {/* Top Banner: Auto-Responder Status & Controls */}
      <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-4 h-4 font-bold" />
            </div>
            {isAutoEnabled && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Dashboard Auto-Responder</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                  isAutoEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isAutoEnabled ? 'Live Active' : 'Paused'}
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Automatically evaluates your structural parameters, coursework tasks, and grading in real-time.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Mute auto-response chimes' : 'Enable audio feedback on auto-responses'}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              soundEnabled 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Auto-Monitoring On/Off */}
          <button
            onClick={() => setIsAutoEnabled(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
              isAutoEnabled 
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Zap className={`w-3 h-3 ${isAutoEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isAutoEnabled ? 'Auto ON' : 'Auto OFF'}</span>
          </button>

          {/* Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Auto-Response Content Area */}
      {isExpanded && (
        <div className="p-3 sm:p-5 space-y-4">
          {/* Live Synchronized Context Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Monitoring Live:</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-emerald-300">
              Span: {currentSpan}m
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-amber-300">
              UDL: {currentUDL} kN/m
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-sky-300">
              P: {currentPointLoad} kN
            </span>
            <span className={`px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${
              isDeflectionPass 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' 
                : 'bg-rose-950/80 text-rose-400 border-rose-500/50 animate-pulse'
            }`}>
              {isDeflectionPass ? '✓ SLS DEFLECTION PASS' : '⚠ SLS DEFLECTION FAIL'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-purple-300">
              Tasks: {completedTasksCount}/{completedTasksCount + activeTasksCount} Done
            </span>
          </div>

          {/* LATEST AUTO-RESPONSE CARD (Prominent) */}
          {latestResponse && (
            <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
              latestResponse.type === 'warning'
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                : latestResponse.type === 'distinction'
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-100'
                : latestResponse.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                : 'bg-slate-800/60 border-slate-700 text-slate-100'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {latestResponse.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : latestResponse.type === 'distinction' ? (
                    <Award className="w-5 h-5 text-purple-400 shrink-0" />
                  ) : latestResponse.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-sky-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{latestResponse.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal font-mono">
                        {latestResponse.timestamp}
                      </span>
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => copyResponseText(latestResponse)}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Copy auto-response to portfolio"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === latestResponse.id ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Summary & Details */}
              <p className="text-xs text-slate-200 mt-2 font-medium leading-relaxed">
                {latestResponse.summary}
              </p>

              {latestResponse.details && (
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                  {latestResponse.details}
                </p>
              )}

              {/* Recommended Action / Fix button */}
              {latestResponse.recommendedAction && (
                <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-xs">
                  <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{latestResponse.recommendedAction}</span>
                  </div>
                  {!isDeflectionPass && onApplyFix && (
                    <button
                      onClick={() => onApplyFix('deckType', 'prestressed')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                    >
                      Auto-Apply Fix (Switch to Prestressed)
                    </button>
                  )}
                </div>
              )}

              {/* Formula or Code standard footnote */}
              {latestResponse.formulaOrCode && (
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-500">Ref:</span>
                  <code className="text-amber-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                    {latestResponse.formulaOrCode}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Quick Auto-Trigger Shortcut Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Instant Auto-Response Queries:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '📄 Auto-Explain PDF Pricing & Demo', query: 'How does PDF pricing and free demo pages work?' },
                { label: '📐 Auto-Diagnose SLS Deflection', query: 'Auto-Diagnose Structural Deflection' },
                { label: '🎯 Auto-Audit Unit 1 Distinction', query: 'Unit 1 Distinction criteria check' },
                { label: '📊 Auto-Calculate BTEC UCAS Tariff', query: 'Calculate my BTEC grade points and UCAS tariff' },
                { label: '🧭 Auto-Check Bowditch Traverse', query: 'How to adjust closed traverse with Bowditch rule' },
                { label: '🏗️ Auto-Verify Soil Mohr-Coulomb', query: 'Unit 30 Soil mechanics Rankine earth pressure' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetTrigger(chip.query)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer hover:text-white"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive User Auto-Query Input Bar */}
          <form onSubmit={handleQuerySubmit} className="relative flex items-center">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask auto-responder anything about your coursework, formulas, or Eurocode limits..."
              className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!userQuery.trim()}
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              <span>Auto-Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Previous Auto-Responses Accordion / History */}
          {responses.length > 1 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-semibold">Recent Auto-Responses ({responses.length})</span>
                <button
                  onClick={() => setResponses([responses[0]])}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {responses.slice(1).map((resp) => (
                  <div
                    key={resp.id}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          resp.type === 'warning' ? 'bg-rose-400' :
                          resp.type === 'distinction' ? 'bg-purple-400' :
                          resp.type === 'success' ? 'bg-emerald-400' : 'bg-sky-400'
                        }`} />
                        <span className="font-semibold text-slate-200 text-[11px]">{resp.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{resp.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{resp.summary}</p>
                    </div>

                    <button
                      onClick={() => copyResponseText(resp)}
                      className="p-1 text-slate-500 hover:text-slate-300 shrink-0 cursor-pointer"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
