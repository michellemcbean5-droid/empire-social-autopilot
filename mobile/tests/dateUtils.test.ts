import { describe, it, expect } from '@jest/globals';
import { formatDate, groupByDate, isSameDay, addDays, getOptimalPostingTimes } from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should return "Today" for current date', () => {
      const today = new Date().toISOString();
      expect(formatDate(today)).toBe('Today');
    });

    it('should return "Tomorrow" for next day', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatDate(tomorrow.toISOString())).toBe('Tomorrow');
    });

    it('should return formatted date for other days', () => {
      const date = new Date('2026-01-15');
      const result = formatDate(date.toISOString());
      expect(result).toContain('January');
      expect(result).toContain('15');
    });
  });

  describe('groupByDate', () => {
    it('should group items by date', () => {
      const items = [
        { id: '1', createdAt: '2026-01-15T10:00:00Z', scheduledFor: undefined },
        { id: '2', createdAt: '2026-01-15T14:00:00Z', scheduledFor: undefined },
        { id: '3', createdAt: '2026-01-16T10:00:00Z', scheduledFor: undefined },
      ];

      const grouped = groupByDate(items as any);
      const keys = Object.keys(grouped);
      expect(keys.length).toBe(2);
      expect(grouped[keys[0]].length).toBe(2);
      expect(grouped[keys[1]].length).toBe(1);
    });

    it('should use scheduledFor when available', () => {
      const items = [
        { id: '1', createdAt: '2026-01-15T10:00:00Z', scheduledFor: '2026-01-20T10:00:00Z' },
      ];

      const grouped = groupByDate(items as any);
      const keys = Object.keys(grouped);
      expect(keys[0]).toContain('2026-01-20');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const d1 = new Date('2026-01-15T10:00:00');
      const d2 = new Date('2026-01-15T18:00:00');
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('should return false for different days', () => {
      const d1 = new Date('2026-01-15');
      const d2 = new Date('2026-01-16');
      expect(isSameDay(d1, d2)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2026-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle month boundaries', () => {
      const date = new Date('2026-01-30');
      const result = addDays(date, 3);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(2);
    });
  });

  describe('getOptimalPostingTimes', () => {
    it('should return times for known platforms', () => {
      expect(getOptimalPostingTimes('twitter')).toEqual([9, 12, 17, 20]);
      expect(getOptimalPostingTimes('instagram')).toEqual([11, 15, 19]);
      expect(getOptimalPostingTimes('linkedin')).toEqual([8, 12, 17]);
    });

    it('should return default for unknown platform', () => {
      expect(getOptimalPostingTimes('unknown')).toEqual([12]);
    });
  });
});
