import React, { useState } from 'react';
import { X, UserPlus, UserCheck, Heart, Users } from 'lucide-react';
import { User } from '../types';

interface ReactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactions: Record<string, string[]>;
  users: User[];
  currentUser: User;
  onToggleFollow?: (userId: string) => void;
  onNavigateProfile: (username: string) => void;
}

export const ReactionsModal: React.FC<ReactionsModalProps> = ({
  isOpen,
  onClose,
  reactions,
  users,
  currentUser,
  onToggleFollow,
  onNavigateProfile,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Flatten all reactions: array of { user: User, emoji: string }
  const allReactions: { user: User; emoji: string }[] = [];
  const emojiCounts: Record<string, number> = {};

  Object.entries(reactions || {}).forEach(([emoji, userIds]) => {
    const ids = Array.isArray(userIds) ? userIds : [];
    if (ids.length > 0) {
      emojiCounts[emoji] = ids.length;
      ids.forEach(uid => {
        let u = users.find(x => x.id === uid);
        if (!u) {
          // If currentUser reacted
          if (currentUser.id === uid) {
            u = currentUser;
          } else {
            // Fallback user representation
            u = {
              id: uid,
              username: uid.replace(/^u_/, ''),
              name: uid.replace(/^u_/, ''),
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
              bio: '',
              role: 'user',
              followers: [],
              following: [],
              online: false,
              createdAt: new Date().toISOString()
            };
          }
        }
        allReactions.push({ user: u, emoji });
      });
    }
  });

  const totalCount = allReactions.length;

  const filteredReactions = activeFilter === 'all'
    ? allReactions
    : allReactions.filter(r => r.emoji === activeFilter);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                পোস্টে প্রতিক্রিয়া
              </h3>
              <p className="text-[11px] text-slate-500">
                মোট {totalCount} জন রিঅ্যাক্ট করেছেন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reaction filter tabs */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-850/50 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 shrink-0 ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>সকল</span>
            <span className="text-[10px] opacity-80">({totalCount})</span>
          </button>

          {Object.entries(emojiCounts).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => setActiveFilter(emoji)}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 shrink-0 ${
                activeFilter === emoji
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span>{emoji}</span>
              <span className="text-[10px] opacity-80">{count}</span>
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredReactions.length > 0 ? (
            filteredReactions.map(({ user, emoji }, idx) => {
              const isMe = user.id === currentUser.id;
              const isFollowing = currentUser.following.includes(user.id);

              return (
                <div 
                  key={`${user.id}-${emoji}-${idx}`}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-2.5"
                >
                  <div 
                    onClick={() => {
                      onNavigateProfile(user.username);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 group"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-slate-800 rounded-full shadow-xs px-0.5 leading-none">
                        {emoji}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">
                          {user.name}
                        </span>
                        {user.role === 'admin' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded-full">
                            অ্যাডমিন
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        @{user.username} {user.profession ? `• ${user.profession}` : ''}
                      </p>
                    </div>
                  </div>

                  {!isMe && onToggleFollow && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollow(user.id);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
                        isFollowing
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>ফলোয়িং</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span>ফলো</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              কোনো প্রতিক্রিয়া পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
