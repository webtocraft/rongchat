import React from 'react';
import { User } from '../types';
import { MessageSquare, UserCheck, Sparkles, Megaphone } from 'lucide-react';

interface RightSidebarProps {
  users: User[];
  currentUser: User;
  announcement?: string;
  announcementActive?: boolean;
  onSelectChatUser: (targetUser: User) => void;
  onNavigateProfile: (username: string) => void;
  onToggleFollow: (userId: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  users,
  currentUser,
  announcement,
  announcementActive,
  onSelectChatUser,
  onNavigateProfile,
  onToggleFollow
}) => {
  const onlineUsers = users.filter(u => u.online && u.id !== currentUser.id);
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
      {/* Announcement Box if active */}
      {announcementActive && announcement && (
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-300/60 dark:border-amber-700/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Megaphone className="w-4 h-4" />
            <span>অ্যাডমিন ঘোষণা</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {announcement}
          </p>
        </div>
      )}

      {/* Online Users List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>এখন অনলাইনে ({onlineUsers.length + 1})</span>
          </h4>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            সক্রিয়
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Always show current user first */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  আপনি (অনলাইন)
                </div>
              </div>
            </div>
          </div>

          {onlineUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <div 
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                onClick={() => onNavigateProfile(user.username)}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    /@{user.username}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectChatUser(user)}
                title="মেসেজ পাঠান"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          ))}

          {onlineUsers.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              অন্যান্য সদস্যরা অফলাইনে আছেন।
            </p>
          )}
        </div>
      </div>

      {/* Suggested / All Members to Connect */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>কমিউনিটি সদস্য</span>
        </h4>

        <div className="space-y-3">
          {otherUsers.map(user => {
            const isFollowing = currentUser.following.includes(user.id);
            return (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <div 
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                  onClick={() => onNavigateProfile(user.username)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate hover:text-indigo-600">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {user.profession || `@${user.username}`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow(user.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20'
                  }`}
                >
                  {isFollowing ? 'ফলোয়িং' : 'ফলো'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
