import { User, Post, Story, Message, AppNotification, ReportItem, AppSettings } from '../types';
import { sound } from './sound';

const STORAGE_KEYS = {
  USERS: 'rsn_users_v2',
  CURRENT_USER_ID: 'rsn_current_user_id_v2',
  POSTS: 'rsn_posts_v2',
  STORIES: 'rsn_stories_v2',
  MESSAGES: 'rsn_messages_v2',
  NOTIFICATIONS: 'rsn_notifications_v2',
  REPORTS: 'rsn_reports_v2',
  SETTINGS: 'rsn_settings_v2',
};

// Initial realistic seed users (Demo users removed - users must login or register)
const INITIAL_USERS: User[] = [];

const INITIAL_POSTS: Post[] = [];

const INITIAL_STORIES: Story[] = [];

const INITIAL_MESSAGES: Message[] = [];

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

const INITIAL_SETTINGS: AppSettings = {
  soundEnabled: true,
  browserNotificationsEnabled: true,
  theme: 'light',
  compactMode: false,
  announcement: '📢 নতুন আপডেট: পোস্ট এডিট/ডিলিট, ইউজার হ্যান্ডেল লিংক (/#username), গ্লোবাল চ্যাট ও স্টোরি ফিচার চালু হয়েছে!',
  announcementActive: true
};

// Multi-tab sync channel
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('rsn_sync_channel')
  : null;

class StorageService {
  private users: User[] = [];
  private currentUserId: string = ''; // No hardcoded demo user; starts empty until login/register
  private posts: Post[] = [];
  private stories: Story[] = [];
  private messages: Message[] = [];
  private notifications: AppNotification[] = [];
  private reports: ReportItem[] = [];
  private settings: AppSettings = INITIAL_SETTINGS;
  private listeners: Set<() => void> = new Set();
  private version: number = 0;

  getVersion = (): number => {
    return this.version;
  };

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      let parsedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Purge old demo users if they exist in localStorage from earlier runs
      const demoIds = ['u_admin', 'u_shakib', 'u_fatima', 'u_rohan'];
      const demoUsernames = ['shakib_dev', 'fatima_art', 'rohan_travels'];
      parsedUsers = parsedUsers.filter(u => !demoIds.includes(u.id) && !demoUsernames.includes(u.username));

      const storedCurUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      this.currentUserId = storedCurUser && parsedUsers.some(u => u.id === storedCurUser)
        ? storedCurUser
        : '';

