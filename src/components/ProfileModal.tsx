import React from 'react';
import { X, User, Award, BookCheck, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Student &amp; Portal Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base border border-emerald-300">
              BC
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">BTEC Civil Candidate</h4>
              <p className="text-xs text-slate-500">Pearson Reg: UK-2024-CE</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Target Grade: Distinction* (D*D*D*)
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Enrolled Programme
            </h5>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>Pearson BTEC Level 3 National Extended Diploma</span>
                <span className="text-emerald-700">180 Credits</span>
              </div>
              <p className="text-slate-500 text-[11px]">Civil Engineering Pathway (Mandatory Units 1, 2, 3, 4, 6, 8)</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>CivilNotes Engineering Editorial</span>
            </div>
            <p>Founder &amp; Chief Content Curator: <strong className="text-slate-800">Prince Maurya</strong></p>
            <p>Location: Varanasi, Uttar Pradesh</p>
            <p className="text-[11px] text-slate-500">Dedicated to engineering students preparing Pearson BTEC portfolios, HNC/HND coursework, and state AE/JE exams.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
