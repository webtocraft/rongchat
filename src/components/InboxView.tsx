import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Search, 
  Image, 
  Upload, 
  CheckCheck, 
  MessageSquare, 
  Sparkles, 
  ArrowLeft,
  X,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { User, Message } from '../types';
import { formatTimeAgo, toBanglaNumber, readFileAsDataUrl } from '../utils/format';

interface InboxViewProps {
  currentUser: User;
  users: User[];
  conversations: { user: User; lastMessage: Message; unreadCount: number }[];
  activeChatUser: User | null;
  onSelectChatUser: (user: User) => void;
  messages: Message[];
  onSendMessage: (receiverId: string, text: string, mediaUrl?: string) => void;
  onNavigateProfile: (username: string) => void;
  onSimulateReply?: (fromUser: User) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  currentUser,
  users,
  conversations,
  activeChatUser,
  onSelectChatUser,
  messages,
  onSendMessage,
  onNavigateProfile,
  onSimulateReply
}) => {
  const [inputText, setInputText] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(activeChatUser ? 'chat' : 'list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeChatUser) {
      setMobileView('chat');
    }
  }, [activeChatUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeChatUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !mediaUrl) return;
    if (!activeChatUser) return;

    onSendMessage(activeChatUser.id, inputText, mediaUrl || undefined);
    setInputText('');
    setMediaUrl(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await readFileAsDataUrl(file);
        setMediaUrl(data);
      } catch {
        alert('ছবি আপলোড করতে সমস্যা হয়েছে!');
      }
    }
  };

  // Filter conversation list or search any user in community to start new chat
  const filteredUsers = users.filter(u => 
    u.id !== currentUser.id && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex h-[76vh] max-h-[820px]">
      {/* Left Sidebar: Conversations List */}
      <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        {/* Inbox Title & Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <span>প্রাইভেট ইনবক্স</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-full">
                {toBanglaNumber(conversations.length)}
              </span>
            </h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="সদস্য খুঁজুন..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* List of active conversations or searched members */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {searchQuery ? (
            // Search Results
            <div className="p-2 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase px-2">সদস্য ফলাফল</span>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectChatUser(user);
                    setMobileView('chat');
                    setSearchQuery('');
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : conversations.length > 0 ? (
            conversations.map(({ user, lastMessage, unreadCount }) => {
              const isSelected = activeChatUser?.id === user.id;

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectChatUser(user);
                    setMobileView('chat');
                  }}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-colors relative ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/50'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/10"
                    />
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">
                        {formatTimeAgo(lastMessage.time)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {lastMessage.senderId === currentUser.id ? 'আপনি: ' : ''}
                      {lastMessage.text || '📷 ছবি'}
                    </p>
                  </div>

                  {/* Red Unread Counter Badge */}
                  {unreadCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 bg-rose-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                      {toBanglaNumber(unreadCount)}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
              <p className="text-xs font-semibold">কোনো পূর্ববর্তী কথোপকথন নেই।</p>
              <p className="text-[11px] text-slate-400 mt-1">
                উপরের সার্চ বারে নাম লিখে যেকোনো বন্ধুর সাথে চ্যাট শুরু করুন।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {activeChatUser ? (
          <>
            {/* Chat Top Header */}
            <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div 
                  onClick={() => onNavigateProfile(activeChatUser.username)}
                  className="relative cursor-pointer flex-shrink-0"
                >
                  <img
                    src={activeChatUser.avatar}
                    alt={activeChatUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  {activeChatUser.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div>
                  <h4 
                    onClick={() => onNavigateProfile(activeChatUser.username)}
                    className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{activeChatUser.name}</span>
                    {activeChatUser.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    @{activeChatUser.username} • {activeChatUser.online ? 'অনলাইনে সক্রিয়' : 'অফলাইন'}
                  </div>
                </div>
              </div>

              {/* Quick simulation helper for testing 2-way conversation */}
              {onSimulateReply && (
                <button
                  onClick={() => onSimulateReply(activeChatUser)}
                  className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all border border-indigo-200/50"
                  title="টেস্ট করুন: অপর প্রান্ত থেকে স্বয়ংক্রিয় রিপ্লাই পান যাতে আনরিড ব্যাজ ও নোটিফিকেশন চেক করা যায়"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ডেমো অটো-রিপ্লাই নিন</span>
                </button>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <img
                    src={activeChatUser.avatar}
                    alt={activeChatUser.name}
                    className="w-16 h-16 rounded-full object-cover mb-3 ring-4 ring-indigo-500/20"
                  />
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">{activeChatUser.name}</h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    এখনই একটি শুভেচ্ছা মেসেজ পাঠিয়ে ব্যক্তিগত কথোপকথন শুরু করুন।
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                        isMe ? 'ml-auto items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-xs text-sm leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-700/70'
                        }`}
                      >
                        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                        {msg.mediaUrl && (
                          <img
                            src={msg.mediaUrl}
                            alt="Message attachment"
                            className="mt-2 rounded-xl max-h-56 w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatTimeAgo(msg.time)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Media preview */}
            {mediaUrl && (
              <div className="p-2 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <img src={mediaUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-xs text-slate-500 font-medium">ছবি সংযুক্ত হয়েছে</span>
                </div>
                <button onClick={() => setMediaUrl(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="ছবি পাঠান"
              >
                <Upload className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="একটি মেসেজ লিখুন..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !mediaUrl}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 mb-3">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              আপনার ইনবক্স নির্বাচন করুন
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              বাঁ দিকের তালিকা থেকে কোনো বন্ধু নির্বাচন করুন অথবা নতুন কারো সাথে কথা বলতে সদস্য সার্চ করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
