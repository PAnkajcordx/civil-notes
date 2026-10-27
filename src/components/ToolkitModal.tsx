import React, { useState } from 'react';
import { X, Download, CheckCircle2, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { CourseworkToolkit, PYQResource } from '../types';

interface ToolkitModalProps {
  item: CourseworkToolkit | PYQResource | null;
  onClose: () => void;
  onAddToCart: (item: CourseworkToolkit | PYQResource) => void;
}

export const ToolkitModal: React.FC<ToolkitModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!item) return null;

  const isToolkit = 'unitsIncluded' in item;

  const handleInstantDownload = () => {
    setDownloadSuccess(true);
    // Trigger synthetic file download for the toolkit
    const content = `=====================================================
CIVILNOTES COURSEWORK RESOURCE BUNDLE
=====================================================
Title: ${item.title}
Type: ${isToolkit ? 'BTEC Coursework Toolkit' : 'Competitive Exam PYQ Question Bank'}
Curated by: CivilNotes (Founder: Prince Maurya, Varanasi)
Timestamp: ${new Date().toISOString()}

Included Materials:
${isToolkit ? (item as CourseworkToolkit).unitsIncluded : `${(item as PYQResource).questionsCount}+ Solved Questions with Detailed Solutions`}

All assignment briefs, distinction calculation steps, and IV guidelines are unlocked.
Downloaded from CivilNotes.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivilNotes_${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_Bundle.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              {isToolkit ? (item as CourseworkToolkit).badge : (item as PYQResource).yearRange}
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
              {isToolkit ? (item as CourseworkToolkit).subtitle : (item as PYQResource).category}
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">What’s inside this resource pack:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isToolkit 
                    ? (item as CourseworkToolkit).unitsIncluded 
                    : `Over ${(item as PYQResource).questionsCount} verified chapter-wise multiple choice questions with numerical explanations.`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Complete dimensional consistency check (SI units &amp; Eurocodes).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Exemplar formatting compliant with Pearson British Standards.</span>
              </li>
            </ul>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Bundle Downloaded Successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                onAddToCart(item);
                onClose();
              }}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
            >
              Add to Coursework Cart
            </button>
            <button
              onClick={handleInstantDownload}
              className="py-2.5 px-3 bg-[#185a36] hover:bg-[#13492c] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instant Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
