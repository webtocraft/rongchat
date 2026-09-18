import re

with open('Index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update <main ...> start and close
# Let's locate '<main class="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-6">'
main_old_start = '<main class="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-6">'

left_sidebar_html = '''  <!-- 3-COLUMN RESPONSIVE LAYOUT -->
  <main class="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      
      <!-- ============================================== -->
      <!-- LEFT SIDEBAR -->
      <!-- ============================================== -->
      <aside class="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
        <!-- User Info / Guest Card -->
        <div id="left-sidebar-user-card">
          <!-- Populated dynamically by updateUserHeader -->
        </div>

        <!-- Left Navigation Menu -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-xs font-bold">
          <button onclick="switchTab('feed')" id="left-nav-feed" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="home" class="w-4 h-4"></i>
              <span>নিউজ ফিড</span>
            </div>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          </button>
          <button onclick="switchTab('friends')" id="left-nav-friends" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="users" class="w-4 h-4 text-emerald-500"></i>
              <span>ফ্রেন্ড খুঁজুন</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-[10px] text-emerald-600">খুঁজুন</span>
          </button>
          <button onclick="switchTab('reels')" id="left-nav-reels" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="play-square" class="w-4 h-4 text-pink-500"></i>
              <span>রিলস ও শর্টস</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-[10px] text-pink-600 font-bold">হট</span>
          </button>
          <button onclick="switchTab('market')" id="left-nav-market" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="shopping-bag" class="w-4 h-4 text-amber-500"></i>
              <span>মার্কেটপ্লেস</span>
            </div>
          </button>
          <button onclick="switchTab('events')" id="left-nav-events" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="calendar" class="w-4 h-4 text-purple-500"></i>
              <span>ইভেন্টস</span>
            </div>
          </button>
          <button onclick="switchTab('games')" id="left-nav-games" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="gamepad-2" class="w-4 h-4 text-cyan-500"></i>
              <span>গেমস জোন</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-[10px] text-cyan-600 font-bold">৩টি গেম</span>
          </button>
          <button onclick="switchTab('radio')" id="left-nav-radio" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="radio" class="w-4 h-4 text-rose-500"></i>
              <span>লাইভ রেডিও</span>
            </div>
            <span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>
          </button>
          <button onclick="switchTab('tv')" id="left-nav-tv" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="tv" class="w-4 h-4 text-red-500"></i>
              <span>লাইভ টিভি</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-[10px] text-red-600 font-bold">লাইভ</span>
          </button>
          <button onclick="switchTab('chat')" id="left-nav-chat" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="message-circle" class="w-4 h-4 text-teal-500"></i>
              <span>পাবলিক চ্যাট</span>
            </div>
          </button>
          <button onclick="switchTab('inbox')" id="left-nav-inbox" class="sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="mail" class="w-4 h-4 text-blue-500"></i>
              <span>ইনবক্স মেসেজ</span>
            </div>
          </button>
        </div>

        <!-- Realtime EMQX Broker Status Card -->
        <div class="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-medium">রিয়েলটাইম ব্রোকার:</span>
            <span class="flex items-center gap-1 font-bold text-emerald-500 text-[11px]">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>EMQX সক্রিয়</span>
            </span>
          </div>
          <div class="text-[10px] text-slate-400">Google Apps Script + MQTT</div>
        </div>
      </aside>

      <!-- ============================================== -->
      <!-- CENTER COLUMN -->
      <!-- ============================================== -->
      <div class="col-span-1 lg:col-span-6 space-y-5">
'''

# New tabs: Search & Friends (before feed)
center_prefix_tabs = '''
        <!-- ============================================== -->
        <!-- 0. GLOBAL SEARCH RESULTS TAB -->
        <!-- ============================================== -->
        <div id="tab-search" class="hidden space-y-4">
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <i data-lucide="search" class="w-5 h-5 text-indigo-500"></i>
                <span>অনুসন্ধানের ফলাফল</span>
              </h2>
              <p id="search-query-label" class="text-xs text-slate-500 dark:text-slate-400"></p>
            </div>
            <button onclick="clearGlobalSearch()" class="text-xs font-bold text-indigo-600 hover:underline">রিসেট</button>
          </div>
          <div id="search-results-container" class="space-y-3"></div>
        </div>

        <!-- ============================================== -->
        <!-- 0.1 FRIENDS & MEMBERS TAB -->
        <!-- ============================================== -->
        <div id="tab-friends" class="hidden space-y-4">
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <i data-lucide="users" class="w-5 h-5 text-emerald-500"></i>
                  <span>বন্ধু ও ইউজার খুঁজুন</span>
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">নতুন বন্ধুদের খুঁজে নিন, তাদের টাইমলাইন প্রোফাইল দেখুন এবং কানেক্ট হন</p>
              </div>
              <span id="friends-total-badge" class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 self-start sm:self-auto">০ জন সদস্য</span>
            </div>

            <!-- Search input -->
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input 
                type="text" 
                id="friends-search-box" 
                oninput="renderFriendsList(this.value)" 
                placeholder="নাম বা @ইউজারনেম দিয়ে বন্ধু খুঁজুন..." 
                class="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
            </div>

            <!-- Filter buttons -->
            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold pt-1">
              <button onclick="filterFriendsCategory('all')" id="btn-ff-all" class="ff-filter-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white shadow-sm">সকল ইউজার</button>
              <button onclick="filterFriendsCategory('online')" id="btn-ff-online" class="ff-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500">🟢 অনলাইনে আছেন</button>
              <button onclick="filterFriendsCategory('following')" id="btn-ff-following" class="ff-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500">যাদের ফলো করছেন</button>
            </div>
          </div>

          <!-- User Cards Grid -->
          <div id="friends-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Dynamic Friends Cards -->
          </div>
        </div>
'''

content = content.replace(main_old_start, left_sidebar_html + center_prefix_tabs, 1)

# Now check reels replacement: replace <div id="tab-reels" ...>...</div> with Instagram-like vertical snap feed
reels_old_pattern = r'<div id="tab-reels" class="hidden space-y-4">.*?</div>\s*<!-- =============================================='
reels_new_html = '''<div id="tab-reels" class="hidden space-y-4">
        <div class="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="play-square" class="w-5 h-5 text-pink-500"></i>
              <span>রিলস ও শর্টস ভিডিও</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">ইনস্টাগ্রামের মতো উল্লম্ব স্ক্রোল করে রিলস দেখুন, রিঅ্যাক্ট করুন ও কমেন্ট করুন</p>
          </div>
          <button onclick="openCreateReelModal()" class="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>নতুন রিল</span>
          </button>
        </div>

        <!-- Instagram Style Vertical Snap Scroll Viewport -->
        <div class="flex justify-center">
          <div class="relative w-full max-w-[420px]">
            <!-- Navigation Chevrons for desktop convenience -->
            <button onclick="scrollReelsContainer(-1)" class="hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-transform active:scale-95" title="পূর্ববর্তী রিল">
              <i data-lucide="chevron-up" class="w-5 h-5"></i>
            </button>
            <button onclick="scrollReelsContainer(1)" class="hidden sm:flex absolute -left-12 top-1/2 translate-y-6 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-transform active:scale-95" title="পরবর্তী রিল">
              <i data-lucide="chevron-down" class="w-5 h-5"></i>
            </button>

            <!-- Snap Container -->
            <div id="reels-snap-feed" class="w-full h-[78vh] sm:h-[680px] bg-black rounded-3xl overflow-y-scroll snap-y-mandatory no-scrollbar relative shadow-2xl border border-slate-800">
              <div id="reels-container" class="w-full min-h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- =============================================='''

content = re.sub(reels_old_pattern, reels_new_html, content, count=1, flags=re.DOTALL)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Main start & reels replaced successfully")
