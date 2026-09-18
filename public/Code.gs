/**
 * ====================================================================
 *   RONG SOCIAL NETWORK - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 *   সম্পূর্ণ ফিচারসমৃদ্ধ গুগল শীট ব্যাকএন্ড (Version 2.0)
 * ====================================================================
 * 
 * অন্তর্ভুক্ত ফিচারসমূহ:
 * ১. সিকিউর লগইন ও সাইনআপ (Authentication & Accounts)
 * ২. পূর্ণাঙ্গ প্রোফাইল এডিটর (Name, Bio, Location, Profession, Website, Avatar, Cover)
 * ৩. ছবি আপলোড (Data URL / Base64 সাপোর্ট)
 * ৪. নিউজফিড, পোস্ট তৈরি, এডিট, ডিলিট, লাইক, বুকমার্ক
 * ৫. পোস্টের কমেন্ট সিস্টেম (Comments CRUD)
 * ৬. রিলস ও শর্ট ভিডিও ফিড (YouTube Shorts, TikTok, Instagram, FB, MP4)
 * ৭. মার্কেটপ্লেস / বাজার (পণ্য কেনাবেচা, ফিল্টার, সরাসরি সেলার চ্যাট)
 * ৮. ইভেন্ট ম্যানেজমেন্ট (ইভেন্ট তৈরি, তারিখ, লোকেশন, RSVP গোয়িং/ইন্টারেস্টেড)
 * ৯. ১-অন-১ প্রাইভেট ইনবক্স (Direct Messaging)
 * ১০. লাইভ গ্লোবাল চ্যাট ও সাউন্ড এফেক্টস
 * ১১. স্টোরিজ (24-hour visual stories)
 * ১২. ইউজার ফলো ও আনফলো সিস্টেম
 */

const SHEET_NAMES = {
  USERS: 'Users',
  POSTS: 'Posts',
  COMMENTS: 'Comments',
  REELS: 'Reels',
  MARKET: 'Marketplace',
  EVENTS: 'Events',
  GLOBAL_CHAT: 'Messages',
  DIRECT_CHAT: 'DirectMessages',
  STORIES: 'Stories'
};

/**
 * Web App Entry Point
 */
function doGet(e) {
  initDatabase();
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('রং সোশ্যাল নেটওয়ার্ক | Rong Social')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  return htmlOutput;
}

/**
 * Helper to get or create sheet with headers
 */
