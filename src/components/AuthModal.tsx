import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let res;
    if (mode === 'login') {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    setIsLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  // Demo accounts quick-fill
  const handleQuickFill = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@civilnotes.com');
      setPassword('Admin@CivilNotes2026');
      setName('CivilNotes Admin');
      setMode('login');
    } else {
      setEmail('student@civilnotes.com');
      setPassword('Student@123');
      setName('Pankaj Kumar (Student)');
      setMode('login');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-xs text-emerald-400">
              CN
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {mode === 'login' ? 'Student & Admin Login' : 'Create Free Account'}
              </h3>
              <p className="text-[10px] text-slate-300">
                Access Purchased Portfolios, Coursework &amp; Masterclasses
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

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Demo Credentials */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Quick Login (Pre-Configured Accounts):</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Student Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Pankaj Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
