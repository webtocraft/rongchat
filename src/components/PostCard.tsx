import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Pin, 
  Flag, 
  Check, 
  Send, 
  Repeat2, 
  Link as LinkIcon,
  X,
  Upload
} from 'lucide-react';
import { Post, User } from '../types';
import { formatTimeAgo, toBanglaNumber, readFileAsDataUrl } from '../utils/format';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onReact: (postId: string, emoji: string) => void;
  onComment: (postId: string, text: string) => void;
  onEdit: (postId: string, newText: string, newImage?: string) => void;
  onDelete: (postId: string) => void;
  onShare: (postId: string, caption?: string) => void;
  onReport: (postId: string, reason: string) => void;
  onPin?: (postId: string) => void;
  onNavigateProfile: (username: string) => void;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏'];

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onReact,
  onComment,
  onEdit,
  onDelete,
  onShare,
  onReport,
  onPin,
  onNavigateProfile
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCaption, setShareCaption] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [editImage, setEditImage] = useState<string | undefined>(post.image);

  const isAuthor = post.authorId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';

  // Calculate total reactions & if current user reacted
  const reactionsMap = post.reactions || {};
  let totalReactions = 0;
  let userReaction: string | null = null;
  const activeEmojis: { emoji: string; count: number }[] = [];

  Object.entries(reactionsMap).forEach(([emoji, rawIds]) => {
    const userIds = (rawIds as string[]) || [];
    if (userIds.length > 0) {
      totalReactions += userIds.length;
      activeEmojis.push({ emoji, count: userIds.length });
      if (userIds.includes(currentUser.id)) {
        userReaction = emoji;
      }
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleSaveEdit = () => {
    if (!editText.trim() && !editImage) return;
    onEdit(post.id, editText, editImage);
    setIsEditing(false);
  };

  const handleShareSubmit = () => {
    onShare(post.id, shareCaption || undefined);
    setShowShareModal(false);
    setShareCaption('');
  };

  const copyPostLink = () => {
    const url = `${window.location.origin}/#post-${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <article 
      id={`post-${post.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4 overflow-hidden transition-all hover:shadow-md"
    >
      {/* Pinned announcement header if pinned */}
      {post.isPinned && (
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 px-4 py-1.5 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Pin className="w-3.5 h-3.5" />
          <span>পিন করা পোস্ট</span>
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigateProfile(post.authorUsername)}
            className="cursor-pointer group flex-shrink-0"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span 
                onClick={() => onNavigateProfile(post.authorUsername)}
                className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {post.authorName}
              </span>
              <button
                onClick={() => onNavigateProfile(post.authorUsername)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                /@{post.authorUsername}
              </button>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>{formatTimeAgo(post.time)}</span>
              {post.updatedAt && <span>• (এডিটেড)</span>}
            </div>
          </div>
        </div>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptions && (
            <div 
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-20"
              onMouseLeave={() => setShowOptions(false)}
            >
              {isAuthor && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    <span>পোস্ট এডিট করুন</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('আপনি কি এই পোস্টটি মুছে ফেলতে চান?')) {
                        onDelete(post.id);
                      }
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>পোস্ট ডিলিট করুন</span>
                  </button>
                </>
              )}

              {isAdmin && !isAuthor && (
                <>
                  {onPin && (
                    <button
                      onClick={() => {
                        onPin(post.id);
                        setShowOptions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2"
                    >
                      <Pin className="w-4 h-4" />
                      <span>{post.isPinned ? 'আনপিন করুন' : 'পিন করুন'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('অ্যাডমিন হিসেবে এই পোস্টটি ডিলিট করতে চান?')) {
                        onDelete(post.id);
                      }
                      setShowOptions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>অ্যাডমিন ডিলিট</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  copyPostLink();
                  setShowOptions(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4 text-slate-500" />
                <span>লিংক কপি করুন</span>
              </button>

              {!isAuthor && (
                <button
                  onClick={() => {
                    const reason = prompt('রিপোর্টের কারণ লিখুন:', 'অনুপযুক্ত বিষয়বস্তু');
                    if (reason) onReport(post.id, reason);
                    setShowOptions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>রিপোর্ট করুন</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              rows={3}
            />
            {editImage && (
              <div className="relative max-h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={editImage} alt="Edit preview" className="w-full h-48 object-cover" />
                <button
                  onClick={() => setEditImage(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
              >
                আপডেট সংরক্ষণ করুন
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        )}
      </div>

      {/* Post Attached Image */}
      {!isEditing && post.image && (
        <div className="relative bg-slate-100 dark:bg-slate-950 max-h-[520px] overflow-hidden flex items-center justify-center">
          <img
            src={post.image}
            alt="Post media"
            className="w-full h-auto max-h-[520px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Shared Post Embed (re-share card) */}
      {post.sharedPost && (
        <div className="mx-4 mb-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={post.sharedPost.originalAuthorAvatar}
              alt={post.sharedPost.originalAuthorName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span 
                onClick={() => onNavigateProfile(post.sharedPost!.originalAuthorUsername)}
                className="font-bold text-xs text-slate-900 dark:text-slate-100 hover:underline cursor-pointer"
              >
                {post.sharedPost.originalAuthorName}
              </span>
              <span className="text-[11px] text-slate-400 block">
                @{post.sharedPost.originalAuthorUsername} • {formatTimeAgo(post.sharedPost.originalTime)}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {post.sharedPost.originalText}
          </p>
          {post.sharedPost.originalImage && (
            <img
              src={post.sharedPost.originalImage}
              alt="Shared original media"
              className="mt-2 rounded-lg max-h-60 w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Reactions & Comments summary bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {activeEmojis.length > 0 ? (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {activeEmojis.slice(0, 3).map(item => (
                  <span key={item.emoji} className="text-sm bg-white dark:bg-slate-800 rounded-full shadow-xs px-0.5">
                    {item.emoji}
                  </span>
                ))}
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                {toBanglaNumber(totalReactions)}
              </span>
            </div>
          ) : (
            <span>প্রথম রিঅ্যাক্ট দিন</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {toBanglaNumber(post.comments?.length || 0)} কমেন্ট
          </button>
          <span>•</span>
          <span>{toBanglaNumber(post.sharesCount || 0)} শেয়ার</span>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="px-2 py-1 flex items-center border-t border-slate-100 dark:border-slate-800 relative">
        {/* Reaction button with long hover/touch drawer */}
        <div className="relative flex-1">
          <button
            onClick={() => onReact(post.id, userReaction || '❤️')}
            onMouseEnter={() => setShowReactionPicker(true)}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors ${
              userReaction
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${userReaction ? 'fill-current' : ''}`} />
            <span>{userReaction ? `${userReaction} রিঅ্যাক্টেড` : 'লাইক'}</span>
          </button>

          {/* Reaction Picker Popover */}
          {showReactionPicker && (
            <div 
              className="absolute left-0 bottom-full mb-1.5 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 z-30 animate-in fade-in zoom-in duration-150"
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              {REACTION_EMOJIS.map(em => (
                <button
                  key={em}
                  onClick={() => {
                    onReact(post.id, em);
                    setShowReactionPicker(false);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-130 transition-transform"
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment toggle button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>কমেন্ট</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>শেয়ার</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Comment list */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span 
                        onClick={() => onNavigateProfile(c.authorUsername)}
                        className="font-bold text-xs text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
                      >
                        {c.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTimeAgo(c.time)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">
                এখনও কোনো কমেন্ট নেই। আপনার মতামত জানান!
              </p>
            )}
          </div>

          {/* Comment input form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center pt-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="একটি কমেন্ট লিখুন..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Repeat2 className="w-5 h-5 text-indigo-500" />
                <span>পোস্ট শেয়ার করুন</span>
              </h4>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                আপনার চিন্তা বা ক্যাপশন লিখুন (ঐচ্ছিক):
              </label>
              <textarea
                value={shareCaption}
                onChange={e => setShareCaption(e.target.value)}
                placeholder="এই পোস্ট সম্পর্কে কিছু বলুন..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Preview of original post */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">{post.authorName}</div>
              <p className="text-slate-600 dark:text-slate-400 truncate mt-1">{post.text}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={copyPostLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
                <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'লিংক কপি'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleShareSubmit}
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  ফিডে শেয়ার করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