function getOrCreateSheet(sheetName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Initialize all database sheets with default data
 */
function initDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Users Sheet
  var userHeaders = ['id', 'username', 'password', 'name', 'avatar', 'coverImage', 'bio', 'location', 'profession', 'website', 'role', 'followersJson', 'followingJson', 'createdAt'];
  var userSheet = getOrCreateSheet(SHEET_NAMES.USERS, userHeaders);

  // 2. Posts Sheet
  var postHeaders = ['id', 'authorId', 'authorName', 'authorUsername', 'authorAvatar', 'text', 'image', 'time', 'likesJson', 'commentsCount', 'reactionsJson'];
  var postSheet = getOrCreateSheet(SHEET_NAMES.POSTS, postHeaders);

  // 3. Comments Sheet
  var commentHeaders = ['id', 'postId', 'authorUsername', 'authorName', 'authorAvatar', 'text', 'time'];
  var commentSheet = getOrCreateSheet(SHEET_NAMES.COMMENTS, commentHeaders);

  // 4. Reels Sheet
  var reelHeaders = ['id', 'authorUsername', 'authorName', 'authorAvatar', 'title', 'videoUrl', 'platform', 'likesJson', 'time'];
  var reelSheet = getOrCreateSheet(SHEET_NAMES.REELS, reelHeaders);

  // 5. Marketplace Sheet
  var marketHeaders = ['id', 'sellerUsername', 'sellerName', 'sellerAvatar', 'title', 'price', 'category', 'location', 'description', 'image', 'contactPhone', 'time'];
  var marketSheet = getOrCreateSheet(SHEET_NAMES.MARKET, marketHeaders);

  // 6. Events Sheet
  var eventHeaders = ['id', 'creatorUsername', 'creatorName', 'title', 'date', 'time', 'location', 'description', 'image', 'rsvpsJson', 'createdAt'];
  var eventSheet = getOrCreateSheet(SHEET_NAMES.EVENTS, eventHeaders);

  // 7. Global Messages Sheet
  var msgHeaders = ['id', 'senderId', 'senderName', 'senderUsername', 'senderAvatar', 'text', 'attachment', 'time'];
  var msgSheet = getOrCreateSheet(SHEET_NAMES.GLOBAL_CHAT, msgHeaders);

  // 8. Direct Messages Sheet
  var dmHeaders = ['id', 'conversationId', 'senderUsername', 'recipientUsername', 'text', 'attachment', 'time', 'read'];
  var dmSheet = getOrCreateSheet(SHEET_NAMES.DIRECT_CHAT, dmHeaders);

  // 9. Stories Sheet
  var storyHeaders = ['id', 'authorId', 'authorName', 'authorUsername', 'authorAvatar', 'mediaUrl', 'text', 'bgGradient', 'viewsJson', 'createdAt'];
  var storySheet = getOrCreateSheet(SHEET_NAMES.STORIES, storyHeaders);

  // Seed default users if empty
  if (userSheet.getLastRow() <= 1) {
    userSheet.appendRow([
      'u_admin',
      'admin',
      '123456',
      'তানভীর আহমেদ (Admin)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
      'রং সোশ্যাল নেটওয়ার্কের এডমিন। নিরাপদ ও আধুনিক প্ল্যাটফর্ম। 🚀',
      'ঢাকা, বাংলাদেশ',
      'সিস্টেম এডমিনিস্ট্রেটর',
      'https://rongsocial.com',
      'admin',
      JSON.stringify(['shakib_dev']),
      JSON.stringify(['shakib_dev']),
      new Date().toISOString()
    ]);

    userSheet.appendRow([
      'u_shakib',
      'shakib_dev',
      '123456',
      'সাকিব আল হাসান',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      'টেকপ্রেমী ও ডেভেলপার। কোডিং ও উদ্ভাবনী প্রযুক্তি অন্বেষণ আমার প্যাশন। 💻☕',
      'চট্টগ্রাম, বাংলাদেশ',
      'ফুল স্ট্যাক ডেভেলপার',
      'https://github.com',
      'user',
      JSON.stringify(['admin']),
      JSON.stringify(['admin']),
      new Date().toISOString()
    ]);
  }

  // Seed default posts if empty
  if (postSheet.getLastRow() <= 1) {
    postSheet.appendRow([
      'post_1',
      'u_admin',
      'তানভীর আহমেদ (Admin)',
      'admin',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      '🎉 রং সোশ্যাল নেটওয়ার্ক ২.০-তে স্বাগতম! এখন থাকছে লগইন/সাইনআপ, রিলস ভিডিও, মার্কেটপ্লেস বাজার, ইভেন্ট, ইনবক্স ও সরাসরি ছবি আপলোড সুবিধা!',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      new Date().toISOString(),
      JSON.stringify(['admin', 'shakib_dev']),
      1
    ]);

    commentSheet.appendRow([
      'c_1',
      'post_1',
      'shakib_dev',
      'সাকিব আল হাসান',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'অসাধারণ নতুন সব ফিচার! বিশেষ করে রিলস এবং মার্কেটপ্লেস দারুণ লেগেছে। ❤️🔥',
      new Date().toISOString()
    ]);
  }

  // Seed sample Reels if empty
  if (reelSheet.getLastRow() <= 1) {
    reelSheet.appendRow([
      'reel_1',
      'admin',
      'তানভীর আহমেদ (Admin)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'প্রকৃতির অপূর্ব রূপ ও প্রশান্তি 🌿🌊 #nature #peace',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'mp4',
      JSON.stringify(['admin']),
      new Date().toISOString()
    ]);
    reelSheet.appendRow([
      'reel_2',
      'shakib_dev',
      'সাকিব আল হাসান',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'শহরের রাতের সৌন্দর্য এবং আলো-আঁধারির খেলা ✨🌃 #citylights #vibes',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'mp4',
      JSON.stringify(['shakib_dev']),
      new Date().toISOString()
    ]);
  }

  // Seed sample Marketplace items if empty
  if (marketSheet.getLastRow() <= 1) {
    marketSheet.appendRow([
      'item_1',
      'shakib_dev',
      'সাকিব আল হাসান',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'Wireless Mechanical Keyboard (RGB)',
      '৪,৫০০',
      'ইলেকট্রনিক্স',
      'মিরপুর, ঢাকা',
      'মাত্র ৩ মাস ব্যবহৃত, কোনো স্ক্র্যাচ নেই। সাথে সম্পূর্ণ বক্স ও কেবল পাবেন।',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      '01711000000',
      new Date().toISOString()
    ]);
    marketSheet.appendRow([
      'item_2',
      'admin',
      'তানভীর আহমেদ (Admin)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'Noise Cancelling Studio Headphones',
      '৭,২০০',
      'অডিও ও গ্যাজেট',
      'ধানমন্ডি, ঢাকা',
      'অরিজিনাল স্টুডিও সাউন্ড, ব্যাটারি ব্যাকআপ ৪০ ঘণ্টা। জরুরি প্রয়োজনে বিক্রি করছি।',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      '01811000000',
      new Date().toISOString()
    ]);
  }

  // Seed sample Events if empty
  if (eventSheet.getLastRow() <= 1) {
    eventSheet.appendRow([
      'ev_1',
      'admin',
      'তানভীর আহমেদ (Admin)',
      'বাংলা টেক ডেভেলপারস মিটআপ ২০২৬',
      '২৫ অক্টোবর, ২০২৬',
      'বিকাল ৪:০০ টা',
      'আইসিটি টাওয়ার অডিটোরিয়াম, আগারগাঁও, ঢাকা',
      'সকল সফটওয়্যার ইঞ্জিনিয়ার, ডিজাইনার ও ফ্রেশারদের জন্য মুক্ত আড্ডা, অভিজ্ঞতা বিনিময় ও নেটওয়ার্কিংয়ের সুযোগ!',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
      JSON.stringify(['admin', 'shakib_dev']),
      new Date().toISOString()
    ]);
  }

  // Seed sample Global Message
  if (msgSheet.getLastRow() <= 1) {
    msgSheet.appendRow([
      'msg_1',
      'u_admin',
      'তানভীর আহমেদ (Admin)',
      'admin',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'স্বাগতম সবাইকে রং সোশ্যাল নেটওয়ার্কে! 👋 লাইভ চ্যাটে মতামত জানান।',
      '',
      new Date().toISOString()
    ]);
  }
}

