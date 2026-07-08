import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Post, ContentCalendar, Platform, PostStatus, BrandVoice } from '../types';

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: SubscriptionTier;
  referralCode: string;
  referralsCount: number;
  trialEndsAt?: string;
  promoCode?: string;
  masterAccess: boolean;
}

export interface AppState {
  // App lifecycle
  isReady: boolean;
  isOnline: boolean;
  lastSyncAt: string | null;

  // User
  user: UserProfile | null;
  isAuthenticated: boolean;

  // Content
  calendars: ContentCalendar[];
  drafts: Post[];
  scheduled: Post[];
  published: Post[];

  // Brand voice
  brandVoice: BrandVoice;

  // UI state
  isLoading: boolean;
  error: string | null;
  selectedCalendarId: string | null;

  // Monetization
  showUpgradePrompt: boolean;
  lastUpgradePromptAt: string | null;
  adFreeUntil: string | null;

  // Actions
  initialize: () => Promise<void>;
  setOnline: (online: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setTier: (tier: SubscriptionTier) => void;
  upgradeWithPromoCode: (code: string) => boolean;
  unlockMasterAccess: (code: string) => boolean;
  addCalendar: (calendar: ContentCalendar) => void;
  updateCalendar: (id: string, updates: Partial<ContentCalendar>) => void;
  deleteCalendar: (id: string) => void;
  addDraft: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  setBrandVoice: (voice: Partial<BrandVoice>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  dismissUpgradePrompt: () => void;
  triggerUpgradePrompt: () => void;
  sync: () => Promise<void>;
  logout: () => void;
}

const DEFAULT_BRAND_VOICE: BrandVoice = {
  name: 'Q-Empire',
  tone: 'bold, motivational, entrepreneurial',
  emoji: true,
  cta: 'Automate your empire today.',
  hashtagsBase: ['#QEmpire', '#AIautomation', '#Entrepreneur'],
};

const DEFAULT_USER: UserProfile = {
  id: 'guest',
  name: 'Guest User',
  email: '',
  tier: 'free',
  referralCode: 'EMPIRE' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  referralsCount: 0,
  masterAccess: false,
};

const MASTER_CODE = process.env.MASTER_ACCESS_CODE || 'EMP1R3-MAST3R-2026';

const PROMO_CODES: Record<string, { tier: SubscriptionTier; durationDays: number; discount?: number }> = {
  'WELCOME50': { tier: 'basic', durationDays: 30, discount: 0.5 },
  'PROLAUNCH': { tier: 'pro', durationDays: 14 },
  'ELITE2026': { tier: 'elite', durationDays: 7 },
  'REFER10': { tier: 'basic', durationDays: 30, discount: 0.1 },
  'FOUNDER': { tier: 'pro', durationDays: 90, discount: 0.25 },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isReady: false,
      isOnline: true,
      lastSyncAt: null,
      user: DEFAULT_USER,
      isAuthenticated: false,
      calendars: [],
      drafts: [],
      scheduled: [],
      published: [],
      brandVoice: DEFAULT_BRAND_VOICE,
      isLoading: false,
      error: null,
      selectedCalendarId: null,
      showUpgradePrompt: false,
      lastUpgradePromptAt: null,
      adFreeUntil: null,

      initialize: async () => {
        // Simulate app initialization
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({ isReady: true });
      },

      setOnline: (online) => set({ isOnline: online }),

      setUser: (user) => set({ user, isAuthenticated: !!user && user.id !== 'guest' }),

      setTier: (tier) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, tier } });
        }
      },

      upgradeWithPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();
        const promo = PROMO_CODES[normalized];
        if (!promo) return false;

        const user = get().user;
        if (!user) return false;

        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + promo.durationDays);

        set({
          user: {
            ...user,
            tier: promo.tier,
            promoCode: normalized,
            trialEndsAt: trialEndsAt.toISOString(),
          },
        });
        return true;
      },

      unlockMasterAccess: (code) => {
        if (code !== MASTER_CODE) return false;
        const user = get().user;
        if (!user) return false;
        set({
          user: {
            ...user,
            tier: 'elite',
            masterAccess: true,
            promoCode: 'MASTER',
          },
        });
        return true;
      },

      addCalendar: (calendar) => {
        set((state) => ({ calendars: [calendar, ...state.calendars] }));
      },

      updateCalendar: (id, updates) => {
        set((state) => ({
          calendars: state.calendars.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCalendar: (id) => {
        set((state) => ({
          calendars: state.calendars.filter((c) => c.id !== id),
        }));
      },

      addDraft: (post) => {
        set((state) => ({ drafts: [post, ...state.drafts] }));
      },

      updatePost: (postId, updates) => {
        set((state) => ({
          drafts: state.drafts.map((p) => (p.id === postId ? { ...p, ...updates } : p)),
          scheduled: state.scheduled.map((p) => (p.id === postId ? { ...p, ...updates } : p)),
          published: state.published.map((p) => (p.id === postId ? { ...p, ...updates } : p)),
        }));
      },

      deletePost: (postId) => {
        set((state) => ({
          drafts: state.drafts.filter((p) => p.id !== postId),
          scheduled: state.scheduled.filter((p) => p.id !== postId),
          published: state.published.filter((p) => p.id !== postId),
        }));
      },

      setBrandVoice: (voice) => {
        set((state) => ({
          brandVoice: { ...state.brandVoice, ...voice },
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      dismissUpgradePrompt: () => {
        set({ showUpgradePrompt: false, lastUpgradePromptAt: new Date().toISOString() });
      },

      triggerUpgradePrompt: () => {
        const { lastUpgradePromptAt, user } = get();
        if (user?.tier !== 'free') return;

        const now = new Date();
        const lastPrompt = lastUpgradePromptAt ? new Date(lastUpgradePromptAt) : null;
        const hoursSinceLastPrompt = lastPrompt
          ? (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60)
          : Infinity;

        if (hoursSinceLastPrompt >= 24) {
          set({ showUpgradePrompt: true });
        }
      },

      sync: async () => {
        set({ isLoading: true });
        try {
          // Simulate sync with backend
          await new Promise((resolve) => setTimeout(resolve, 2000));
          set({ lastSyncAt: new Date().toISOString(), isLoading: false });
        } catch (err) {
          set({ error: 'Sync failed. Will retry when online.', isLoading: false });
        }
      },

      logout: () => {
        set({
          user: DEFAULT_USER,
          isAuthenticated: false,
          calendars: [],
          drafts: [],
          scheduled: [],
          published: [],
        });
      },
    }),
    {
      name: 'empire-social-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        calendars: state.calendars,
        drafts: state.drafts,
        scheduled: state.scheduled,
        published: state.published,
        brandVoice: state.brandVoice,
        lastSyncAt: state.lastSyncAt,
        lastUpgradePromptAt: state.lastUpgradePromptAt,
        adFreeUntil: state.adFreeUntil,
      }),
    }
  )
);
