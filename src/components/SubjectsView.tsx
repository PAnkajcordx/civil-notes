import React, { useState } from 'react';
import { SUBJECT_DIRECTORIES } from '../data/civilData';
import { SubjectDirectory, BTECUnit } from '../types';
import { BookOpen, Layers, Building2, Compass, Droplets, Hammer, ShieldAlert, ChevronRight, Calculator, FileText } from 'lucide-react';

interface SubjectsViewProps {
  onSelectUnit: (unitTitle: string) => void;
  units: BTECUnit[];
  onPreviewUnit: (unit: BTECUnit) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  onPreviewUnit,
  units
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectDirectory | null>(null);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-indigo-700" />;
      case 'Layers': return <Layers className="w-5 h-5 text-amber-700" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-700" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-sky-700" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-orange-700" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-purple-700" />;
      default: return <BookOpen className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[#185a36]" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Civil Engineering Subjects Directory
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Comprehensive curriculum breakdown covering 20+ specialized disciplines across Pearson BTEC L3, HNC &amp; HND Civil Engineering specifications.
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {SUBJECT_DIRECTORIES.map((subj) => (
          <div
            key={subj.id}
            onClick={() => setSelectedSubject(subj)}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {getSubjectIcon(subj.iconName)}
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  {subj.notesAvailable} Notes
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {subj.name}
              </h3>

              <div className="space-y-1 mb-3">
                {subj.topics.slice(0, 2).map((topic, i) => (
                  <p key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span className="truncate">{topic}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold group">
              <span>View Topics &amp; Cheat Sheet</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Subject Detail Drawer / Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedSubject.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Core Topics Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Curriculum Topics
                </h4>
                <div className="space-y-1.5">
                  {selectedSubject.topics.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-slate-100 flex items-center justify-between">
                      <span>{t}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Available in Spec
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Civil Engineering Formulas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Key Formulas &amp; Equations</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSubject.keyFormulas.map((formula, fIdx) => (
                    <div key={fIdx} className="p-2.5 bg-slate-900 text-emerald-300 font-mono text-xs rounded-lg border border-slate-800">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Units */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Related BTEC Portfolios
                </h4>
                <div className="space-y-2">
                  {units.slice(0, 2).map((u) => (
                    <div key={u.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {u.unitCodeTag}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 mt-1">
                          {u.title}
                        </h5>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSubject(null);
                          onPreviewUnit(u);
                        }}
                        className="px-3 py-1.5 bg-[#185a36] text-white rounded-md text-xs font-semibold cursor-pointer shrink-0"
                      >
                        Preview Notes
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
