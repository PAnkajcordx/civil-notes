import React from 'react';
import { Search, ShoppingCart, User, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  cartCount,
  onCartClick,
  onProfileClick,
  isMobileFrame,
  onToggleFrame
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* CivilNotes Logo mark matching screenshot top left */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => {
              try {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } catch {
                window.scrollTo(0, 0);
              }
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="CivilNotes - Home"
          >
            {/* Custom geometric bridge & cantilever architectural mark */}
            <div className="flex flex-col justify-center gap-[3px] w-9 h-7 py-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="h-[3.5px] w-5 bg-slate-900 rounded-xs"></span>
              </div>
              <div className="w-8 h-[3.5px] bg-slate-900 rounded-xs"></div>
              <div className="w-6 h-[3px] bg-slate-900/80 rounded-xs"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                CivilNotes
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 tracking-wider uppercase leading-tight mt-0.5">
                BTEC Portfolios
              </span>
            </div>
          </button>
        </div>

        {/* Right side utility icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Frame Toggle (Desktop vs Mobile Preview) */}
          <button
            onClick={onToggleFrame}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title={isMobileFrame ? "Switch to Expanded View" : "Switch to Mobile Device Frame"}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-700" />
                <span>Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Search Civil Engineering subjects"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={onCartClick}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
            aria-label="View Coursework Cart"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute top-1 right-1 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {cartCount}
            </span>
          </button>

          {/* Profile Icon */}
          <button
            onClick={onProfileClick}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="User Account"
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
