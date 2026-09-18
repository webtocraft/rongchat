import React, { useState } from 'react';
import { 
  MapPin, 
  Briefcase, 
  Globe, 
  Calendar, 
  Edit3, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  Share2, 
  Grid, 
  Image as ImageIcon,
  Sparkles,
  Check
} from 'lucide-react';
import { User, Post } from '../types';
import { PostCard } from './PostCard';
import { toBanglaNumber } from '../utils/format';
import { db } from '../services/storage';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  userPosts: Post[];
  onToggleFollow: (userId: string) => void;
  onOpenEditProfile: () => void;
  onSelectChatUser: (user: User) => void;
  onReactPost: (postId: string, emoji: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onEditPost: (postId: string, newText: string, newImage?: string) => void;
  onDeletePost: (postId: string) => void;
  onSharePost: (postId: string, caption?: string) => void;
  onReportPost: (postId: string, reason: string) => void;
  onNavigateProfile: (username: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  userPosts,
  onToggleFollow,
  onOpenEditProfile,
  onSelectChatUser,
  onReactPost,
  onCommentPost,
  onEditPost,
  onDeletePost,
  onSharePost,
  onReportPost,
  onNavigateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
  const [copiedLink, setCopiedLink] = useState(false);

  const isMe = user.id === currentUser.id;
  const isFollowing = currentUser.following.includes(user.id);

  const mediaPosts = userPosts.filter(p => p.image);

  const handleShareProfile = () => {
    const url = `${window.location.origin}/#${user.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Profile Card with Cover & Avatar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-64 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
          {user.coverPhoto && (
            <img
              src={user.coverPhoto}
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Info Header */}
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 sm:w-36 h-28 sm:h-36 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
              />
              {user.isVerified && (
                <span className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs ring-2 ring-white dark:ring-slate-900 font-bold" title="ভেরিফাইড প্রোফাইল">
                  ✓
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {isMe ? (
                <button
                  id="profile-edit-btn"
                  onClick={onOpenEditProfile}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-all active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>প্রোফাইল এডিট করুন</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onToggleFollow(user.id)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-sm ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>ফলোয়িং</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>ফলো করুন</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectChatUser(user)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-2xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>মেসেজ পাঠান</span>
                  </button>
                </>
              )}

              {/* Share profile handle link */}
              <button
                onClick={handleShareProfile}
                title="প্রোফাইল হ্যান্ডেল লিংক কপি করুন"
                className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Names & Handle */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-full border border-rose-200 dark:border-rose-900/60">
                  অ্যাডমিন
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              /@{user.username}
              <span className="text-xs text-slate-400 font-normal ml-2">
                (হ্যান্ডেল লিঙ্ক: /#{user.username})
              </span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl whitespace-pre-wrap">
              {user.bio}
            </p>
          )}

          {/* User Details Grid */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {user.profession && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>{user.profession}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:underline text-sky-600 dark:text-sky-400 truncate max-w-[200px]"
                >
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>যুক্ত হয়েছেন {new Date(user.createdAt).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Numerical Stats */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {toBanglaNumber(userPosts.length)}
              </span>
              <span className="text-xs text-slate-500">পোস্ট</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {toBanglaNumber(db.getFollowersCount(user.id))}
              </span>
              <span className="text-xs text-slate-500">ফলোয়ার</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {toBanglaNumber(db.getFollowingCount(user.id))}
              </span>
              <span className="text-xs text-slate-500">ফলো করছেন</span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>সকল পোস্ট ({toBanglaNumber(userPosts.length)})</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'media'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ছবি ও মিডিয়া ({toBanglaNumber(mediaPosts.length)})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onReact={onReactPost}
                onComment={onCommentPost}
                onEdit={onEditPost}
                onDelete={onDeletePost}
                onShare={onSharePost}
                onReport={onReportPost}
                onNavigateProfile={onNavigateProfile}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-slate-500 font-semibold text-sm">এই ব্যবহারকারী এখনও কোনো পোস্ট করেননি।</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaPosts.length > 0 ? (
            mediaPosts.map(post => (
              <div
                key={post.id}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
                onClick={() => {
                  setActiveTab('posts');
                  const el = document.getElementById(`post-${post.id}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img
                  src={post.image}
                  alt="User media"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold p-2 text-center">
                  <span>{post.text.slice(0, 30)}...</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-slate-500 font-semibold text-sm">কোনো ছবি আপলোড করা হয়নি।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
