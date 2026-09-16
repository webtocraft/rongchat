import React, { useState } from 'react';
import { X, Users, UserPlus, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types';

interface SwitchAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  onCreateNewUser: (name: string, username: string) => void;
}

export const SwitchAccountModal: React.FC<SwitchAccountModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSwitchUser,
  onCreateNewUser
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const handle = (newUsername.trim() || newName.trim().toLowerCase().replace(/\s+/g, '_')).replace(/[^a-z0-9_]/g, '');
    onCreateNewUser(newName.trim(), handle);
    setNewName('');
    setNewUsername('');
    setShowCreateForm(false);
  };

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
            <Users className="w-5 h-5 text-indigo-500" />
            <span>প্রোফাইল পরিবর্তন / সুইচ করুন</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            এক ক্লিকেই অন্য প্রোফাইলে সুইচ করে ইনবক্স মেসেজিং, ফলো, এবং রিঅ্যাকশন টেস্ট করুন:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {users.map(u => {
              const isCurrent = u.id === currentUser.id;

              return (
                <div
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u.id);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800'
                      : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.2 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        /@{u.username} • {u.profession || 'সদস্য'}
                      </div>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>সক্রিয়</span>
                    </span>
                  ) : (
                    <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      সুইচ
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Create new demo user button */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন টেস্ট প্রোফাইল যোগ করুন</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                নতুন প্রোফাইল তৈরি:
              </span>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="আপনার নাম..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="ইউজারনেম যেমন: rafi_bd"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg shadow-sm"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
