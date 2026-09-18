import React, { useState } from 'react';
import { Tv, Play, Maximize2, RotateCcw, ExternalLink, Radio, Sparkles, CheckCircle2 } from 'lucide-react';

interface TVChannel {
  id: string;
  name: string;
  tagline: string;
  category: string;
  logo: string;
  embedUrl: string;
  color: string;
}

const TV_CHANNELS: TVChannel[] = [
  {
    id: 'somoy',
    name: 'সময় টিভি (Somoy News)',
    tagline: 'দেশের অন্যতম শীর্ষ ২৪ ঘণ্টার লাইভ সংবাদ ও বিশেষ প্রতিবেদন',
    category: 'লাইভ সংবাদ',
    logo: '🔴',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC82Xo3F31Xn77qJ_O-F-Ypg',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'jamuna',
    name: 'যমুনা টিভি (Jamuna TV)',
    tagline: 'ইনভেস্টিগেটিভ ও সাহসী সংবাদ পরিবেশনা • লাইভ ব্রডকাস্ট',
    category: 'তদন্তমূলক সংবাদ',
    logo: '📺',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCm8B_cI-rU5uA5n4r_dZc3Q',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'ekattor',
    name: 'একাত্তর টিভি (Ekattor TV)',
    tagline: 'সংবাদ বিশ্লেষণ, টক-শো একাত্তর জার্নাল ও সরাসরি খবর',
    category: 'টক-শো ও খবর',
    logo: '📡',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC7N1nBfK9Qp6T0a1wH2bJTw',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'dbc',
    name: 'ডিবিসি নিউজ (DBC News)',
    tagline: 'সর্বশেষ জাতীয় ও আন্তর্জাতিক রাজনৈতিক খবরের সরাসরি সম্প্রচার',
    category: 'লাইভ নিউজ',
    logo: '📽️',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC6nL2eWf3g0v82G0iY0Yv1A',
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'channel24',
    name: 'চ্যানেল ২৪ (Channel 24)',
    tagline: 'লাইভ বুলেটিন, স্পোর্টস ও বিনোদন জগতের টাটকা খবর',
    category: 'সংবাদ ও স্পোর্টস',
    logo: '✨',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC7t-1m2F6mDkLgR_4U3W4zA',
    color: 'from-purple-600 to-pink-700'
  }
];

export const LiveTVView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<TVChannel>(TV_CHANNELS[0]);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('tv-stream-screen');
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
              <Tv className="w-3.5 h-3.5" />
              <span>লাইভ টেলিভিশন স্ট্রিমিং</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              লাইভ বাংলা টিভি 📺
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              দেশের শীর্ষস্থানীয় সকল সংবাদ ও বিনোদন টিভি চ্যানেলগুলো সরাসরি দেখুন এক ক্লিকে এইচডি কোয়ালিটিতে।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold">লাইভ ২৪ ঘণ্টা সম্প্রচার</span>
          </div>
        </div>
      </div>

      {/* Main Video TV Stage */}
      <div 
        id="tv-stream-screen"
        className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* TV Header Toolbar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl">{activeChannel.logo}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base truncate">
                  {activeChannel.name}
                </h2>
                <span className="px-2 py-0.5 bg-red-600 text-[10px] font-extrabold rounded-full animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {activeChannel.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReload}
              title="স্ট্রিম রিলোড"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">রিলোড</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="ফুলস্ক্রিন দেখুন"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">ফুলস্ক্রিন</span>
            </button>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Video Frame */}
        <div className="relative w-full pb-[56.25%] bg-black">
          <iframe
            key={iframeKey}
            src={activeChannel.embedUrl}
            title={activeChannel.name}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>লাইভ স্ট্রিমিং চলমান: <strong>{activeChannel.name}</strong></span>
          </div>
          <span className="text-[11px] text-slate-500">
            ইউটিউব অফিসিয়াল লাইভ স্ট্রিম
          </span>
        </div>
      </div>

      {/* Channel Grid Selector */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Tv className="w-4 h-4 text-red-500" />
          <span>সকল লাইভ চ্যানেল নির্বাচন করুন ({TV_CHANNELS.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {TV_CHANNELS.map(ch => {
            const isSelected = activeChannel.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChannel(ch);
                  setIframeKey(k => k + 1);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-red-500 dark:border-red-600 scale-101 ring-1 ring-red-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-red-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ch.logo}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {ch.name}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {ch.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
                    LIVE
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] truncate max-w-[160px]">
                    {ch.tagline}
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isSelected ? 'চলছে' : 'দেখুন'}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
