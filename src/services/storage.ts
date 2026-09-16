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

// Initial realistic seed users
const INITIAL_USERS: User[] = [
  {
    id: 'u_admin',
    username: 'admin',
    name: 'তানভীর আহমেদ (Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'রং সোশ্যাল নেটওয়ার্কের প্রতিষ্ঠাতা ও অ্যাডমিনিস্ট্রেটর। সবার জন্য একটি নিরাপদ ও দ্রুত যোগাযোগ মাধ্যম। 🚀',
    location: 'ঢাকা, বাংলাদেশ',
    profession: 'Community Manager & Developer',
    website: 'https://rong-social.net',
    role: 'admin',
    isVerified: true,
    followers: ['u_shakib', 'u_fatima', 'u_rohan'],
    following: ['u_shakib', 'u_fatima'],
    online: true,
    lastSeen: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'u_shakib',
    username: 'shakib_dev',
    name: 'সাকিব আল হাসান',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    bio: 'টেক উৎসাহী, ফুল-স্ট্যাক ওয়েব ডেভেলপার এবং ওপেন সোর্স লাভার। কোডিং এবং বই পড়া আমার শখ। 💻☕',
    location: 'চট্টগ্রাম, বাংলাদেশ',
    profession: 'Software Engineer',
    website: 'https://github.com/shakib',
    role: 'user',
    isVerified: true,
    followers: ['u_admin', 'u_fatima'],
    following: ['u_admin', 'u_fatima', 'u_rohan'],
    online: true,
    lastSeen: new Date().toISOString(),
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'u_fatima',
    username: 'fatima_art',
    name: 'ফাতিমা নূর',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
    bio: 'ডিজিটাল আর্টিস্ট ও UI/UX ডিজাইনার। সুন্দর ভিজ্যুয়াল এবং প্রকৃতির ছবি তুলতে ভালোবাসি। 🎨✨',
    location: 'সিলেট, বাংলাদেশ',
    profession: 'UI/UX & Visual Artist',
    website: 'https://behance.net/fatima',
    role: 'user',
    isVerified: true,
    followers: ['u_admin', 'u_shakib', 'u_rohan'],
    following: ['u_admin', 'u_shakib'],
    online: true,
    lastSeen: new Date().toISOString(),
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'u_rohan',
    username: 'rohan_travels',
    name: 'রোহান চৌধুরী',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    bio: 'ভ্রমণপিপাসু ও ওয়াইল্ডলাইফ ফটোগ্রাফার। পাহাড়, নদী ও সাধারণ মানুষের গল্পের খোঁজে ঘুরে বেড়াই। 🏔️📷',
    location: 'কক্সবাজার, বাংলাদেশ',
    profession: 'Travel Photographer',
    website: 'https://instagram.com/rohan',
    role: 'user',
    isVerified: false,
    followers: ['u_shakib'],
    following: ['u_admin', 'u_shakib', 'u_fatima'],
    online: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    createdAt: '2026-02-01T00:00:00.000Z',
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'u_admin',
    authorName: 'তানভীর আহমেদ (Admin)',
    authorUsername: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: '🎉 রং সোশ্যাল নেটওয়ার্কের নতুন আল্ট্রা-ফাস্ট আপডেট লাইভ হয়েছে! এখন সম্পূর্ণ ইন্টারফেস ইনস্ট্যান্ট কাজ করে, পোস্ট এডিট ও ডিলিট, ডিরেক্ট হ্যান্ডেল লিংক (/#username), গ্লোবাল ইনবক্স ও স্টোরি ফিচার উপভোগ করুন। সবাই কেমন ফিল করছেন জানাবেন!',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    time: new Date(Date.now() - 7200000).toISOString(),
    reactions: {
      '❤️': ['u_shakib', 'u_fatima', 'u_rohan'],
      '🔥': ['u_shakib', 'u_rohan'],
      '👏': ['u_fatima']
    },
    comments: [
      {
        id: 'c_1',
        authorId: 'u_shakib',
        authorName: 'সাকিব আল হাসান',
        authorUsername: 'shakib_dev',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        text: 'এক ক্লিকেই সব লোড হচ্ছে! আগের চেয়ে অনেক বেশি স্মুথ ও পাওয়ারফুল লেগেছে। গ্রেট জব টিম! 🔥',
        time: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: 'c_2',
        authorId: 'u_fatima',
        authorName: 'ফাতিমা নূর',
        authorUsername: 'fatima_art',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        text: 'স্টোরি আর হ্যান্ডেল প্রোফাইল লিংক চমৎকার কাজ করছে। অনেক শুভকামনা! 🌈',
        time: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    sharesCount: 3,
    isPinned: true
  },
  {
    id: 'post_2',
    authorId: 'u_fatima',
    authorName: 'ফাতিমা নূর',
    authorUsername: 'fatima_art',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    text: 'আজকের বিকেলের সূর্যাস্ত অসাধারণ ছিল। আকাশ যেন রঙের ক্যানভাসে পরিণত হয়েছিল! প্রকৃতির চেয়ে বড় কোনো শিল্পী আর নেই। 🌅✨',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    time: new Date(Date.now() - 14400000).toISOString(),
    reactions: {
      '❤️': ['u_admin', 'u_shakib'],
      '👍': ['u_rohan']
    },
    comments: [
      {
        id: 'c_3',
        authorId: 'u_rohan',
        authorName: 'রোহান চৌধুরী',
        authorUsername: 'rohan_travels',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        text: 'মনোরম ফ্রেম! কোন ক্যামেরায় তোলা?',
        time: new Date(Date.now() - 10800000).toISOString()
      }
    ],
    sharesCount: 1
  }
];

const INITIAL_STORIES: Story[] = [
  {
    id: 's_1',
    authorId: 'u_admin',
    authorName: 'তানভীর আহমেদ',
    authorUsername: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    text: 'বিল্ডিং দ্য ফিউচার অব সোশ্যাল কানেকশন 🚀',
    time: new Date(Date.now() - 3600000).toISOString(),
    views: ['u_shakib']
  },
  {
    id: 's_2',
    authorId: 'u_fatima',
    authorName: 'ফাতিমা নূর',
    authorUsername: 'fatima_art',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    text: 'নতুন আর্টওয়ার্কের কাজ চলছে... 🎨',
    time: new Date(Date.now() - 7200000).toISOString(),
    views: []
  },
  {
    id: 's_3',
    authorId: 'u_rohan',
    authorName: 'রোহান চৌধুরী',
    authorUsername: 'rohan_travels',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bgGradient: 'from-amber-500 via-rose-500 to-purple-600',
    text: 'পাহাড়ের মিষ্টি বাতাস আর এক কাপ গরম চা ☕🏔️',
    time: new Date(Date.now() - 10800000).toISOString(),
    views: []
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm_g1',
    senderId: 'u_admin',
    senderName: 'তানভীর আহমেদ (Admin)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    senderUsername: 'admin',
    receiverId: 'global',
    text: 'সবাইকে গ্লোবাল কমিউনিটি চ্যাটে স্বাগতম! এখানে সরাসরি লাইভ আড্ডা দিন 💬',
    time: new Date(Date.now() - 18000000).toISOString(),
    read: true,
    reactions: { '👋': ['u_shakib', 'u_fatima'] }
  },
  {
    id: 'm_g2',
    senderId: 'u_shakib',
    senderName: 'সাকিব আল হাসান',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    senderUsername: 'shakib_dev',
    receiverId: 'global',
    text: 'হ্যালো এভরিওয়ান! প্ল্যাটফর্মটা আসলেই ইন্সট্যান্ট ফাস্ট কাজ করছে!',
    time: new Date(Date.now() - 7200000).toISOString(),
    read: true
  },
  {
    id: 'm_p1',
    senderId: 'u_fatima',
    senderName: 'ফাতিমা নূর',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    senderUsername: 'fatima_art',
    receiverId: 'u_shakib',
    text: 'আসসালামু আলাইকুম সাকিব ভাই! আপনার নতুন প্রজেক্টের আপডেট কেমন চলছে?',
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'm_p2',
    senderId: 'u_admin',
    senderName: 'তানভীর আহমেদ',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    senderUsername: 'admin',
    receiverId: 'u_shakib',
    text: 'সাকিব, ফিডব্যাক দেয়ার জন্য অনেক ধন্যবাদ! যে কোনো সমস্যা পেলে অবশ্যই জানাবেন।',
    time: new Date(Date.now() - 1800000).toISOString(),
    read: false
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n_1',
    recipientId: 'u_shakib',
    actorId: 'u_admin',
    actorName: 'তানভীর আহমেদ (Admin)',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    actorUsername: 'admin',
    type: 'like',
    title: 'পোস্টে রিঅ্যাক্ট করেছেন',
    content: 'আপনার কমেন্টে ❤️ দিয়েছেন।',
    link: '#post-post_1',
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'n_2',
    recipientId: 'u_shakib',
    actorId: 'u_fatima',
    actorName: 'ফাতিমা নূর',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    actorUsername: 'fatima_art',
    type: 'message',
    title: 'নতুন প্রাইভেট মেসেজ',
    content: 'আসসালামু আলাইকুম সাকিব ভাই! আপনার নতুন...',
    link: '#inbox-u_fatima',
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'n_3',
    recipientId: 'u_shakib',
    actorId: 'u_admin',
    actorName: 'তানভীর আহমেদ (Admin)',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    actorUsername: 'admin',
    type: 'announcement',
    title: 'অ্যাডমিন ঘোষণা',
    content: 'রং সোশ্যাল নেটওয়ার্কের নতুন সিস্টেম চালু করা হয়েছে।',
    time: new Date(Date.now() - 18000000).toISOString(),
    read: true
  }
];

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
  private currentUserId: string = 'u_shakib'; // Default logged in as Shakib or Admin
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
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedCurUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      this.currentUserId = storedCurUser && this.users.some(u => u.id === storedCurUser)
        ? storedCurUser
        : 'u_shakib';

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      this.posts = storedPosts ? JSON.parse(storedPosts) : INITIAL_POSTS;

      const storedStories = localStorage.getItem(STORAGE_KEYS.STORIES);
      this.stories = storedStories ? JSON.parse(storedStories) : INITIAL_STORIES;

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      this.messages = storedMessages ? JSON.parse(storedMessages) : INITIAL_MESSAGES;

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : INITIAL_NOTIFICATIONS;

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : [];

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? { ...INITIAL_SETTINGS, ...JSON.parse(storedSettings) } : INITIAL_SETTINGS;
      sound.enabled = this.settings.soundEnabled;

      // Persist if first time
      this.persistAll();
    } catch {
      this.users = INITIAL_USERS;
      this.currentUserId = 'u_shakib';
      this.posts = INITIAL_POSTS;
      this.stories = INITIAL_STORIES;
      this.messages = INITIAL_MESSAGES;
      this.notifications = INITIAL_NOTIFICATIONS;
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

  private emitChange() {
    this.version++;
    this.persistAll();
    this.notify();
    if (channel) {
      channel.postMessage({ type: 'SYNC' });
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
  getCurrentUser(): User {
    const user = this.users.find(u => u.id === this.currentUserId);
    if (user) return user;
    return this.users[0] || INITIAL_USERS[0];
  }

  setCurrentUser(userId: string) {
    if (this.users.some(u => u.id === userId)) {
      this.currentUserId = userId;
      this.emitChange();
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

    this.emitChange();
    return updated;
  }

  toggleFollow(targetUserId: string) {
    const me = this.getCurrentUser();
    if (me.id === targetUserId) return;

    const target = this.getUserById(targetUserId);
    if (!target) return;

    const isFollowing = me.following.includes(targetUserId);
    if (isFollowing) {
      me.following = me.following.filter(id => id !== targetUserId);
      target.followers = target.followers.filter(id => id !== me.id);
    } else {
      me.following.push(targetUserId);
      target.followers.push(me.id);

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

    sound.playPop();
    this.emitChange();
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
    return newPost;
  }

  editPost(postId: string, newText: string, newImage?: string) {
    const me = this.getCurrentUser();
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
  }

  deletePost(postId: string) {
    const me = this.getCurrentUser();
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    if (post.authorId !== me.id && me.role !== 'admin') {
      throw new Error('অনুমতি নেই: আপনি শুধুমাত্র নিজের পোস্ট ডিলিট করতে পারবেন!');
    }

    this.posts = this.posts.filter(p => p.id !== postId);
    sound.playPop();
    this.emitChange();
  }

  reactToPost(postId: string, emoji: string) {
    const me = this.getCurrentUser();
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
  }

  addComment(postId: string, text: string) {
    const me = this.getCurrentUser();
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
  }

  sharePost(postId: string, caption?: string) {
    const me = this.getCurrentUser();
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
    return newStory;
  }

  viewStory(storyId: string) {
    const me = this.getCurrentUser();
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;
    if (!story.views.includes(me.id)) {
      story.views.push(me.id);
      this.emitChange();
    }
  }

  deleteStory(storyId: string) {
    const me = this.getCurrentUser();
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;
    if (story.authorId !== me.id && me.role !== 'admin') {
      throw new Error('অনুমতি নেই');
    }
    this.stories = this.stories.filter(s => s.id !== storyId);
    sound.playPop();
    this.emitChange();
  }

  // Messages
  getGlobalMessages(): Message[] {
    return this.messages
      .filter(m => m.receiverId === 'global')
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  getPrivateMessages(targetUserId: string): Message[] {
    const me = this.getCurrentUser();
    return this.messages
      .filter(m => 
        (m.senderId === me.id && m.receiverId === targetUserId) ||
        (m.senderId === targetUserId && m.receiverId === me.id)
      )
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  getInboxConversations(): { user: User; lastMessage: Message; unreadCount: number }[] {
    const me = this.getCurrentUser();
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
    return this.messages.filter(m => m.receiverId === me.id && !m.read).length;
  }

  sendMessage(receiverId: string, text: string, mediaUrl?: string): Message {
    const me = this.getCurrentUser();
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
    return newMsg;
  }

  markMessagesAsRead(targetUserId: string) {
    const me = this.getCurrentUser();
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
    return this.notifications
      .filter(n => n.recipientId === me.id)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  getUnreadNotificationsCount(): number {
    const me = this.getCurrentUser();
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
    const myPosts = this.posts.filter(p => p.authorId === me.id);
    const myMessages = this.messages.filter(m => m.senderId === me.id || m.receiverId === me.id);
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
    this.users = INITIAL_USERS;
    this.currentUserId = 'u_shakib';
    this.posts = INITIAL_POSTS;
    this.stories = INITIAL_STORIES;
    this.messages = INITIAL_MESSAGES;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.reports = [];
    this.settings = INITIAL_SETTINGS;
    this.emitChange();
  }
}

export const db = new StorageService();
