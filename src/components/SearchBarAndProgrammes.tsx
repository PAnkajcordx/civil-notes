import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarAndProgrammesProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProgramme: string;
  onSelectProgramme: (programme: string) => void;
}

const PROGRAMMES = [
  'All Programmes',
  'BTEC Level 3',
  'BTEC Level 4 HNC',
  'BTEC Level 5 HND',
  'SSC JE Civil'
];

export const SearchBarAndProgrammes: React.FC<SearchBarAndProgrammesProps> = ({
  searchQuery,
  onSearchChange,
  selectedProgramme,
  onSelectProgramme,
}) => {
  return (
    <div className="pt-3 pb-2 space-y-2.5">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 stroke-[2.2]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search 20+ Civil Engineering subjects..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 text-slate-900 placeholder:text-slate-500 rounded-xl text-sm font-medium border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Programmes Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap text-xs shrink-0">
          Programmes:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {PROGRAMMES.map((prog) => {
            const isSelected = selectedProgramme === prog;
            return (
              <button
                key={prog}
                onClick={() => onSelectProgramme(prog)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {prog}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
