import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Lock,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CatalogProduct } from './PDFPaymentTable';

interface ProtectedPDFViewerModalProps {
  product: CatalogProduct | null;
  isDemoMode?: boolean;
  onClose: () => void;
  onOpenCheckout: (product: CatalogProduct) => void;
}

export const ProtectedPDFViewerModal: React.FC<ProtectedPDFViewerModalProps> = ({
  product,
  isDemoMode = false,
  onClose,
  onOpenCheckout,
}) => {
  const { user, token, hasPurchased } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [demoData, setDemoData] = useState<any>(null);

  const isEntitled = product ? hasPurchased(product.id) : false;
  const isFullViewAllowed = isEntitled && !isDemoMode;

  useEffect(() => {
    if (!product) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    if (isFullViewAllowed && token) {
      // Fetch full protected PDF from server delivery endpoint
      fetch(`/api/pdfs/${product.id}/view`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to stream protected PDF document.');
          }
          return res.blob();
        })
        .then(blob => {
          if (isMounted) {
            const url = URL.createObjectURL(blob);
            setPdfBlobUrl(url);
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err.message || 'Error accessing private PDF document.');
            setIsLoading(false);
          }
        });
    } else {
      // Load 2-page demo preview
      fetch(`/api/pdfs/${product.id}/demo`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setDemoData(data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [product, isFullViewAllowed, token]);

  if (!product) return null;

  const totalPages = isFullViewAllowed ? product.pageCount : 2;

  const handleDownload = () => {
    if (!token) return;
    // Trigger authenticated download endpoint
    const downloadUrl = `/api/pdfs/${product.id}/download`;
    fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Download failed.');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(err => {
        alert('Could not download file: ' + err.message);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-white">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {product.title}
                </h3>
                {isFullViewAllowed ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Full Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Demo Mode (2 Pages)
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Discipline: {product.subject} • Total Pages: {product.pageCount}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono font-semibold text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button (Only for full unlocked) */}
            {isFullViewAllowed && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Watermark Strip */}
        <div className="bg-slate-950 px-4 py-1 text-center text-[10px] text-slate-400 border-b border-slate-800 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>
            {isFullViewAllowed
              ? `Licensed to: ${user?.email || 'Authorized Student'} • CivilNotes Authenticated Stream`
              : `Sample Demo View: Pages 1-2 only. Unlock remaining ${product.pageCount - 2} pages for ₹${product.finalPriceINR}`}
          </span>
        </div>

        {/* Reader Canvas / Document View Area */}
        <div className="flex-1 bg-slate-950/70 p-3 sm:p-6 overflow-y-auto flex items-center justify-center relative">
          {isLoading ? (
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Loading document pages securely...</p>
            </div>
          ) : error ? (
            <div className="p-6 max-w-md text-center bg-red-950/40 border border-red-700/60 rounded-3xl space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Access Restriction</h4>
              <p className="text-xs text-red-200">{error}</p>
              <button
                onClick={() => onOpenCheckout(product)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Purchase Access (₹{product.finalPriceINR})
              </button>
            </div>
          ) : isFullViewAllowed && pdfBlobUrl ? (
            /* Render Full PDF Document Stream via iframe/embed */
            <div
              className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl transition-transform"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-0"
                title={product.title}
              />
            </div>
          ) : (
            /* 2-PAGE DEMO RENDERER */
            <div
              className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl transition-transform min-h-[500px] flex flex-col justify-between"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#185a36] text-white text-[10px] font-black flex items-center justify-center">
                      CN
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      CivilNotes Distinction Portfolio
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Preview Page {currentPage} of 2
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <h2 className="text-lg font-black text-slate-900">
                    {currentPage === 1
                      ? demoData?.demoPages?.[0]?.title || `${product.title} - Module Overview`
                      : demoData?.demoPages?.[1]?.title || `Formulae & Numerical Methodology`}
                  </h2>

                  <div className="text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {currentPage === 1
                      ? demoData?.demoPages?.[0]?.sampleText ||
                        `Discipline: ${product.subject}\n\n1. Scope of Works & Structural Mechanics\n2. Eurocode 2 (BS EN 1992-1-1) Design Formulas\n3. Loading combinations: 1.35 Gk + 1.5 Qk\n4. Finite element truss simulation & joints analysis.`
                      : demoData?.demoPages?.[1]?.sampleText ||
                        `Limit State Analysis Summary:\n- Allowable Bending Stress: sigma_allowable = 165 N/mm2\n- Deflection criteria check: delta <= Span / 250\n- Maximum shear capacity: V_Rd,c formula applied.`}
                  </div>

                  {/* Lock Callout for remaining pages */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-amber-900 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold">
                        Pages 3 through {product.pageCount} are locked
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Unlock the complete distinction portfolio, worked numerical step-by-step examples, CAD schematics, and model assignment solutions instantly.
                    </p>
                    <button
                      onClick={() => onOpenCheckout(product)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unlock All {product.pageCount} Pages for ₹{product.finalPriceINR}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>CivilNotes Academic Publishing</span>
                <span>BS EN / BTEC Pearson Specifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Pagination & Navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300">
              Page <strong className="text-white">{currentPage}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isFullViewAllowed && (
            <button
              onClick={() => onOpenCheckout(product)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Full PDF (₹{product.finalPriceINR})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
