import React, { useState, useRef } from 'react';
import { X, Upload, Check, Sparkles, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { readFileAsDataUrl } from '../utils/format';

interface EditProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onSave: (updated: Partial<User> & { id: string }) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [profession, setProfession] = useState(currentUser.profession || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [coverPhoto, setCoverPhoto] = useState(currentUser.coverPhoto || COVER_PRESETS[0]);
  const [error, setError] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await readFileAsDataUrl(file);
        setAvatar(data);
      } catch {
        setError('অ্যাভাটার ছবি আপলোড করতে ব্যর্থ হয়েছে');
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await readFileAsDataUrl(file);
        setCoverPhoto(data);
      } catch {
        setError('কভার ছবি আপলোড করতে ব্যর্থ হয়েছে');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!name.trim()) {
      setError('নাম ফাঁকা রাখা যাবে না!');
      return;
    }
    if (!cleanUsername) {
      setError('হ্যান্ডেল / ইউজারনেম সঠিক নয়!');
      return;
    }

    try {
      onSave({
        id: currentUser.id,
        name: name.trim(),
        username: cleanUsername,
        bio: bio.trim(),
        profession: profession.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar,
        coverPhoto
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            প্রোফাইল এডিট করুন
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Cover & Avatar previews */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 relative">
              <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-semibold backdrop-blur"
              >
                কভার পরিবর্তন
              </button>
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="absolute -bottom-6 left-4 flex items-end gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                  title="ছবি পরিবর্তন"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Quick preset avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              অথবা প্রিসেট অ্যাভাটার নির্বাচন করুন:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Preset"
                  onClick={() => setAvatar(url)}
                  className={`w-10 h-10 rounded-xl object-cover cursor-pointer flex-shrink-0 transition-all ${
                    avatar === url ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পূর্ণ নাম:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* Username / Handle link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ইউজার হ্যান্ডেল (/#username লিংক):
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-indigo-500">
              <span className="text-sm font-bold text-indigo-500">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="your_handle"
                className="w-full py-2.5 pl-1.5 bg-transparent border-none text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              অন্যরা আপনার প্রোফাইলে ঢুকতে পারবে এই লিংকে: <b>/#/{username || 'username'}</b>
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              বায়ো / পরিচয়:
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              placeholder="আপনার সম্পর্কে কিছু বলুন..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Profession & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পেশা / পদবী:
              </label>
              <input
                type="text"
                value={profession}
                onChange={e => setProfession(e.target.value)}
                placeholder="যেমন: Software Developer"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ঠিকানা / শহর:
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="যেমন: ঢাকা, বাংলাদেশ"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ওয়েবসাইট লিঙ্ক:
            </label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
