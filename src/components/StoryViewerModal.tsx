import React, { useState, useEffect } from 'react';
import { X, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Story, User } from '../types';
import { formatTimeAgo, toBanglaNumber } from '../utils/format';

interface StoryViewerModalProps {
  story: Story | null;
  stories: Story[];
  currentUser: User;
  onClose: () => void;
  onDeleteStory: (storyId: string) => void;
  onViewStory: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  stories,
  currentUser,
  onClose,
  onDeleteStory,
  onViewStory
}) => {
  if (!story) return null;

  const currentIndex = stories.findIndex(s => s.id === story.id);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    onViewStory(story.id);
    setProgress(0);
  }, [story.id]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Advance to next story if available
          if (currentIndex < stories.length - 1) {
            onViewStory(stories[currentIndex + 1].id);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories, isPaused, onClose, onViewStory]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onViewStory(stories[currentIndex - 1].id);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      onViewStory(stories[currentIndex + 1].id);
    } else {
      onClose();
    }
  };

  const isOwnStory = story.authorId === currentUser.id || currentUser.role === 'admin';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md h-[85vh] max-h-[700px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background media or gradient */}
        {story.mediaUrl ? (
          <img
            src={story.mediaUrl}
            alt="Story"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${story.bgGradient || 'from-indigo-600 via-purple-600 to-pink-500'}`} />
        )}

        {/* Gradient dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 p-4">
          {/* Progress bar */}
          <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-white h-full transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/80"
              />
              <div>
                <h4 className="text-white font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>{story.authorName}</span>
                </h4>
                <div className="text-white/70 text-xs font-medium">
                  @{story.authorUsername} • {formatTimeAgo(story.time)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwnStory && (
                <button
                  onClick={() => {
                    if (confirm('এই স্টোরিটি ডিলিট করতে চান?')) {
                      onDeleteStory(story.id);
                      onClose();
                    }
                  }}
                  className="p-2 text-white/80 hover:text-rose-400 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-colors"
                  title="ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Text content in center */}
        {story.text && (
          <div className="relative z-10 p-6 my-auto text-center">
            <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-md leading-relaxed px-2">
              {story.text}
            </p>
          </div>
        )}

        {/* Left / Right click touch navigation zones */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Views summary */}
        <div className="relative z-10 p-4 flex items-center justify-between text-white/80 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur">
            <Eye className="w-3.5 h-3.5" />
            <span>{toBanglaNumber(story.views.length)} বার দেখা হয়েছে</span>
          </div>

          <div className="text-[11px] text-white/60">
            ধরে রাখুন থামানোর জন্য
          </div>
        </div>
      </div>
    </div>
  );
};
