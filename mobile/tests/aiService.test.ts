import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { aiService } from '../src/services/aiService';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('aiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('generateContent', () => {
    it('should generate content using template fallback when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await aiService.generateContent('AI automation', 'twitter', {
        tone: 'bold',
        includeCta: true,
        hashtagCount: 3,
      });

      expect(result.caption).toContain('AI automation');
      expect(result.hashtags.length).toBeLessThanOrEqual(3);
      expect(result.caption).toContain('Automate your empire today');
    });

    it('should respect platform limits', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await aiService.generateContent(
        'A very long topic about scaling businesses with AI automation and machine learning',
        'twitter',
        { tone: 'bold', includeCta: true, hashtagCount: 5 }
      );

      expect(result.caption.length).toBeLessThanOrEqual(280);
    });

    it('should generate Instagram content with different template', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await aiService.generateContent('Launch day', 'instagram', {
        tone: 'motivational',
        includeCta: true,
        hashtagCount: 5,
      });

      expect(result.caption).toContain('Launch day');
      expect(result.hashtags.length).toBeGreaterThan(0);
    });
  });

  describe('predictEngagement', () => {
    it('should return engagement prediction with valid structure', async () => {
      const prediction = await aiService.predictEngagement({
        platform: 'instagram',
        caption: 'Test post',
      } as any);

      expect(prediction).toHaveProperty('score');
      expect(prediction).toHaveProperty('estimatedLikes');
      expect(prediction).toHaveProperty('estimatedShares');
      expect(prediction).toHaveProperty('estimatedComments');
      expect(prediction).toHaveProperty('bestPostingTime');
      expect(prediction).toHaveProperty('confidence');
      expect(prediction.score).toBeGreaterThan(0);
      expect(prediction.score).toBeLessThanOrEqual(1);
    });

    it('should apply platform multiplier', async () => {
      const igPrediction = await aiService.predictEngagement({
        platform: 'instagram',
        caption: 'Test',
      } as any);

      const twitterPrediction = await aiService.predictEngagement({
        platform: 'twitter',
        caption: 'Test',
      } as any);

      // Instagram has higher multiplier (1.2) than Twitter (1.0)
      expect(igPrediction.score).toBeGreaterThanOrEqual(twitterPrediction.score * 0.9);
    });
  });

  describe('getTrendingInsights', () => {
    it('should return array of insights', async () => {
      const insights = await aiService.getTrendingInsights();

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0]).toHaveProperty('id');
      expect(insights[0]).toHaveProperty('type');
      expect(insights[0]).toHaveProperty('title');
      expect(insights[0]).toHaveProperty('confidence');
    });
  });

  describe('analyzeCompetitor', () => {
    it('should return competitor analysis with required fields', async () => {
      const analysis = await aiService.analyzeCompetitor('@testuser', 'twitter');

      expect(analysis).toHaveProperty('id');
      expect(analysis).toHaveProperty('name', '@testuser');
      expect(analysis).toHaveProperty('platform', 'twitter');
      expect(analysis).toHaveProperty('followers');
      expect(analysis).toHaveProperty('engagementRate');
      expect(analysis).toHaveProperty('topHashtags');
      expect(analysis).toHaveProperty('strengths');
      expect(analysis).toHaveProperty('weaknesses');
    });
  });
});
