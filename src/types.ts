export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string; // handle e.g. "samiul", "webtocraft" -> accessible via /#username
  name: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  location?: string;
  profession?: string;
  website?: string;
  role: UserRole;
  isVerified?: boolean;
  followers: string[]; // user IDs
  following: string[]; // user IDs
  online: boolean;
  lastSeen?: string;
  isBanned?: boolean;
  createdAt: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  text: string;
  time: string;
}

export interface SharedPostInfo {
  originalPostId: string;
  originalAuthorId: string;
  originalAuthorName: string;
  originalAuthorUsername: string;
  originalAuthorAvatar: string;
  originalText: string;
  originalImage?: string;
  originalTime: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  text: string;
  image?: string;
  time: string;
  updatedAt?: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  comments: PostComment[];
  sharesCount: number;
  sharedPost?: SharedPostInfo;
  isPinned?: boolean;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  mediaUrl?: string;
  text?: string;
  bgGradient?: string;
  time: string;
  views: string[]; // userIds
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderUsername: string;
  receiverId: string; // 'global' or user.id
  text: string;
  mediaUrl?: string;
  time: string;
  read: boolean;
  reactions?: Record<string, string[]>;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'share' | 'message' | 'announcement';

export interface AppNotification {
  id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  actorUsername: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string; // e.g. #post-123 or /#username or #inbox
  time: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  postId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  time: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface AppSettings {
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  theme: 'light' | 'dark';
  compactMode: boolean;
  announcement: string;
  announcementActive: boolean;
}
