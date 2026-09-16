import React, { useState, useRef } from 'react';
import { Image, Smile, Send, X, Upload } from 'lucide-react';
import { User } from '../types';
import { readFileAsDataUrl } from '../utils/format';

interface PostComposerProps {
  currentUser: User;
  onCreatePost: (text: string, image?: string) => void;
}

const QUICK_EMOJIS = ['❤️', '🔥', '✨', '☕', '🚀', '👍', '🌈', '🎉', '💡'];
const CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'
];

export const PostComposer: React.FC<PostComposerProps> = ({
  currentUser,
  onCreatePost
}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setImage(dataUrl);
        setShowPresets(false);
      } catch {
        alert('ছবি নির্বাচন করতে ব্যর্থ হয়েছে!');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    onCreatePost(text, image || undefined);
    setText('');
    setImage(null);
    setShowPresets(false);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4">
      <div className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            id="post-composer-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`আজ আপনার মনে কী আছে, ${currentUser.name.split(' ')[0]}?`}
            rows={2}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
          />

          {/* Image preview if attached */}
          {image && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-60 bg-black/5">
              <img
                src={image}
                alt="Upload preview"
                className="w-full h-auto max-h-60 object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Curated Image selector */}
          {showPresets && (
            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  নমুনা ছবি নির্বাচন করুন অথবা ডিভাইস থেকে আপলোড করুন:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPresets(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CURATED_IMAGES.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => {
                      setImage(url);
                      setShowPresets(false);
                    }}
                    className="w-full h-14 rounded-lg object-cover cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Emoji Toolbar */}
          {showEmojiPicker && (
            <div className="flex flex-wrap gap-1.5 mt-2 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              {QUICK_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    setText(prev => prev + ' ' + em);
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-lg transition-transform hover:scale-125"
                >
                  {em}
                </button>
              ))}
            </div>
          )}

          {/* Actions toolbar */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 sm:gap-2">
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                title="ডিভাইস থেকে ছবি আপলোড"
              >
                <Upload className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">ছবি আপলোড</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50 rounded-lg transition-colors"
                title="নমুনা ছবি নির্বাচন"
              >
                <Image className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">নমুনা ফটো</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
                title="ইমোজি যোগ করুন"
              >
                <Smile className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            <button
              id="submit-post-btn"
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() && !image}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all active:scale-95 ${
                !text.trim() && !image
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20'
              }`}
            >
              <span>পোস্ট করুন</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
