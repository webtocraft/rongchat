import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, User, AtSign, Image, Sparkles, CheckCircle2, ShieldAlert, Sun, Moon } from 'lucide-react';
import { db } from '../services/storage';
import { sound } from '../services/sound';

interface AuthScreenProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  theme,
  onToggleTheme,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (!loginPassword) {
      setErrorMsg('পাসওয়ার্ড প্রদান করুন!');
      return;
    }

    setIsLoading(true);
    try {
      const user = db.loginUser(cleanUser, loginPassword);
      sound.playSuccess();
      setSuccessMsg(`স্বাগতম ${user.name}! লগইন সফল হয়েছে।`);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: unknown) {
      sound.playError();
      setErrorMsg(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে!');
      setIsLoading(false);
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

    setIsLoading(true);
    try {
      const newUser = db.registerUser({
        name: regName.trim(),
        username: cleanUser,
        password: regPassword,
        bio: regBio.trim() || 'রং সোশ্যাল নেটওয়ার্কের সদস্য ✨',
        avatar: regAvatar || undefined
      });
      sound.playSuccess();
      setSuccessMsg(`অভিনন্দন ${newUser.name}! একাউন্ট তৈরি সম্পন্ন হয়েছে।`);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: unknown) {
      sound.playError();
      setErrorMsg(err instanceof Error ? err.message : 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20">
            🌈
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rong Social
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
              রং সোশ্যাল নেটওয়ার্ক • সুপারফাস্ট ও নিরাপদ
            </p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </header>

      {/* Main Content Form Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {/* Card Top Title */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/20 mb-3">
              {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {mode === 'login' ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' 
                ? 'আপনার ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন' 
                : 'তাত্ক্ষণিক ফ্রি রেজিস্টার করে বন্ধুদের সাথে সংযুক্ত হোন'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-6 pt-4">
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন (Login)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
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
            <div className="mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mx-6 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <div className="p-6 pt-4">
            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    ইউজারনেম (Username)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-bold">@</span>
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={e => setLoginUsername(e.target.value)}
                      placeholder="আপনার_ইউজারনেম"
                      required
                      autoComplete="username"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    পাসওয়ার্ড (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    আপনার পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ইউজারনেম (ইংরেজি ছোট অক্ষর ও সংখ্যা) *
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="যেমন: shakib বা my_username"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    পাসওয়ার্ড *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    সংক্ষিপ্ত বায়ো (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={regBio}
                    onChange={e => setRegBio(e.target.value)}
                    placeholder="নিজের সম্পর্কে এক লাইনে লিখুন..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    প্রোফাইল ছবি (ঐচ্ছিক)
                  </label>
                  <div className="flex items-center gap-3">
                    {regAvatar ? (
                      <img
                        src={regAvatar}
                        alt="Avatar Preview"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
                        <Image className="w-5 h-5" />
                      </div>
                    )}
                    <label className="cursor-pointer px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-700">
                      <span>ছবি নির্বাচন করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isLoading ? 'রেজিস্ট্রেশন হচ্ছে...' : 'নতুন একাউন্ট খুলুন'}</span>
                </button>
              </form>
            )}

            {/* Bottom switcher */}
            <div className="mt-4 pt-3 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              {mode === 'login' ? (
                <p>
                  এখনো কোনো একাউন্ট নেই?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                  >
                    নতুন একাউন্ট খুলুন
                  </button>
                </p>
              ) : (
                <p>
                  ইতিমধ্যে একটি একাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                  >
                    লগইন করুন
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        © ২০২৬ রং সোশ্যাল নেটওয়ার্ক (Rong Social) • সকল অধিকার সংরক্ষিত
      </footer>
    </div>
  );
};
