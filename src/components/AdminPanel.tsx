import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  MessageSquare, 
  Flag, 
  Megaphone, 
  Trash2, 
  Pin, 
  CheckCircle, 
  Ban, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { User, Post, ReportItem, AppSettings } from '../types';
import { toBanglaNumber, formatTimeAgo } from '../utils/format';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  reports: ReportItem[];
  settings: AppSettings;
  onSetAnnouncement: (text: string) => void;
  onToggleVerifyUser: (userId: string) => void;
  onToggleBanUser: (userId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onResolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  onResetDemoData: () => void;
  onNavigateProfile: (username: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  users,
  posts,
  reports,
  settings,
  onSetAnnouncement,
  onToggleVerifyUser,
  onToggleBanUser,
  onTogglePinPost,
  onDeletePost,
  onResolveReport,
  onResetDemoData,
  onNavigateProfile
}) => {
  const [announcementText, setAnnouncementText] = useState(settings.announcement || '');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'users' | 'posts' | 'reports'>('overview');
  const [savedAnnouncementToast, setSavedAnnouncementToast] = useState(false);

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAnnouncement(announcementText);
    setSavedAnnouncementToast(true);
    setTimeout(() => setSavedAnnouncementToast(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-7 h-7" />
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              অ্যাডমিন ও মডারেশন প্যানেল
            </h2>
          </div>
          <p className="text-white/80 text-xs sm:text-sm">
            প্ল্যাটফর্ম পরিচালনা, নিরাপত্তা নিয়মাবলী, ঘোষণা সম্প্রচার ও ব্যবহারকারী নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('ডেমো ডেটা রিসেট করতে চান? সব ডেটা ফ্রেশ প্রাথমিক অবস্থায় ফিরে যাবে।')) {
              onResetDemoData();
            }
          }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold backdrop-blur flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>ডেমো ডেটা রিসেট</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">মোট ব্যবহারকারী</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {toBanglaNumber(users.length)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">মোট পোস্ট</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {toBanglaNumber(posts.length)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">অনলাইন সদস্য</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {toBanglaNumber(users.filter(u => u.online).length)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">পেন্ডিং রিপোর্ট</span>
            <Flag className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {toBanglaNumber(reports.filter(r => r.status === 'pending').length)}
          </span>
        </div>
      </div>

      {/* Global Announcement Broadcaster */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            সিস্টেম-ওয়াইড ঘোষণা সম্প্রচার (Announcement Banner)
          </h3>
        </div>

        <form onSubmit={handleUpdateAnnouncement} className="space-y-3">
          <textarea
            value={announcementText}
            onChange={e => setAnnouncementText(e.target.value)}
            rows={2}
            placeholder="এখানে যে বার্তা লিখবেন তা সকল ইউজারের ফিডের শীর্ষে হলুদ এনাউন্সমেন্ট বক্সে দেখাবে..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />

          <div className="flex items-center justify-between">
            {savedAnnouncementToast ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>ঘোষণা সফলভাবে আপডেট করা হয়েছে!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                খালি রাখলে ব্যানারটি প্রদর্শিত হবে না।
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              ঘোষণা প্রকাশ করুন
            </button>
          </div>
        </form>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === 'overview' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          ব্যবহারকারী ব্যবস্থাপনা
        </button>
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === 'posts' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          পোস্ট মডারেশন
        </button>
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeSubTab === 'reports' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          ইউজার রিপোর্ট ({toBanglaNumber(reports.length)})
        </button>
      </div>

      {/* User Management Subtab */}
      {activeSubTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100">
            নিবন্ধিত ইউজার তালিকা ও অ্যাকশন
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(u => (
              <div key={u.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onNavigateProfile(u.username)}
                >
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600">
                        {u.name}
                      </span>
                      {u.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                      {u.role === 'admin' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded font-bold">
                          Admin
                        </span>
                      )}
                      {u.isBanned && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-900 text-white rounded font-bold">
                          নিষিদ্ধ (Banned)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      /@{u.username} • {u.location || 'বাংলাদেশ'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleVerifyUser(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      u.isVerified
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    {u.isVerified ? 'ভেরিফাইড ব্যাজ সরানো' : 'ভেরিফাই ব্যাজ দিন'}
                  </button>

                  {u.id !== currentUser.id && (
                    <button
                      onClick={() => onToggleBanUser(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        u.isBanned
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      {u.isBanned ? 'আন-ব্যান' : 'ব্যান করুন'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Moderation Subtab */}
      {activeSubTab === 'posts' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100">
            পোস্টসমূহ পর্যালোচনা ও নিয়ন্ত্রণ
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {posts.map(p => (
              <div key={p.id} className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{p.authorName}</span>
                    <span className="text-[11px] text-slate-400">@{p.authorUsername}</span>
                    <span className="text-[10px] text-slate-400">• {formatTimeAgo(p.time)}</span>
                    {p.isPinned && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">
                        পিন্ড
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                    {p.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onTogglePinPost(p.id)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl"
                    title={p.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('অ্যাডমিন হিসেবে এই পোস্টটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
                        onDeletePost(p.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl"
                    title="পোস্ট মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Subtab */}
      {activeSubTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100">
            ব্যবহারকারীদের জমা দেওয়া রিপোর্ট
          </div>

          {reports.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-semibold text-xs">
              কোনো ব্যবহারকারী রিপোর্ট এখনও জমা পড়েনি। প্ল্যাটফর্ম নিরাপদ আছে। ✨
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map(r => (
                <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-rose-600 mb-0.5">
                      কারণ: {r.reason}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      রিপোর্টার: {r.reporterName} • পোস্ট আইডি: {r.postId} • {formatTimeAgo(r.time)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onResolveReport(r.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold rounded-xl"
                    >
                      সমাধান (Resolve)
                    </button>
                    <button
                      onClick={() => onResolveReport(r.id, 'dismissed')}
                      className="px-3 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold rounded-xl"
                    >
                      বাতিল (Dismiss)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