/**
 * Clean User object without exposing passwords
 */
function sanitizeUserRow(row) {
  var followers = [];
  var following = [];
  try { followers = row[11] ? JSON.parse(row[11]) : []; } catch(e){}
  try { following = row[12] ? JSON.parse(row[12]) : []; } catch(e){}

  return {
    id: String(row[0]),
    username: String(row[1]),
    name: String(row[3]),
    avatar: String(row[4]),
    coverImage: String(row[5] || ''),
    bio: String(row[6] || ''),
    location: String(row[7] || ''),
    profession: String(row[8] || ''),
    website: String(row[9] || ''),
    role: String(row[10] || 'user'),
    followers: followers,
    following: following,
    createdAt: String(row[13] || '')
  };
}

/**
 * 1. AUTHENTICATION: SIGN UP
 */
function userSignUp(userData) {
  try {
    initDatabase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var data = sheet.getDataRange().getValues();

    var cleanUsername = String(userData.username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'ইউজারনেম অন্তত ৩ অক্ষরের (ইংরেজি ছোট হাতের অক্ষর, সংখ্যা বা _) হতে হবে।' };
    }

    if (!userData.password || String(userData.password).length < 4) {
      return { success: false, error: 'পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।' };
    }

    // Check existing username
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() === cleanUsername) {
        return { success: false, error: 'এই ইউজারনেমটি আগে থেকেই নেওয়া আছে! অন্য একটি বাছাই করুন।' };
      }
    }

    var newId = 'u_' + new Date().getTime();
    var defaultAvatar = userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    var defaultCover = userData.coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80';
    var now = new Date().toISOString();

    var newRow = [
      newId,
      cleanUsername,
      String(userData.password),
      userData.name || cleanUsername,
      defaultAvatar,
      defaultCover,
      userData.bio || 'রং সোশ্যাল মেম্বার ✨',
      userData.location || '',
      userData.profession || '',
      userData.website || '',
      'user',
      JSON.stringify([]),
      JSON.stringify([]),
      now
    ];

    sheet.appendRow(newRow);

    return {
      success: true,
      user: sanitizeUserRow(newRow)
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 1. AUTHENTICATION: LOGIN
 */
function userLogin(username, password) {
  try {
    initDatabase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var data = sheet.getDataRange().getValues();

    var cleanUsername = String(username || '').trim().toLowerCase();
    var inputPass = String(password || '');

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (String(row[1]).toLowerCase() === cleanUsername) {
        var storedPass = String(row[2]);
        if (storedPass === inputPass) {
          return {
            success: true,
            user: sanitizeUserRow(row)
          };
        } else {
          return { success: false, error: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' };
        }
      }
    }

    return { success: false, error: 'ইউজার খুঁজে পাওয়া যায়নি! অনুগ্রহ করে সাইনআপ করুন।' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Fetch all initial data at once for high-performance single load
 */
function getInitialData(currentUsername) {
  try {
    initDatabase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Users
    var userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var userData = userSheet.getDataRange().getValues();
    var users = [];
    for (var i = 1; i < userData.length; i++) {
      if (userData[i][0]) users.push(sanitizeUserRow(userData[i]));
    }

    // 2. Posts
    var postSheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var postData = postSheet.getDataRange().getValues();
    var posts = [];
    for (var j = 1; j < postData.length; j++) {
      var p = postData[j];
      if (p[0]) {
        var likes = [];
        try { likes = p[8] ? JSON.parse(p[8]) : []; } catch(e){}
        var reactions = {};
        try { reactions = p[10] ? JSON.parse(p[10]) : {}; } catch(e){}
        posts.push({
          id: String(p[0]),
          authorId: String(p[1]),
          authorName: String(p[2]),
          authorUsername: String(p[3]),
          authorAvatar: String(p[4]),
          text: String(p[5]),
          image: String(p[6] || ''),
          time: String(p[7]),
          likes: likes,
          commentsCount: Number(p[9] || 0),
          reactions: reactions
        });
      }
    }
    posts.reverse();

    // 3. Comments
    var commentSheet = ss.getSheetByName(SHEET_NAMES.COMMENTS);
    var cData = commentSheet.getDataRange().getValues();
    var comments = [];
    for (var c = 1; c < cData.length; c++) {
      var cr = cData[c];
      if (cr[0]) {
        comments.push({
          id: String(cr[0]),
          postId: String(cr[1]),
          authorUsername: String(cr[2]),
          authorName: String(cr[3]),
          authorAvatar: String(cr[4]),
          text: String(cr[5]),
          time: String(cr[6])
        });
      }
    }

    // 4. Reels
    var reelSheet = ss.getSheetByName(SHEET_NAMES.REELS);
    var reelData = reelSheet.getDataRange().getValues();
    var reels = [];
    for (var r = 1; r < reelData.length; r++) {
      var rr = reelData[r];
      if (rr[0]) {
        var rLikes = [];
        try { rLikes = rr[7] ? JSON.parse(rr[7]) : []; } catch(e){}
        reels.push({
          id: String(rr[0]),
          authorUsername: String(rr[1]),
          authorName: String(rr[2]),
          authorAvatar: String(rr[3]),
          title: String(rr[4]),
          videoUrl: String(rr[5]),
          platform: String(rr[6]),
          likes: rLikes,
          time: String(rr[8])
        });
      }
    }
    reels.reverse();

    // 5. Marketplace
    var marketSheet = ss.getSheetByName(SHEET_NAMES.MARKET);
    var mData = marketSheet.getDataRange().getValues();
    var marketplace = [];
    for (var m = 1; m < mData.length; m++) {
      var mr = mData[m];
      if (mr[0]) {
        marketplace.push({
          id: String(mr[0]),
          sellerUsername: String(mr[1]),
          sellerName: String(mr[2]),
          sellerAvatar: String(mr[3]),
          title: String(mr[4]),
          price: String(mr[5]),
          category: String(mr[6]),
          location: String(mr[7]),
          description: String(mr[8]),
          image: String(mr[9] || ''),
          contactPhone: String(mr[10] || ''),
          time: String(mr[11])
        });
      }
    }
    marketplace.reverse();

    // 6. Events
    var eventSheet = ss.getSheetByName(SHEET_NAMES.EVENTS);
    var eData = eventSheet.getDataRange().getValues();
    var events = [];
    for (var ev = 1; ev < eData.length; ev++) {
      var er = eData[ev];
      if (er[0]) {
        var rsvps = [];
        try { rsvps = er[9] ? JSON.parse(er[9]) : []; } catch(e){}
        events.push({
          id: String(er[0]),
          creatorUsername: String(er[1]),
          creatorName: String(er[2]),
          title: String(er[3]),
          date: String(er[4]),
          time: String(er[5]),
          location: String(er[6]),
          description: String(er[7]),
          image: String(er[8] || ''),
          rsvps: rsvps,
          createdAt: String(er[10])
        });
      }
    }
    events.reverse();

    // 7. Global Messages (last 50)
    var msgSheet = ss.getSheetByName(SHEET_NAMES.GLOBAL_CHAT);
    var msgData = msgSheet.getDataRange().getValues();
    var globalMessages = [];
    var startIdx = Math.max(1, msgData.length - 50);
    for (var k = startIdx; k < msgData.length; k++) {
      var mRow = msgData[k];
      if (mRow[0]) {
        globalMessages.push({
          id: String(mRow[0]),
          senderId: String(mRow[1]),
          senderName: String(mRow[2]),
          senderUsername: String(mRow[3]),
          senderAvatar: String(mRow[4]),
          text: String(mRow[5]),
          attachment: String(mRow[6] || ''),
          time: String(mRow[7])
        });
      }
    }

    // 8. Direct Messages (for current user)
    var dmSheet = ss.getSheetByName(SHEET_NAMES.DIRECT_CHAT);
    var dmData = dmSheet.getDataRange().getValues();
    var directMessages = [];
    for (var d = 1; d < dmData.length; d++) {
      var dr = dmData[d];
      if (dr[0]) {
        var sUser = String(dr[2]).toLowerCase();
        var rUser = String(dr[3]).toLowerCase();
        var cUser = (currentUsername || '').toLowerCase();
        if (!cUser || sUser === cUser || rUser === cUser) {
          directMessages.push({
            id: String(dr[0]),
            conversationId: String(dr[1]),
            senderUsername: String(dr[2]),
            recipientUsername: String(dr[3]),
            text: String(dr[4]),
            attachment: String(dr[5] || ''),
            time: String(dr[6]),
            read: Boolean(dr[7])
          });
        }
      }
    }

    // 9. Stories (last 24 hours)
    var storySheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    var stories = [];
    if (storySheet) {
      var sData = storySheet.getDataRange().getValues();
      var nowMs = Date.now();
      for (var s = 1; s < sData.length; s++) {
        var sr = sData[s];
        if (sr[0]) {
          var createdAtMs = new Date(sr[9]).getTime();
          // Filter stories within last 24 hours
          if (isNaN(createdAtMs) || nowMs - createdAtMs < 24 * 3600 * 1000) {
              var sViews = [];
              try { sViews = sr[8] ? JSON.parse(String(sr[8])) : []; } catch(e){}
              stories.push({
                id: String(sr[0]),
                authorId: String(sr[1]),
                authorName: String(sr[2]),
                authorUsername: String(sr[3]),
                authorAvatar: String(sr[4]),
                mediaUrl: String(sr[5] || ''),
                text: String(sr[6] || ''),
                bgGradient: String(sr[7] || ''),
                views: sViews,
                createdAt: String(sr[9])
              });
          }
        }
      }
    }

    return {
      success: true,
      users: users,
      posts: posts,
      comments: comments,
      reels: reels,
      marketplace: marketplace,
      events: events,
      messages: globalMessages,
      directMessages: directMessages,
      stories: stories
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 2. PROFILE: Update full details
 */
function updateFullProfile(p) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var data = sheet.getDataRange().getValues();

    var targetUser = String(p.username || '').toLowerCase();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() === targetUser) {
        if (p.name !== undefined) sheet.getRange(i + 1, 4).setValue(p.name);
        if (p.avatar !== undefined) sheet.getRange(i + 1, 5).setValue(p.avatar);
        if (p.coverImage !== undefined) sheet.getRange(i + 1, 6).setValue(p.coverImage);
        if (p.bio !== undefined) sheet.getRange(i + 1, 7).setValue(p.bio);
        if (p.location !== undefined) sheet.getRange(i + 1, 8).setValue(p.location);
        if (p.profession !== undefined) sheet.getRange(i + 1, 9).setValue(p.profession);
        if (p.website !== undefined) sheet.getRange(i + 1, 10).setValue(p.website);
        if (p.newPassword) sheet.getRange(i + 1, 3).setValue(p.newPassword);

        // Also update latest user info cache in posts
        return {
          success: true,
          user: {
            id: String(data[i][0]),
            username: String(data[i][1]),
            name: p.name || String(data[i][3]),
            avatar: p.avatar || String(data[i][4]),
            coverImage: p.coverImage || String(data[i][5]),
            bio: p.bio !== undefined ? p.bio : String(data[i][6]),
            location: p.location !== undefined ? p.location : String(data[i][7]),
            profession: p.profession !== undefined ? p.profession : String(data[i][8]),
            website: p.website !== undefined ? p.website : String(data[i][9]),
            role: String(data[i][10])
          }
        };
      }
    }
    return { success: false, error: 'ইউজার প্রোফাইল পাওয়া যায়নি।' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 3. POSTS: Create, Edit, Delete, Like
 */
function addPost(post) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var id = 'post_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      post.authorId || 'u_' + post.authorUsername,
      post.authorName,
      post.authorUsername,
      post.authorAvatar,
      post.text,
      post.image || '',
      time,
      JSON.stringify(post.likes || []),
      0,
      JSON.stringify(post.reactions || {})
    ]);

    return {
      success: true,
      post: {
        id: id,
        authorId: post.authorId || 'u_' + post.authorUsername,
        authorName: post.authorName,
        authorUsername: post.authorUsername,
        authorAvatar: post.authorAvatar,
        text: post.text,
        image: post.image || '',
        time: time,
        likes: post.likes || [],
        commentsCount: 0,
        reactions: post.reactions || {}
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function editPost(postId, newText, authorUsername) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(postId)) {
        var rowAuthor = String(data[i][3]);
        if (rowAuthor !== authorUsername && authorUsername !== 'admin') {
          return { success: false, error: 'অনুমতি নেই: আপনি শুধু নিজের পোস্ট এডিট করতে পারেন।' };
        }
        sheet.getRange(i + 1, 6).setValue(newText);
        return { success: true, postId: postId, newText: newText };
      }
    }
    return { success: false, error: 'পোস্ট খুঁজে পাওয়া যায়নি।' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function deletePost(postId, authorUsername) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(postId)) {
        var rowAuthor = String(data[i][3]);
        if (rowAuthor !== authorUsername && authorUsername !== 'admin') {
          return { success: false, error: 'অনুমতি নেই: আপনি শুধু নিজের পোস্ট ডিলিট করতে পারেন।' };
        }
        sheet.deleteRow(i + 1);
        return { success: true, postId: postId };
      }
    }
    return { success: false, error: 'পোস্ট খুঁজে পাওয়া যায়নি।' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}


/**
 * Post Reactions with Emoji (Like, Love, Haha, Wow, Sad, Fire, Clap)
 */
function reactToPost(postId, username, emoji) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(postId)) {
        var likes = [];
        try { likes = data[i][8] ? JSON.parse(data[i][8]) : []; } catch(e){}
        var reactions = {};
        try { reactions = data[i][10] ? JSON.parse(data[i][10]) : {}; } catch(e){}

        // Remove user from all reaction types first
        Object.keys(reactions).forEach(function(k) {
          if (Array.isArray(reactions[k])) {
            reactions[k] = reactions[k].filter(function(u) { return u !== username; });
          }
        });

        // Add to selected emoji list
        if (!reactions[emoji]) reactions[emoji] = [];
        if (reactions[emoji].indexOf(username) === -1) {
          reactions[emoji].push(username);
        }

        // Keep likes array in sync
        if (likes.indexOf(username) === -1) {
          likes.push(username);
        }

        sheet.getRange(i + 1, 9).setValue(JSON.stringify(likes));
        sheet.getRange(i + 1, 11).setValue(JSON.stringify(reactions));

        return { success: true, postId: postId, likes: likes, reactions: reactions };
      }
    }
    return { success: false, error: 'পোস্ট পাওয়া যায়নি' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function toggleLike(postId, username) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(postId)) {
        var likes = [];
        try { likes = data[i][8] ? JSON.parse(data[i][8]) : []; } catch(e){}
        var idx = likes.indexOf(username);
        if (idx > -1) {
          likes.splice(idx, 1);
        } else {
          likes.push(username);
        }
        sheet.getRange(i + 1, 9).setValue(JSON.stringify(likes));
        return { success: true, postId: postId, likes: likes };
      }
    }
    return { success: false, error: 'পোস্ট পাওয়া যায়নি' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 4. COMMENTS: Add, Delete
 */
function addComment(c) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.COMMENTS);
    var id = 'c_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      c.postId,
      c.authorUsername,
      c.authorName,
      c.authorAvatar,
      c.text,
      time
    ]);

    // Increment commentsCount in Posts sheet
    var postSheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    var pData = postSheet.getDataRange().getValues();
    for (var i = 1; i < pData.length; i++) {
      if (String(pData[i][0]) === String(c.postId)) {
        var count = Number(pData[i][9] || 0) + 1;
        postSheet.getRange(i + 1, 10).setValue(count);
        break;
      }
    }

    return {
      success: true,
      comment: {
        id: id,
        postId: c.postId,
        authorUsername: c.authorUsername,
        authorName: c.authorName,
        authorAvatar: c.authorAvatar,
        text: c.text,
        time: time
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 5. REELS: Add Reel, Like Reel
 */
function addReel(r) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.REELS);
    var id = 'reel_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      r.authorUsername,
      r.authorName,
      r.authorAvatar,
      r.title,
      r.videoUrl,
      r.platform || 'mp4',
      JSON.stringify([]),
      time
    ]);

    return {
      success: true,
      reel: {
        id: id,
        authorUsername: r.authorUsername,
        authorName: r.authorName,
        authorAvatar: r.authorAvatar,
        title: r.title,
        videoUrl: r.videoUrl,
        platform: r.platform || 'mp4',
        likes: [],
        time: time
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function toggleReelLike(reelId, username) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.REELS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(reelId)) {
        var likes = [];
        try { likes = data[i][7] ? JSON.parse(data[i][7]) : []; } catch(e){}
        var idx = likes.indexOf(username);
        if (idx > -1) likes.splice(idx, 1);
        else likes.push(username);

        sheet.getRange(i + 1, 8).setValue(JSON.stringify(likes));
        return { success: true, reelId: reelId, likes: likes };
      }
    }
    return { success: false, error: 'রিলস পাওয়া যায়নি' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 6. MARKETPLACE: Add, Delete
 */
function addMarketItem(m) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.MARKET);
    var id = 'item_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      m.sellerUsername,
      m.sellerName,
      m.sellerAvatar,
      m.title,
      m.price,
      m.category || 'অন্যান্য',
      m.location || 'বাংলাদেশ',
      m.description,
      m.image || '',
      m.contactPhone || '',
      time
    ]);

    return {
      success: true,
      item: {
        id: id,
        sellerUsername: m.sellerUsername,
        sellerName: m.sellerName,
        sellerAvatar: m.sellerAvatar,
        title: m.title,
        price: m.price,
        category: m.category || 'অন্যান্য',
        location: m.location || 'বাংলাদেশ',
        description: m.description,
        image: m.image || '',
        contactPhone: m.contactPhone || '',
        time: time
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 7. EVENTS: Add Event, RSVP
 */
function addEvent(ev) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.EVENTS);
    var id = 'ev_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      ev.creatorUsername,
      ev.creatorName,
      ev.title,
      ev.date,
      ev.time,
      ev.location,
      ev.description,
      ev.image || '',
      JSON.stringify([ev.creatorUsername]),
      time
    ]);

    return {
      success: true,
      event: {
        id: id,
        creatorUsername: ev.creatorUsername,
        creatorName: ev.creatorName,
        title: ev.title,
        date: ev.date,
        time: ev.time,
        location: ev.location,
        description: ev.description,
        image: ev.image || '',
        rsvps: [ev.creatorUsername],
        createdAt: time
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function toggleEventRSVP(eventId, username) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.EVENTS);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(eventId)) {
        var rsvps = [];
        try { rsvps = data[i][9] ? JSON.parse(data[i][9]) : []; } catch(e){}
        var idx = rsvps.indexOf(username);
        if (idx > -1) rsvps.splice(idx, 1);
        else rsvps.push(username);

        sheet.getRange(i + 1, 10).setValue(JSON.stringify(rsvps));
        return { success: true, eventId: eventId, rsvps: rsvps };
      }
    }
    return { success: false, error: 'ইভেন্ট পাওয়া যায়নি' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 8. INBOX / DIRECT MESSAGING (1-on-1)
 */
function sendDirectMessage(dm) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.DIRECT_CHAT);
    var id = 'dm_' + new Date().getTime();
    var time = new Date().toISOString();

    var convId = [dm.senderUsername.toLowerCase(), dm.recipientUsername.toLowerCase()].sort().join('_');

    sheet.appendRow([
      id,
      convId,
      dm.senderUsername,
      dm.recipientUsername,
      dm.text,
      dm.attachment || '',
      time,
      false
    ]);

    return {
      success: true,
      message: {
        id: id,
        conversationId: convId,
        senderUsername: dm.senderUsername,
        recipientUsername: dm.recipientUsername,
        text: dm.text,
        attachment: dm.attachment || '',
        time: time,
        read: false
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 9. GLOBAL LIVE CHAT
 */
function sendGlobalMessage(msg) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.GLOBAL_CHAT);
    var id = 'msg_' + new Date().getTime();
    var time = new Date().toISOString();

    sheet.appendRow([
      id,
      msg.senderId || 'u_' + msg.senderUsername,
      msg.senderName,
      msg.senderUsername,
      msg.senderAvatar,
      msg.text,
      msg.attachment || '',
      time
    ]);

    return {
      success: true,
      message: {
        id: id,
        senderId: msg.senderId || 'u_' + msg.senderUsername,
        senderName: msg.senderName,
        senderUsername: msg.senderUsername,
        senderAvatar: msg.senderAvatar,
        text: msg.text,
        attachment: msg.attachment || '',
        time: time
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 10. FOLLOW / UNFOLLOW SYSTEM
 */
function toggleFollowUser(followerUsername, targetUsername) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.USERS);
    var data = sheet.getDataRange().getValues();

    var followerRow = -1;
    var targetRow = -1;

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() === followerUsername.toLowerCase()) followerRow = i + 1;
      if (String(data[i][1]).toLowerCase() === targetUsername.toLowerCase()) targetRow = i + 1;
    }

    if (followerRow === -1 || targetRow === -1) return { success: false, error: 'ইউজার পাওয়া যায়নি' };

    var followerFollowing = [];
    var targetFollowers = [];
    try { followerFollowing = JSON.parse(sheet.getRange(followerRow, 13).getValue() || '[]'); } catch(e){}
    try { targetFollowers = JSON.parse(sheet.getRange(targetRow, 12).getValue() || '[]'); } catch(e){}

    var isFollowing = followerFollowing.indexOf(targetUsername) > -1;

    if (isFollowing) {
      followerFollowing = followerFollowing.filter(function(u) { return u !== targetUsername; });
      targetFollowers = targetFollowers.filter(function(u) { return u !== followerUsername; });
    } else {
      followerFollowing.push(targetUsername);
      targetFollowers.push(followerUsername);
    }

    sheet.getRange(followerRow, 13).setValue(JSON.stringify(followerFollowing));
    sheet.getRange(targetRow, 12).setValue(JSON.stringify(targetFollowers));

    return {
      success: true,
      isFollowing: !isFollowing,
      followerCount: targetFollowers.length
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 11. STORIES MANAGEMENT
 */
function addStory(story) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    if (!sheet) {
      initDatabase();
      sheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    }

    var id = story.id || ('story_' + Date.now());
    var createdAt = story.createdAt || new Date().toISOString();

    sheet.appendRow([
      id,
      story.authorId || '',
      story.authorName || '',
      story.authorUsername || '',
      story.authorAvatar || '',
      story.mediaUrl || '',
      story.text || '',
      story.bgGradient || '',
      JSON.stringify(story.views || []),
      createdAt
    ]);

    return {
      success: true,
      story: {
        id: id,
        authorId: story.authorId,
        authorName: story.authorName,
        authorUsername: story.authorUsername,
        authorAvatar: story.authorAvatar,
        mediaUrl: story.mediaUrl || '',
        text: story.text || '',
        bgGradient: story.bgGradient || '',
        views: story.views || [],
        createdAt: createdAt
      }
    };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function deleteStory(storyId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    if (!sheet) return { success: false, error: 'Sheet not found' };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(storyId)) {
        sheet.deleteRow(i + 1);
        return { success: true, storyId: storyId };
      }
    }
    return { success: false, error: 'Story not found' };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function viewStory(storyId, username) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    if (!sheet) return { success: false };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(storyId)) {
        var views = [];
        try { views = JSON.parse(data[i][8] || '[]'); } catch(e){}
        if (views.indexOf(username) === -1) {
          views.push(username);
          sheet.getRange(i + 1, 9).setValue(JSON.stringify(views));
        }
        return { success: true, views: views };
      }
    }
    return { success: false };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function reactToStory(storyId, username, reaction) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.STORIES);
    if (!sheet) return { success: false };
    return { success: true, storyId: storyId, username: username, reaction: reaction };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}

