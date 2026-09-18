import re

with open('Index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert games, radio, tv after tab-events
# Locate end of tab-events:
# `<div id="tab-events" ...>...</div>`
# followed by `<!-- ==============================================\n  <!-- 5. INBOX TAB`

games_radio_tv_html = '''
      <!-- ============================================== -->
      <!-- 4.1 GAMES ZONE TAB -->
      <!-- ============================================== -->
      <div id="tab-games" class="hidden space-y-5">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="gamepad-2" class="w-5 h-5 text-cyan-500"></i>
              <span>রং গেমস জোন (Games Zone)</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">বন্ধুদের সাথে খেলুন, পয়েন্ট অর্জন করুন এবং টাইমলাইনে শেয়ার করুন</p>
          </div>
          <!-- Game Switcher Pills -->
          <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button onclick="switchGameMode('tictactoe')" id="btn-gm-ttt" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm">টিক-ট্যাক-টো</button>
            <button onclick="switchGameMode('memory')" id="btn-gm-mem" class="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">ইমোজি ম্যাচ</button>
            <button onclick="switchGameMode('riddle')" id="btn-gm-rid" class="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">বাংলা ধাঁধা</button>
          </div>
        </div>

        <!-- GAME 1: TIC TAC TOE -->
        <div id="game-view-tictactoe" class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div class="flex items-center justify-between text-xs font-bold px-2">
            <span id="ttt-turn-indicator" class="text-indigo-600 dark:text-indigo-400">আপনার চাল (X)</span>
            <span id="ttt-score" class="text-slate-500">স্কোর: ০</span>
          </div>
          <div id="ttt-board" class="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
            <!-- 9 Cells populated by JS -->
          </div>
          <button onclick="resetTicTacToe()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all">নতুন গেম শুরু করুন</button>
        </div>

        <!-- GAME 2: EMOJI MEMORY MATCH -->
        <div id="game-view-memory" class="hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div class="flex items-center justify-between text-xs font-bold px-2">
            <span id="mem-status" class="text-emerald-600">জোড়া মেলান!</span>
            <span id="mem-moves" class="text-slate-500">চাল: ০ | মিল: ০/৬</span>
          </div>
          <div id="memory-board" class="grid grid-cols-4 gap-2.5 max-w-[320px] mx-auto">
            <!-- 12 Cards populated by JS -->
          </div>
          <button onclick="resetMemoryGame()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all">পুনরায় খেলুন</button>
        </div>

        <!-- GAME 3: BANGLA RIDDLE & QUIZ -->
        <div id="game-view-riddle" class="hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-lg mx-auto">
          <div class="flex items-center justify-between text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
            <span class="text-purple-600 dark:text-purple-400 font-bold">🧠 বাংলা ধাঁধা ও সাধারণ জ্ঞান কুইজ</span>
            <span id="riddle-score-badge" class="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 text-[11px]">স্কোর: ০</span>
          </div>
          <div id="riddle-question-card" class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed text-center">
            <!-- Question text -->
          </div>
          <div id="riddle-options-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <!-- 4 Options -->
          </div>
          <div id="riddle-feedback" class="text-center text-xs font-bold py-1 min-h-[20px]"></div>
          <div class="flex justify-end">
            <button onclick="nextRiddle()" id="btn-next-riddle" class="hidden px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm">পরবর্তী ধাঁধা →</button>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- 4.2 LIVE RADIO FM TAB -->
      <!-- ============================================== -->
      <div id="tab-radio" class="hidden space-y-4">
        <!-- Player Master Card -->
        <div class="bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-center sm:text-left">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner border border-white/20 relative">
                <i data-lucide="radio" class="w-8 h-8 text-white"></i>
                <span id="radio-pulse-dot" class="hidden absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] font-bold text-white/90 mb-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  <span>অন-এয়ার লাইভ রেডিও</span>
                </div>
                <h3 id="radio-station-title" class="text-lg sm:text-xl font-black">Radio Foorti 88.0 FM</h3>
                <p id="radio-station-desc" class="text-xs text-white/80">সর্বোচ্চ বিনোদন ও ট্রেন্ডিং বাংলা গান</p>
              </div>
            </div>

            <!-- Equalizer + Controls -->
            <div class="flex flex-col items-center sm:items-end gap-3">
              <!-- Audio Waveform Visualizer -->
              <div id="radio-eq-bars" class="flex items-end gap-1 h-6">
                <span class="w-1 bg-white rounded-full eq-bar-1" style="height: 6px;"></span>
                <span class="w-1 bg-white rounded-full eq-bar-2" style="height: 12px;"></span>
                <span class="w-1 bg-white rounded-full eq-bar-3" style="height: 18px;"></span>
                <span class="w-1 bg-white rounded-full eq-bar-4" style="height: 10px;"></span>
                <span class="w-1 bg-white rounded-full eq-bar-1" style="height: 15px;"></span>
              </div>

              <!-- Play / Pause & Volume -->
              <div class="flex items-center gap-3">
                <button onclick="toggleRadioPlay()" id="btn-radio-play" class="w-12 h-12 rounded-full bg-white text-rose-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg">
                  <i id="icon-radio-play" data-lucide="play" class="w-6 h-6 ml-0.5"></i>
                </button>
                <div class="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-xs">
                  <i data-lucide="volume-2" class="w-4 h-4 text-white/80"></i>
                  <input type="range" min="0" max="1" step="0.05" value="0.8" oninput="setRadioVolume(this.value)" class="w-20 accent-white">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden Audio Element -->
        <audio id="global-radio-audio" preload="none"></audio>

        <!-- Stations Grid -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i data-lucide="list-music" class="w-4 h-4 text-rose-500"></i>
            <span>জনপ্রিয় রেডিও স্টেশন নির্বাচন করুন</span>
          </h4>
          <div id="radio-stations-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Populated by JS -->
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- 4.3 BANGLA LIVE TV TAB -->
      <!-- ============================================== -->
      <div id="tab-tv" class="hidden space-y-4">
        <!-- Live TV Player Card -->
        <div class="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
          <!-- Live Indicator Badge -->
          <div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>লাইভ সম্প্রচার</span>
          </div>

          <!-- Channel Title Overlay -->
          <div class="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl border border-white/10">
            <span id="tv-active-channel-name">Somoy TV Live</span>
          </div>

          <!-- Video Stream Container -->
          <div class="aspect-video w-full bg-slate-950 flex items-center justify-center relative">
            <iframe 
              id="tv-stream-frame" 
              src="https://www.youtube.com/embed/live_stream?channel=UC82Xo3F31Xn77qJ_O-F-Ypg" 
              title="Live TV Stream" 
              class="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- TV Channel Switcher -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i data-lucide="tv" class="w-4 h-4 text-red-500"></i>
            <span>লাইভ টিভি চ্যানেলসমূহ</span>
          </h4>
          <div id="tv-channels-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <!-- Channel cards populated by JS -->
          </div>
        </div>
      </div>
'''

events_pattern = r'(<div id="tab-events".*?</div>\s*)(<!-- ==============================================\s*<!-- 5\. INBOX TAB)'
content = re.sub(events_pattern, r'\1' + games_radio_tv_html + r'\n\n      \2', content, count=1, flags=re.DOTALL)

# 2. Close Center column and add Right Sidebar right after tab-profile
# tab-profile ends right before </main>
profile_end_pattern = r'(<!-- User\'s Posts -->.*?</div>\s*</div>\s*)(</main>)'

right_sidebar_html = '''      </div> <!-- /col-span-6 (Center Column) -->

      <!-- ============================================== -->
      <!-- RIGHT SIDEBAR (ONLINE USERS & SUGGESTIONS) -->
      <!-- ============================================== -->
      <aside class="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
        
        <!-- Online Members Panel -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 class="text-xs font-bold text-slate-900 dark:text-slate-100">অনলাইনে আছেন</h3>
            </div>
            <span id="right-online-count" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">১ জন সক্রিয়</span>
          </div>

          <!-- Quick Filter Input -->
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="right-online-filter-input" 
              oninput="filterRightOnlineList(this.value)" 
              placeholder="অনলাইন মেম্বার খুঁজুন..." 
              class="w-full pl-8 pr-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            >
          </div>

          <!-- List of Clickable Online Users -> Visits Profile & Timeline! -->
          <div id="right-online-users-list" class="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar">
            <!-- Rendered by renderOnlineUsersSidebar() -->
          </div>
        </div>

        <!-- Friend Suggestions Panel -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-indigo-500"></i>
              <span>প্রস্তাবিত বন্ধুগণ</span>
            </h3>
            <button onclick="switchTab('friends')" class="text-[10px] font-bold text-indigo-600 hover:underline">সব দেখুন</button>
          </div>
          <div id="right-suggested-users-list" class="space-y-2">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Trending Topics Panel -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
          <h3 class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>জনপ্রিয় ট্রেন্ডিং</span>
          </h3>
          <div class="flex flex-wrap gap-1.5 text-[11px]">
            <button onclick="searchHashtag('রং_সোশ্যাল')" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600">#রং_সোশ্যাল</button>
            <button onclick="searchHashtag('বাংলাদেশ')" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600">#বাংলাদেশ</button>
            <button onclick="searchHashtag('মার্কেটপ্লেস')" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600">#মার্কেটপ্লেস</button>
            <button onclick="searchHashtag('ভাইরাল_রিলস')" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600">#ভাইরাল_রিলস</button>
          </div>
        </div>

      </aside>
    </div> <!-- /grid -->
  </main>
'''

content = re.sub(profile_end_pattern, r'\1' + right_sidebar_html, content, count=1, flags=re.DOTALL)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Games, Radio, TV and Right Sidebar inserted successfully")
