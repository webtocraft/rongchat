import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { db } from './services/storage';
import { sound } from './services/sound';
import { realtime } from './services/realtime';
import { User, Post, Story, Message, AppNotification } from './types';
import { toBanglaNumber } from './utils/format';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { PostComposer } from './components/PostComposer';
import { PostCard } from './components/PostCard';
import { GlobalChat } from './components/GlobalChat';
import { InboxView } from './components/InboxView';
import { ProfileView } from './components/ProfileView';
import { EditProfileModal } from './components/EditProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { SearchModal } from './components/SearchModal';
import { NotificationsView } from './components/NotificationsView';
import { SettingsModal } from './components/SettingsModal';
import { GoogleSheetCodeModal } from './components/GoogleSheetCodeModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { GamesView } from './components/GamesView';
import { LiveRadioView } from './components/LiveRadioView';
import { LiveTVView } from './components/LiveTVView';

type ActiveTab = 'feed' | 'global_chat' | 'inbox' | 'games' | 'radio' | 'tv' | 'profile' | 'admin' | 'notifications';

export default function App() {
  // Sync state reactively with zero lag
  useSyncExternalStore(
    db.subscribe,
    db.getVersion
  );

  const currentUser = db.getCurrentUser();
  const users = db.getUsers();
  const posts = db.getPosts();
  const stories = db.getStories();
  const globalMessages = db.getGlobalMessages();
  const notifications = currentUser ? db.getNotifications() : [];
  const reports = db.getReports();
  const settings = db.getSettings();
  const unreadMessagesCount = currentUser ? db.getTotalUnreadPrivateMessages() : 0;
  const unreadNotificationsCount = currentUser ? db.getUnreadNotificationsCount() : 0;

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');
  const [viewingProfileUsername, setViewingProfileUsername] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);

  // Modals state
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');
  const [showSettings, setShowSettings] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('rsn_theme') as 'light' | 'dark') || 'light';
  });

  // Initialize realtime live broker sync
  useEffect(() => {
    realtime.init();
  }, []);

  // Apply dark mode class to html document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rsn_theme', theme);
  }, [theme]);

  // Handle URL hash changes for deep linking (/#username, #inbox, #global-chat, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#') {
        setActiveTab(prev => (prev === 'feed' ? prev : 'feed'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash === '#global-chat') {
        setActiveTab(prev => (prev === 'global_chat' ? prev : 'global_chat'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash === '#games') {
        setActiveTab(prev => (prev === 'games' ? prev : 'games'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash === '#radio') {
        setActiveTab(prev => (prev === 'radio' ? prev : 'radio'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash === '#tv') {
        setActiveTab(prev => (prev === 'tv' ? prev : 'tv'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash === '#inbox') {
        setActiveTab(prev => (prev === 'inbox' ? prev : 'inbox'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash.startsWith('#inbox-')) {
        const targetUserId = hash.replace('#inbox-', '');
        const targetUser = db.getUserById(targetUserId);
        if (targetUser) {
          setActiveChatUser(targetUser);
          setActiveTab(prev => (prev === 'inbox' ? prev : 'inbox'));
          setViewingProfileUsername(prev => (prev === null ? prev : null));
        }
        return;
      }

      if (hash === '#admin') {
        setActiveTab(prev => (prev === 'admin' ? prev : 'admin'));
        setViewingProfileUsername(prev => (prev === null ? prev : null));
        return;
      }

      if (hash.startsWith('#post-')) {
        setActiveTab(prev => (prev === 'feed' ? prev : 'feed'));
        const postId = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(postId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }

      // Handle user handle link: e.g. /#shakib_dev or #/shakib_dev or #shakib_dev
      const potentialHandle = hash.replace(/^[#/]+/, '').trim();
      const matchedUser = db.getUserByUsername(potentialHandle);
      if (matchedUser) {
        setViewingProfileUsername(prev => (prev === matchedUser.username ? prev : matchedUser.username));
        setActiveTab(prev => (prev === 'profile' ? prev : 'profile'));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Keyboard shortcuts (e.g. Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Profile navigation handler
  const handleNavigateProfile = (username: string) => {
    window.location.hash = `#${username}`;
    setViewingProfileUsername(username);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chat user selection handler
  const handleSelectChatUser = (targetUser: User) => {
    setActiveChatUser(targetUser);
    db.markMessagesAsRead(targetUser.id);
    setActiveTab('inbox');
    window.location.hash = `#inbox-${targetUser.id}`;
  };

  // Switch active tab and update URL
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'feed') {
      window.location.hash = '';
      setViewingProfileUsername(null);
    } else if (tab === 'profile') {
      if (currentUser) handleNavigateProfile(currentUser.username);
    } else if (tab === 'global_chat') {
      window.location.hash = '#global-chat';
    } else if (tab === 'inbox') {
      window.location.hash = '#inbox';
    } else if (tab === 'admin') {
      window.location.hash = '#admin';
    }
  };

  // If no user is logged in, show the clean Auth Screen
  if (!currentUser) {
    return (
      <AuthScreen
        theme={theme}
        onToggleTheme={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        onSuccess={() => {
          window.location.hash = '';
          setActiveTab('feed');
        }}
      />
    );
  }

  // Filtered posts for feed
  const displayPosts = feedFilter === 'following'
    ? posts.filter(p => currentUser.following.includes(p.authorId) || p.authorId === currentUser.id)
    : posts;

  // Resolved user for Profile View
  const profileTargetUser = viewingProfileUsername
    ? db.getUserByUsername(viewingProfileUsername) || currentUser
    : currentUser;

  const profileUserPosts = posts.filter(p => p.authorId === profileTargetUser.id);

  // Private messages for active chat
  const privateMessages = activeChatUser ? db.getPrivateMessages(activeChatUser.id) : [];

  // Simulated reply test helper
  const handleSimulateReply = (fromUser: User) => {
    const sampleReplies = [
      'ধন্যবাদ মেসেজ দেওয়ার জন্য! সবকিছু খুব স্মুথ চলছে। 🚀',
      'হ্যাঁ, আমি এখন অনলাইনে আছি। কেমন আছেন আপনি?',
      'অসাধারণ আইডিয়া! আমি এই পোস্টে লাইক দিয়েছি। 👍',
      'রং সোশ্যাল নেটওয়ার্কের স্পিড সত্যিই প্রশংসনীয়! 🌈'
    ];
    const randomText = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    // Send simulated reply
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: fromUser.id,
      senderName: fromUser.name,
      senderAvatar: fromUser.avatar,
      senderUsername: fromUser.username,
      receiverId: currentUser.id,
      text: randomText,
      time: new Date().toISOString(),
      read: activeTab === 'inbox' && activeChatUser?.id === fromUser.id
    };

    // Push into storage messages
    const allMsgs = (db as any).messages;
    allMsgs.push(newMsg);

    if (newMsg.read) {
      sound.playMessageChime();
    } else {
      db.addNotification({
        recipientId: currentUser.id,
        actorId: fromUser.id,
        actorName: fromUser.name,
        actorAvatar: fromUser.avatar,
        actorUsername: fromUser.username,
        type: 'message',
        title: 'নতুন মেসেজ 💬',
        content: `${fromUser.name}: ${randomText}`,
        link: `#inbox-${fromUser.id}`
      });
      db.sendBrowserPush(`মেসেজ এসেছে (${fromUser.name})`, randomText, fromUser.avatar);
    }
    (db as any).emitChange();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenCreatePost={() => {
          setActiveTab('feed');
          window.location.hash = '';
          setTimeout(() => {
            document.getElementById('post-composer-input')?.focus();
          }, 50);
        }}
        onOpenCreateStory={() => setShowCreateStory(true)}
        onLogout={() => {
          if (window.confirm('আপনি কি একাউন্ট থেকে লগআউট করতে চান?')) {
            db.logout();
          }
        }}
        onOpenAuthModal={(mode) => {
          setAuthDefaultMode(mode || 'login');
          setShowAuthModal(true);
        }}
        onNavigateProfile={handleNavigateProfile}
        onOpenGasModal={() => setShowGasModal(true)}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-5 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Menu */}
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          unreadMessagesCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenSettings={() => setShowSettings(true)}
          onLogout={() => {
            if (window.confirm('আপনি কি একাউন্ট থেকে লগআউট করতে চান?')) {
              db.logout();
            }
          }}
          onNavigateProfile={handleNavigateProfile}
        />

        {/* Center Main Stage */}
        <section className="flex-1 min-w-0">
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Stories Carousel */}
              <StoriesBar
                stories={stories}
                currentUser={currentUser}
                onOpenCreateStory={() => setShowCreateStory(true)}
                onSelectStory={story => setActiveStory(story)}
              />

              {/* Feed Switcher Tabs */}
              <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-2">
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    feedFilter === 'all'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  সকল পোস্ট ({toBanglaNumber(posts.length)})
                </button>
                <button
                  onClick={() => setFeedFilter('following')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    feedFilter === 'following'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  যাদের ফলো করছেন ({toBanglaNumber(currentUser.following.length)})
                </button>
              </div>

              {/* Post Composer Card */}
              <PostComposer
                currentUser={currentUser}
                onCreatePost={(text, image) => db.createPost(text, image)}
              />

              {/* Feed Posts List */}
              <div className="space-y-4">
                {displayPosts.length > 0 ? (
                  displayPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onReact={(id, em) => db.reactToPost(id, em)}
                      onComment={(id, text) => db.addComment(id, text)}
                      onEdit={(id, text, img) => db.editPost(id, text, img)}
                      onDelete={id => db.deletePost(id)}
                      onShare={(id, caption) => db.sharePost(id, caption)}
                      onReport={(id, reason) => db.reportPost(id, reason)}
                      onPin={id => db.togglePinPost(id)}
                      onNavigateProfile={handleNavigateProfile}
                    />
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-500">
                      কোনো পোস্ট পাওয়া যায়নি। প্রথম পোস্টটি আপনিই করুন!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Global Chat Tab */}
          {activeTab === 'global_chat' && (
            <div className="max-w-3xl mx-auto">
              <GlobalChat
                currentUser={currentUser}
                users={users}
                messages={globalMessages}
                onSendMessage={(text, mediaUrl) => db.sendMessage('global', text, mediaUrl)}
                onNavigateProfile={handleNavigateProfile}
                onSelectPrivateChat={handleSelectChatUser}
              />
            </div>
          )}

          {/* HTML5 Games Zone */}
          {activeTab === 'games' && (
            <div className="max-w-5xl mx-auto">
              <GamesView />
            </div>
          )}

          {/* Live Radio FM Stream */}
          {activeTab === 'radio' && (
            <div className="max-w-4xl mx-auto">
              <LiveRadioView />
            </div>
          )}

          {/* Live TV Channels Stream */}
          {activeTab === 'tv' && (
            <div className="max-w-5xl mx-auto">
              <LiveTVView />
            </div>
          )}

          {/* Private Inbox Tab */}
          {activeTab === 'inbox' && (
            <div className="max-w-4xl mx-auto">
              <InboxView
                currentUser={currentUser}
                users={users}
                conversations={db.getInboxConversations()}
                activeChatUser={activeChatUser}
                onSelectChatUser={handleSelectChatUser}
                messages={privateMessages}
                onSendMessage={(receiverId, text, mediaUrl) => db.sendMessage(receiverId, text, mediaUrl)}
                onNavigateProfile={handleNavigateProfile}
                onSimulateReply={handleSimulateReply}
              />
            </div>
          )}

          {/* User Profile View (/#username) */}
          {activeTab === 'profile' && (
            <ProfileView
              user={profileTargetUser}
              currentUser={currentUser}
              userPosts={profileUserPosts}
              onToggleFollow={uid => db.toggleFollow(uid)}
              onOpenEditProfile={() => setShowEditProfile(true)}
              onSelectChatUser={handleSelectChatUser}
              onReactPost={(id, em) => db.reactToPost(id, em)}
              onCommentPost={(id, text) => db.addComment(id, text)}
              onEditPost={(id, text, img) => db.editPost(id, text, img)}
              onDeletePost={id => db.deletePost(id)}
              onSharePost={(id, cap) => db.sharePost(id, cap)}
              onReportPost={(id, r) => db.reportPost(id, r)}
              onNavigateProfile={handleNavigateProfile}
            />
          )}

          {/* Admin Panel Tab */}
          {activeTab === 'admin' && (
            <AdminPanel
              currentUser={currentUser}
              users={users}
              posts={posts}
              reports={reports}
              settings={settings}
              onSetAnnouncement={text => db.setAnnouncement(text)}
              onToggleVerifyUser={uid => db.toggleVerifyUser(uid)}
              onToggleBanUser={uid => db.toggleBanUser(uid)}
              onTogglePinPost={pid => db.togglePinPost(pid)}
              onDeletePost={pid => db.deletePost(pid)}
              onResolveReport={(rid, status) => db.resolveReport(rid, status)}
              onResetDemoData={() => db.resetDemoData()}
              onNavigateProfile={handleNavigateProfile}
            />
          )}

          {/* Real-time Notifications Tab */}
          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              currentUser={currentUser}
              onMarkAllRead={() => db.markAllNotificationsAsRead()}
              onSelectNotification={n => {
                db.markNotificationAsRead(n.id);
                if (n.link) {
                  window.location.hash = n.link;
                }
              }}
              onRequestPushPermission={() => db.requestNotificationPermission()}
              hasPushPermission={typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'}
            />
          )}
        </section>

        {/* Right Sidebar */}
        <RightSidebar
          users={users}
          currentUser={currentUser}
          announcement={settings.announcement}
          announcementActive={settings.announcementActive}
          onSelectChatUser={handleSelectChatUser}
          onNavigateProfile={handleNavigateProfile}
          onToggleFollow={uid => db.toggleFollow(uid)}
        />
      </main>

      {/* Story Viewer Modal */}
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          stories={stories}
          currentUser={currentUser}
          onClose={() => setActiveStory(null)}
          onDeleteStory={sid => {
            db.deleteStory(sid);
            setActiveStory(null);
          }}
          onViewStory={sid => db.viewStory(sid)}
          onChangeStory={s => {
            setActiveStory(s);
            db.viewStory(s.id);
          }}
        />
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <CreateStoryModal
          onClose={() => setShowCreateStory(false)}
          onSubmit={(text, mediaUrl, bgGradient) => {
            db.addStory(text, mediaUrl, bgGradient);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setShowEditProfile(false)}
          onSave={data => db.updateProfile(data)}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        users={users}
        posts={posts}
        onNavigateProfile={handleNavigateProfile}
        onSelectPost={postId => {
          setActiveTab('feed');
          window.location.hash = `#post-${postId}`;
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={partial => db.updateSettings(partial)}
        onExportData={() => {
          const json = db.exportData();
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `rong-social-data-${currentUser.username}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        onResetData={() => db.resetDemoData()}
        onRequestPush={() => db.requestNotificationPermission()}
        onTestPush={() => {
          db.sendBrowserPush(
            '🔔 পুশ নোটিফিকেশন টেস্ট',
            'রং সোশ্যাল নেটওয়ার্কের পুশ অ্যালার্ট কাজ করছে!'
          );
          sound.playNotification();
        }}
      />

      {/* Google Sheets Code (Code.gs & Index.html) Modal */}
      {showGasModal && (
        <GoogleSheetCodeModal onClose={() => setShowGasModal(false)} />
      )}

      {/* Auth Modal: Login & Registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authDefaultMode}
        onSuccess={(username) => {
          setActiveTab('feed');
          window.location.hash = '';
        }}
      />
    </div>
  );
}
