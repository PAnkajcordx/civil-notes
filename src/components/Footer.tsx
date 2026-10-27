import React from 'react';
import { Compass } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenSupport
}) => {
  return (
    <footer className="pt-8 pb-20 sm:pb-12 text-center text-slate-500 border-t border-slate-200/80 mt-10">
      <div className="max-w-xl mx-auto px-4 space-y-4">
        {/* Brand Lockup */}
        <div className="flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-slate-800" />
          <span className="text-base font-extrabold text-slate-900 tracking-tight">
            CivilNotes
          </span>
        </div>

        {/* Portal Summary */}
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Specialist Pearson BTEC Level 3, HNC &amp; HND Civil Engineering resource portal. Exemplars, assignment briefs, and distinction verification guides.
        </p>

        {/* Links with bullet separators */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium text-slate-600">
          <button 
            onClick={onOpenSupport}
            className="hover:text-slate-900 cursor-pointer"
          >
            Telegram Channel
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={onOpenSupport}
            className="hover:text-slate-900 cursor-pointer"
          >
            WhatsApp Support
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={onOpenPrivacy}
            className="hover:text-slate-900 cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={onOpenTerms}
            className="hover:text-slate-900 cursor-pointer"
          >
            Terms of Service
          </button>
        </div>

        {/* Copyright & Founder Attribution */}
        <div className="pt-2 text-[11px] text-slate-400 space-y-1">
          <p>© 2024 CivilNotes. All rights reserved. Handwritten &amp; Curated Civil Engineering Portal.</p>
          <p className="font-medium text-slate-600">
            Founder: Prince Maurya • Varanasi, Uttar Pradesh
          </p>
        </div>
      </div>
    </footer>
  );
};
