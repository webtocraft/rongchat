import React from 'react';
import { 
  Home, 
  MessageSquare, 
  MessagesSquare, 
  Bell, 
  Search, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Users, 
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { User, AppNotification } from '../types';
import { toBanglaNumber } from '../utils/format';

interface NavbarProps {
  currentUser: User;
  activeTab: 'feed' | 'global_chat' | 'inbox' | 'profile' | 'admin' | 'notifications';
  setActiveTab: (tab: 'feed' | 'global_chat' | 'inbox' | 'profile' | 'admin' | 'notifications') => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenSearch: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateStory: () => void;
  onOpenSwitchAccount: () => void;
  onNavigateProfile: (username: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenSearch,
  onOpenCreatePost,
  onOpenCreateStory,
  onOpenSwitchAccount,
  onNavigateProfile,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            id="nav-brand-logo"
            onClick={() => {
              setActiveTab('feed');
              window.location.hash = '';
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              🌈
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Rong Social
              </span>
              <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                সুপারফাস্ট • ইনস্ট্যান্ট
              </span>
            </div>
          </button>
        </div>

        {/* Instant Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-1 sm:mx-4">
          <button
            id="search-trigger-btn"
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700/60 transition-all text-left group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="truncate">খুঁজুন (যেমন: @{currentUser.username}, মানুষ বা পোস্ট)...</span>
            <kbd className="hidden md:inline-flex ml-auto text-[10px] uppercase font-semibold px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center/Right Nav Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Feed Button */}
          <button
            id="nav-home-feed-btn"
            onClick={() => {
              setActiveTab('feed');
              window.location.hash = '';
            }}
            title="হোম ফিড"
            className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 font-medium text-sm transition-all ${
              activeTab === 'feed'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="hidden lg:inline">ফিড</span>
          </button>

          {/* Global Chat Tab */}
          <button
            id="nav-global-chat-btn"
            onClick={() => {
              setActiveTab('global_chat');
              window.location.hash = '#global-chat';
            }}
            title="গ্লোবাল কমিউনিটি চ্যাট"
            className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 font-medium text-sm transition-all ${
              activeTab === 'global_chat'
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden lg:inline">গ্লোবাল চ্যাট</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" title="লাইভ অনলাইন" />
          </button>

          {/* Inbox Tab (Private messages with unread badge counter) */}
          <button
            id="nav-inbox-btn"
            onClick={() => {
              setActiveTab('inbox');
              window.location.hash = '#inbox';
            }}
            title="প্রাইভেট ইনবক্স"
            className={`relative p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 font-medium text-sm transition-all ${
              activeTab === 'inbox'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessagesSquare className="w-5 h-5" />
            <span className="hidden lg:inline">ইনবক্স</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:top-1 sm:right-1.5 min-w-5 h-5 px-1 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {toBanglaNumber(unreadMessagesCount)}
              </span>
            )}
          </button>

          {/* Notifications Tab with badge */}
          <button
            id="nav-notifications-btn"
            onClick={() => {
              setActiveTab('notifications');
            }}
            title="নোটিফিকেশন"
            className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
              activeTab === 'notifications'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : ''
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {toBanglaNumber(unreadNotificationsCount)}
              </span>
            )}
          </button>

          {/* Admin Panel (visible or highlighted for admin) */}
          {currentUser.role === 'admin' && (
            <button
              id="nav-admin-btn"
              onClick={() => {
                setActiveTab('admin');
                window.location.hash = '#admin';
              }}
              title="এডমিন প্যানেল"
              className={`p-2 rounded-xl flex items-center gap-1 font-semibold text-xs transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/40'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="hidden xl:inline">এডমিন</span>
            </button>
          )}

          {/* Create Post Quick Button */}
          <button
            id="nav-create-post-btn"
            onClick={onOpenCreatePost}
            title="নতুন পোস্ট করুন"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>পোস্ট</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="nav-theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Account Switcher Demo Modal Trigger */}
          <button
            id="nav-switch-account-btn"
            onClick={onOpenSwitchAccount}
            title="আইডি পরিবর্তন / অন্য প্রোফাইলে সুইচ করুন"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden sm:flex items-center"
          >
            <Users className="w-5 h-5 text-indigo-500" />
          </button>

          {/* User Profile avatar pill */}
          <button
            id="nav-user-profile-pill"
            onClick={() => onNavigateProfile(currentUser.username)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-700"
            title={`প্রোফাইল: /#${currentUser.username}`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[90px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                @{currentUser.username}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
