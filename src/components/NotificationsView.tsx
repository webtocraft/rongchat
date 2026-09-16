import React from 'react';
import { Bell, CheckCheck, MessageSquare, Heart, UserPlus, Megaphone, Share2, Sparkles } from 'lucide-react';
import { AppNotification, User } from '../types';
import { formatTimeAgo, toBanglaNumber } from '../utils/format';

interface NotificationsViewProps {
  notifications: AppNotification[];
  currentUser: User;
  onMarkAllRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onRequestPushPermission: () => void;
  hasPushPermission: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  currentUser,
  onMarkAllRead,
  onSelectNotification,
  onRequestPushPermission,
  hasPushPermission
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'comment':
      case 'message':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-sky-500" />;
      case 'share':
        return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-3xl mx-auto overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🔔 রিয়েল-টাইম নোটিফিকেশন</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                {toBanglaNumber(unreadCount)} নতুন
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            আপনার অ্যাকাউন্টের সকল লাইক, কমেন্ট, ফলো ও বার্তার সরাসরি আপডেট।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!hasPushPermission && (
            <button
              onClick={onRequestPushPermission}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors"
            >
              🔔 পুশ নোটিফিকেশন চালু করুন
            </button>
          )}

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>সব পড়া হয়েছে</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              এখনও কোনো নোটিফিকেশন নেই!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              কেউ আপনার পোস্টে রিঅ্যাক্ট দিলে বা ইনবক্সে মেসেজ করলে এখানে রিয়েল-টাইমে দেখতে পাবেন।
            </p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onSelectNotification(n)}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !n.read
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 hover:bg-indigo-50/70'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={n.actorAvatar}
                  alt={n.actorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full shadow-xs">
                  {getIcon(n.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {formatTimeAgo(n.time)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {n.content}
                </p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
