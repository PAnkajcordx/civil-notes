import React, { useState, useEffect } from 'react';
import { Bookmark, Download, Trash2, CheckCircle2, Award, ArrowRight, Video, FileCheck, ExternalLink, Lock, FileText, Zap } from 'lucide-react';
import { BTECUnit, CivilVideo, PaymentTransaction } from '../types';
import { CIVIL_VIDEOS } from '../data/videoData';
import { getPaidVideoIds, getAllTransactions, downloadUnlockedVideoPackage } from '../utils/videoPaymentHelper';
import { getPaidPdfIds, isPdfPaid, hasAllAccessPass } from '../utils/pdfPaymentHelper';

interface SavedViewProps {
  savedUnits: BTECUnit[];
  onRemoveSaved: (unitId: string) => void;
  onPreviewUnit: (unit: BTECUnit) => void;
  onDownloadUnit: (unit: BTECUnit) => void;
  onExploreMore: () => void;
  onOpenVideoPaywall?: (video: CivilVideo) => void;
  onOpenPdfPaywall?: (unit: BTECUnit) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedUnits,
  onRemoveSaved,
  onPreviewUnit,
  onDownloadUnit,
  onExploreMore,
  onOpenVideoPaywall,
  onOpenPdfPaywall
}) => {
  // Interactive checklist tracking for students
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    'c1': true,
    'c2': true,
    'c3': false,
    'c4': false,
    'c5': false
  });

  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    setPaidIds(getPaidVideoIds());
    setTransactions(getAllTransactions());
  }, []);

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(checklist).length) * 100);

  // Match paid videos
  const unlockedVideos = CIVIL_VIDEOS.filter(v => paidIds.includes(v.id));

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-[#185a36] fill-[#185a36]" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Saved Portfolios &amp; Unlocked Resources
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Bookmarked unit exemplar notes, unlocked ₹49 video packages, and Pearson grading verification checklist.
        </p>
      </div>

      {/* Unlocked ₹49 Video Packages Section if any paid */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Unlocked ₹49 Video Masterclasses ({paidIds.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                {paidIds.length > 0 ? 'Lifetime offline access & download licenses active' : 'No videos purchased yet'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
            Paid Pass
          </span>
        </div>

        {paidIds.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-1.5">
            <p className="text-xs text-slate-600 font-medium">No videos purchased yet</p>
            <p className="text-[11px] text-slate-400">
              Download any video masterclass or lab demo for ₹49 to keep lifetime offline access here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {unlockedVideos.map(video => {
              const matchedTxn = transactions.find(t => t.videoId === video.id);
              return (
                <div 
                  key={video.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold">
                        {video.unitCodeTag}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {video.title}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Ref: {matchedTxn?.txnId || 'TXN_VERIFIED'} • {video.fileSize} • {video.quality}
                    </div>
                  </div>

                  <button
                    onClick={() => downloadUnlockedVideoPackage(video, matchedTxn)}
                    className="py-1.5 px-3 bg-[#185a36] hover:bg-[#13492c] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (Free)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Coursework Assignment Verification Tracker */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Pearson BTEC Submission Readiness Tracker
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {progressPercent}% Ready
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#185a36] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checkable criteria */}
        <div className="space-y-2 text-xs">
          {[
            { id: 'c1', text: 'All beam loading and support reaction calculations dimensionally checked (kN, m, kN·m)' },
            { id: 'c2', text: 'SFD and BMD plotted with clear inflection points and maximum bending moment callout' },
            { id: 'c3', text: 'Eurocode 2 / Eurocode 3 standard clauses cited in reference bibliography' },
            { id: 'c4', text: 'Distinction evaluation comparing structural steel UB vs glulam timber beam under ULS/SLS' },
            { id: 'c5', text: 'Internal Verification (IV) sheet signed and plagiarism declaration checked' }
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-100"
            >
              <input
                type="checkbox"
                checked={checklist[item.id]}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
              />
              <span className={`leading-snug ${checklist[item.id] ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bookmarked Units List */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Bookmarked Units ({savedUnits.length})</span>
          {savedUnits.length > 0 && (
            <span className="text-xs text-slate-400 font-normal">Available offline</span>
          )}
        </h3>

        {savedUnits.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No saved unit notes yet</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tap the bookmark icon on any unit card in the Notes tab to keep quick access here for offline review.
            </p>
            <button
              onClick={onExploreMore}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#185a36] text-white rounded-lg text-xs font-semibold hover:bg-[#13492c] transition-colors cursor-pointer"
            >
              <span>Browse BTEC Portfolios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedUnits.map((unit) => {
              const isPaid = isPdfPaid(unit.id);

              return (
                <div
                  key={unit.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                        {unit.unitCodeTag}
                      </span>
                      {isPaid ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Full PDF Unlocked
                        </span>
                      ) : (
                        <>
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            PDF: ₹{unit.priceINR || 49}
                          </span>
                          <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            2 Free Demo Pages
                          </span>
                        </>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {unit.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {unit.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => onPreviewUnit(unit)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Preview 2 Free Demo Pages"
                    >
                      Demo Preview
                    </button>
                    {isPaid ? (
                      <button
                        onClick={() => onDownloadUnit(unit)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPdfPaywall ? onOpenPdfPaywall(unit) : onDownloadUnit(unit)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#185a36] hover:bg-[#13492c] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Lock className="w-3 h-3 text-emerald-300" />
                        <span>Unlock (₹{unit.priceINR || 49})</span>
                      </button>
                    )}
                    <button
                      onClick={() => onRemoveSaved(unit.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
