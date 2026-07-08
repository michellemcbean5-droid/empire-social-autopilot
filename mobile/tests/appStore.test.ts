import { describe, it, expect, beforeEach } from '@jest/globals';
import { useAppStore } from '../src/store/appStore';
import { resetStore } from './setup';

describe('appStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('user management', () => {
    it('should initialize with default user', () => {
      const state = useAppStore.getState();
      expect(state.user).toBeDefined();
      expect(state.user?.tier).toBe('free');
      expect(state.user?.name).toBe('Guest User');
    });

    it('should upgrade user tier', () => {
      useAppStore.getState().setTier('pro');
      expect(useAppStore.getState().user?.tier).toBe('pro');
    });

    it('should apply promo code successfully', () => {
      const result = useAppStore.getState().upgradeWithPromoCode('WELCOME50');
      expect(result).toBe(true);
      expect(useAppStore.getState().user?.tier).toBe('basic');
      expect(useAppStore.getState().user?.promoCode).toBe('WELCOME50');
    });

    it('should reject invalid promo code', () => {
      const result = useAppStore.getState().upgradeWithPromoCode('INVALID');
      expect(result).toBe(false);
      expect(useAppStore.getState().user?.tier).toBe('free');
    });

    it('should unlock master access with correct code', () => {
      const result = useAppStore.getState().unlockMasterAccess('EMP1R3-MAST3R-2026');
      expect(result).toBe(true);
      expect(useAppStore.getState().user?.tier).toBe('elite');
      expect(useAppStore.getState().user?.masterAccess).toBe(true);
    });

    it('should reject wrong master code', () => {
      const result = useAppStore.getState().unlockMasterAccess('wrong-code');
      expect(result).toBe(false);
    });
  });

  describe('calendar management', () => {
    it('should add calendar', () => {
      const calendar = {
        id: 'cal-1',
        campaign: 'Test Campaign',
        posts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const,
        platforms: ['twitter' as const],
        topics: ['AI'],
      };

      useAppStore.getState().addCalendar(calendar);
      expect(useAppStore.getState().calendars).toHaveLength(1);
      expect(useAppStore.getState().calendars[0].campaign).toBe('Test Campaign');
    });

    it('should delete calendar', () => {
      const calendar = {
        id: 'cal-1',
        campaign: 'Test',
        posts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const,
        platforms: ['twitter' as const],
        topics: ['AI'],
      };

      useAppStore.getState().addCalendar(calendar);
      useAppStore.getState().deleteCalendar('cal-1');
      expect(useAppStore.getState().calendars).toHaveLength(0);
    });
  });

  describe('post management', () => {
    it('should add draft', () => {
      const post = {
        id: 'post-1',
        platform: 'twitter' as const,
        caption: 'Test post',
        hashtags: ['#test'],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useAppStore.getState().addDraft(post);
      expect(useAppStore.getState().drafts).toHaveLength(1);
    });

    it('should update post across all lists', () => {
      const post = {
        id: 'post-1',
        platform: 'twitter' as const,
        caption: 'Test',
        hashtags: ['#test'],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useAppStore.getState().addDraft(post);
      useAppStore.getState().updatePost('post-1', { caption: 'Updated' });
      expect(useAppStore.getState().drafts[0].caption).toBe('Updated');
    });

    it('should delete post from all lists', () => {
      const post = {
        id: 'post-1',
        platform: 'twitter' as const,
        caption: 'Test',
        hashtags: [],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useAppStore.getState().addDraft(post);
      useAppStore.getState().deletePost('post-1');
      expect(useAppStore.getState().drafts).toHaveLength(0);
    });
  });

  describe('brand voice', () => {
    it('should update brand voice', () => {
      useAppStore.getState().setBrandVoice({ name: 'My Brand' });
      expect(useAppStore.getState().brandVoice.name).toBe('My Brand');
    });
  });

  describe('upgrade prompt', () => {
    it('should not trigger for paid users', () => {
      useAppStore.getState().setTier('pro');
      useAppStore.getState().triggerUpgradePrompt();
      expect(useAppStore.getState().showUpgradePrompt).toBe(false);
    });

    it('should trigger for free users', () => {
      useAppStore.getState().triggerUpgradePrompt();
      expect(useAppStore.getState().showUpgradePrompt).toBe(true);
    });
  });
});
