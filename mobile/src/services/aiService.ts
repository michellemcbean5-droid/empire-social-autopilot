import { Platform } from '../types';

/**
 * AI Service for generating content, insights, and competitor analysis.
 * Uses free APIs: HuggingFace Inference API, public datasets, and local templates.
 */

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const FREE_MODELS = {
  textGeneration: 'google/flan-t5-base',
  summarization: 'facebook/bart-large-cnn',
  sentiment: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
};

interface GenerateContentOptions {
  tone?: string;
  includeCta?: boolean;
  hashtagCount?: number;
  brandName?: string;
}

export const aiService = {
  /**
   * Generate social media content using free AI APIs.
   * Falls back to template generation if API fails.
   */
  async generateContent(
    topic: string,
    platform: Platform,
    options: GenerateContentOptions = {}
  ): Promise<{ caption: string; hashtags: string[] }> {
    try {
      // Try HuggingFace Inference API (free tier: 10k requests/month)
      const result = await this.callHuggingFace(topic, platform, options);
      if (result) return result;
    } catch (error) {
      console.warn('AI generation failed, using template fallback:', error);
    }

    // Template fallback
    return this.generateTemplate(topic, platform, options);
  },

  async callHuggingFace(
    topic: string,
    platform: Platform,
    options: GenerateContentOptions
  ): Promise<{ caption: string; hashtags: string[] } | null> {
    const prompt = this.buildPrompt(topic, platform, options);

    try {
      const response = await fetch(
        `${HUGGINGFACE_API_URL}/${FREE_MODELS.textGeneration}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Note: HF_API_KEY is optional for free tier but recommended for rate limits
            ...(process.env.HF_API_KEY
              ? { Authorization: `Bearer ${process.env.HF_API_KEY}` }
              : {}),
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 150,
              temperature: 0.8,
              do_sample: true,
            },
          }),
        }
      );

      if (!response.ok) {
        // If model is loading, wait and retry
        if (response.status === 503) {
          await new Promise((resolve) => setTimeout(resolve, 20000));
          return this.callHuggingFace(topic, platform, options);
        }
        return null;
      }

      const data = await response.json();
      const generatedText =
        Array.isArray(data) && data[0]?.generated_text
          ? data[0].generated_text
          : data.generated_text || '';

      return this.parseGeneratedContent(generatedText, platform, options);
    } catch (error) {
      console.warn('HuggingFace API error:', error);
      return null;
    }
  },

  buildPrompt(
    topic: string,
    platform: Platform,
    options: GenerateContentOptions
  ): string {
    const { tone = 'bold, motivational', includeCta = true, brandName = 'Q-Empire' } = options;

    const platformHints: Record<Platform, string> = {
      twitter: 'Write a short, punchy tweet under 280 characters.',
      instagram: 'Write an engaging Instagram caption with emojis.',
      linkedin: 'Write a professional LinkedIn post with business insights.',
      facebook: 'Write a friendly Facebook post for community engagement.',
      tiktok: 'Write a fun, energetic TikTok caption.',
    };

    return `Write a social media post for ${platform} about: ${topic}.
Tone: ${tone}.
Brand: ${brandName}.
${platformHints[platform]}
${includeCta ? 'Include a call to action.' : ''}
Include 3-5 relevant hashtags.`;
  },

  parseGeneratedContent(
    text: string,
    platform: Platform,
    options: GenerateContentOptions
  ): { caption: string; hashtags: string[] } {
    // Extract hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = (text.match(hashtagRegex) || []).slice(
      0,
      options.hashtagCount || 5
    );

    // Remove hashtags from caption
    let caption = text.replace(hashtagRegex, '').trim();

    // Apply platform limits
    const limits: Record<Platform, number> = {
      twitter: 280,
      instagram: 2200,
      linkedin: 3000,
      facebook: 63206,
      tiktok: 2200,
    };

    if (caption.length > limits[platform]) {
      caption = caption.substring(0, limits[platform] - 1) + '…';
    }

    return { caption, hashtags };
  },

  generateTemplate(
    topic: string,
    platform: Platform,
    options: GenerateContentOptions
  ): { caption: string; hashtags: string[] } {
    const { tone = 'bold, motivational', includeCta = true, brandName = 'Q-Empire' } = options;
    const emoji = '🚀 ';
    const cta = includeCta ? ` Automate your empire today. 👉 qempireai.com` : '';

    const captions: Record<Platform, string> = {
      twitter: `${emoji}${topic}.${cta}`,
      instagram: `${emoji}${topic}\n\nBuilt for founders who move fast.${cta}`,
      linkedin: `${topic}\n\nHere's why it matters for founders and small businesses: automation compounds. Start small, scale relentlessly.\n\n${cta}`,
      facebook: `${emoji}${topic}\n\n${cta}`,
      tiktok: `${emoji}${topic} — ${cta}`,
    };

    const baseHashtags = ['#QEmpire', '#AIautomation', '#Entrepreneur'];
    const topicTag = '#' + topic.split(' ').slice(0, 2).join('').replace(/[^a-zA-Z0-9]/g, '');

    return {
      caption: captions[platform] || `${topic}.${cta}`,
      hashtags: [...baseHashtags, topicTag].slice(0, options.hashtagCount || 5),
    };
  },

  /**
   * Get trending insights using free data sources.
   */
  async getTrendingInsights(): Promise<any[]> {
    // In production, this would fetch from:
    // - Google Trends API (free with API key)
    // - Twitter/X API v2 (free tier available)
    // - Reddit API (free)
    // - News APIs (free tiers available)

    // For now, return simulated insights based on current patterns
    return [
      {
        id: '1',
        type: 'trend',
        title: 'Peak Engagement Window',
        description:
          'Your audience is most active between 6-9 PM. Schedule posts during this window for 34% more engagement.',
        confidence: 0.87,
      },
      {
        id: '2',
        type: 'hashtag',
        title: '#AIautomation Trending',
        description:
          'This hashtag is up 156% this week. Creating content around this topic could increase reach by 40%.',
        confidence: 0.92,
      },
    ];
  },

  /**
   * Analyze competitor using free data sources.
   */
  async analyzeCompetitor(handle: string, platform: Platform): Promise<any> {
    // In production, this would use:
    // - Social media scraping (respect robots.txt)
    // - Public profile APIs
    // - Free analytics tools

    // Simulated analysis
    return {
      id: Date.now().toString(),
      name: handle,
      platform,
      followers: Math.floor(Math.random() * 100000) + 1000,
      engagementRate: (Math.random() * 5 + 1).toFixed(2),
      postFrequency: Math.floor(Math.random() * 10) + 1,
      topHashtags: ['#AI', '#automation', '#startup', '#growth', '#founder'],
      bestPerformingContent: [
        'How to automate your business',
        '10 tools every founder needs',
      ],
      weaknesses: [
        'Inconsistent posting schedule',
        'Low video content',
      ],
      strengths: ['Strong engagement', 'Good hashtag strategy'],
      analyzedAt: new Date().toISOString(),
    };
  },

  /**
   * Predict engagement for a post using free ML models.
   */
  async predictEngagement(post: any): Promise<any> {
    // In production, this would use:
    // - Historical data analysis
    // - Free ML models from HuggingFace
    // - Time-series forecasting

    const baseScore = Math.random() * 0.4 + 0.5;
    const platformMultiplier =
      { twitter: 1.0, instagram: 1.2, linkedin: 0.8, facebook: 0.9, tiktok: 1.5 }[
        post.platform
      ] || 1.0;

    const score = Math.min(baseScore * platformMultiplier, 0.99);

    return {
      score,
      estimatedLikes: Math.floor(score * 1000),
      estimatedShares: Math.floor(score * 200),
      estimatedComments: Math.floor(score * 100),
      bestPostingTime: '18:00-21:00',
      confidence: 0.75 + Math.random() * 0.2,
    };
  },
};
