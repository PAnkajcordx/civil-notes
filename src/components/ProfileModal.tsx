import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  ShoppingBag,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPurchases?: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onViewPurchases,
  onOpenAdmin,
}) => {
  const { user, logout, entitlements } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-xs text-emerald-400">
              CN
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Student Account
              </h3>
              <p className="text-[10px] text-slate-300">
                CivilNotes Security &amp; Entitlements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{user.name}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Purchased PDFs
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {entitlements.length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Security Level
                  </span>
                  <span className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {onViewPurchases && (
                  <button
                    onClick={() => {
                      onViewPurchases();
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>View My Purchased PDFs</span>
                    </span>
                    <span className="font-mono text-slate-400">→</span>
                  </button>
                )}

                {user.role === 'admin' && onOpenAdmin && (
                  <button
                    onClick={() => {
                      onOpenAdmin();
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-emerald-500/30"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin Management Dashboard</span>
                    </span>
                    <span className="font-mono text-emerald-400">→</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-2">
              <User className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">Not currently logged in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
