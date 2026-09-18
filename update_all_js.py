import re

with open('Index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect where switchTab is located
js_addon = '''
    // ==============================================
    // EXTENDED NAVIGATION & TAB SWITCHING
    // ==============================================
    function switchTab(tab) {
      state.activeTab = tab;
      window.location.hash = '#' + tab;

      const tabs = ['feed', 'friends', 'reels', 'market', 'events', 'games', 'radio', 'tv', 'inbox', 'chat', 'profile', 'search'];
      tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.toggle('hidden', t !== tab);

        // Header desktop nav buttons
        const navBtn = document.getElementById('btn-tab-' + t);
        if (navBtn) {
          if (t === tab) {
            navBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 shadow-sm";
          } else {
            navBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";
          }
        }

        // Left sidebar buttons
        const leftBtn = document.getElementById('left-nav-' + t);
        if (leftBtn) {
          if (t === tab) {
            leftBtn.className = "sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/90 dark:bg-indigo-950/60 shadow-sm transition-all";
          } else {
            leftBtn.className = "sidebar-nav-btn w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all";
          }
        }
      });

      if (tab === 'feed') renderFeed();
      if (tab === 'friends') renderFriendsList();
      if (tab === 'reels') renderReels();
      if (tab === 'market') renderMarket();
      if (tab === 'events') renderEvents();
      if (tab === 'games') renderGames();
      if (tab === 'radio') renderRadio();
      if (tab === 'tv') renderTV();
      if (tab === 'inbox') renderInbox();
      if (tab === 'chat') renderGlobalChat();

      renderOnlineUsersSidebar();
      renderSuggestedFriends();
      lucide.createIcons();
    }

    // ==============================================
    // RIGHT SIDEBAR: ONLINE USERS (CLICKABLE PROFILE & TIMELINE)
    // ==============================================
    let currentOnlineFilter = '';

    function filterRightOnlineList(query) {
      currentOnlineFilter = (query || '').toLowerCase().trim();
      renderOnlineUsersSidebar();
    }

    function renderOnlineUsersSidebar() {
      const container = document.getElementById('right-online-users-list');
      const countBadge = document.getElementById('right-online-count');
      if (!container) return;

      const onlineUsernames = new Set(Array.from(state.onlineUsers || []));
      if (state.currentUser) onlineUsernames.add(state.currentUser.username);

      // Collect users from state.users + currentUser
      let userMap = new Map();
      (state.users || []).forEach(u => userMap.set(u.username, u));
      if (state.currentUser) userMap.set(state.currentUser.username, state.currentUser);

      let list = Array.from(userMap.values()).filter(u => {
        if (!currentOnlineFilter) return true;
        return (u.name || '').toLowerCase().includes(currentOnlineFilter) ||
               (u.username || '').toLowerCase().includes(currentOnlineFilter);
      });

      if (countBadge) {
        countBadge.textContent = `${list.length} জন সক্রিয়`;
      }

      if (list.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-slate-400 py-3">কোনো ইউজার পাওয়া যায়নি</div>`;
        return;
      }

      container.innerHTML = list.map(u => {
        const isOnline = onlineUsernames.has(u.username);
        const isSelf = state.currentUser && state.currentUser.username === u.username;

        return `
          <div class="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <!-- Clickable to visit profile & timeline! -->
            <div onclick="switchTab('profile'); showProfile('${u.username}')" class="flex items-center gap-2.5 cursor-pointer overflow-hidden flex-1" title="প্রোফাইল ও টাইমলাইন দেখুন">
              <div class="relative shrink-0">
                <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700">
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
              </div>
              <div class="overflow-hidden text-left">
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                  ${u.name || u.username} ${isSelf ? '<span class="text-[10px] text-indigo-500 font-normal">(আপনি)</span>' : ''}
                </div>
                <div class="text-[10px] text-slate-400 truncate">@${u.username}</div>
              </div>
            </div>

            <!-- Direct chat shortcut -->
            ${!isSelf ? `
              <button onclick="startChatWithSeller('${u.username}')" title="মেসেজ দিন" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    function renderSuggestedFriends() {
      const container = document.getElementById('right-suggested-users-list');
      if (!container) return;

      const current = state.currentUser ? state.currentUser.username : '';
      const list = (state.users || []).filter(u => u.username !== current).slice(0, 4);

      if (list.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-slate-400 py-2">কোনো প্রস্তাবনা নেই</div>`;
        return;
      }

      const following = state.currentUser ? new Set(state.currentUser.following || []) : new Set();

      container.innerHTML = list.map(u => {
        const isFollowing = following.has(u.username);
        return `
          <div class="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <div onclick="switchTab('profile'); showProfile('${u.username}')" class="flex items-center gap-2 cursor-pointer overflow-hidden flex-1">
              <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-7 h-7 rounded-full object-cover">
              <div class="overflow-hidden text-left">
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${u.name}</div>
                <div class="text-[10px] text-slate-400 truncate">@${u.username}</div>
              </div>
            </div>
            <button onclick="toggleFollowUser('${u.username}')" class="px-2 py-1 rounded-lg text-[10px] font-bold ${isFollowing ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-600 hover:text-white'} transition-colors shrink-0">
              ${isFollowing ? 'ফলোয়িং' : '+ ফলো'}
            </button>
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    // ==============================================
    // FRIENDS & DISCOVER TAB
    // ==============================================
    let activeFriendsCategory = 'all';

    function filterFriendsCategory(cat) {
      activeFriendsCategory = cat;
      ['all', 'online', 'following'].forEach(c => {
        const btn = document.getElementById('btn-ff-' + c);
        if (btn) {
          if (c === cat) {
            btn.className = "ff-filter-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white shadow-sm";
          } else {
            btn.className = "ff-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500";
          }
        }
      });
      renderFriendsList();
    }

    function renderFriendsList(query = '') {
      const container = document.getElementById('friends-cards-grid');
      const badge = document.getElementById('friends-total-badge');
      if (!container) return;

      const q = (query || (document.getElementById('friends-search-box')?.value || '')).toLowerCase().trim();
      const onlineSet = new Set(Array.from(state.onlineUsers || []));
      const followingSet = state.currentUser ? new Set(state.currentUser.following || []) : new Set();

      let list = (state.users || []).filter(u => {
        // filter query
        if (q && !(u.name || '').toLowerCase().includes(q) && !(u.username || '').toLowerCase().includes(q) && !(u.bio || '').toLowerCase().includes(q)) {
          return false;
        }
        // filter category
        if (activeFriendsCategory === 'online' && !onlineSet.has(u.username)) return false;
        if (activeFriendsCategory === 'following' && !followingSet.has(u.username)) return false;
        return true;
      });

      if (badge) badge.textContent = `${list.length} জন সদস্য`;

      if (list.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <i data-lucide="users" class="w-8 h-8 text-slate-300 mx-auto"></i>
            <div class="text-sm font-bold text-slate-600 dark:text-slate-300">কোনো ফ্রেন্ড বা সদস্য পাওয়া যায়নি</div>
            <p class="text-xs text-slate-400">অন্য নাম দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      container.innerHTML = list.map(u => {
        const isOnline = onlineSet.has(u.username);
        const isFollowing = followingSet.has(u.username);
        const isSelf = state.currentUser && state.currentUser.username === u.username;

        return `
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3">
            <div class="flex items-center gap-3">
              <div onclick="switchTab('profile'); showProfile('${u.username}')" class="relative cursor-pointer shrink-0">
                <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20">
                <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
              </div>
              <div class="overflow-hidden flex-1 text-left">
                <div onclick="switchTab('profile'); showProfile('${u.username}')" class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:text-indigo-600 transition-colors">
                  ${u.name}
                </div>
                <div class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">@${u.username}</div>
                <div class="text-[10px] text-slate-500 truncate">${u.bio || 'রং সোশ্যাল নেটওয়ার্ক সদস্য'}</div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <button onclick="switchTab('profile'); showProfile('${u.username}')" class="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                <i data-lucide="user" class="w-3.5 h-3.5"></i>
                <span>প্রোফাইল</span>
              </button>
              ${!isSelf ? `
                <button onclick="toggleFollowUser('${u.username}')" class="flex-1 py-1.5 px-2 ${isFollowing ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
                  <i data-lucide="${isFollowing ? 'check' : 'user-plus'}" class="w-3.5 h-3.5"></i>
                  <span>${isFollowing ? 'ফলোয়িং' : 'ফলো'}</span>
                </button>
                <button onclick="startChatWithSeller('${u.username}')" class="p-2 bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 text-slate-600 dark:text-slate-300 rounded-xl transition-colors">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    // ==============================================
    // GLOBAL SEARCH IMPLEMENTATION
    // ==============================================
    function handleGlobalSearch(query) {
      const q = (query || '').trim();
      const clearBtn = document.getElementById('clear-search-btn');
      if (clearBtn) clearBtn.classList.toggle('hidden', !q);

      if (!q) {
        if (state.activeTab === 'search') switchTab('feed');
        return;
      }

      switchTab('search');
      const label = document.getElementById('search-query-label');
      if (label) label.textContent = `"${q}" এর জন্য ফলাফল খোঁজা হচ্ছে...`;

      const qLower = q.toLowerCase();
      const container = document.getElementById('search-results-container');
      if (!container) return;

      // 1. Matching Users
      const matchUsers = (state.users || []).filter(u => 
        (u.name || '').toLowerCase().includes(qLower) || 
        (u.username || '').toLowerCase().includes(qLower)
      );

      // 2. Matching Posts
      const matchPosts = (state.posts || []).filter(p => 
        (p.content || '').toLowerCase().includes(qLower) || 
        (p.authorName || '').toLowerCase().includes(qLower)
      );

      // 3. Matching Reels
      const matchReels = (state.reels || []).filter(r => 
        (r.title || '').toLowerCase().includes(qLower) || 
        (r.author || '').toLowerCase().includes(qLower)
      );

      // 4. Matching Marketplace
      const matchMarket = (state.market || []).filter(m => 
        (m.title || '').toLowerCase().includes(qLower) || 
        (m.desc || '').toLowerCase().includes(qLower)
      );

      const totalMatches = matchUsers.length + matchPosts.length + matchReels.length + matchMarket.length;
      if (label) label.textContent = `"${q}" এর জন্য মোট ${totalMatches}টি ফলাফল পাওয়া গেছে`;

      if (totalMatches === 0) {
        container.innerHTML = `
          <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <i data-lucide="search-x" class="w-10 h-10 text-slate-300 mx-auto"></i>
            <div class="text-sm font-bold text-slate-600 dark:text-slate-300">কোনো তথ্য মেলেনি</div>
            <p class="text-xs text-slate-400">অন্য শব্দ ব্যবহার করে পুনরায় চেষ্টা করুন</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      let html = '';

      // Users section
      if (matchUsers.length > 0) {
        html += `
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">সদস্যগণ (${matchUsers.length})</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${matchUsers.map(u => `
                <div onclick="switchTab('profile'); showProfile('${u.username}')" class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer flex items-center gap-3 transition-all">
                  <img src="${u.avatar}" class="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200">
                  <div class="overflow-hidden">
                    <div class="text-xs font-bold text-slate-900 dark:text-white truncate">${u.name}</div>
                    <div class="text-[10px] text-indigo-600">@${u.username}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Posts section
      if (matchPosts.length > 0) {
        html += `
          <div class="space-y-2 pt-2">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">পোস্টসমূহ (${matchPosts.length})</h4>
            <div class="space-y-2.5">
              ${matchPosts.slice(0, 5).map(p => `
                <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div class="flex items-center gap-2">
                    <img src="${p.authorAvatar}" class="w-6 h-6 rounded-full object-cover">
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${p.authorName}</span>
                    <span class="text-[10px] text-slate-400">${formatTimeAgo(p.createdAt)}</span>
                  </div>
                  <p class="text-xs text-slate-700 dark:text-slate-300 line-clamp-3">${p.content}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
      lucide.createIcons();
    }

    function clearGlobalSearch() {
      const inp = document.getElementById('global-search-input');
      if (inp) inp.value = '';
      const clearBtn = document.getElementById('clear-search-btn');
      if (clearBtn) clearBtn.classList.add('hidden');
      switchTab('feed');
    }

    function searchHashtag(tag) {
      const inp = document.getElementById('global-search-input');
      if (inp) {
        inp.value = '#' + tag.replace('#', '');
        handleGlobalSearch(inp.value);
      }
    }
'''

# We will replace renderReels with the Instagram-style vertical snap reels implementation
reels_instagram_js = '''
    // ==============================================
    // INSTAGRAM-STYLE REELS ENGINE
    // ==============================================
    let activeReelCommentId = null;
    let reelMuted = true;

    function scrollReelsContainer(dir) {
      const container = document.getElementById('reels-snap-feed');
      if (container) {
        const height = container.clientHeight;
        container.scrollBy({ top: dir * height, behavior: 'smooth' });
      }
    }

    function toggleReelSound(id, btn) {
      reelMuted = !reelMuted;
      const video = document.getElementById('reel-vid-' + id);
      if (video) video.muted = reelMuted;
      if (btn) {
        btn.innerHTML = `<i data-lucide="${reelMuted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>`;
        lucide.createIcons();
      }
    }

    function renderReels() {
      const container = document.getElementById('reels-container');
      if (!container) return;

      if (!state.reels || state.reels.length === 0) {
        container.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <i data-lucide="play-square" class="w-12 h-12 text-pink-500 opacity-60"></i>
            <div class="text-sm font-bold">কোনো রিলস পাওয়া যায়নি</div>
            <p class="text-xs text-slate-400">প্রথম রিল ভিডিও আপনিই আপলোড করুন!</p>
            <button onclick="openCreateReelModal()" class="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md">নতুন রিল দিন</button>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      container.innerHTML = state.reels.map((r, idx) => {
        const isLiked = r.likes && state.currentUser && r.likes.includes(state.currentUser.username);
        const likeCount = r.likes ? r.likes.length : 0;
        const commentsCount = r.comments ? r.comments.length : 0;
        
        // reactions summary
        const reactionsObj = r.reactions || {};
        const totalReactions = Object.values(reactionsObj).reduce((a, b) => a + b, 0);

        // check video type
        const isEmbed = r.videoUrl && (r.videoUrl.includes('youtube.com') || r.videoUrl.includes('youtu.be'));
        const embedUrl = isEmbed ? getYouTubeEmbedUrl(r.videoUrl) : null;

        return `
          <div class="snap-item relative w-full h-[78vh] sm:h-[680px] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-900" id="reel-card-${r.id}">
            <!-- Media Layer -->
            ${embedUrl ? `
              <iframe src="${embedUrl}?autoplay=0&loop=1&controls=0&modestbranding=1" class="w-full h-full object-cover border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowfullscreen></iframe>
            ` : `
              <video 
                id="reel-vid-${r.id}"
                src="${r.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-happy-woman-smiling-at-the-camera-40787-large.mp4'}" 
                class="w-full h-full object-cover" 
                loop 
                playsinline 
                muted 
                onclick="this.paused ? this.play() : this.pause()"
              ></video>
            `}

            <!-- Top Header gradient shadow -->
            <div class="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10"></div>

            <!-- Sound toggle button -->
            <button onclick="toggleReelSound('${r.id}', this)" class="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors">
              <i data-lucide="volume-x" class="w-4 h-4"></i>
            </button>

            <!-- Bottom Information Layer -->
            <div class="absolute bottom-4 inset-x-4 z-20 text-white space-y-2.5 pr-14 pointer-events-none">
              <div class="flex items-center gap-2 pointer-events-auto">
                <img onclick="switchTab('profile'); showProfile('${r.author}')" src="${r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-9 h-9 rounded-full object-cover ring-2 ring-white/60 cursor-pointer">
                <div>
                  <div onclick="switchTab('profile'); showProfile('${r.author}')" class="text-xs font-bold drop-shadow hover:underline cursor-pointer flex items-center gap-1.5">
                    <span>${r.authorName || r.author}</span>
                    <span class="text-[10px] text-pink-400">@${r.author}</span>
                  </div>
                </div>
              </div>

              <!-- Title & Caption -->
              <p class="text-xs font-medium drop-shadow-md line-clamp-2 text-white/95 pointer-events-auto leading-relaxed">
                ${r.title || ''}
              </p>

              <!-- Audio tag with spinning disc -->
              <div class="flex items-center gap-2 text-[10px] text-white/80 pointer-events-auto">
                <i data-lucide="music" class="w-3 h-3 text-pink-400"></i>
                <span class="truncate max-w-[160px]">অরিজিনাল অডিও • ${r.authorName || r.author}</span>
              </div>
            </div>

            <!-- Right Action Sidebar (Instagram Style) -->
            <div class="absolute right-3 bottom-8 z-20 flex flex-col items-center gap-4 text-white">
              
              <!-- Like Action -->
              <div class="flex flex-col items-center gap-1">
                <button onclick="toggleLikeReel('${r.id}')" class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${isLiked ? 'text-pink-500' : 'text-white'}">
                  <i data-lucide="heart" class="w-5 h-5 ${isLiked ? 'fill-current' : ''}"></i>
                </button>
                <span class="text-[11px] font-bold drop-shadow">${likeCount}</span>
              </div>

              <!-- Multi-Reaction Emoji Picker Button -->
              <div class="relative group flex flex-col items-center">
                <button class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-all text-xl">
                  🔥
                </button>
                <!-- Popover Reactions -->
                <div class="hidden group-hover:flex absolute right-12 bottom-0 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 items-center gap-1 shadow-2xl z-30 animate-in fade-in">
                  <button onclick="sendReelReaction('${r.id}', '❤️')" class="text-lg hover:scale-130 transition-transform">❤️</button>
                  <button onclick="sendReelReaction('${r.id}', '🔥')" class="text-lg hover:scale-130 transition-transform">🔥</button>
                  <button onclick="sendReelReaction('${r.id}', '😂')" class="text-lg hover:scale-130 transition-transform">😂</button>
                  <button onclick="sendReelReaction('${r.id}', '👏')" class="text-lg hover:scale-130 transition-transform">👏</button>
                  <button onclick="sendReelReaction('${r.id}', '😮')" class="text-lg hover:scale-130 transition-transform">😮</button>
                </div>
                <span class="text-[10px] font-bold drop-shadow">${totalReactions > 0 ? totalReactions : ''}</span>
              </div>

              <!-- Comment Button -->
              <div class="flex flex-col items-center gap-1">
                <button onclick="openReelComments('${r.id}')" class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white">
                  <i data-lucide="message-square" class="w-5 h-5"></i>
                </button>
                <span class="text-[11px] font-bold drop-shadow">${commentsCount}</span>
              </div>

              <!-- Share Button -->
              <div class="flex flex-col items-center gap-1">
                <button onclick="shareReel('${r.id}')" class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white">
                  <i data-lucide="share-2" class="w-5 h-5"></i>
                </button>
                <span class="text-[10px] font-semibold drop-shadow">শেয়ার</span>
              </div>

              <!-- Spinning Music Disc -->
              <div class="w-9 h-9 rounded-full bg-slate-900 ring-2 ring-white/40 flex items-center justify-center spin-disc overflow-hidden shadow-lg mt-1">
                <img src="${r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    function sendReelReaction(reelId, emoji) {
      if (!state.currentUser) {
        openAuthModal('login');
        return;
      }
      const reel = (state.reels || []).find(r => r.id === reelId);
      if (reel) {
        if (!reel.reactions) reel.reactions = {};
        reel.reactions[emoji] = (reel.reactions[emoji] || 0) + 1;
        renderReels();
        showToast(`রিলসে ${emoji} প্রতিক্রিয়া দেওয়া হয়েছে!`);
        
        // GAS backend sync
        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.reactToReel(reelId, state.currentUser.username, emoji);
        }
      }
    }

    function openReelComments(reelId) {
      activeReelCommentId = reelId;
      const reel = (state.reels || []).find(r => r.id === reelId);
      if (!reel) return;

      const badge = document.getElementById('reel-comment-count-badge');
      if (badge) badge.textContent = reel.comments ? reel.comments.length : 0;

      const list = document.getElementById('reel-comments-list');
      if (list) {
        if (!reel.comments || reel.comments.length === 0) {
          list.innerHTML = `<div class="text-center text-xs text-slate-400 py-10">এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন!</div>`;
        } else {
          list.innerHTML = reel.comments.map(c => `
            <div class="flex gap-2.5 pt-2">
              <img src="${c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" class="w-7 h-7 rounded-full object-cover shrink-0">
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${c.name || c.author}</span>
                  <span class="text-[10px] text-slate-400">${formatTimeAgo(c.createdAt)}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">${c.text}</p>
              </div>
            </div>
          `).join('');
        }
      }

      openModal('modal-reel-comments');
      lucide.createIcons();
    }

    function handleReelCommentSubmit(e) {
      e.preventDefault();
      if (!state.currentUser) {
        openAuthModal('login');
        return;
      }
      const inp = document.getElementById('reel-comment-input');
      const text = (inp.value || '').trim();
      if (!text || !activeReelCommentId) return;

      const reel = (state.reels || []).find(r => r.id === activeReelCommentId);
      if (reel) {
        if (!reel.comments) reel.comments = [];
        reel.comments.push({
          id: 'rc_' + Date.now(),
          author: state.currentUser.username,
          name: state.currentUser.name,
          avatar: state.currentUser.avatar,
          text: text,
          createdAt: new Date().toISOString()
        });
        inp.value = '';
        openReelComments(activeReelCommentId);
        showToast('মন্তব্য যুক্ত করা হয়েছে!');
      }
    }

    function shareReel(reelId) {
      const url = window.location.origin + window.location.pathname + '#reels';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        showToast('রিলসের লিংক কপি করা হয়েছে!');
      } else {
        showToast('লিংক: ' + url);
      }
    }
'''

# Let's add Games, Radio, TV, Story Reactions scripts:
features_js = '''
    // ==============================================
    // GAMES ZONE: TIC TAC TOE, MEMORY, RIDDLES
    // ==============================================
    let activeGameMode = 'tictactoe';
    let tttBoard = Array(9).fill(null);
    let tttTurn = 'X';
    let tttScore = 0;

    function switchGameMode(mode) {
      activeGameMode = mode;
      document.getElementById('game-view-tictactoe')?.classList.toggle('hidden', mode !== 'tictactoe');
      document.getElementById('game-view-memory')?.classList.toggle('hidden', mode !== 'memory');
      document.getElementById('game-view-riddle')?.classList.toggle('hidden', mode !== 'riddle');

      ['ttt', 'mem', 'rid'].forEach(m => {
        const btn = document.getElementById('btn-gm-' + m);
        const isCurrent = (m === 'ttt' && mode === 'tictactoe') || (m === 'mem' && mode === 'memory') || (m === 'rid' && mode === 'riddle');
        if (btn) {
          btn.className = isCurrent 
            ? "px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300";
        }
      });

      if (mode === 'tictactoe') initTicTacToe();
      if (mode === 'memory') initMemoryGame();
      if (mode === 'riddle') initQuizGame();
      lucide.createIcons();
    }

    function renderGames() {
      switchGameMode(activeGameMode);
    }

    function initTicTacToe() {
      const board = document.getElementById('ttt-board');
      if (!board) return;
      board.innerHTML = tttBoard.map((val, i) => `
        <button onclick="handleTTTMove(${i})" class="w-20 h-20 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-2xl font-black flex items-center justify-center transition-all ${val === 'X' ? 'text-indigo-600' : 'text-pink-500'}">
          ${val || ''}
        </button>
      `).join('');

      const ind = document.getElementById('ttt-turn-indicator');
      if (ind) ind.textContent = `চাল: ${tttTurn === 'X' ? 'আপনার (X)' : 'কম্পিউটার (O)'}`;
    }

    function handleTTTMove(i) {
      if (tttBoard[i] || checkTTTWinner(tttBoard)) return;
      tttBoard[i] = 'X';
      initTicTacToe();

      const win = checkTTTWinner(tttBoard);
      if (win === 'X') {
        tttScore += 10;
        document.getElementById('ttt-score').textContent = `স্কোর: ${tttScore}`;
        document.getElementById('ttt-turn-indicator').textContent = '🎉 আপনি জিতেছেন!';
        showToast('অভিনন্দন! আপনি জিতেছেন (+১০ পয়েন্ট)');
        return;
      }

      if (tttBoard.every(Boolean)) {
        document.getElementById('ttt-turn-indicator').textContent = '🤝 ড্র হয়েছে!';
        return;
      }

      // Computer move
      setTimeout(() => {
        const emptyIndices = tttBoard.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
        if (emptyIndices.length > 0) {
          const compMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          tttBoard[compMove] = 'O';
          initTicTacToe();

          const compWin = checkTTTWinner(tttBoard);
          if (compWin === 'O') {
            document.getElementById('ttt-turn-indicator').textContent = '🤖 কম্পিউটার জিতেছে!';
          }
        }
      }, 300);
    }

    function checkTTTWinner(b) {
      const lines = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      for (let l of lines) {
        if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return b[l[0]];
      }
      return null;
    }

    function resetTicTacToe() {
      tttBoard = Array(9).fill(null);
      tttTurn = 'X';
      initTicTacToe();
    }

    // MEMORY MATCH
    let memoryCards = [];
    let memoryFlipped = [];
    let memoryMatched = 0;
    let memoryMoves = 0;

    function initMemoryGame() {
      const emojis = ['🚀', '🌟', '🎨', '🍕', '🎮', '❤️'];
      const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      memoryCards = deck.map((e, id) => ({ id, emoji: e, matched: false }));
      memoryFlipped = [];
      memoryMatched = 0;
      memoryMoves = 0;
      renderMemoryBoard();
    }

    function renderMemoryBoard() {
      const board = document.getElementById('memory-board');
      const movesBadge = document.getElementById('mem-moves');
      if (movesBadge) movesBadge.textContent = `চাল: ${memoryMoves} | মিল: ${memoryMatched}/৬`;
      if (!board) return;

      board.innerHTML = memoryCards.map((c, idx) => {
        const isFlipped = memoryFlipped.includes(idx) || c.matched;
        return `
          <button onclick="handleMemoryCardClick(${idx})" class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${isFlipped ? 'bg-indigo-600 text-white shadow-lg rotate-0' : 'bg-slate-100 dark:bg-slate-800 text-transparent hover:bg-slate-200'}">
            ${isFlipped ? c.emoji : '❓'}
          </button>
        `;
      }).join('');
    }

    function handleMemoryCardClick(idx) {
      if (memoryCards[idx].matched || memoryFlipped.includes(idx) || memoryFlipped.length === 2) return;
      memoryFlipped.push(idx);
      renderMemoryBoard();

      if (memoryFlipped.length === 2) {
        memoryMoves++;
        const [c1, c2] = memoryFlipped;
        if (memoryCards[c1].emoji === memoryCards[c2].emoji) {
          memoryCards[c1].matched = true;
          memoryCards[c2].matched = true;
          memoryMatched++;
          memoryFlipped = [];
          renderMemoryBoard();
          if (memoryMatched === 6) {
            showToast('🎉 অসাধারণ! সবগুলো মেমোরি কার্ড মিলিয়েছেন!');
          }
        } else {
          setTimeout(() => {
            memoryFlipped = [];
            renderMemoryBoard();
          }, 800);
        }
      }
    }

    function resetMemoryGame() {
      initMemoryGame();
    }

    // BANGLA RIDDLES & QUIZ
    const RIDDLES_DATA = [
      { q: "কোন জিনিস ভাঙলে মানুষ খুশি হয়?", options: ["কাঁচ", "রেকর্ড", "প্লেট", "হৃদয়"], correct: 1, explanation: "রেকর্ড ভাঙলে মানুষ খুশি ও গর্বিত হয়!" },
      { q: "যত টানি তত ছোট হয়, জিনিসটি কি?", options: ["দড়ি", "সিগারেট বা বিড়ি", "রাবার ব্যান্ড", "সুতা"], correct: 1, explanation: "টানলে সিগারেট বা বিড়ি ছোট হতে থাকে।" },
      { q: "কোন পাখির কোনো ডানা নেই?", options: ["পেঙ্গুইন", "কিউই", "উটপাখি", "কাক"], correct: 1, explanation: "কিউই পাখির ব্যবহারযোগ্য দৃশ্যমান ডানা নেই।" },
      { q: "কোন দেশ প্রথম কাগজের মুদ্রা চালু করে?", options: ["ইংল্যান্ড", "চীন", "ভারত", "আমেরিকা"], correct: 1, explanation: "চীন সপ্তম শতাব্দীতে ট্যাং রাজবংশের সময়ে প্রথম কাগজের মুদ্রা প্রচলন করে।" }
    ];
    let currentRiddleIndex = 0;
    let riddleScore = 0;

    function initQuizGame() {
      const qCard = document.getElementById('riddle-question-card');
      const grid = document.getElementById('riddle-options-grid');
      const feedback = document.getElementById('riddle-feedback');
      const nextBtn = document.getElementById('btn-next-riddle');
      const scoreBadge = document.getElementById('riddle-score-badge');

      if (!qCard || !grid) return;
      const cur = RIDDLES_DATA[currentRiddleIndex % RIDDLES_DATA.length];

      qCard.textContent = `ধাঁধা ${currentRiddleIndex + 1}: ${cur.q}`;
      if (scoreBadge) scoreBadge.textContent = `স্কোর: ${riddleScore}`;
      if (feedback) feedback.textContent = '';
      if (nextBtn) nextBtn.classList.add('hidden');

      grid.innerHTML = cur.options.map((opt, i) => `
        <button onclick="handleAnswerRiddle(${i})" class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 text-xs font-bold border border-transparent hover:border-purple-500 transition-all text-left">
          ${String.fromCharCode(65 + i)}. ${opt}
        </button>
      `).join('');
    }

    function handleAnswerRiddle(selected) {
      const cur = RIDDLES_DATA[currentRiddleIndex % RIDDLES_DATA.length];
      const feedback = document.getElementById('riddle-feedback');
      const nextBtn = document.getElementById('btn-next-riddle');

      if (selected === cur.correct) {
        riddleScore += 10;
        feedback.innerHTML = `<span class="text-emerald-500 font-bold">✅ সঠিক উত্তর! ${cur.explanation}</span>`;
      } else {
        feedback.innerHTML = `<span class="text-rose-500 font-bold">❌ ভুল উত্তর। সঠিক ছিল: "${cur.options[cur.correct]}". ${cur.explanation}</span>`;
      }

      if (nextBtn) nextBtn.classList.remove('hidden');
    }

    function nextRiddle() {
      currentRiddleIndex++;
      initQuizGame();
    }

    // ==============================================
    // LIVE RADIO PLAYER ENGINE
    // ==============================================
    const RADIO_STATIONS = [
      { id: 'foorti', name: 'Radio Foorti 88.0 FM', desc: 'ঢাকা ও চট্টগ্রাম এফএম বিনোদন', url: 'https://stream.zeno.fm/4gq3h02a8p8uv' },
      { id: 'dhakafm', name: 'Dhaka FM 90.4', desc: 'সংগীত ও লাইভ রেডিও টক শো', url: 'https://stream.zeno.fm/9qszq7dhy08uv' },
      { id: 'today', name: 'Radio Today 89.6 FM', desc: 'সংবাদ, লাইভ আপডেট ও গান', url: 'https://stream.zeno.fm/7x4802g2738uv' },
      { id: 'quran', name: 'Quran Bangla Radio', desc: 'পবিত্র কুরআন তিলাওয়াত ও বাংলা তরজমা', url: 'https://stream.zeno.fm/k2d4hyqby08uv' },
      { id: 'melodies', name: 'Bangla Classic Hits', desc: 'চিরসবুজ বাংলা গানের সুরের ধারা', url: 'https://stream.zeno.fm/u1655h2ky08uv' }
    ];

    let currentRadioStation = RADIO_STATIONS[0];
    let isRadioPlaying = false;

    function renderRadio() {
      const list = document.getElementById('radio-stations-list');
      if (!list) return;

      list.innerHTML = RADIO_STATIONS.map(s => {
        const isCurrent = currentRadioStation.id === s.id;
        return `
          <div onclick="selectRadioStation('${s.id}')" class="p-3 rounded-2xl border ${isCurrent ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} hover:border-rose-400 cursor-pointer transition-all flex items-center justify-between">
            <div class="flex items-center gap-2.5 overflow-hidden">
              <div class="w-9 h-9 rounded-xl ${isCurrent ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'} flex items-center justify-center shrink-0">
                <i data-lucide="radio" class="w-4 h-4"></i>
              </div>
              <div class="overflow-hidden">
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${s.name}</div>
                <div class="text-[10px] text-slate-400 truncate">${s.desc}</div>
              </div>
            </div>
            ${isCurrent && isRadioPlaying ? `
              <span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>
            ` : ''}
          </div>
        `;
      }).join('');

      lucide.createIcons();
    }

    function selectRadioStation(id) {
      const station = RADIO_STATIONS.find(s => s.id === id);
      if (!station) return;
      currentRadioStation = station;

      document.getElementById('radio-station-title').textContent = station.name;
      document.getElementById('radio-station-desc').textContent = station.desc;

      const audio = document.getElementById('global-radio-audio');
      if (audio) {
        audio.src = station.url;
        audio.play().then(() => {
          isRadioPlaying = true;
          updateRadioUI(true);
        }).catch(() => {
          isRadioPlaying = false;
          updateRadioUI(false);
        });
      }
      renderRadio();
    }

    function toggleRadioPlay() {
      const audio = document.getElementById('global-radio-audio');
      if (!audio) return;

      if (isRadioPlaying) {
        audio.pause();
        isRadioPlaying = false;
        updateRadioUI(false);
      } else {
        if (!audio.src) audio.src = currentRadioStation.url;
        audio.play().then(() => {
          isRadioPlaying = true;
          updateRadioUI(true);
        }).catch(err => {
          showToast('রেডিও সংযোগে ত্রুটি বা ব্রাউজার নীতি');
        });
      }
      renderRadio();
    }

    function updateRadioUI(playing) {
      const icon = document.getElementById('icon-radio-play');
      const pulseDot = document.getElementById('radio-pulse-dot');
      if (icon) icon.setAttribute('data-lucide', playing ? 'pause' : 'play');
      if (pulseDot) pulseDot.classList.toggle('hidden', !playing);
      lucide.createIcons();
    }

    function setRadioVolume(val) {
      const audio = document.getElementById('global-radio-audio');
      if (audio) audio.volume = parseFloat(val);
    }

    // ==============================================
    // LIVE TV ENGINE
    // ==============================================
    const TV_CHANNELS = [
      { id: 'somoy', name: 'Somoy TV Live', stream: 'https://www.youtube.com/embed/live_stream?channel=UC82Xo3F31Xn77qJ_O-F-Ypg', logo: '📺' },
      { id: 'channel24', name: 'Channel 24 Live', stream: 'https://www.youtube.com/embed/live_stream?channel=UCF83015_bZ97fGk5K_eQz8g', logo: '🎥' },
      { id: 'ekattor', name: 'Ekattor TV Live', stream: 'https://www.youtube.com/embed/live_stream?channel=UC7N1nBfK9Qp6T0a1wH2bJTw', logo: '🔴' },
      { id: 'jamuna', name: 'Jamuna TV Live', stream: 'https://www.youtube.com/embed/live_stream?channel=UCm8B_cI-rU5uA5n4r_dZc3Q', logo: '⚡' }
    ];

    function renderTV() {
      const grid = document.getElementById('tv-channels-grid');
      if (!grid) return;

      grid.innerHTML = TV_CHANNELS.map(ch => `
        <div onclick="switchTVChannel('${ch.id}')" class="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-500 cursor-pointer transition-all text-center space-y-1.5 shadow-sm hover:scale-105">
          <div class="text-2xl">${ch.logo}</div>
          <div class="text-xs font-bold text-slate-800 dark:text-slate-100">${ch.name}</div>
          <span class="inline-block text-[10px] text-red-500 font-semibold">🔴 সরাসরি</span>
        </div>
      `).join('');

      lucide.createIcons();
    }

    function switchTVChannel(id) {
      const ch = TV_CHANNELS.find(c => c.id === id);
      if (!ch) return;

      const frame = document.getElementById('tv-stream-frame');
      const title = document.getElementById('tv-active-channel-name');
      if (frame) frame.src = ch.stream;
      if (title) title.textContent = ch.name;
      showToast(`${ch.name} চালু করা হয়েছে`);
    }

    // ==============================================
    // STORY REACTIONS & QUICK REPLIES
    // ==============================================
    function reactToCurrentStory(emoji) {
      if (!state.currentUser) {
        openAuthModal('login');
        return;
      }
      spawnFloatingEmoji(emoji);
      showToast(`স্টোরিতে ${emoji} রিঅ্যাকশন দেওয়া হয়েছে!`);

      // Backend sync via Google Apps Script
      const currentStory = (state.stories || [])[activeStoryIndex];
      if (currentStory && typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.reactToStory(currentStory.id, state.currentUser.username, emoji);
      }
    }

    function spawnFloatingEmoji(emoji) {
      const container = document.getElementById('story-reaction-float-box');
      if (!container) return;

      const el = document.createElement('div');
      el.className = 'floating-reaction text-3xl select-none';
      el.textContent = emoji;
      el.style.left = `${30 + Math.random() * 40}%`;
      container.appendChild(el);

      setTimeout(() => el.remove(), 1600);
    }

    function sendStoryReply() {
      if (!state.currentUser) {
        openAuthModal('login');
        return;
      }
      const inp = document.getElementById('story-reply-input');
      const text = (inp?.value || '').trim();
      if (!text) return;

      const currentStory = (state.stories || [])[activeStoryIndex];
      if (!currentStory) return;

      showToast(`@${currentStory.author} কে রিপ্লাই পাঠানো হয়েছে!`);
      inp.value = '';

      // Direct message via Inbox
      if (!state.messages) state.messages = [];
      state.messages.push({
        id: 'msg_' + Date.now(),
        sender: state.currentUser.username,
        receiver: currentStory.author,
        text: `[স্টোরিতে রিপ্লাই]: ${text}`,
        image: currentStory.mediaUrl,
        timestamp: new Date().toISOString()
      });
    }
'''

# Check if switchTab exists and replace it
switch_tab_pattern = r'function switchTab\(tab\) \{.*?renderGlobalChat\(\);\s*lucide\.createIcons\(\);\s*\}'
code = re.sub(switch_tab_pattern, js_addon, code, count=1, flags=re.DOTALL)

# Check if renderReels exists and replace it
reels_pattern = r'function renderReels\(\) \{.*?(?=function openCreateReelModal)'
code = re.sub(reels_pattern, reels_instagram_js + '\n\n', code, count=1, flags=re.DOTALL)

# Append features_js right before closing </script>
code = code.replace('</script>', features_js + '\n</script>', 1)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("JS logic applied successfully")
