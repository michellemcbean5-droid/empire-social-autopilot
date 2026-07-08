import { describe, it, expect } from '@jest/globals';
import { generateId, truncate, formatNumber, debounce, throttle } from '../src/utils/helpers';

describe('helpers', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should include timestamp', () => {
      const id = generateId();
      const timestamp = parseInt(id.split('-')[0]);
      expect(timestamp).toBeGreaterThan(1700000000000); // After 2023
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate long strings with ellipsis', () => {
      const result = truncate('hello world', 8);
      expect(result.length).toBeLessThanOrEqual(8);
      expect(result).toContain('…');
    });

    it('should handle exact length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });
  });

  describe('formatNumber', () => {
    it('should format thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1000)).toBe('1K');
    });

    it('should format millions', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(1000000)).toBe('1M');
    });

    it('should return small numbers as-is', () => {
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('debounce', () => {
    it('should delay function execution', (done) => {
      let called = false;
      const debounced = debounce(() => {
        called = true;
      }, 50);

      debounced();
      expect(called).toBe(false);

      setTimeout(() => {
        expect(called).toBe(true);
        done();
      }, 100);
    });

    it('should cancel previous calls', (done) => {
      let count = 0;
      const debounced = debounce(() => {
        count++;
      }, 50);

      debounced();
      debounced();
      debounced();

      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 100);
    });
  });

  describe('throttle', () => {
    it('should limit execution rate', (done) => {
      let count = 0;
      const throttled = throttle(() => {
        count++;
      }, 100);

      throttled();
      throttled();
      throttled();

      expect(count).toBe(1);

      setTimeout(() => {
        throttled();
        expect(count).toBe(2);
        done();
      }, 150);
    });
  });
});
