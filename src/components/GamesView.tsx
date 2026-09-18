import React, { useState } from 'react';
import { Gamepad2, Maximize2, RotateCcw, Sparkles, ExternalLink, Play, Trophy, Shield, Flame } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  embedUrl: string;
  icon: string;
  author: string;
}

const HTML5_GAMES: GameItem[] = [
  {
    id: '2048',
    title: '2048 পাজল',
    category: 'পাজল ও ব্রেইন গেম',
    description: 'সংখ্যার ব্লকগুলোকে মিলিয়ে ২০৪৮ স্কোর অর্জনের জনপ্রিয় ক্লাসিক চ্যালেঞ্জ!',
    embedUrl: 'https://play2048.co/',
    icon: '🔢',
    author: 'Gabriele Cirulli'
  },
  {
    id: 'hextris',
    title: 'হেক্সট্রিস (Hextris)',
    category: 'আর্কেড ও রিফ্লেক্স',
    description: 'ষড়ভুজাকৃতি দ্রুতগতির রঙ মেলানোর আকর্ষণীয় HTML5 গেম।',
    embedUrl: 'https://hextris.io/',
    icon: '💠',
    author: 'Logan & Garrett'
  },
  {
    id: 'clumsy_bird',
    title: 'ক্ল্যামজি বার্ড (Flappy Bird)',
    category: 'ফ্লাইং আর্কেড',
    description: 'বাধা এড়িয়ে পাখিকে নিরাপদে উড়ানোর রোমাঞ্চকর HTML5 অ্যাডভেঞ্চার!',
    embedUrl: 'https://ellisonleao.github.io/clumsy-bird/',
    icon: '🐥',
    author: 'Ellison Leao'
  },
  {
    id: 'snake',
    title: 'রেট্রো স্নেক (Retro Snake)',
    category: 'ক্লাসিক নস্টালজিয়া',
    description: 'সাপের ক্লাসিক খাবার খাওয়া ও সর্বোচ্চ দৈর্ঘ্য তৈরির নস্টালজিক গেম।',
    embedUrl: 'https://playsnake.org/',
    icon: '🐍',
    author: 'Classic Arcade'
  },
  {
    id: 'pacman',
    title: 'প্যাকম্যান রেট্রো (Pacman)',
    category: 'ক্লাসিক আর্কেড',
    description: 'ভুতুড়ে বাধা এড়িয়ে ডট খাওয়ার অল-টাইম ফেভারিট আর্কেড মাস্টারপিস।',
    embedUrl: 'https://freepacman.org/',
    icon: '🟡',
    author: 'Namco Classic'
  }
];

export const GamesView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameItem>(HTML5_GAMES[0]);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleReloadGame = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('game-embed-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Games Zone Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>HTML5 গেমিং জোন</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              অনলাইন গেমস প্লে জোন 🎮
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              সরাসরি ব্রাউজারে খেলুন আকর্ষণীয় ফ্রি HTML5 গেমস — কোনো ইন্সটল ছাড়াই ইনস্ট্যান্ট প্লে ও ফুলস্ক্রিন আনন্দ!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15">
            <Trophy className="w-5 h-5 text-amber-300 animate-bounce" />
            <div className="text-left text-xs">
              <span className="block font-bold">৫টি জনপ্রিয় গেম</span>
              <span className="text-[11px] text-indigo-100">সম্পূর্ণ ফ্রি ও আনলিমিটেড</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {HTML5_GAMES.map(game => {
          const isSelected = activeGame.id === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                setActiveGame(game);
                setIsLoading(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 shadow-xs ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-102'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              <span className="text-base">{game.icon}</span>
              <span>{game.title}</span>
            </button>
          );
        })}
      </div>

      {/* Game Stage Area */}
      <div 
        id="game-embed-container"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden flex flex-col"
      >
        {/* Game Stage Control Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl">{activeGame.icon}</span>
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                {activeGame.title}
              </h2>
              <span className="text-[11px] text-slate-500 truncate block">
                {activeGame.category} • নির্মাতা: {activeGame.author}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleReloadGame}
              title="গেম রিলোড করুন"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">রিলোড</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="ফুলস্ক্রিন মোড"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">ফুলস্ক্রিন</span>
            </button>

            <a
              href={activeGame.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="নতুন ট্যাবে খেলুন"
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন ট্যাব</span>
            </a>
          </div>
        </div>

        {/* Embedded Game Iframe */}
        <div className="relative w-full h-[520px] sm:h-[620px] bg-slate-950 flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-300 animate-pulse">
                {activeGame.title} লোড হচ্ছে... অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন
              </p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={activeGame.embedUrl}
            title={activeGame.title}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 rounded-b-2xl"
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          />
        </div>

        {/* Game instructions footer */}
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <p className="line-clamp-1">
            💡 টিপস: {activeGame.description}
          </p>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
            ১০০% নিরাপদ HTML5
          </span>
        </div>
      </div>
    </div>
  );
};
