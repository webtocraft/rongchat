import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, RadioReceiver, Sparkles, ExternalLink, Activity } from 'lucide-react';

interface RadioStation {
  id: string;
  name: string;
  tagline: string;
  frequency: string;
  streamUrl: string;
  logo: string;
  category: string;
  badgeColor: string;
}

const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'foorti',
    name: 'রেডিও ফুর্তি (Radio Foorti)',
    tagline: 'ঢাকার সর্বোচ্চ জনপ্রিয় এফএম রেডিও স্টেশন • নন-স্টপ মিউজিক',
    frequency: '88.0 FM',
    streamUrl: 'https://stream.zeno.fm/4gq3h02a8p8uv',
    logo: '📻',
    category: 'মিউজিক ও এন্টারটেইনমেন্ট',
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'dhakafm',
    name: 'ঢাকা এফএম (Dhaka FM)',
    tagline: '২৪ ঘণ্টা গান, সংবাদ ও বিনোদনমূলক টক-শো',
    frequency: '90.4 FM',
    streamUrl: 'https://stream.zeno.fm/9qszq7dhy08uv',
    logo: '🎧',
    category: 'টক-শো ও গান',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'today',
    name: 'রেডিও টুডে (Radio Today)',
    tagline: 'লাইভ সংবাদ বুলেটিন, ট্রাফিক আপডেট ও ক্লাসিক বাংলা গান',
    frequency: '89.6 FM',
    streamUrl: 'https://stream.zeno.fm/7x4802g2738uv',
    logo: '🎙️',
    category: 'সংবাদ ও তথ্য',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'quran',
    name: 'কুরআন বাংলা রেডিও (Quran Bangla)',
    tagline: 'পবিত্র কুরআন তিলাওয়াত ও বিশুদ্ধ বাংলা ভাবানুবাদ',
    frequency: 'অনলাইন লাইভ',
    streamUrl: 'https://stream.zeno.fm/k2d4hyqby08uv',
    logo: '📖',
    category: 'ইসলামিক ও কুরআন',
    badgeColor: 'bg-teal-500'
  },
  {
    id: 'jago',
    name: 'জাগো এফএম (Jago FM)',
    tagline: 'তরুণ প্রজন্মের প্রিয় রেডিও মিউজিক ও লাইভ আড্ডা',
    frequency: '94.4 FM',
    streamUrl: 'https://stream.zeno.fm/4m6t2k2w3zquv',
    logo: '🎵',
    category: 'ইউথ ও পপ মিউজিক',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'bbc',
    name: 'বিবিসি বাংলা (BBC Bangla)',
    tagline: 'আন্তর্জাতিক সংবাদ, বিশ্লেষণ ও প্রভাতী পরিক্রমা',
    frequency: 'আন্তর্জাতিক',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_bangla',
    logo: '🌍',
    category: 'আন্তর্জাতিক সংবাদ',
    badgeColor: 'bg-red-600'
  }
];

export const LiveRadioView: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSelectStation = (station: RadioStation) => {
    setHasError(false);
    setCurrentStation(station);
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasError(false);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src !== currentStation.streamUrl) {
        audioRef.current.src = currentStation.streamUrl;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Radio play error:', err);
        setHasError(true);
        setIsPlaying(false);
      });
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentStation.streamUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
              <Radio className="w-3.5 h-3.5" />
              <span>লাইভ এফএম ও অনলাইন ব্রডকাস্ট</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              লাইভ রেডিও প্লেয়ার 📻
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
              বাংলাদেশের সেরা ও জনপ্রিয় এফএম রেডিও শুনুন একদম ঝকঝকে সাউন্ডে — কাজ করতে করতে বা ব্রাউজ করতে করতে ব্যাকগ্রাউন্ডে উপভোগ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold tracking-wide">২৪/৭ লাইভ স্ট্রিমিং</span>
          </div>
        </div>
      </div>

      {/* Big Master Player Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Station Visual Info */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-rose-500/25 shrink-0">
              {currentStation.logo}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className={`px-2.5 py-0.5 text-[11px] font-extrabold text-white rounded-full ${currentStation.badgeColor}`}>
                  {currentStation.frequency}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    লাইভ অন-এয়ার
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentStation.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                {currentStation.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause & Animated Waves */}
          <div className="flex flex-col items-center gap-3">
            {/* Play/Pause Main Button */}
            <button
              onClick={togglePlay}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-end gap-1 h-6 px-3">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 1, 0.4, 0.8].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.max(4, h * 24)}px` : '4px',
                    transition: 'height 0.2s ease-in-out'
                  }}
                  className={`w-1 rounded-full ${
                    isPlaying ? 'bg-rose-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Volume & Details Bar */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-64">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-rose-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-indigo-500" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={e => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-500 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {hasError && (
            <span className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full">
              ⚠️ স্টেশনে সাময়িক সংযোগ সমস্যা বা ব্রাউজার নীতি। প্লে বাটনে পুনরায় চাপুন।
            </span>
          )}

          <span className="text-xs font-medium text-slate-400">
            এইচডি অডিও কোয়ালিটি • ১২৮ কেবিপিএস
          </span>
        </div>
      </div>

      {/* Station List Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-indigo-500" />
          <span>সকল লাইভ রেডিও স্টেশন ({RADIO_STATIONS.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {RADIO_STATIONS.map(station => {
            const isSelected = currentStation.id === station.id;
            return (
              <div
                key={station.id}
                onClick={() => handleSelectStation(station)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700 scale-101'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{station.logo}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {station.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {station.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shrink-0 ${station.badgeColor}`}>
                    {station.frequency}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                    {station.tagline}
                  </span>

                  <span className={`font-bold flex items-center gap-1 ${
                    isSelected && isPlaying ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600'
                  }`}>
                    {isSelected && isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>বাজছে</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>শুনুন</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
