import React, { useState, useEffect, useMemo } from 'react';
import { VideoItem, TaskItem, AppSettings, UserTaskProgress, UserAccount, AppNotification, DailyRewardState } from './types';
import { initialVideos, initialSettings, default5Tasks } from './data/initialData';
import { getTelegramWebApp, triggerHaptic, openExternalOrTelegramLink } from './utils/telegram';
import { AdTubesHeader } from './components/AdTubesHeader';
import { AdTubesCard } from './components/AdTubesCard';
import { QuickAdModal } from './components/QuickAdModal';
import { SpecialChannelModal } from './components/SpecialChannelModal';
import { AdTubesTaskPage } from './components/AdTubesTaskPage';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { EmailAuthModal } from './components/EmailAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { WelcomeNoticeModal } from './components/WelcomeNoticeModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { AdminPanel } from './components/AdminPanel';
import { getMediaBlobUrl } from './utils/mediaStorage';
import { 
  CheckCircle2, Film, Bell, X, Play, Sparkles, Gift, Ticket
} from 'lucide-react';

export default function App() {
  // 1. Theme State: Dark Mode & Light Mode (Persisted)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('televideo_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const isLight = theme === 'light';

  // 2. User Authentication State (Persisted)
  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('televideo_user_account');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // 3. Persistent State for Videos, Settings, and Task Progress
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('televideo_pro_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialVideos;
    } catch {
      return initialVideos;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('televideo_pro_settings');
      if (saved) {
        return JSON.parse(saved);
      }
      return initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [userProgress, setUserProgress] = useState<UserTaskProgress>(() => {
    try {
      const saved = localStorage.getItem('televideo_pro_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 4. Routing: Standalone Admin Panel check (?admin=1 or #admin)
  const [currentView, setCurrentView] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('admin') === '1' || 
        urlParams.get('admin') === 'portal' || 
        urlParams.get('view') === 'admin' || 
        window.location.hash === '#admin'
      ) {
        return 'admin';
      }
    }
    return 'user';
  });

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular'>('latest');

  // Modals & Navigation
  const [showWelcomeNotice, setShowWelcomeNotice] = useState<boolean>(() => {
    return settings.welcomeNoticeActive !== false;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDailyCheckInModal, setShowDailyCheckInModal] = useState(false);
  const [activeSpecialChannelVideo, setActiveSpecialChannelVideo] = useState<VideoItem | null>(null);
  const [activeTaskPageVideo, setActiveTaskPageVideo] = useState<VideoItem | null>(null);
  const [activeQuickAdVideo, setActiveQuickAdVideo] = useState<VideoItem | null>(null);
  const [activePlayerVideo, setActivePlayerVideo] = useState<VideoItem | null>(null);

  // Daily Check-in Rewards State (Persisted)
  const [dailyRewardState, setDailyRewardState] = useState<DailyRewardState>(() => {
    try {
      const saved = localStorage.getItem('televideo_daily_rewards');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Daily rewards storage error", e);
    }
    return {
      lastCheckInDate: '',
      streak: 0,
      points: 100, // Initial welcome bonus
      skipTokens: 1, // 1 free welcome skip token
      history: [],
    };
  });

  // Small toast notification for Daily Check-in claim and actions
  const [claimToast, setClaimToast] = useState<{ show: boolean; message: string; subMessage?: string } | null>(null);

  // Push Notification state
  const [activePushNotification, setActivePushNotification] = useState<AppNotification | null>(null);

  // Toast for "Link Copied! Share with friends."
  const [shareToast, setShareToast] = useState<{ show: boolean; link: string }>({ show: false, link: '' });

  // Sync Theme to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('televideo_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.warn("Theme storage error", e);
    }
  }, [theme]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      if (userAccount) {
        localStorage.setItem('televideo_user_account', JSON.stringify(userAccount));
      } else {
        localStorage.removeItem('televideo_user_account');
      }
    } catch (e) {
      console.warn("User storage error", e);
    }
  }, [userAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('televideo_pro_videos', JSON.stringify(videos));
    } catch (e) {
      console.warn("Videos storage error", e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem('televideo_pro_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn("Settings storage error", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('televideo_pro_progress', JSON.stringify(userProgress));
    } catch (e) {
      console.warn("Progress storage error", e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('televideo_daily_rewards', JSON.stringify(dailyRewardState));
    } catch (e) {
      console.warn("Daily rewards storage error", e);
    }
  }, [dailyRewardState]);

  // Rehydrate persistent Blob URLs from IndexedDB for any gallery-uploaded videos so they NEVER expire!
  // Refreshes on mount, visibility change (returning to tab), and periodically every 10 mins.
  useEffect(() => {
    let isMounted = true;
    const rehydrateBlobs = async () => {
      try {
        let changed = false;
        const updated = await Promise.all(
          videos.map(async (v) => {
            if (v.blobId) {
              const freshUrl = await getMediaBlobUrl(v.blobId);
              if (freshUrl && freshUrl !== v.videoUrl) {
                changed = true;
                return { ...v, videoUrl: freshUrl };
              }
            }
            return v;
          })
        );
        if (changed && isMounted) {
          setVideos(updated);
        }
      } catch (e) {
        console.warn('Blob rehydration error:', e);
      }
    };

    rehydrateBlobs();

    // Rehydrate whenever user returns to the app tab (e.g. after screen lock or 30 minutes in another app)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        rehydrateBlobs();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic safety interval (every 10 minutes)
    const interval = setInterval(rehydrateBlobs, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [videos]);

  // Zoom Prevention Effect (Safely disables pinch gestures and ctrl-wheel zoom without interfering with vertical touch scrolling)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (settings.disableZoom !== false) {
      const handleGesture = (e: Event) => {
        try {
          e.preventDefault();
        } catch {
          // ignore
        }
      };

      const handleWheel = (e: WheelEvent) => {
        try {
          if (e.ctrlKey) {
            e.preventDefault();
          }
        } catch {
          // ignore
        }
      };

      try {
        document.addEventListener('gesturestart', handleGesture);
        document.addEventListener('gesturechange', handleGesture);
        document.addEventListener('gestureend', handleGesture);
        document.addEventListener('wheel', handleWheel, { passive: false });
      } catch {
        // ignore
      }

      return () => {
        try {
          document.removeEventListener('gesturestart', handleGesture);
          document.removeEventListener('gesturechange', handleGesture);
          document.removeEventListener('gestureend', handleGesture);
          document.removeEventListener('wheel', handleWheel);
        } catch {
          // ignore
        }
      };
    }
  }, [settings.disableZoom]);

  // Filtered and searched videos list
  const filteredVideos = useMemo(() => {
    let result = [...videos];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.titleEn && v.titleEn.toLowerCase().includes(q)) ||
          (v.subtitle && v.subtitle.toLowerCase().includes(q)) ||
          v.category.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return result;
  }, [videos, searchQuery, activeFilter]);

  // Stats for User Profile
  const unlockedVideosCount = useMemo(() => {
    return Object.values(userProgress).filter(p => p.isUnlocked).length;
  }, [userProgress]);

  const totalCompletedTasksCount = useMemo(() => {
    return Object.values(userProgress).reduce((acc, p) => acc + (p.completedTaskIds?.length || 0), 0);
  }, [userProgress]);

  // Date Helpers for Daily Check-in System
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateStr = getTodayDateStr();
  const canClaimDailyToday = dailyRewardState.lastCheckInDate !== todayDateStr;

  // Claim Daily Check-in Reward
  const handleClaimDailyReward = () => {
    const today = getTodayDateStr();
    if (dailyRewardState.lastCheckInDate === today) return;

    const yesterday = getYesterdayDateStr();
    const isConsecutive = dailyRewardState.lastCheckInDate === yesterday;
    const newStreak = isConsecutive ? (dailyRewardState.streak || 0) + 1 : 1;

    // 7-day reward schedule
    const cycleDay = ((newStreak - 1) % 7) + 1;
    const schedule = [
      { points: 50, tokens: 0 },
      { points: 75, tokens: 0 },
      { points: 100, tokens: 1 },
      { points: 125, tokens: 0 },
      { points: 150, tokens: 1 },
      { points: 175, tokens: 0 },
      { points: 250, tokens: 2 },
    ];
    const reward = schedule[cycleDay - 1];

    setDailyRewardState((prev) => ({
      lastCheckInDate: today,
      streak: newStreak,
      points: (prev.points || 0) + reward.points,
      skipTokens: (prev.skipTokens || 0) + reward.tokens,
      history: [
        {
          date: today,
          pointsAwarded: reward.points,
          tokensAwarded: reward.tokens,
        },
        ...(prev.history || []).slice(0, 30),
      ],
    }));

    triggerHaptic('success');

    // Small celebratory toast notification upon successful claim
    setClaimToast({
      show: true,
      message: `🎉 Daily Check-in Claimed! +${reward.points} Points${reward.tokens > 0 ? ` & +${reward.tokens} Skip Token 🎟️` : ''}`,
      subMessage: `Streak: ${newStreak} Day${newStreak > 1 ? 's' : ''} 🔥 | Total Points: ${(dailyRewardState.points || 0) + reward.points}`,
    });

    setTimeout(() => {
      setClaimToast(null);
    }, 4500);
  };

  // Use a task-skip token to bypass tasks and unlock video directly
  const handleUseSkipToken = (video: VideoItem) => {
    if (dailyRewardState.skipTokens <= 0) return;

    // Deduct 1 token
    setDailyRewardState((prev) => ({
      ...prev,
      skipTokens: Math.max(0, prev.skipTokens - 1),
    }));

    // Instantly unlock video in progress
    setUserProgress((prev) => ({
      ...prev,
      [video.id]: {
        completedTaskIds: ['skipped-via-token'],
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      },
    }));

    triggerHaptic('heavy');

    setClaimToast({
      show: true,
      message: '🎟️ ১টি টাস্ক-স্কিপ টোকেন দিয়ে ভিডিও সরাসরি আনলক করা হয়েছে!',
      subMessage: `বাকী টোকেন: ${Math.max(0, dailyRewardState.skipTokens - 1)}টি ⚡`,
    });

    setTimeout(() => {
      setClaimToast(null);
    }, 4000);
  };

  // Complete a Task Step
  const handleCompleteTask = (videoId: string, taskId: string) => {
    setUserProgress((prev) => {
      const current = prev[videoId] || { completedTaskIds: [], isUnlocked: false };
      const newCompleted = Array.from(new Set([...current.completedTaskIds, taskId]));

      const targetVideo = videos.find((v) => v.id === videoId);
      const totalRequired = targetVideo?.taskMode === 'special'
        ? (targetVideo.customTasks?.length || targetVideo.specialChannels?.length || targetVideo.requiredTasksCount || 2)
        : (targetVideo?.requiredTasksCount || 3);

      const isNowUnlocked = newCompleted.length >= totalRequired;

      return {
        ...prev,
        [videoId]: {
          completedTaskIds: newCompleted,
          isUnlocked: isNowUnlocked,
          unlockedAt: isNowUnlocked ? new Date().toISOString() : current.unlockedAt,
        },
      };
    });
  };

  // Special Telegram Channel Task Claim (Matching Video 2)
  const handleCompleteSpecialChannel = (videoId: string, channelId: string) => {
    handleCompleteTask(videoId, channelId);
  };

  // Quick In-App Ad Task Claim (Matching Video 1)
  const handleQuickAdCompleted = () => {
    if (!activeQuickAdVideo) return;
    const videoId = activeQuickAdVideo.id;
    const currentCompleted = userProgress[videoId]?.completedTaskIds || [];
    const nextTaskId = `quick-ad-task-${currentCompleted.length + 1}`;
    handleCompleteTask(videoId, nextTaskId);
    setActiveQuickAdVideo(null);
  };

  // Route Task Click: Normal (In-app 5s Ad) vs Special (Dedicated Inside Task Page as shown in Video 3)
  const handleOpenTaskAction = (video: VideoItem) => {
    if (video.taskMode === 'special') {
      setActiveTaskPageVideo(video);
    } else {
      setActiveQuickAdVideo(video);
    }
  };

  // Tasks for inside Special Task Page (Video 3)
  const tasksForActivePage: TaskItem[] = useMemo(() => {
    if (!activeTaskPageVideo) return [];
    if (activeTaskPageVideo.customTasks && activeTaskPageVideo.customTasks.length > 0) {
      return activeTaskPageVideo.customTasks;
    }
    if (activeTaskPageVideo.specialChannels && activeTaskPageVideo.specialChannels.length > 0) {
      return activeTaskPageVideo.specialChannels.map((ch, idx) => ({
        id: ch.id,
        title: ch.name || `Partner Task ${idx + 1}`,
        stepLabel: `Step ${idx + 1}`,
        buttonText: 'Join Channel',
        description: `${ch.name} টেলিগ্রাম চ্যানেলে জয়েন করুন এবং ভেরিফাই করুন।`,
        descriptionEn: `Join ${ch.name} on Telegram to verify.`,
        platform: 'telegram' as const,
        actionUrl: ch.url,
        requiredSeconds: activeTaskPageVideo.adCountdownSeconds || 4,
      }));
    }
    return default5Tasks.slice(0, activeTaskPageVideo.requiredTasksCount || 5);
  }, [activeTaskPageVideo]);

  // Open Player with refreshed persistent Blob URL if uploaded from gallery
  const openPlayerForVideo = async (video: VideoItem) => {
    if (video.blobId) {
      const freshUrl = await getMediaBlobUrl(video.blobId);
      if (freshUrl) {
        setActivePlayerVideo({ ...video, videoUrl: freshUrl });
        return;
      }
    }
    setActivePlayerVideo(video);
  };

  // Direct Video Page Open (When completed or download clicked)
  const handleDownloadAction = (video: VideoItem) => {
    triggerHaptic('heavy');
    setActiveTaskPageVideo(null);
    openPlayerForVideo(video);
  };

  // Direct Video Card Click: When task is completed, directly open video player page! No second page!
  const handleCardClick = (video: VideoItem) => {
    triggerHaptic('light');
    const isUnlocked = !!userProgress[video.id]?.isUnlocked;
    const requiredCount = video.taskMode === 'special'
      ? (video.specialChannels?.length || 2)
      : (video.requiredTasksCount ?? 3);

    if (isUnlocked || requiredCount === 0) {
      // Directly open Video Player page! No intermediate modal or second page!
      openPlayerForVideo(video);
    } else {
      // Directly open task action!
      handleOpenTaskAction(video);
    }
  };

  // Share Link Handler with Toast
  const handleShareLink = (video: VideoItem) => {
    triggerHaptic('medium');
    const shareUrl = video.botUrl || `https://t.me/${settings.botUsername}?startapp=${video.startappParam || 'file4'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }

    setShareToast({ show: true, link: shareUrl });
    setTimeout(() => {
      setShareToast({ show: false, link: '' });
    }, 3500);

    const tg = getTelegramWebApp();
    if (tg?.openTelegramLink) {
      const shareText = encodeURIComponent(`${video.title}\n${video.subtitle || ''}`);
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`);
    }
  };

  // Admin Broadcast Push Notification Handler
  const handleBroadcastNotification = (newVideo: VideoItem) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'নতুন ভিডিও যুক্ত হয়েছে! 🔥',
      body: newVideo.title,
      thumbnailUrl: newVideo.thumbnailUrl,
      videoId: newVideo.id,
      timestamp: 'এইমাত্র',
    };

    if (userAccount?.notificationsEnabled !== false) {
      setActivePushNotification(notif);
      triggerHaptic('success');
      setTimeout(() => {
        setActivePushNotification(null);
      }, 7000);
    }
  };

  // Admin CRUD operations
  const handleAddVideo = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const handleUpdateVideo = (updated: VideoItem) => {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleResetData = () => {
    setVideos(initialVideos);
    setSettings(initialSettings);
    setUserProgress({});
    localStorage.removeItem('televideo_pro_videos');
    localStorage.removeItem('televideo_pro_settings');
    localStorage.removeItem('televideo_pro_progress');
  };

  // User Logout
  const handleLogout = () => {
    setUserAccount(null);
    setShowProfileModal(false);
    triggerHaptic('warning');
  };

  // IF ADMIN VIEW IS SELECTED (via ?admin=1 or secret trigger by yhayrifat@gmail.com)
  if (currentView === 'admin') {
    return (
      <AdminPanel
        videos={videos}
        settings={settings}
        onAddVideo={handleAddVideo}
        onUpdateVideo={handleUpdateVideo}
        onDeleteVideo={handleDeleteVideo}
        onUpdateSettings={setSettings}
        onResetData={handleResetData}
        onClose={() => setCurrentView('user')}
        lang="bn"
        onSwitchToUserApp={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setCurrentView('user');
        }}
        onBroadcastNotification={handleBroadcastNotification}
      />
    );
  }

  // IF NOT LOGGED IN, REQUIRE EMAIL AUTH
  if (!userAccount || !userAccount.isLoggedIn) {
    return (
      <EmailAuthModal
        onLoginSuccess={(user) => {
          setUserAccount(user);
        }}
      />
    );
  }

  // IF SPECIAL TASK PAGE IS OPEN (Navigated inside as shown in Video 3)
  if (activeTaskPageVideo) {
    const videoProgress = userProgress[activeTaskPageVideo.id];
    const isUnlocked = !!videoProgress?.isUnlocked;
    const completedTaskIds = videoProgress?.completedTaskIds || [];

    return (
      <AdTubesTaskPage
        video={activeTaskPageVideo}
        tasks={tasksForActivePage}
        completedTaskIds={completedTaskIds}
        isUnlocked={isUnlocked}
        onCompleteTask={handleCompleteTask}
        onBack={() => setActiveTaskPageVideo(null)}
        onDownload={handleDownloadAction}
        settings={settings}
        theme={theme}
        skipTokensCount={dailyRewardState.skipTokens}
        onUseSkipToken={handleUseSkipToken}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans relative pb-8 w-full max-w-full overflow-x-clip touch-pan-y transition-colors duration-200 ${
      isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#080d1a] text-slate-100'
    }`}>
      {/* Ambient Glow Accents (Dark Mode Only) */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Real-time Animated Top Push Notification Banner */}
      {activePushNotification && userAccount.notificationsEnabled && (
        <div 
          onClick={() => {
            const vid = videos.find((v) => v.id === activePushNotification.videoId);
            if (vid) handleCardClick(vid);
            setActivePushNotification(null);
          }}
          className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md cursor-pointer animate-fadeIn border ${
            isLight 
              ? 'bg-white/95 border-purple-300 text-slate-900 shadow-purple-100' 
              : 'bg-[#1e293b]/95 border-purple-500/80 text-white'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold flex items-center justify-between">
              <span>{activePushNotification.title}</span>
              <span className="text-[10px] text-purple-400 font-mono">এখনই</span>
            </div>
            <p className={`text-xs truncate mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {activePushNotification.body}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActivePushNotification(null);
            }} 
            className="p-1 text-slate-400 hover:text-purple-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Share Toast */}
      {shareToast.show && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fadeIn backdrop-blur-md border ${
          isLight 
            ? 'bg-white/95 border-slate-300 text-slate-900 shadow-slate-200' 
            : 'bg-[#1e293b]/95 border-slate-700/80 text-white'
        }`}>
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">Link Copied!</div>
            <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>Share with friends.</div>
          </div>
        </div>
      )}

      {/* Daily Check-in & Skip Token Claim Toast Notification */}
      {claimToast?.show && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fadeIn backdrop-blur-md border max-w-sm w-[90%] sm:w-auto ${
          isLight 
            ? 'bg-white/95 border-amber-300 text-slate-900 shadow-amber-100' 
            : 'bg-[#181a2e]/95 border-amber-500/60 text-white shadow-purple-950/40'
        }`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold leading-tight truncate">{claimToast.message}</div>
            {claimToast.subMessage && (
              <div className={`text-[10px] leading-tight mt-0.5 truncate ${isLight ? 'text-slate-600' : 'text-amber-200/90'}`}>
                {claimToast.subMessage}
              </div>
            )}
          </div>
          <button
            onClick={() => setClaimToast(null)}
            className="p-1 text-slate-400 hover:text-slate-200 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Electric Bolt logo, Bachelor Point & PREMIUM FILES underneath, theme awareness */}
      <AdTubesHeader
        settings={settings}
        userAccount={userAccount}
        theme={theme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenProfile={() => setShowProfileModal(true)}
        onSecretAdminTrigger={() => setCurrentView('admin')}
        onOpenDailyCheckIn={() => setShowDailyCheckInModal(true)}
        canClaimDaily={canClaimDailyToday}
        dailyStreak={dailyRewardState.streak}
      />

      {/* Main Links Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3 sm:px-4 pb-6 space-y-2.5 relative z-10">
        {/* Compact Daily Check-in Promo Card if reward is claimable today */}
        {canClaimDailyToday && (
          <div 
            onClick={() => setShowDailyCheckInModal(true)}
            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
              isLight 
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/70 text-slate-900 shadow-xs' 
                : 'bg-gradient-to-r from-amber-950/30 to-purple-950/30 border-amber-500/30 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold truncate">ডেইলি রিওয়ার্ড প্রস্তুত!</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                    +Pts & 🎟️
                  </span>
                </div>
                <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                  আজকের বোনাস পয়েন্ট ও টাস্ক-স্কিপ টোকেন সংগ্রহ করুন
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDailyCheckInModal(true);
              }}
              className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-xs transition-transform active:scale-95 glass-sheen"
            >
              ক্লেইম
            </button>
          </div>
        )}

        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const progress = userProgress[video.id];
            const isUnlocked = !!progress?.isUnlocked;
            const completedCount = progress?.completedTaskIds?.length || 0;
            const requiredCount = video.taskMode === 'special'
              ? (video.specialChannels?.length || 2)
              : (video.requiredTasksCount ?? 3);

            return (
              <AdTubesCard
                key={video.id}
                video={video}
                isUnlocked={isUnlocked}
                completedTasksCount={completedCount}
                totalRequiredTasks={requiredCount}
                theme={theme}
                downloadText={settings.downloadButtonText || 'Download'}
                tasksText={settings.tasksButtonText || 'Tasks'}
                onOpenCardDetails={handleCardClick}
                onOpenTaskAction={handleOpenTaskAction}
                onDownloadAction={handleDownloadAction}
                onShare={handleShareLink}
              />
            );
          })
        ) : (
          <div className={`p-8 text-center rounded-2xl border my-4 ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-500' 
              : 'bg-[#17212b] border-slate-800 text-slate-400'
          }`}>
            <Film className="w-10 h-10 mx-auto text-slate-500 mb-2" />
            <p className="text-xs font-bold">কোনো ভিডিও পাওয়া যায়নি</p>
            <p className="text-[11px] text-slate-400 mt-1">অন্য কোনো শব্দ দিয়ে সার্চ করুন</p>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Compact User Profile & Theme Drawer (No overflow on small screens) */}
      {showProfileModal && (
        <UserProfileModal
          user={userAccount}
          unlockedCount={unlockedVideosCount}
          completedTasksCount={totalCompletedTasksCount}
          currentTheme={theme}
          onToggleTheme={(t) => setTheme(t)}
          onUpdateUser={(updated) => setUserAccount(updated)}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
          onOpenAdmin={() => {
            setShowProfileModal(false);
            setCurrentView('admin');
          }}
          points={dailyRewardState.points}
          skipTokens={dailyRewardState.skipTokens}
          streak={dailyRewardState.streak}
          onOpenDailyCheckIn={() => {
            setShowProfileModal(false);
            setShowDailyCheckInModal(true);
          }}
        />
      )}

      {/* 1.1 Daily Check-in Rewards Modal */}
      <DailyCheckInModal
        isOpen={showDailyCheckInModal}
        onClose={() => setShowDailyCheckInModal(false)}
        rewardState={dailyRewardState}
        onClaim={handleClaimDailyReward}
        canClaimToday={canClaimDailyToday}
        theme={theme}
      />

      {/* 2. Special Channel Task Popup (Matching Video 2: Step 1 of X, Channel, Join, Verify) */}
      {activeSpecialChannelVideo && (
        <SpecialChannelModal
          video={activeSpecialChannelVideo}
          completedChannelIds={userProgress[activeSpecialChannelVideo.id]?.completedTaskIds || []}
          onChannelCompleted={handleCompleteSpecialChannel}
          onClose={() => setActiveSpecialChannelVideo(null)}
          theme={theme}
        />
      )}

      {/* 3. In-App Advertisement Modal with Sponsor Click & 360° Ring */}
      {activeQuickAdVideo && (
        <QuickAdModal
          videoTitle={activeQuickAdVideo.title}
          currentTaskNumber={(userProgress[activeQuickAdVideo.id]?.completedTaskIds?.length || 0) + 1}
          totalTasksRequired={activeQuickAdVideo.requiredTasksCount || 3}
          sponsorImageUrl={activeQuickAdVideo.sponsorAdImageUrl || settings.sponsorAdImageUrl}
          sponsorTargetUrl={activeQuickAdVideo.sponsorAdTargetUrl || settings.sponsorAdTargetUrl || activeQuickAdVideo.botUrl}
          sponsorTitle={activeQuickAdVideo.sponsorAdTitle || settings.sponsorAdTitle}
          adDurationSeconds={settings.sponsorAdDuration || 3}
          ringDurationSeconds={settings.sponsorRingDuration || 3}
          onAdCompleted={handleQuickAdCompleted}
          onClose={() => setActiveQuickAdVideo(null)}
          theme={theme}
        />
      )}

      {/* 5. In-App Video Player Modal */}
      {activePlayerVideo && (
        <VideoPlayerModal
          video={activePlayerVideo}
          isUnlocked={!!userProgress[activePlayerVideo.id]?.isUnlocked}
          onOpenTasks={(v) => {
            setActivePlayerVideo(null);
            handleOpenTaskAction(v);
          }}
          onClose={() => setActivePlayerVideo(null)}
          lang="bn"
        />
      )}

      {/* 6. User Welcome Notice Popup Modal (with video, download button, and ✕ close button) */}
      {showWelcomeNotice && settings.welcomeNoticeActive !== false && (
        <WelcomeNoticeModal
          settings={settings}
          theme={theme}
          onClose={() => setShowWelcomeNotice(false)}
        />
      )}

      {/* Discreet Brand Footer */}
      <footer className={`mt-auto py-4 text-center text-xs ${
        isLight ? 'text-slate-500' : 'text-slate-600'
      }`}>
        <p>{settings.footerText || `TeleVideo Pro © ${new Date().getFullYear()} · Premium Viral Gateway`}</p>
      </footer>
    </div>
  );
}
