import React from 'react';
import { X, Volume2, Bell, Sparkles, Download, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onResetData: () => void;
  onRequestPush: () => void;
  onTestPush: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportData,
  onResetData,
  onRequestPush,
  onTestPush
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>অ্যাপ সেটিংস ও নোটিফিকেশন</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">মেসেজ ও অ্যাকশন সাউন্ড</div>
                <div className="text-[11px] text-slate-400">নতুন বার্তা আসলে শব্দ হবে</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Browser Push Notifications */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">ব্রাউজার পুশ নোটিফিকেশন</div>
                <div className="text-[11px] text-slate-400">স্ক্রিনের বাইরে থাকলেও অ্যালার্ট পাবেন</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.browserNotificationsEnabled}
              onChange={e => {
                onUpdateSettings({ browserNotificationsEnabled: e.target.checked });
                if (e.target.checked) onRequestPush();
              }}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Push Test Button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-500">পুশ নোটিফিকেশন চেক করুন:</span>
            <button
              onClick={onTestPush}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              🔔 টেস্ট পুশ পাঠান
            </button>
          </div>

          {/* Data Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={onExportData}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>আমার ডেটা এক্সপোর্ট করুন (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('ডেমো ডেটা রিসেট করতে চান?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ফ্যাক্টরি রিসেট (সকল ডেটা ডিফল্ট করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
