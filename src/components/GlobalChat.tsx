import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, Users, Sparkles, Upload, X } from 'lucide-react';
import { Message, User } from '../types';
import { formatTimeAgo, readFileAsDataUrl } from '../utils/format';

interface GlobalChatProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (text: string, mediaUrl?: string) => void;
  onNavigateProfile: (username: string) => void;
  onSelectPrivateChat: (user: User) => void;
}

const QUICK_EMOJIS = ['❤️', '🔥', '👋', '🎉', '☕', '👍', '😂', '✨'];

export const GlobalChat: React.FC<GlobalChatProps> = ({
  currentUser,
  users,
  messages,
  onSendMessage,
  onNavigateProfile,
  onSelectPrivateChat
}) => {
  const [inputText, setInputText] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !mediaUrl) return;

    onSendMessage(inputText, mediaUrl || undefined);
    setInputText('');
    setMediaUrl(null);
    setShowEmojis(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await readFileAsDataUrl(file);
        setMediaUrl(data);
      } catch {
        alert('ছবি পাঠাতে সমস্যা হয়েছে!');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[76vh] max-h-[820px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            💬
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
              <span>গ্লোবাল কমিউনিটি চ্যাট</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              রং প্ল্যাটফর্মের সকল সক্রিয় সদস্যদের জন্য উন্মুক্ত লাইভ আড্ডা
            </p>
          </div>
        </div>

        {/* Online avatars stack */}
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <div className="flex -space-x-2 overflow-hidden">
            {users.slice(0, 4).map(u => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                title={u.name}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {users.filter(u => u.online).length} জন অনলাইন
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
            <p className="text-sm font-semibold">প্রথম মেসেজটি পাঠিয়ে আড্ডা শুরু করুন!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    onClick={() => onNavigateProfile(msg.senderUsername)}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-500 transition-all mt-1"
                  />
                )}

                <div>
                  {!isMe && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span 
                        onClick={() => onNavigateProfile(msg.senderUsername)}
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
                      >
                        {msg.senderName}
                      </span>
                      <button
                        onClick={() => {
                          const senderUser = users.find(u => u.id === msg.senderId);
                          if (senderUser) onSelectPrivateChat(senderUser);
                        }}
                        className="text-[10px] text-indigo-500 hover:underline"
                      >
                        (ইনবক্স করুন)
                      </button>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-xs text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                    {msg.mediaUrl && (
                      <img
                        src={msg.mediaUrl}
                        alt="Chat media"
                        className="mt-2 rounded-xl max-h-52 w-full object-cover"
                      />
                    )}
                  </div>

                  <div className={`text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1 ${isMe ? 'justify-end' : ''}`}>
                    <span>{formatTimeAgo(msg.time)}</span>
                    {isMe && <span>• আপনি</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Bar */}
      {showEmojis && (
        <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex gap-2 overflow-x-auto">
          {QUICK_EMOJIS.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => setInputText(prev => prev + ' ' + em)}
              className="text-lg p-1.5 hover:scale-125 transition-transform"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview if selected */}
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

      {/* Input Area */}
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
          title="ছবি আপলোড করুন"
        >
          <Upload className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="ইমোজি"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="গ্লোবাল চ্যাটে কিছু লিখুন..."
          className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !mediaUrl}
          className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
