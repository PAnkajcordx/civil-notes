import React from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Smartphone,
  Monitor,
  Video,
  Bot,
  ShieldCheck,
  LogIn,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSearchClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  onAuthClick: () => void;
  onAdminClick: () => void;
  onPricingClick: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onVideosClick?: () => void;
  onAutoResponderClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  cartCount,
  onCartClick,
  onProfileClick,
  onAuthClick,
  onAdminClick,
  onPricingClick,
  isMobileFrame,
  onToggleFrame,
  onVideosClick,
  onAutoResponderClick,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 transition-all">
      <div className="max-w-4xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
        {/* CivilNotes Logo mark */}
        <div className="flex items-center gap-2">
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
            <div className="flex flex-col justify-center gap-[3px] w-8 h-6 py-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="h-[3px] w-4 bg-slate-900 rounded-xs"></span>
              </div>
              <div className="w-7 h-[3px] bg-slate-900 rounded-xs"></div>
              <div className="w-5 h-[2.5px] bg-slate-900/80 rounded-xs"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                CivilNotes
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 tracking-wider uppercase leading-tight mt-0.5">
                Paid PDF Store
              </span>
            </div>
          </button>
        </div>

        {/* Right side utility icons & buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Panel button (only for admin users) */}
          {user?.role === 'admin' && (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-emerald-500/40 shadow-xs"
              title="Admin Dashboard: Manage PDFs & Transactions"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Admin</span>
            </button>
          )}

          {/* Quick PDF Store Button */}
          <button
            onClick={onPricingClick}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            title="PDF Pricing Table"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xs:inline text-[11px]">Prices</span>
          </button>

          {/* Frame Toggle (Desktop vs Mobile Preview) */}
          <button
            onClick={onToggleFrame}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title={isMobileFrame ? 'Switch to Expanded View' : 'Switch to Mobile Device Frame'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[11px]">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">Mobile</span>
              </>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Search Civil Engineering subjects"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* User Account / Login Button */}
          {user ? (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-1.5 p-1 px-2 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
              title={`Logged in as ${user.name}`}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-semibold max-w-[80px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Sign In or Register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
