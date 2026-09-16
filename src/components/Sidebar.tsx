import React from 'react';
import { 
  Home, 
  MessageSquare, 
  MessagesSquare, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  Settings, 
  Users, 
  Sparkles,
  Search,
  LogOut,
  Bookmark,
  Share2
} from 'lucide-react';
import { User } from '../types';
import { toBanglaNumber } from '../utils/format';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenSwitchAccount: () => void;
  onNavigateProfile: (username: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenSearch,
  onOpenSettings,
  onOpenSwitchAccount,
  onNavigateProfile
}) => {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
      {/* User Mini Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => onNavigateProfile(currentUser.username)}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            {currentUser.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900" title="ভেরিফাইড অ্যাকাউন্ট">
                ✓
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              onClick={() => onNavigateProfile(currentUser.username)}
              className="font-bold text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {currentUser.name}
            </h3>
            <button
              onClick={() => onNavigateProfile(currentUser.username)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block truncate"
            >
              /@{currentUser.username}
            </button>
          </div>
        </div>

        {/* Quick Follower Counts */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2">
            <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">
              {toBanglaNumber(currentUser.followers.length)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">ফলোয়ার</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2">
            <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">
              {toBanglaNumber(currentUser.following.length)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">ফলো করছেন</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-1">
        <button
          id="sidebar-feed-btn"
          onClick={() => {
            setActiveTab('feed');
            window.location.hash = '';
          }}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'feed'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home className="w-5 h-5 text-indigo-500" />
          <span>হোম ফিড</span>
        </button>

        <button
          id="sidebar-global-chat-btn"
          onClick={() => {
            setActiveTab('global_chat');
            window.location.hash = '#global-chat';
          }}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'global_chat'
              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span>গ্লোবাল চ্যাট</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>

        <button
          id="sidebar-inbox-btn"
          onClick={() => {
            setActiveTab('inbox');
            window.location.hash = '#inbox';
          }}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'inbox'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessagesSquare className="w-5 h-5 text-indigo-500" />
            <span>ইনবক্স (মেসেজ)</span>
          </div>
          {unreadMessagesCount > 0 && (
            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
              {toBanglaNumber(unreadMessagesCount)}
            </span>
          )}
        </button>

        <button
          id="sidebar-profile-btn"
          onClick={() => onNavigateProfile(currentUser.username)}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserIcon className="w-5 h-5 text-sky-500" />
          <span>আমার প্রোফাইল (/{currentUser.username})</span>
        </button>

        <button
          id="sidebar-notifications-btn"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'notifications'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>নোটিফিকেশন</span>
          </div>
          {unreadNotificationsCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
              {toBanglaNumber(unreadNotificationsCount)}
            </span>
          )}
        </button>

        <button
          id="sidebar-search-btn"
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Search className="w-5 h-5 text-emerald-500" />
          <span>প্রোফাইল ও পোস্ট সার্চ</span>
        </button>

        {/* Admin Link */}
        {currentUser.role === 'admin' && (
          <button
            id="sidebar-admin-btn"
            onClick={() => {
              setActiveTab('admin');
              window.location.hash = '#admin';
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/40'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <span>এডমিন প্যানেল 🛡️</span>
          </button>
        )}

        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

        <button
          id="sidebar-switch-btn"
          onClick={onOpenSwitchAccount}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Users className="w-5 h-5 text-purple-500" />
          <span>ইউজার পরিবর্তন (ডেমো টেস্ট)</span>
        </button>

        <button
          id="sidebar-settings-btn"
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Settings className="w-5 h-5 text-slate-500" />
          <span>সেটিংস ও পুশ অ্যালার্ট</span>
        </button>
      </div>
    </aside>
  );
};
