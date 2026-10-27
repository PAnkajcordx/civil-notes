import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Video,
  Play,
  Sparkles,
  Lock
} from 'lucide-react';
import { BTECUnit, CivilVideo } from '../types';
import { CIVIL_VIDEOS } from '../data/videoData';
import { isVideoPaid } from '../utils/videoPaymentHelper';

interface DocumentPreviewModalProps {
  unit: BTECUnit | null;
  onClose: () => void;
  onDownload: (unit: BTECUnit) => void;
  onOpenVideoPaywall?: (video: CivilVideo) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  unit,
  onClose,
  onDownload,
  onOpenVideoPaywall
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'exemplar' | 'calculations' | 'criteria' | 'iv' | 'video'>('exemplar');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!unit) return null;

  // Find matching video or fallback
  const matchingVideo = CIVIL_VIDEOS.find(v => 
    v.unitCodeTag.toLowerCase().includes(unit.unitCodeTag.toLowerCase().slice(0, 6)) ||
    v.title.toLowerCase().includes(`unit ${unit.unitNumber}`)
  ) || {
    id: `vid-unit-${unit.unitNumber}`,
    title: `${unit.unitCodeTag}: ${unit.title} Distinction Masterclass`,
    unitCodeTag: unit.unitCodeTag,
    duration: '45:00 min',
    quality: '1080p Full HD',
    fileSize: '390 MB',
    tutorName: 'CivilNotes Accredited Faculty',
    description: `Complete numerical walkthrough and coursework step-by-step guidance for ${unit.title}.`,
    priceINR: 49,
    thumbnailColor: 'from-blue-700 to-indigo-900',
    topicsCovered: [
      `${unit.title} Overview & Learning Outcomes`,
      'Step-by-step Numerical Problems & Formula Application',
      'BS EN / Eurocode Specifications Walkthrough',
      'Distinction Criteria Sign-off Guidance'
    ]
  };

  const isPaid = isVideoPaid(matchingVideo.id);

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

            {onOpenVideoPaywall && (
              <button
                onClick={() => onOpenVideoPaywall(matchingVideo)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-200 bg-amber-900/60 hover:bg-amber-900 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download 1080p Video for ₹49"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>{isPaid ? 'Video (Paid)' : 'Video (₹49)'}</span>
              </button>
            )}

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
            onClick={() => setActiveDocTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDocTab === 'video'
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'text-amber-800 hover:text-amber-900 bg-amber-50/60'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-600" />
            <span>Video Masterclass (₹49)</span>
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

          {/* TAB: VIDEO MASTERCLASS (₹49) */}
          {activeDocTab === 'video' && (
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xs space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{matchingVideo.title}</h4>
                    <span className="text-xs text-slate-500">{matchingVideo.tutorName} • {matchingVideo.duration}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through mr-1">₹499</span>
                  <span className="text-lg font-black text-emerald-700">₹49</span>
                </div>
              </div>

              {/* Video Mockup Player */}
              <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center text-white">
                <div className="text-center p-4">
                  <div className="w-14 h-14 bg-emerald-600/90 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <p className="text-xs font-semibold">{matchingVideo.quality} • High Bitrate Stream</p>
                  <p className="text-[11px] text-slate-400 mt-1">{matchingVideo.fileSize} offline download pack</p>
                </div>
              </div>

              {/* Topics Included */}
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Covered in this Video Masterclass:
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {matchingVideo.topicsCovered.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pay & Download Action */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    {isPaid ? 'You own lifetime access to this video' : 'Download for ₹49.00 INR (Instant UPI / Card)'}
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Includes step-by-step calculations and assignment grading guide.
                  </div>
                </div>

                {onOpenVideoPaywall && (
                  <button
                    onClick={() => onOpenVideoPaywall(matchingVideo)}
                    className="w-full sm:w-auto py-2.5 px-5 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isPaid ? 'Re-Download Free' : 'Pay ₹49 & Download'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

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
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-700" />
                  <span>Sample Distinction Calculation Sheets</span>
                </h4>
                <div className="space-y-2.5 font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto shadow-inner">
                  {unit.previewContent.sampleCalculations.map((calc, idx) => (
                    <div key={idx} className="border-b border-slate-800 pb-2 last:border-b-0 last:pb-0">
                      <span className="text-slate-500 mr-2">[{idx + 1}]</span>
                      <span>{calc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Grading Criteria */}
          {activeDocTab === 'criteria' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Pearson BTEC Pass / Merit / Distinction Criteria</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                    Pass Level (P1, P2)
                  </span>
                  <p className="text-xs text-blue-950 leading-relaxed">
                    {unit.previewContent.gradingCriteria.pass}
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                    Merit Level (M1, M2)
                  </span>
                  <p className="text-xs text-indigo-950 leading-relaxed">
                    {unit.previewContent.gradingCriteria.merit}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                    Distinction Level (D1, D2)
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {unit.previewContent.gradingCriteria.distinction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: IV Sign-Off */}
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
