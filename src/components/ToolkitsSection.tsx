import React from 'react';
import { ChevronRight } from 'lucide-react';
import { COURSEWORK_TOOLKITS, PYQ_RESOURCES } from '../data/civilData';
import { CourseworkToolkit, PYQResource } from '../types';

interface ToolkitsSectionProps {
  onSelectToolkit: (toolkit: CourseworkToolkit) => void;
  onSelectPYQ: (pyq: PYQResource) => void;
}

export const ToolkitsSection: React.FC<ToolkitsSectionProps> = ({
  onSelectToolkit,
  onSelectPYQ
}) => {
  return (
    <div className="space-y-6 my-6">
      {/* Popular BTEC Coursework Toolkits */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Popular BTEC Coursework Toolkits
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {COURSEWORK_TOOLKITS.map((toolkit) => (
            <button
              key={toolkit.id}
              onClick={() => onSelectToolkit(toolkit)}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer shadow-2xs"
            >
              <div className="min-w-0 pr-1">
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-900 group-hover:text-emerald-800 transition-colors block truncate">
                  {toolkit.title}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {toolkit.badge}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Popular PYQ Resources */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-3">
          Popular PYQ Resources
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {PYQ_RESOURCES.map((pyq) => (
            <button
              key={pyq.id}
              onClick={() => onSelectPYQ(pyq)}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer shadow-2xs"
            >
              <div className="min-w-0 pr-1">
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-900 group-hover:text-emerald-800 transition-colors block truncate">
                  {pyq.title}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {pyq.category.split(' ')[0]} • {pyq.questionsCount}+ Qs
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
