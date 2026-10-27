import React from 'react';
import { Download, Bookmark, BookmarkCheck, Video, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { BTECUnit, CivilVideo } from '../types';

interface UnitCardProps {
  unit: BTECUnit;
  onPreview: (unit: BTECUnit) => void;
  onDownload: (unit: BTECUnit) => void;
  isSaved?: boolean;
  onToggleSave?: (unitId: string) => void;
  onOpenVideoPaywall?: (unit: BTECUnit) => void;
  hasVideo?: boolean;
  isVideoPaid?: boolean;
  isPdfPaid?: boolean;
  onOpenPdfPaywall?: (unit: BTECUnit) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  onPreview,
  onDownload,
  isSaved = false,
  onToggleSave,
  onOpenVideoPaywall,
  hasVideo = true,
  isVideoPaid = false,
  isPdfPaid = false,
  onOpenPdfPaywall
}) => {
  // Pill styling based on badgeType matching the screenshot
  const getBadgeStyle = () => {
    switch (unit.badgeType) {
      case 'blue':
        return {
          pill: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80',
          symbol: '☵'
        };
      case 'green':
        return {
          pill: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80',
          symbol: '✓'
        };
      case 'amber':
        return {
          pill: 'bg-amber-50/90 text-amber-800 border-amber-200/80',
          symbol: '⊞'
        };
      case 'purple':
        return {
          pill: 'bg-purple-50/90 text-purple-700 border-purple-200/80',
          symbol: '⦿'
        };
      case 'indigo':
        return {
          pill: 'bg-blue-50/90 text-blue-700 border-blue-200/80',
          symbol: 'Σ'
        };
      case 'orange':
        return {
          pill: 'bg-orange-50/90 text-orange-800 border-orange-200/80',
          symbol: '△'
        };
      default:
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
          symbol: '•'
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
      {/* Top Tag Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        {/* Left Pill with symbol */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle.pill}`}>
          <span className="font-mono text-xs">{badgeStyle.symbol}</span>
          <span>{unit.level} • {unit.levelType}</span>
        </div>

        {/* Right Spec label & optional bookmark */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            {unit.tag}
          </span>
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(unit.id)}
              className="p-1 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
              title={isSaved ? "Remove from Saved" : "Save Unit"}
              aria-label={isSaved ? "Saved" : "Save"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-snug mb-1">
        {unit.title}
      </h3>

      {/* Pricing & Demo Availability Badge */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {isPdfPaid ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Full PDF Unlocked ({unit.totalPages || 6} Pages)</span>
          </span>
        ) : (
          <>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
              <FileText className="w-3 h-3 text-amber-700" />
              <span>PDF: ₹{unit.priceINR || 49}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
              <span>2 Free Demo Pages</span>
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3.5">
        {unit.description}
      </p>

      {/* Bottom Row */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Unit Code Tag & Status */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold tracking-tight border border-slate-200/70">
            {unit.unitCodeTag}
          </span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {unit.exemplarStatus}
          </span>
        </div>

        {/* Action Buttons: Preview (Demo), Video (₹49), Download / Unlock */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {onOpenVideoPaywall && (
            <button
              onClick={() => onOpenVideoPaywall(unit)}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Download 1080p Video Masterclass for ₹49"
            >
              <Video className="w-3.5 h-3.5 text-amber-700" />
              <span>{isVideoPaid ? 'Video (Paid)' : 'Video (₹49)'}</span>
            </button>
          )}

          <button
            onClick={() => onPreview(unit)}
            className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
            title="Preview with 2 Free Demo Pages"
          >
            <span>Demo Preview</span>
          </button>

          {isPdfPaid ? (
            <button
              onClick={() => onDownload(unit)}
              className="px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Download Unlocked PDF"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Download</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenPdfPaywall ? onOpenPdfPaywall(unit) : onDownload(unit)}
              className="px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-[#185a36] hover:bg-[#13492c] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Unlock Complete PDF for ₹49"
            >
              <Lock className="w-3 h-3 text-emerald-300 stroke-[2.5]" />
              <span>Unlock (₹{unit.priceINR || 49})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