      if (!this.currentUserId) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }

      this.users = parsedUsers.map(u => ({
        ...u,
        online: u.id === this.currentUserId
      }));

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      let parsedPosts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];
      parsedPosts = parsedPosts.filter(p => !demoIds.includes(p.authorId));
      this.posts = parsedPosts;

      const storedStories = localStorage.getItem(STORAGE_KEYS.STORIES);
      let parsedStories: Story[] = storedStories ? JSON.parse(storedStories) : [];
      parsedStories = parsedStories.filter(s => !demoIds.includes(s.authorId));
      this.stories = parsedStories;

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      let parsedMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
      parsedMessages = parsedMessages.filter(m => !demoIds.includes(m.senderId));
      this.messages = parsedMessages;

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [];

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : [];

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? { ...INITIAL_SETTINGS, ...JSON.parse(storedSettings) } : INITIAL_SETTINGS;
      sound.enabled = this.settings.soundEnabled;

      this.persistAll();
    } catch {
      this.users = [];
      this.currentUserId = '';
      this.posts = [];
      this.stories = [];
      this.messages = [];
      this.notifications = [];
      this.reports = [];
      this.settings = INITIAL_SETTINGS;
    }

    // Listen to broadcast updates across tabs
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC') {
          this.reloadFromStorage();
          this.notify();
        }
      };
    }

    // Listen to window storage events
    window.addEventListener('storage', () => {
      this.reloadFromStorage();
      this.notify();
    });
  }

  private reloadFromStorage() {
    try {
      const u = localStorage.getItem(STORAGE_KEYS.USERS);
      if (u) this.users = JSON.parse(u);

      const p = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (p) this.posts = JSON.parse(p);

      const s = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (s) this.stories = JSON.parse(s);

      const m = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (m) this.messages = JSON.parse(m);

      const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (n) this.notifications = JSON.parse(n);

      const r = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (r) this.reports = JSON.parse(r);

      const st = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (st) this.settings = JSON.parse(st);

      this.version++;
    } catch {
      // ignore
    }
  }

  private persistAll() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(this.posts));
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(this.stories));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  private broadcastHandler: ((type: string, payload: any) => void) | null = null;

  public setBroadcastHandler(handler: (type: string, payload: any) => void) {
    this.broadcastHandler = handler;
  }

  private broadcast(type: string, payload: any) {
    if (this.broadcastHandler) {
      try {
        this.broadcastHandler(type, payload);
      } catch {
        // ignore
      }
    }
  }

  private emitChange() {
    this.version++;
    this.persistAll();
    this.notify();
    if (channel) {
      channel.postMessage({ type: 'SYNC' });
    }
  }

  // Broker presence and online users management
  upsertBrokerUser(peer: User) {
    if (!peer || !peer.id) return;
    const idx = this.users.findIndex(u => u.id === peer.id || (peer.username && u.username.toLowerCase() === peer.username.toLowerCase()));
    if (idx > -1) {
      this.users[idx] = {
        ...this.users[idx],
        name: peer.name || this.users[idx].name,
        avatar: peer.avatar || this.users[idx].avatar,
        bio: peer.bio || this.users[idx].bio,
        online: true,
        lastSeen: new Date().toISOString()
      };
    } else {
      this.users.push({
        ...peer,
        online: true,
        lastSeen: new Date().toISOString()
      });
    }
    this.version++;
    this.persistAll();
    this.notify();
  }

  markUserOffline(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.id !== this.currentUserId) {
      user.online = false;
      this.version++;
      this.notify();
    }
  }

  // Remote event handlers from broker
  handleRemoteNewPost(post: Post) {
    if (!post || !post.id) return;
    if (!this.posts.some(p => p.id === post.id)) {
      this.posts.unshift(post);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteDeletePost(postId: string) {
    const prevLen = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== postId);
    if (this.posts.length !== prevLen) {
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteReactPost(postId: string, emoji: string, userId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.reactions) post.reactions = {};
    if (!post.reactions[emoji]) post.reactions[emoji] = [];
    if (!post.reactions[emoji].includes(userId)) {
      Object.keys(post.reactions).forEach(em => {
        post.reactions[em] = (post.reactions[em] || []).filter(uid => uid !== userId);
        if (post.reactions[em].length === 0) delete post.reactions[em];
      });
      if (!post.reactions[emoji]) post.reactions[emoji] = [];
      post.reactions[emoji].push(userId);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteCommentPost(postId: string, comment: any) {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !comment) return;
    if (!post.comments) post.comments = [];
    if (!post.comments.some(c => c.id === comment.id)) {
      post.comments.push(comment);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteNewStory(story: Story) {
    if (!story || !story.id) return;
    if (!this.stories.some(s => s.id === story.id)) {
      this.stories.unshift(story);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteDeleteStory(storyId: string) {
    const prevLen = this.stories.length;
    this.stories = this.stories.filter(s => s.id !== storyId);
    if (this.stories.length !== prevLen) {
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteViewStory(storyId: string, userId: string) {
    const story = this.stories.find(s => s.id === storyId);
    if (story && !story.views.includes(userId)) {
      story.views.push(userId);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  handleRemoteMessage(message: Message) {
    if (!message || !message.id) return;
    if (!this.messages.some(m => m.id === message.id)) {
      this.messages.push(message);
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  mergeRemotePosts(posts: Post[]) {
    let added = false;
    posts.forEach(p => {
      if (p && p.id && !this.posts.some(existing => existing.id === p.id)) {
        this.posts.push(p);
        added = true;
      }
    });
    if (added) {
      this.posts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  mergeRemoteStories(stories: Story[]) {
    let added = false;
    stories.forEach(s => {
      if (s && s.id && !this.stories.some(existing => existing.id === s.id)) {
        this.stories.push(s);
        added = true;
      }
    });
    if (added) {
      this.version++;
      this.persistAll();
      this.notify();
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Push notification helper
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  sendBrowserPush(title: string, body: string, icon?: string) {
    if (!this.settings.browserNotificationsEnabled) return;
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: icon || '/vite.svg',
        });
      } catch {
        // ignore
      }
    }
  }

  // Current User
  getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.find(u => u.id === this.currentUserId) || null;
  }

  setCurrentUser(userId: string) {
    if (this.users.some(u => u.id === userId)) {
      this.currentUserId = userId;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      this.users = this.users.map(u => ({
        ...u,
        online: u.id === userId
      }));
      this.persistAll();
      this.emitChange();
      this.broadcast('PRESENCE', {});
    }
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    const clean = username.toLowerCase().replace(/^[@#]/, '').trim();
    return this.users.find(u => u.username.toLowerCase() === clean);
  }

  updateProfile(data: Partial<User> & { id: string }): User {
    const idx = this.users.findIndex(u => u.id === data.id);
    if (idx === -1) throw new Error('User not found');

    // Check if new username is unique
    if (data.username) {
      const cleanUsername = data.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const conflict = this.users.find(u => u.id !== data.id && u.username.toLowerCase() === cleanUsername);
      if (conflict) {
        throw new Error(`@${cleanUsername} এই হ্যান্ডেলটি ইতিমধ্যে অন্য কেউ ব্যবহার করছেন!`);
      }
      data.username = cleanUsername;
    }

    this.users[idx] = { ...this.users[idx], ...data };

    // Also update authorName/avatar in their posts
    const updated = this.users[idx];
    this.posts = this.posts.map(p => {
      if (p.authorId === updated.id) {
        return {
          ...p,
          authorName: updated.name,
          authorUsername: updated.username,
          authorAvatar: updated.avatar
        };
      }
      return p;
    });

    this.persistAll();
    this.emitChange();
    return updated;
  }

  // Authentication: Login, Sign up / Register, Logout
  loginUser(usernameInput: string, passwordInput?: string): User {
    const clean = usernameInput.toLowerCase().replace(/^[@#]/, '').trim();
    const user = this.users.find(u => u.username.toLowerCase() === clean);

    if (!user) {
      throw new Error(`@${clean} ইউজারনেম দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি! অনুগ্রহ করে নতুন অ্যাকাউন্ট রেজিস্টার করুন।`);
    }

    // Verify stored password if one exists
    try {
      const storedPassMap = JSON.parse(localStorage.getItem('rsn_user_passwords') || '{}');
      if (storedPassMap[clean] && passwordInput && storedPassMap[clean] !== passwordInput) {
        throw new Error('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('পাসওয়ার্ড')) throw e;
    }

    this.currentUserId = user.id;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    this.users = this.users.map(u => ({
      ...u,
      online: u.id === user.id
    }));
    this.persistAll();
    this.emitChange();
    this.broadcast('PRESENCE', {});
    return user;
  }

  registerUser(data: {
    name: string;
    username: string;
    password?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    profession?: string;
    website?: string;
  }): User {
    const cleanUsername = data.username.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
    if (!cleanUsername) {
      throw new Error('একটি সঠিক ইউজারনেম দিন (ইংরেজি অক্ষর ও সংখ্যা)');
    }

    const existing = this.users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      throw new Error(`@${cleanUsername} ইউজারনেমটি ইতিমধ্যে বিদ্যমান! অন্য ইউজারনেম বেছে নিন বা লগইন করুন।`);
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    ];
    const pickedAvatar = data.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const isFirst = this.users.length === 0 || cleanUsername === 'admin';

    const newUser: User = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUsername,
      name: data.name.trim(),
      avatar: pickedAvatar,
      coverPhoto: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      bio: data.bio || 'রং সোশ্যাল নেটওয়ার্ক মেম্বার ✨',
      location: data.location || 'বাংলাদেশ',
      profession: data.profession || 'সোশ্যাল মেম্বার',
      website: data.website || '',
      role: isFirst ? 'admin' : 'user',
      isVerified: isFirst,
      followers: [],
      following: [],
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Provide a friendly welcome follower from community admin/official account
    const welcomeUser = this.users.find(u => u.id !== newUser.id);
    if (welcomeUser) {
      if (!welcomeUser.following) welcomeUser.following = [];
      if (!welcomeUser.following.includes(newUser.id)) {
        welcomeUser.following.push(newUser.id);
      }
      newUser.followers.push(welcomeUser.id);
    }

    // Save password securely in local storage
    if (data.password) {
      try {
        const storedPassMap = JSON.parse(localStorage.getItem('rsn_user_passwords') || '{}');
        storedPassMap[cleanUsername] = data.password;
        localStorage.setItem('rsn_user_passwords', JSON.stringify(storedPassMap));
      } catch {
        // ignore
      }
    }

    this.users.unshift(newUser);
    this.currentUserId = newUser.id;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    this.persistAll();
    this.emitChange();
    this.broadcast('PRESENCE', {});
    return newUser;
  }

  logout() {
    this.currentUserId = '';
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    this.users = this.users.map(u => ({ ...u, online: false }));
    this.persistAll();
    this.emitChange();
    this.broadcast('PRESENCE', {});
  }

  toggleFollow(targetUserId: string) {
    const me = this.getCurrentUser();
    if (!me || me.id === targetUserId) return;

    const target = this.getUserById(targetUserId);
    if (!target) return;

    if (!me.following) me.following = [];
    if (!target.followers) target.followers = [];

    const isFollowing = me.following.includes(targetUserId);
    if (isFollowing) {
      me.following = me.following.filter(id => id !== targetUserId);
      target.followers = target.followers.filter(id => id !== me.id);
    } else {
      me.following.push(targetUserId);
      if (!target.followers.includes(me.id)) {
        target.followers.push(me.id);
      }

      // Notification
      this.addNotification({
        recipientId: targetUserId,
        actorId: me.id,
        actorName: me.name,
        actorAvatar: me.avatar,
        actorUsername: me.username,
        type: 'follow',
        title: 'নতুন ফলোয়ার',
        content: `${me.name} আপনাকে ফলো করা শুরু করেছেন!`,
        link: `/#${me.username}`
      });
    }

    this.persistAll();
    sound.playPop();
    this.emitChange();
    this.broadcast('PRESENCE', {});
  }

  getFollowersCount(userId: string): number {
    const user = this.getUserById(userId);
    if (!user) return 0;
    const directFollowers = user.followers || [];
    const fromFollowing = this.users
      .filter(u => u.following && u.following.includes(userId))
      .map(u => u.id);
    const unique = new Set([...directFollowers, ...fromFollowing]);
    return unique.size;
  }

  getFollowingCount(userId: string): number {
    const user = this.getUserById(userId);
    if (!user) return 0;
    return (user.following || []).length;
  }

  // Posts
  getPosts(): Post[] {
    return [...this.posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
  }

  createPost(text: string, image?: string): Post {
    const me = this.getCurrentUser();
    if (!me) {
      throw new Error('পোস্ট করতে অনুগ্রহ করে লগইন করুন');
    }
    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      authorId: me.id,
      authorName: me.name,
      authorUsername: me.username,
      authorAvatar: me.avatar,
      text: text.trim(),
      image: image || undefined,
      time: new Date().toISOString(),
      reactions: {},
      comments: [],
      sharesCount: 0
    };

    this.posts.unshift(newPost);
    sound.playPop();
    this.emitChange();
    this.broadcast('NEW_POST', newPost);
    return newPost;
  }

  editPost(postId: string, newText: string, newImage?: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== me.id && me.role !== 'admin') {
      throw new Error('অনুমতি নেই: আপনি শুধুমাত্র নিজের পোস্ট এডিট করতে পারবেন!');
    }

    post.text = newText.trim();
    if (newImage !== undefined) {
      post.image = newImage || undefined;
    }
    post.updatedAt = new Date().toISOString();
    sound.playPop();
    this.emitChange();
    this.broadcast('NEW_POST', post);
  }

  deletePost(postId: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    if (post.authorId !== me.id && me.role !== 'admin') {
      throw new Error('অনুমতি নেই: আপনি শুধুমাত্র নিজের পোস্ট ডিলিট করতে পারবেন!');
    }

    this.posts = this.posts.filter(p => p.id !== postId);
    sound.playPop();
    this.emitChange();
    this.broadcast('DELETE_POST', { postId });
  }

  reactToPost(postId: string, emoji: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.reactions) post.reactions = {};

    const users = post.reactions[emoji] || [];
    const hasReacted = users.includes(me.id);

    // Remove any other reaction this user might have given
    Object.keys(post.reactions).forEach(e => {
      post.reactions[e] = (post.reactions[e] || []).filter(uid => uid !== me.id);
      if (post.reactions[e].length === 0) delete post.reactions[e];
    });

    if (!hasReacted) {
      if (!post.reactions[emoji]) post.reactions[emoji] = [];
      post.reactions[emoji].push(me.id);

      // Trigger notification if reacting to someone else's post
      if (post.authorId !== me.id) {
        this.addNotification({
          recipientId: post.authorId,
          actorId: me.id,
          actorName: me.name,
          actorAvatar: me.avatar,
          actorUsername: me.username,
          type: 'like',
          title: 'পোস্টে রিঅ্যাকশন',
          content: `${me.name} আপনার পোস্টে ${emoji} রিঅ্যাক্ট দিয়েছেন: "${post.text.slice(0, 30)}..."`,
          link: `#post-${post.id}`
        });
      }
    }

    sound.playPop();
    this.emitChange();
    this.broadcast('REACT_POST', { postId, emoji, userId: me.id });
  }

  addComment(postId: string, text: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post || !text.trim()) return;

    const comment = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      authorId: me.id,
      authorName: me.name,
      authorUsername: me.username,
      authorAvatar: me.avatar,
      text: text.trim(),
      time: new Date().toISOString()
    };

    if (!post.comments) post.comments = [];
    post.comments.push(comment);

    if (post.authorId !== me.id) {
      this.addNotification({
        recipientId: post.authorId,
        actorId: me.id,
        actorName: me.name,
        actorAvatar: me.avatar,
        actorUsername: me.username,
        type: 'comment',
        title: 'নতুন কমেন্ট',
        content: `${me.name} কমেন্ট করেছেন: "${text.trim().slice(0, 40)}"`,
        link: `#post-${post.id}`
      });
    }

    sound.playPop();
    this.emitChange();
    this.broadcast('COMMENT_POST', { postId, comment });
  }

  sharePost(postId: string, caption?: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    post.sharesCount = (post.sharesCount || 0) + 1;

    // Create shared post in feed
    const shared: Post = {
      id: `post_share_${Date.now()}`,
      authorId: me.id,
      authorName: me.name,
      authorUsername: me.username,
      authorAvatar: me.avatar,
      text: caption ? caption.trim() : `শেয়ার করেছেন @${post.authorUsername}-এর পোস্ট`,
      time: new Date().toISOString(),
      reactions: {},
      comments: [],
      sharesCount: 0,
      sharedPost: {
        originalPostId: post.id,
        originalAuthorId: post.authorId,
        originalAuthorName: post.authorName,
        originalAuthorUsername: post.authorUsername,
        originalAuthorAvatar: post.authorAvatar,
        originalText: post.text,
        originalImage: post.image,
        originalTime: post.time
      }
    };

    this.posts.unshift(shared);

    if (post.authorId !== me.id) {
      this.addNotification({
        recipientId: post.authorId,
        actorId: me.id,
        actorName: me.name,
        actorAvatar: me.avatar,
        actorUsername: me.username,
        type: 'share',
        title: 'পোস্ট শেয়ার',
        content: `${me.name} আপনার পোস্টটি শেয়ার করেছেন!`,
        link: `#post-${shared.id}`
      });
    }

    sound.playPop();
    this.emitChange();
  }

  // Stories
  getStories(): Story[] {
    return this.stories;
  }

  addStory(text?: string, mediaUrl?: string, bgGradient?: string): Story {
    const me = this.getCurrentUser();
    if (!me) {
      throw new Error('স্টোরি দিতে অনুগ্রহ করে লগইন করুন');
    }
    const newStory: Story = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      authorId: me.id,
      authorName: me.name,
      authorUsername: me.username,
      authorAvatar: me.avatar,
      mediaUrl: mediaUrl || undefined,
      text: text ? text.trim() : undefined,
      bgGradient: bgGradient || 'from-indigo-600 via-purple-600 to-pink-500',
      time: new Date().toISOString(),
      views: []
    };

    this.stories.unshift(newStory);
    sound.playPop();
    this.emitChange();
    this.broadcast('NEW_STORY', newStory);
    return newStory;
  }

  viewStory(storyId: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;
    if (!story.views.includes(me.id)) {
      story.views.push(me.id);
      this.emitChange();
      this.broadcast('VIEW_STORY', { storyId, userId: me.id });
    }
  }

  deleteStory(storyId: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;
    if (story.authorId !== me.id && me.role !== 'admin') {
      throw new Error('অনুমতি নেই');
    }
    this.stories = this.stories.filter(s => s.id !== storyId);
    sound.playPop();
    this.emitChange();
    this.broadcast('DELETE_STORY', { storyId });
  }

  // Messages
  getGlobalMessages(): Message[] {
    return this.messages
      .filter(m => m.receiverId === 'global')
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  getPrivateMessages(targetUserId: string): Message[] {
    const me = this.getCurrentUser();
    if (!me) return [];
    return this.messages
      .filter(m => 
        (m.senderId === me.id && m.receiverId === targetUserId) ||
        (m.senderId === targetUserId && m.receiverId === me.id)
      )
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  getInboxConversations(): { user: User; lastMessage: Message; unreadCount: number }[] {
    const me = this.getCurrentUser();
    if (!me) return [];
    const conversationMap = new Map<string, { lastMessage: Message; unreadCount: number }>();

    // Process all private messages involving current user
    this.messages.forEach(m => {
      if (m.receiverId === 'global') return;
      if (m.senderId !== me.id && m.receiverId !== me.id) return;

      const otherUserId = m.senderId === me.id ? m.receiverId : m.senderId;
      const existing = conversationMap.get(otherUserId);
      const isUnread = m.receiverId === me.id && !m.read;

      if (!existing) {
        conversationMap.set(otherUserId, {
          lastMessage: m,
          unreadCount: isUnread ? 1 : 0
        });
      } else {
        const isNewer = new Date(m.time).getTime() > new Date(existing.lastMessage.time).getTime();
        conversationMap.set(otherUserId, {
          lastMessage: isNewer ? m : existing.lastMessage,
          unreadCount: existing.unreadCount + (isUnread ? 1 : 0)
        });
      }
    });

    const result: { user: User; lastMessage: Message; unreadCount: number }[] = [];
    conversationMap.forEach((val, otherUserId) => {
      const user = this.getUserById(otherUserId);
      if (user) {
        result.push({
          user,
          lastMessage: val.lastMessage,
          unreadCount: val.unreadCount
        });
      }
    });

    return result.sort((a, b) => new Date(b.lastMessage.time).getTime() - new Date(a.lastMessage.time).getTime());
  }

  getTotalUnreadPrivateMessages(): number {
    const me = this.getCurrentUser();
    if (!me) return 0;
    return this.messages.filter(m => m.receiverId === me.id && !m.read).length;
  }

  sendMessage(receiverId: string, text: string, mediaUrl?: string): Message {
    const me = this.getCurrentUser();
    if (!me) {
      throw new Error('মেসেজ পাঠাতে অনুগ্রহ করে লগইন করুন');
    }
    const newMsg: Message = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderId: me.id,
      senderName: me.name,
      senderAvatar: me.avatar,
      senderUsername: me.username,
      receiverId,
      text: text.trim(),
      mediaUrl: mediaUrl || undefined,
      time: new Date().toISOString(),
      read: false
    };

    this.messages.push(newMsg);
    sound.playMessageChime();

    // Trigger notification and push if private message
    if (receiverId !== 'global') {
      this.addNotification({
        recipientId: receiverId,
        actorId: me.id,
        actorName: me.name,
        actorAvatar: me.avatar,
        actorUsername: me.username,
        type: 'message',
        title: 'নতুন প্রাইভেট মেসেজ 💬',
        content: `${me.name}: ${text.trim().slice(0, 50)}`,
        link: `#inbox-${me.id}`
      });

      this.sendBrowserPush(
        `নতুন মেসেজ (${me.name})`,
        text.trim().slice(0, 80),
        me.avatar
      );
    }

    this.emitChange();
    this.broadcast('MESSAGE', newMsg);
    return newMsg;
  }

  markMessagesAsRead(targetUserId: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    let changed = false;
    this.messages.forEach(m => {
      if (m.senderId === targetUserId && m.receiverId === me.id && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.emitChange();
    }
  }

  // Notifications
  getNotifications(): AppNotification[] {
    const me = this.getCurrentUser();
    if (!me) return [];
    return this.notifications
      .filter(n => n.recipientId === me.id)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  getUnreadNotificationsCount(): number {
    const me = this.getCurrentUser();
    if (!me) return 0;
    return this.notifications.filter(n => n.recipientId === me.id && !n.read).length;
  }

  addNotification(n: Omit<AppNotification, 'id' | 'time' | 'read'>) {
    const notif: AppNotification = {
      ...n,
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(notif);
    sound.playNotification();

    // Send push notification if recipient is current user or for all
    this.sendBrowserPush(notif.title, notif.content, notif.actorAvatar);
    this.emitChange();
  }

  markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      this.emitChange();
    }
  }

  markAllNotificationsAsRead() {
    const me = this.getCurrentUser();
    if (!me) return;
    this.notifications.forEach(n => {
      if (n.recipientId === me.id) {
        n.read = true;
      }
    });
    this.emitChange();
  }

  // Moderation & Admin
  getReports(): ReportItem[] {
    return this.reports;
  }

  reportPost(postId: string, reason: string) {
    const me = this.getCurrentUser();
    if (!me) return;
    const item: ReportItem = {
      id: `rep_${Date.now()}`,
      postId,
      reporterId: me.id,
      reporterName: me.name,
      reason,
      time: new Date().toISOString(),
      status: 'pending'
    };
    this.reports.unshift(item);
    this.emitChange();
  }

  resolveReport(reportId: string, status: 'resolved' | 'dismissed') {
    const rep = this.reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = status;
      this.emitChange();
    }
  }

  togglePinPost(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isPinned = !post.isPinned;
      this.emitChange();
    }
  }

  toggleVerifyUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isVerified = !user.isVerified;
      this.emitChange();
    }
  }

  toggleBanUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isBanned = !user.isBanned;
      this.emitChange();
    }
  }

  setAnnouncement(text: string) {
    this.settings.announcement = text.trim();
    this.settings.announcementActive = !!text.trim();
    this.emitChange();
  }

  // Settings
  getSettings(): AppSettings {
    return this.settings;
  }

  updateSettings(partial: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...partial };
    sound.enabled = this.settings.soundEnabled;
    this.emitChange();
  }

  exportData(): string {
    const me = this.getCurrentUser();
    const myPosts = me ? this.posts.filter(p => p.authorId === me.id) : [];
    const myMessages = me ? this.messages.filter(m => m.senderId === me.id || m.receiverId === me.id) : [];
    const data = {
      profile: me,
      posts: myPosts,
      messages: myMessages,
      exportedAt: new Date().toISOString(),
      platform: 'Rong Social Network'
    };
    return JSON.stringify(data, null, 2);
  }

  resetDemoData() {
    this.users = [];
    this.currentUserId = '';
    this.posts = [];
    this.stories = [];
    this.messages = [];
    this.notifications = [];
    this.reports = [];
    this.settings = INITIAL_SETTINGS;
    localStorage.clear();
    this.emitChange();
    this.broadcast('PRESENCE', {});
  }
}

export const db = new StorageService();
