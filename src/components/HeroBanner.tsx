import React from 'react';
import { CheckCircle2, FileText, Award, ShieldCheck, HardHat, Sliders, ArrowRight, Video } from 'lucide-react';

interface HeroBannerProps {
  onLearnMore?: () => void;
  onExemplarClick?: () => void;
  onOpenDeck?: () => void;
  onOpenVideos?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onLearnMore, 
  onExemplarClick, 
  onOpenDeck,
  onOpenVideos 
}) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xs my-2">
      {/* Top Graphic & Title Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 pt-6 pb-7 text-white overflow-hidden">
        {/* Engineering blueprint & truss geometric background pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Structural suspension bridge cable lines */}
            <path d="M0,80 Q200,160 400,90 T800,100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M50,140 L150,40 L250,140 L350,40" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Ambient civil engineering graphic elements */}
        <div className="absolute right-3 top-3 opacity-20 pointer-events-none flex items-center gap-1.5">
          <HardHat className="w-16 h-16 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Pearson BTEC Aligned Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/95 border border-emerald-500/40 text-white text-[11px] font-bold tracking-wide uppercase mb-3 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pearson BTEC Aligned</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
            BTEC Civil Engineering Notes &amp; Unit Portfolios
          </h1>
        </div>
      </div>

      {/* Coursework Specs Text & 3 Quick Features */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
          Coursework templates, assignment briefs, unit revision notes, and distinction-grade calculation guides aligned with Pearson BTEC Civil Engineering specifications.
        </p>

        {/* 3 Metric / Quick Cards in a row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          {/* Card 1: Unit-by-Unit */}
          <div 
            onClick={onLearnMore}
            className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center transition-all hover:bg-slate-100 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center mb-1.5">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-900 leading-tight">
              Unit-by-Unit
            </span>
            <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
              Full Spec Notes
            </span>
          </div>

          {/* Card 2: Distinction Grade */}
          <div 
            onClick={onExemplarClick}
            className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 flex flex-col items-center justify-center transition-all hover:bg-emerald-100/70 cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[12px] font-extrabold text-emerald-900 leading-tight">
              Distinction Grade
            </span>
            <span className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
              Exemplar Portfolio
            </span>
          </div>

          {/* Card 3: Pearson Aligned */}
          <div 
            onClick={onLearnMore}
            className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center transition-all hover:bg-slate-100 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-900 leading-tight">
              Pearson Aligned
            </span>
            <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
              L3 / HNC / HND
            </span>
          </div>
        </div>

        {/* Action button into Deck Board & Video Downloads */}
        <div className="space-y-2">
          {onOpenVideos && (
            <button
              onClick={onOpenVideos}
              className="w-full py-2.5 px-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer hover:opacity-95 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-200" />
                <span>Civil Video Masterclasses &amp; Lab Demos</span>
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">₹49 only</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {onOpenDeck && (
            <button
              onClick={onOpenDeck}
              className="w-full py-2.5 px-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer hover:opacity-95 transition-all shadow-xs border border-emerald-500/30 group"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span>Interactive Structural Deck Board &amp; Simulator</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
