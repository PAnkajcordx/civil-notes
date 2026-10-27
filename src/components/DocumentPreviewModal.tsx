import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Calculator, ShieldCheck, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { BTECUnit } from '../types';

interface DocumentPreviewModalProps {
  unit: BTECUnit | null;
  onClose: () => void;
  onDownload: (unit: BTECUnit) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  unit,
  onClose,
  onDownload
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'exemplar' | 'calculations' | 'criteria' | 'iv'>('exemplar');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-[11px] font-bold tracking-tight text-white shrink-0">
              {unit.unitCodeTag}
            </span>
            <div className="truncate">
              <h2 className="text-sm font-bold text-white truncate">
                {unit.title}
              </h2>
              <span className="text-[11px] text-slate-300">
                Pearson Specification: {unit.specificationCode} • {unit.credits} Credits
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
                className="p-1 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onDownload(unit)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#185a36] hover:bg-[#13492c] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Pack</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar for Document Tabs */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveDocTab('exemplar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDocTab === 'exemplar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Distinction Exemplar</span>
          </button>

          <button
            onClick={() => setActiveDocTab('calculations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDocTab === 'calculations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-700" />
            <span>SFD &amp; Calculations</span>
          </button>

          <button
            onClick={() => setActiveDocTab('criteria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDocTab === 'criteria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Grading Criteria (P/M/D)</span>
          </button>

          <button
            onClick={() => setActiveDocTab('iv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDocTab === 'iv'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>IV Checklist</span>
          </button>
        </div>

        {/* Scrollable Document Content Body */}
        <div 
          className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-800 bg-[#fbfbfa]"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header Paper Banner */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Distinction Portfolio (D*)
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                  {unit.title}
                </h3>
              </div>
              <div className="text-right text-xs text-slate-500 hidden sm:block">
                <span className="font-semibold text-slate-800">Academic Year:</span> 2024/2025<br />
                <span className="font-semibold text-slate-800">Spec:</span> Pearson BTEC Civil
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {unit.previewContent.overview}
            </p>
          </div>

          {/* Tab 1: Distinction Exemplar */}
          {activeDocTab === 'exemplar' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Pearson BTEC Learning Outcomes Checklist</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {unit.previewContent.learningOutcomes.map((lo, i) => (
                    <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{lo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Applicable Standards &amp; Codes of Practice</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {unit.previewContent.standardCodes.map((code, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-100 font-mono"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: SFD & Calculations */}
          {activeDocTab === 'calculations' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-700" />
                    <span>Step-by-Step Worked Calculations &amp; Envelopes</span>
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    100% Dimensional Consistency
                  </span>
                </div>

                <div className="space-y-2.5">
                  {unit.previewContent.sampleCalculations.map((calc, i) => (
                    <div 
                      key={i} 
                      className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-lg border border-slate-800 overflow-x-auto shadow-inner"
                    >
                      <span className="text-slate-400 select-none">// Step {i + 1}: </span>
                      {calc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Diagram Representation */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <h5 className="text-xs font-bold text-slate-900 mb-2">
                  Shear Force &amp; Bending Moment Envelope Diagram Reference
                </h5>
                <div className="h-28 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 relative overflow-hidden">
                  <svg className="w-full h-full text-slate-700" viewBox="0 0 400 90">
                    {/* Beam baseline */}
                    <line x1="20" y1="45" x2="380" y2="45" stroke="#94a3b8" strokeWidth="2" />
                    {/* Supports */}
                    <polygon points="20,45 10,65 30,65" fill="#475569" />
                    <circle cx="380" cy="55" r="8" fill="#475569" />
                    {/* SFD curve */}
                    <path d="M20,45 L20,20 L200,20 L200,70 L380,70 L380,45" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
                    {/* BMD parabolic curve */}
                    <path d="M20,45 Q200,85 380,45" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                    <text x="200" y="38" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">M_max = wL²/8</text>
                  </svg>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-600 inline-block"></span> Blue Dashed: SFD (kN)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-emerald-600 inline-block"></span> Green Parabola: BMD (kN·m)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Grading Criteria */}
          {activeDocTab === 'criteria' && (
            <div className="space-y-3">
              {/* Pass */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    PASS CRITERIA (P)
                  </span>
                  <span className="text-[10px] text-slate-500">Baseline Requirement</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {unit.previewContent.gradingCriteria.pass}
                </p>
              </div>

              {/* Merit */}
              <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    MERIT CRITERIA (M)
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">Analytical Depth</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {unit.previewContent.gradingCriteria.merit}
                </p>
              </div>

              {/* Distinction */}
              <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/30 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    DISTINCTION CRITERIA (D)
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold">Critical Evaluation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pt-1 font-medium">
                  {unit.previewContent.gradingCriteria.distinction}
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: IV Checklist */}
          {activeDocTab === 'iv' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Pearson BTEC Internal Verification (IV) Sign-Off Sheet</span>
                </h4>
                <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                  IV Passed • No Resubmission
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span>1. Are tasks accurately mapped against specification LOs?</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> YES
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span>2. Are calculation methods documented with free-body diagrams?</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> YES
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span>3. Does student evaluate real-world design constraints (Eurocode 2/3)?</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> YES
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span>4. Internal Verifier signature verified &amp; date stamped</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            CivilNotes Handwritten &amp; Curated Exemplars
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(unit)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#185a36] hover:bg-[#13492c] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
