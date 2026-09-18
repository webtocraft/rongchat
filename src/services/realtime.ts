import mqtt, { MqttClient } from 'mqtt';
import { Post, Story, Message, User } from '../types';
import { db } from './storage';
import { sound } from './sound';

const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const TOPICS = {
  PRESENCE: 'rong_social_v2/presence',
  POSTS: 'rong_social_v2/posts',
  STORIES: 'rong_social_v2/stories',
  MESSAGES: 'rong_social_v2/messages',
  SYNC: 'rong_social_v2/sync',
};

class RealtimeService {
  private client: MqttClient | null = null;
  private isConnected: boolean = false;
  private clientId: string = '';
  private heartbeatTimer: any = null;
  private cleanupTimer: any = null;
  private activeOnlinePeerMap: Map<string, { user: User; lastSeenMs: number }> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.clientId = `rong_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  }

  public subscribeStatus(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      onlinePeersCount: this.getOnlineUsers().length,
      clientId: this.clientId,
      broker: 'EMQX Live Broker'
    };
  }

  public init() {
    if (this.client) return;

    try {
      this.client = mqtt.connect(BROKER_URL, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.notify();

        // Subscribe to topics
        this.client?.subscribe(Object.values(TOPICS), err => {
          if (!err) {
            // Broadcast initial presence
            this.broadcastPresence();
            // Request existing peers data
            this.requestSync();
          }
        });

        // Start heartbeat every 15 seconds
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
          this.broadcastPresence();
        }, 15000);

        // Start stale online peer cleanup every 8 seconds
        if (this.cleanupTimer) clearInterval(this.cleanupTimer);
        this.cleanupTimer = setInterval(() => {
          this.cleanupStalePeers();
        }, 8000);
      });

      this.client.on('message', (topic, payload) => {
        try {
          const str = payload.toString();
          const data = JSON.parse(str);
          this.handleIncomingMessage(topic, data);
        } catch (e) {
          // ignore malformed packets
        }
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.notify();
      });

      this.client.on('error', () => {
        this.isConnected = false;
        this.notify();
      });
    } catch (e) {
      console.warn('Realtime MQTT initialization failed:', e);
    }
  }

  private handleIncomingMessage(topic: string, data: any) {
    if (!data || data.senderClientId === this.clientId) {
      return; // Ignore own echoes
    }

    if (topic === TOPICS.PRESENCE) {
      if (data.type === 'HEARTBEAT' && data.user) {
        this.recordPeerPresence(data.user);
      }
    } else if (topic === TOPICS.POSTS) {
      if (data.type === 'NEW_POST' && data.post) {
        db.handleRemoteNewPost(data.post);
        sound.playPop();
      } else if (data.type === 'DELETE_POST' && data.postId) {
        db.handleRemoteDeletePost(data.postId);
      } else if (data.type === 'REACT_POST' && data.postId && data.emoji && data.userId) {
        db.handleRemoteReactPost(data.postId, data.emoji, data.userId);
      } else if (data.type === 'COMMENT_POST' && data.postId && data.comment) {
        db.handleRemoteCommentPost(data.postId, data.comment);
      }
    } else if (topic === TOPICS.STORIES) {
      if (data.type === 'NEW_STORY' && data.story) {
        db.handleRemoteNewStory(data.story);
        sound.playPop();
      } else if (data.type === 'DELETE_STORY' && data.storyId) {
        db.handleRemoteDeleteStory(data.storyId);
      } else if (data.type === 'VIEW_STORY' && data.storyId && data.userId) {
        db.handleRemoteViewStory(data.storyId, data.userId);
      }
    } else if (topic === TOPICS.MESSAGES) {
      if (data.type === 'MESSAGE' && data.message) {
        db.handleRemoteMessage(data.message);
        sound.playMessageChime();
      }
    } else if (topic === TOPICS.SYNC) {
      if (data.type === 'REQUEST_SYNC') {
        this.respondToSync(data.requesterId);
      } else if (data.type === 'RESPONSE_SYNC' && data.targetId === this.clientId) {
        if (data.posts && Array.isArray(data.posts)) {
          db.mergeRemotePosts(data.posts);
        }
        if (data.stories && Array.isArray(data.stories)) {
          db.mergeRemoteStories(data.stories);
        }
        if (data.users && Array.isArray(data.users)) {
          data.users.forEach((u: User) => this.recordPeerPresence(u));
        }
      }
    }
  }

  public broadcastPresence() {
    if (!this.client || !this.isConnected) return;
    try {
      const me = db.getCurrentUser();
      if (!me) return;
      const payload = {
        senderClientId: this.clientId,
        type: 'HEARTBEAT',
        user: {
          id: me.id,
          username: me.username,
          name: me.name,
          avatar: me.avatar,
          coverPhoto: me.coverPhoto,
          bio: me.bio,
          role: me.role,
          location: me.location,
          profession: me.profession,
          website: me.website,
          isVerified: me.isVerified,
          followers: me.followers,
          following: me.following,
          online: true,
          lastSeen: new Date().toISOString()
        }
      };
      this.client.publish(TOPICS.PRESENCE, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  private requestSync() {
    if (!this.client || !this.isConnected) return;
    try {
      this.client.publish(TOPICS.SYNC, JSON.stringify({
        senderClientId: this.clientId,
        type: 'REQUEST_SYNC',
        requesterId: this.clientId
      }));
    } catch (e) {}
  }

  private respondToSync(requesterId: string) {
    if (!this.client || !this.isConnected) return;
    try {
      const posts = db.getPosts().slice(0, 30);
      const stories = db.getStories();
      const me = db.getCurrentUser();
      const users = [
        ...(me ? [me] : []),
        ...Array.from(this.activeOnlinePeerMap.values()).map(v => v.user)
      ];

      this.client.publish(TOPICS.SYNC, JSON.stringify({
        senderClientId: this.clientId,
        type: 'RESPONSE_SYNC',
        targetId: requesterId,
        posts,
        stories,
        users
      }));
    } catch (e) {}
  }

  public recordPeerPresence(peerUser: User) {
    if (!peerUser || !peerUser.id) return;
    const me = db.getCurrentUser();
    if (me && peerUser.id === me.id) return;

    // Register or update peer user in database
    db.upsertBrokerUser(peerUser);

    this.activeOnlinePeerMap.set(peerUser.id, {
      user: peerUser,
      lastSeenMs: Date.now()
    });
    this.notify();
  }

  private cleanupStalePeers() {
    const now = Date.now();
    let changed = false;
    this.activeOnlinePeerMap.forEach((entry, userId) => {
      // If no heartbeat for > 40 seconds, mark offline
      if (now - entry.lastSeenMs > 40000) {
        this.activeOnlinePeerMap.delete(userId);
        db.markUserOffline(userId);
        changed = true;
      }
    });
    if (changed) {
      this.notify();
    }
  }

  public getOnlineUsers(): User[] {
    const me = db.getCurrentUser();
    const result: User[] = me ? [{ ...me, online: true }] : [];
    const now = Date.now();

    this.activeOnlinePeerMap.forEach(entry => {
      if (now - entry.lastSeenMs <= 40000) {
        result.push({ ...entry.user, online: true });
      }
    });

    return result;
  }

  public broadcastNewPost(post: Post) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.POSTS, JSON.stringify({
      senderClientId: this.clientId,
      type: 'NEW_POST',
      post
    }));
  }

  public broadcastDeletePost(postId: string) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.POSTS, JSON.stringify({
      senderClientId: this.clientId,
      type: 'DELETE_POST',
      postId
    }));
  }

  public broadcastReactPost(postId: string, emoji: string, userId: string) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.POSTS, JSON.stringify({
      senderClientId: this.clientId,
      type: 'REACT_POST',
      postId,
      emoji,
      userId
    }));
  }

  public broadcastCommentPost(postId: string, comment: any) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.POSTS, JSON.stringify({
      senderClientId: this.clientId,
      type: 'COMMENT_POST',
      postId,
      comment
    }));
  }

  public broadcastNewStory(story: Story) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.STORIES, JSON.stringify({
      senderClientId: this.clientId,
      type: 'NEW_STORY',
      story
    }));
  }

  public broadcastDeleteStory(storyId: string) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.STORIES, JSON.stringify({
      senderClientId: this.clientId,
      type: 'DELETE_STORY',
      storyId
    }));
  }

  public broadcastViewStory(storyId: string, userId: string) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.STORIES, JSON.stringify({
      senderClientId: this.clientId,
      type: 'VIEW_STORY',
      storyId,
      userId
    }));
  }

  public broadcastMessage(message: Message) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPICS.MESSAGES, JSON.stringify({
      senderClientId: this.clientId,
      type: 'MESSAGE',
      message
    }));
  }
}

export const realtime = new RealtimeService();

// Connect storage actions to realtime broker broadcasting
db.setBroadcastHandler((type: string, payload: any) => {
  if (type === 'NEW_POST') {
    realtime.broadcastNewPost(payload);
  } else if (type === 'DELETE_POST') {
    realtime.broadcastDeletePost(payload.postId);
  } else if (type === 'REACT_POST') {
    realtime.broadcastReactPost(payload.postId, payload.emoji, payload.userId);
  } else if (type === 'COMMENT_POST') {
    realtime.broadcastCommentPost(payload.postId, payload.comment);
  } else if (type === 'NEW_STORY') {
    realtime.broadcastNewStory(payload);
  } else if (type === 'DELETE_STORY') {
    realtime.broadcastDeleteStory(payload.storyId);
  } else if (type === 'VIEW_STORY') {
    realtime.broadcastViewStory(payload.storyId, payload.userId);
  } else if (type === 'MESSAGE') {
    realtime.broadcastMessage(payload);
  } else if (type === 'PRESENCE') {
    realtime.broadcastPresence();
  }
});
