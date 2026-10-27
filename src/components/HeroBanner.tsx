import React from 'react';
import { CheckCircle2, FileText, Award, ShieldCheck, HardHat, Sliders, ArrowRight, DollarSign, Lock } from 'lucide-react';

interface HeroBannerProps {
  onLearnMore?: () => void;
  onExemplarClick?: () => void;
  onOpenDeck?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onLearnMore, 
  onExemplarClick, 
  onOpenDeck 
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
            <span>Pearson BTEC Aligned • Verified Coursework</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
            Official Civil Engineering Coursework &amp; Portfolios (PDF)
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-amber-400/25 text-amber-200 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-300" />
              <span>All PDFs Payable • Strictly Protected</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-400/25 text-emerald-300 border border-emerald-400/40 text-[10px] font-semibold">
              2 Free Demo Pages per PDF
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/15 text-slate-200 border border-white/20 text-[10px]">
              Razorpay Secured (INR ₹)
            </span>
          </div>
        </div>
      </div>

      {/* Coursework Specs Text & 3 Quick Features */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
          Coursework templates, assignment briefs, unit revision notes, and distinction-grade calculation guides aligned with Pearson BTEC Civil Engineering specifications. Full PDFs remain protected until verified payment.
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
              Full Spec PDFs
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
              Exemplar Pack
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

        {/* Action buttons */}
        <div className="space-y-2">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="w-full py-2.5 px-3.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer hover:opacity-95 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-300" />
                <span>View Complete PDF Pricing Table &amp; Disounts</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {onOpenDeck && (
            <button
              onClick={onOpenDeck}
              className="w-full py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-all border border-slate-200 group"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700 group-hover:rotate-45 transition-transform" />
                <span>Interactive Structural Deck Board &amp; Deflection Simulator</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
