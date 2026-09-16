import React, { useState, useRef } from 'react';
import { X, Image, Sparkles, Upload, Palette } from 'lucide-react';
import { readFileAsDataUrl } from '../utils/format';

interface CreateStoryModalProps {
  onClose: () => void;
  onSubmit: (text?: string, mediaUrl?: string, bgGradient?: string) => void;
}

const GRADIENTS = [
  'from-indigo-600 via-purple-600 to-pink-500',
  'from-amber-500 via-rose-500 to-purple-600',
  'from-emerald-500 via-teal-600 to-cyan-700',
  'from-blue-600 via-indigo-700 to-slate-900',
  'from-fuchsia-600 via-pink-600 to-rose-500',
];

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [mode, setMode] = useState<'gradient' | 'photo'>('gradient');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setMediaUrl(dataUrl);
        setMode('photo');
      } catch (err) {
        alert('ছবি আপলোড করতে সমস্যা হয়েছে!');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaUrl) {
      alert('দয়া করে কিছু টেক্সট লিখুন অথবা ছবি দিন!');
      return;
    }
    onSubmit(
      text.trim() || undefined,
      mode === 'photo' ? mediaUrl || undefined : undefined,
      mode === 'gradient' ? selectedGradient : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>নতুন স্টোরি তৈরি করুন</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('gradient')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'gradient'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>কালার গ্রেডিয়েন্ট</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('photo')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'photo'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>ছবি স্টোরি</span>
            </button>
          </div>

          {/* Story Live Preview */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6 text-center">
            {mode === 'photo' && mediaUrl ? (
              <>
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient}`} />
            )}

            <p className="relative z-10 text-white font-bold text-lg sm:text-xl drop-shadow-md break-words max-w-full">
              {text || 'আপনার স্টোরি টেক্সট এখানে দেখাবে...'}
            </p>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ক্যাপশন বা স্টোরি বার্তা:
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="আজকে কী অনুভব করছেন বা কোনো সুন্দর বার্তা..."
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Gradient Palette Selection */}
          {mode === 'gradient' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                রং নির্বাচন করুন:
              </label>
              <div className="flex gap-2">
                {GRADIENTS.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGradient(g)}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} transition-transform ${
                      selectedGradient === g ? 'scale-110 ring-2 ring-indigo-500' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Photo Selection / Upload */}
          {mode === 'photo' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ছবি নির্বাচন করুন:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ডিভাইস থেকে আপলোড</span>
                </button>
              </div>

              {/* Sample Presets */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_PHOTOS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => setMediaUrl(url)}
                    className={`w-full h-14 rounded-xl object-cover cursor-pointer transition-all ${
                      mediaUrl === url ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
            >
              স্টোরি শেয়ার করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