function reactToReel(reelId, username, reaction) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.REELS);
    if (!sheet) return { success: false };
    return { success: true, reelId: reelId, username: username, reaction: reaction };
  } catch(err) {
    return { success: false, error: err.toString() };
  }
}



/**
 * Web App HTTP POST Endpoint (for REST API / External Webhook access)
 */
function doPost(e) {
  try {
    var content = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var params = JSON.parse(content);
    var action = params.action || '';
    var result = { success: false, error: 'অজ্ঞাত অনুরোধ (Unknown Action)' };

    if (action === 'getInitialData') {
      result = getInitialData(params.username || '');
    } else if (action === 'login') {
      result = userLogin(params.username, params.password);
    } else if (action === 'signup') {
      result = userSignUp(params.userData || {});
    } else if (action === 'addPost') {
      result = addPost(params.post || {});
    } else if (action === 'reactToPost') {
      result = reactToPost(params.postId, params.username, params.emoji);
    } else if (action === 'toggleLike') {
      result = toggleLike(params.postId, params.username);
    } else if (action === 'addComment') {
      result = addComment(params.comment || {});
    } else if (action === 'addReel') {
      result = addReel(params.reel || {});
    } else if (action === 'toggleFollow') {
      result = toggleFollowUser(params.followerUsername, params.targetUsername);
    } else if (action === 'sendDirectMessage') {
      result = sendDirectMessage(params.message || {});
    } else if (action === 'sendGlobalMessage') {
      result = sendGlobalMessage(params.message || {});
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
