import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User as UserIcon, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { User, Post } from '../types';
import { formatTimeAgo } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  posts: Post[];
  onNavigateProfile: (username: string) => void;
  onSelectPost: (postId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  users,
  posts,
  onNavigateProfile,
  onSelectPost
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().replace(/^[@#]/, '').trim();

  const matchedUsers = cleanQuery ? users.filter(u => 
    u.name.toLowerCase().includes(cleanQuery) ||
    u.username.toLowerCase().includes(cleanQuery) ||
    (u.profession && u.profession.toLowerCase().includes(cleanQuery)) ||
    (u.location && u.location.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedPosts = cleanQuery ? posts.filter(p =>
    p.text.toLowerCase().includes(cleanQuery) ||
    p.authorName.toLowerCase().includes(cleanQuery) ||
    p.authorUsername.toLowerCase().includes(cleanQuery)
  ) : [];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="প্রোফাইল খুঁজুন (@shakib_dev, নাম, পেশা) অথবা পোস্ট..."
            className="flex-1 bg-transparent border-none text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="p-8 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                শক্তিশালী ইনস্ট্যান্ট সার্চ
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                যেকোনো ইউজারের নাম, হ্যান্ডেল (@username), বা পোস্টের বিষয়বস্তু লিখে অনুসন্ধান করুন।
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['@admin', '@shakib_dev', '@fatima_art', 'বাংলাদেশ', 'কোডিং'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold rounded-full text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Users section */}
              {matchedUsers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>ইউজার ও প্রোফাইল ({matchedUsers.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {matchedUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          onNavigateProfile(user.username);
                          onClose();
                        }}
                        className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                              <span>{user.name}</span>
                              {user.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                            </div>
                            <div className="text-xs text-slate-400">
                              /@{user.username} {user.profession ? `• ${user.profession}` : ''}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts section */}
              {matchedPosts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>পোস্টসমূহ ({matchedPosts.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {matchedPosts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => {
                          onSelectPost(post.id);
                          onClose();
                        }}
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{post.authorName}</span>
                          <span>{formatTimeAgo(post.time)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                          {post.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedUsers.length === 0 && matchedPosts.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm font-semibold">"{query}" এর সাথে মিল রেখে কোনো ফলাফল পাওয়া যায়নি।</p>
                  <p className="text-xs text-slate-400 mt-1">ভিন্ন কোনো শব্দ বা হ্যান্ডেল দিয়ে চেষ্টা করুন।</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
