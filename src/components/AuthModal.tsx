import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, User, AtSign, Image, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { db } from '../services/storage';
import { sound } from '../services/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: (username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setRegAvatar(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanUser = loginUsername.trim().toLowerCase().replace(/^@/, '');
    if (!cleanUser) {
      setErrorMsg('ইউজারনেম দিন!');
      return;
    }

    try {
      const user = db.loginUser(cleanUser, loginPassword);
      sound.playSuccess();
      setSuccessMsg(`স্বাগতম ${user.name}! লগইন সফল হয়েছে।`);
      setTimeout(() => {
        onSuccess?.(user.username);
        onClose();
      }, 700);
    } catch (err: unknown) {
      sound.playError();
      setErrorMsg(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanUser = regUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUser || cleanUser.length < 3) {
      setErrorMsg('ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে (ইংরেজি ছোট হাতের অক্ষর, সংখ্যা বা _)');
      return;
    }

    if (!regName.trim()) {
      setErrorMsg('আপনার পূর্ণ নাম লিখুন!');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে!');
      return;
    }

    try {
      const newUser = db.registerUser({
        name: regName.trim(),
        username: cleanUser,
        password: regPassword,
        bio: regBio.trim() || 'রং সোশ্যাল মেম্বার ✨',
        avatar: regAvatar || undefined
      });
      sound.playSuccess();
      setSuccessMsg(`অভিনন্দন! @${newUser.username} একাউন্ট তৈরি সম্পন্ন হয়েছে।`);
      setTimeout(() => {
        onSuccess?.(newUser.username);
        onClose();
      }, 700);
    } catch (err: unknown) {
      sound.playError();
      setErrorMsg(err instanceof Error ? err.message : 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient badge */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-1.5">
                <span>{mode === 'login' ? 'লগইন করুন' : 'নতুন একাউন্ট রেজিস্টার'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  রং সোশ্যাল
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login' ? 'আপনার ইউজারনেম ও পাসওয়ার্ড দিয়ে প্রবেশ করুন' : 'তাত্ক্ষণিক ফ্রি একাউন্ট তৈরি করুন'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-5 pt-4">
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন (Login)</span>
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>রেজিস্ট্রেশন (Sign Up)</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mx-5 mt-3 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ইউজারনেম (Username)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="যেমন: admin বা shakib_dev"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পূর্ণ নাম *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ইউজারনেম (ইংরেজি ছোট অক্ষর ও সংখ্যা) *
                </label>
                <div className="relative">
                  <AtSign className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="my_username"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষর"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  প্রোফাইল ছবি (Data Image আপলোড বা প্রিভিউ)
                </label>
                <div className="flex items-center gap-3">
                  {regAvatar ? (
                    <img src={regAvatar} alt="প্রিভিউ" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  সংক্ষিপ্ত বায়ো (Bio)
                </label>
                <input
                  type="text"
                  value={regBio}
                  onChange={e => setRegBio(e.target.value)}
                  placeholder="আপনার শখ বা কাজের বিবরণ..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>একাউন্ট তৈরি করুন</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
          {mode === 'login' ? (
            <div>
              একাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </div>
          ) : (
            <div>
              ইতিমধ্যে একাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                লগইন করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
