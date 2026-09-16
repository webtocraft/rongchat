import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onOpenCreateStory: () => void;
  onSelectStory: (story: Story) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenCreateStory,
  onSelectStory
}) => {
  // Group stories by author or display unique latest story per user
  const uniqueAuthorStories = stories.reduce((acc: Story[], story) => {
    if (!acc.some(s => s.authorId === story.authorId)) {
      acc.push(story);
    }
    return acc;
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {/* Add Story Card */}
        <div 
          id="add-story-btn"
          onClick={onOpenCreateStory}
          className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-0.5 flex items-center justify-center border-2 border-dashed border-indigo-400/80 group-hover:border-indigo-600 transition-colors">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full rounded-[14px] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate max-w-[68px]">
            আপনার স্টোরি
          </span>
        </div>

        {/* Stories from community */}
        {uniqueAuthorStories.map((story) => {
          const isViewed = story.views.includes(currentUser.id);
          const isMe = story.authorId === currentUser.id;

          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div 
                className={`w-16 h-16 rounded-2xl p-0.5 transition-transform group-hover:scale-105 ${
                  isViewed
                    ? 'ring-2 ring-slate-300 dark:ring-slate-700'
                    : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm shadow-purple-500/20'
                }`}
              >
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 p-0.5 overflow-hidden">
                  {story.mediaUrl ? (
                    <img
                      src={story.mediaUrl}
                      alt={story.authorName}
                      className="w-full h-full object-cover rounded-[12px]"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-[12px] bg-gradient-to-tr ${story.bgGradient || 'from-indigo-600 to-pink-500'} flex items-center justify-center text-[10px] text-white font-bold p-1 text-center`}>
                      ✨
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate max-w-[68px]">
                {isMe ? 'আমার স্টোরি' : story.authorName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
