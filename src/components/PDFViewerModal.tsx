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
  ChevronLeft,
  ChevronRight,
  Lock, 
  Unlock,
  Sparkles,
  Zap,
  AlertCircle
} from 'lucide-react';
import { BTECUnit } from '../types';
import { isPdfPaid, downloadUnlockedPDFDocument } from '../utils/pdfPaymentHelper';

interface PDFViewerModalProps {
  unit: BTECUnit | null;
  onClose: () => void;
  onOpenPdfPaywall: (unit: BTECUnit) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  unit,
  onClose,
  onOpenPdfPaywall
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!unit) return null;

  const totalPages = unit.totalPages || 6;
  const demoPagesCount = unit.demoPagesCount || 2;
  const isPaid = isPdfPaid(unit.id);
  const isPageLocked = !isPaid && currentPage > demoPagesCount;

  const handleDownloadClick = () => {
    if (isPaid) {
      downloadUnlockedPDFDocument(unit);
    } else {
      onOpenPdfPaywall(unit);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP TOOLBAR: PDF Metadata, Page Switcher, Status & Actions */}
        <div className="bg-slate-900 text-white px-3 sm:px-5 py-3 flex items-center justify-between border-b border-slate-800 gap-2">
          {/* Left: Document details */}
          <div className="flex items-center gap-2 min-w-0 pr-1">
            <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-black uppercase tracking-wider text-white shrink-0 shadow-xs">
              PDF
            </span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {unit.unitCodeTag}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • Spec: {unit.specificationCode}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                {unit.title}
              </h2>
            </div>
          </div>

          {/* Right: Controls & CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isPaid ? (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Unlock className="w-3 h-3 text-emerald-400" />
                <span>Full PDF Unlocked</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Demo (2 Free Pages)</span>
              </span>
            )}

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
                onClick={() => setZoomLevel(prev => Math.min(120, prev + 10))}
                className="p-1 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Unlock / Download Button */}
            {isPaid ? (
              <button
                onClick={handleDownloadClick}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenPdfPaywall(unit)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#185a36] hover:bg-[#13492c] transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Unlock PDF (₹{unit.priceINR || 49})</span>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECONDARY TOOLBAR: Page Navigator */}
        <div className="bg-slate-800/95 px-3 sm:px-5 py-2 border-b border-slate-700 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 transition cursor-pointer text-slate-200"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-slate-300 font-mono font-semibold px-1">
              Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 transition cursor-pointer text-slate-200"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
              const locked = !isPaid && pageNum > demoPagesCount;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : locked
                      ? 'bg-slate-900/60 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                  title={locked ? `Page ${pageNum} (Locked - Demo limit)` : `Page ${pageNum} (Free Demo)`}
                >
                  {locked && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                  <span>P{pageNum}</span>
                  {!locked && !isPaid && (
                    <span className="text-[9px] text-emerald-400">demo</span>
                  )}
                </button>
              );
            })}
          </div>

          {!isPaid && (
            <button
              onClick={() => onOpenPdfPaywall(unit)}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Unlock all pages for ₹{unit.priceINR || 49}</span>
            </button>
          )}
        </div>

        {/* DEMO NOTICE BANNER */}
        {!isPaid && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200 gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Free Demo Mode:</strong> Pages 1 &amp; 2 are preview only. Downloading and Pages 3 to {totalPages} require payment.
              </span>
            </div>
            <button
              onClick={() => onOpenPdfPaywall(unit)}
              className="text-xs font-bold text-amber-300 hover:underline shrink-0 cursor-pointer"
            >
              Pay ₹{unit.priceINR || 49} to Unlock &amp; Download →
            </button>
          </div>
        )}

        {/* MAIN VIEWER CANVAS: A4 SHEET */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/70 flex justify-center">
          <div 
            className="w-full max-w-[760px] bg-white text-slate-900 rounded-sm shadow-2xl border border-slate-300 min-h-[880px] p-6 sm:p-10 relative flex flex-col justify-between transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* OFFICIAL PDF HEADER */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 tracking-wider uppercase">
                      PEARSON BTEC
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800">
                      LEVEL 3 &amp; HNC/HND CIVIL ENGINEERING
                    </span>
                  </div>
                  <h1 className="text-base sm:text-xl font-black text-slate-950 mt-1 leading-tight">
                    {unit.unitCodeTag}: {unit.title}
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Specification: {unit.specificationCode} • {unit.credits} Credits • Distinction Exemplar Pack
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-500 shrink-0 font-mono">
                  <div className="font-bold text-slate-900">CIVILNOTES PORTAL</div>
                  <div>Doc ID: CN-BTEC-{unit.unitNumber}-2024</div>
                  <div>Page {currentPage} of {totalPages}</div>
                </div>
              </div>

              <div className="mt-3 py-1 px-2.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 flex items-center justify-between">
                <span>
                  {isPaid ? 'ACCREDITED STUDENT LICENSE • VERIFIED DISTINCTION (D*)' : 'FREE DEMO PREVIEW (PAGES 1-2 FREE) • ALL PDFS PAYABLE'}
                </span>
                <span className="text-emerald-700 font-mono">
                  {isPaid ? '✓ UNLOCKED' : 'PAYMENT REQUIRED TO DOWNLOAD'}
                </span>
              </div>
            </div>

            {/* PAGE BODY CONTENT */}
            <div className="flex-1 space-y-6">
              {currentPage === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5 mb-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      1.0 Unit Overview &amp; Curriculum Scope
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {unit.previewContent.overview}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      2.0 Pearson BTEC Learning Outcomes Checklist
                    </h3>
                    <div className="space-y-2">
                      {unit.previewContent.learningOutcomes.map((lo, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{lo}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-700" />
                      3.0 Approved Codes of Practice &amp; British / Eurocodes
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {unit.previewContent.standardCodes.map((code, idx) => (
                        <div key={idx} className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 font-mono text-[11px]">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5 mb-2">
                      <Calculator className="w-4 h-4 text-blue-700" />
                      4.0 Governing Formulae &amp; Mathematical Basis (Demo Preview)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                      <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-blue-800 font-bold block mb-1">Equilibrium Conditions:</span>
                        <code>Σ F_x = 0,  Σ F_y = 0</code><br />
                        <code>Σ M_(support) = 0</code>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-blue-800 font-bold block mb-1">Elastic Flexural Stress:</span>
                        <code>σ / y = M / I = E / R</code><br />
                        <code>W_el = I / y_max</code>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-blue-800 font-bold block mb-1">Maximum Deflection Limit:</span>
                        <code>δ_max ≤ Span / 250 (SLS)</code>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-blue-800 font-bold block mb-1">Design Factored Load:</span>
                        <code>w_Ed = 1.35·G_k + 1.50·Q_k</code>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Page 2 Demo Concluded</span>
                      <span className="text-[11px] text-amber-800">
                        Pages 3-6 require payment before reading or downloading.
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentPage(3)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                    >
                      View Page 3 →
                    </button>
                  </div>
                </div>
              )}

              {currentPage >= 3 && (
                <div className="relative min-h-[500px]">
                  <div className={`space-y-6 transition-all ${isPageLocked ? 'filter blur-md opacity-25 select-none pointer-events-none' : ''}`}>
                    {currentPage === 3 && (
                      <div className="space-y-4">
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                          <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                            6.0 Distinction-Grade Numerical Calculations &amp; Envelopes
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {unit.previewContent.sampleCalculations.map((step, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-800">
                              [{idx + 1}] {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentPage === 4 && (
                      <div className="space-y-4">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                            7.0 Eurocode 3 Structural Steel Sizing &amp; Deflection Checks
                          </h3>
                        </div>
                      </div>
                    )}

                    {currentPage === 5 && (
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                            8.0 Pearson BTEC Distinction Rubric Evidence (P/M/D)
                          </h3>
                        </div>
                      </div>
                    )}

                    {currentPage === 6 && (
                      <div className="space-y-4">
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                          <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                            9.0 Internal Verification (IV) Sign-Off &amp; Plagiarism Declaration
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>

                  {isPageLocked && (
                    <div className="absolute inset-0 flex items-center justify-center p-3 animate-in fade-in duration-200">
                      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-emerald-500/60 p-5 sm:p-7 max-w-md w-full shadow-2xl text-center text-white space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
                          <Lock className="w-6 h-6" />
                        </div>

                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                            <span>Payment Required</span>
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                            Page {currentPage} and Full Download Locked
                          </h4>
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                            Without payment, full pages and downloads remain protected. Unlock all distinction calculations &amp; signed IV verification for <strong>₹{unit.priceINR || 49}</strong>.
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => onOpenPdfPaywall(unit)}
                            className="w-full py-3 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs sm:text-sm font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Zap className="w-4 h-4 fill-white" />
                            <span>Unlock &amp; Download PDF (₹{unit.priceINR || 49})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div>Pearson BTEC Civil Engineering • Verified Distinction Pack</div>
              <div className="font-bold text-slate-700">Page {currentPage} of {totalPages}</div>
            </div>
          </div>
        </div>

        {/* BOTTOM MODAL FOOTER */}
        <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-300">Unit:</span> {unit.unitCodeTag}
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-emerald-400 font-semibold">
              {isPaid ? '100% Unlocked' : 'Showing 2 of 6 Pages (Free Demo)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              Close
            </button>

            {isPaid ? (
              <button
                onClick={handleDownloadClick}
                className="px-4 py-1.5 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenPdfPaywall(unit)}
                className="px-4 py-1.5 rounded-lg font-bold text-white bg-[#185a36] hover:bg-[#13492c] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Unlock &amp; Download (₹{unit.priceINR || 49})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
