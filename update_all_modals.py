import re

with open('Index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Story Viewer modal to add emoji reaction bar and floating emojis
story_modal_old_body = '''      <!-- Controls -->
      <button onclick="prevStory(event)" class="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors">
        <i data-lucide="chevron-left" class="w-5 h-5"></i>
      </button>
      <button onclick="nextStory(event)" class="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors">
        <i data-lucide="chevron-right" class="w-5 h-5"></i>
      </button>
    </div>
  </div>'''

story_modal_new_body = '''      <!-- Controls -->
      <button onclick="prevStory(event)" class="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors">
        <i data-lucide="chevron-left" class="w-5 h-5"></i>
      </button>
      <button onclick="nextStory(event)" class="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors">
        <i data-lucide="chevron-right" class="w-5 h-5"></i>
      </button>

      <!-- Story Reactions & Quick Reply Bar -->
      <div class="absolute bottom-3 inset-x-3 z-30 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 rounded-2xl">
        <!-- Quick Emojis Reaction Dock -->
        <div class="flex items-center justify-around bg-black/60 backdrop-blur-md rounded-2xl px-2 py-1.5 border border-white/10">
          <button onclick="reactToCurrentStory('❤️')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Love">❤️</button>
          <button onclick="reactToCurrentStory('🔥')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Fire">🔥</button>
          <button onclick="reactToCurrentStory('😂')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Haha">😂</button>
          <button onclick="reactToCurrentStory('👏')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Clap">👏</button>
          <button onclick="reactToCurrentStory('😮')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Wow">😮</button>
          <button onclick="reactToCurrentStory('😢')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Sad">😢</button>
          <button onclick="reactToCurrentStory('😍')" class="text-xl hover:scale-130 active:scale-90 transition-transform" title="Love eyes">😍</button>
        </div>
        <!-- Reply Input -->
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            id="story-reply-input" 
            placeholder="স্টোরিতে রিপ্লাই দিন..." 
            class="flex-1 bg-white/20 backdrop-blur-md text-white placeholder:text-white/60 text-xs px-3.5 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            onkeydown="if(event.key==='Enter') sendStoryReply()"
          >
          <button onclick="sendStoryReply()" class="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>

      <!-- Floating Emoji Animation Box -->
      <div id="story-reaction-float-box" class="absolute inset-0 pointer-events-none z-40 overflow-hidden"></div>
    </div>
  </div>

  <!-- REEL COMMENTS DRAWER MODAL -->
  <div id="modal-reel-comments" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[70vh] sm:h-[520px] p-4 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="message-square" class="w-4 h-4 text-pink-500"></i>
          <span>রিলস মন্তব্যসমূহ (<span id="reel-comment-count-badge">০</span>)</span>
        </h3>
        <button onclick="closeModal('modal-reel-comments')" class="p-1 rounded-full text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <div id="reel-comments-list" class="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
        <!-- Dynamic comments -->
      </div>

      <form onsubmit="handleReelCommentSubmit(event)" class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <input 
          type="text" 
          id="reel-comment-input" 
          placeholder="একটি সুন্দর মন্তব্য লিখুন..." 
          class="flex-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
        >
        <button type="submit" class="p-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </form>
    </div>
  </div>'''

content = content.replace(story_modal_old_body, story_modal_new_body, 1)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modals updated successfully")
