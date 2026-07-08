export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface Post {
  id: string;
  platform: Platform;
  caption: string;
  hashtags: string[];
  scheduledFor?: string;
  status: PostStatus;
  mediaUrl?: string;
  externalId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  aiGenerated?: boolean;
  aiScore?: number;
  engagementPrediction?: EngagementPrediction;
}

export interface EngagementPrediction {
  score: number;
  estimatedLikes: number;
  estimatedShares: number;
  estimatedComments: number;
  bestPostingTime: string;
  confidence: number;
}

export interface ContentCalendar {
  id: string;
  campaign: string;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'paused' | 'completed';
  platforms: Platform[];
  topics: string[];
}

export interface BrandVoice {
  name: string;
  tone: string;
  emoji: boolean;
  cta: string;
  hashtagsBase: string[];
}

export interface CompetitorAnalysis {
  id: string;
  name: string;
  platform: Platform;
  followers: number;
  engagementRate: number;
  postFrequency: number;
  topHashtags: string[];
  bestPerformingContent: string[];
  weaknesses: string[];
  strengths: string[];
  analyzedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'hashtag' | 'content' | 'timing' | 'competitor';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  action?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'post_published' | 'post_failed' | 'insight' | 'upgrade' | 'reminder';
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface AnalyticsData {
  period: string;
  postsPublished: number;
  totalEngagement: number;
  engagementByPlatform: Record<Platform, number>;
  followerGrowth: number;
  topPosts: Post[];
  trendData: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  engagement: number;
  followers: number;
  posts: number;
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  priceAnnual: number;
  description: string;
  features: string[];
  limits: {
    calendarsPerMonth: number;
    postsPerMonth: number;
    platforms: number;
    aiGenerations: number;
    analyticsRetentionDays: number;
    competitorTracking: number;
    teamMembers: number;
  };
  popular?: boolean;
}

export interface PromoCode {
  code: string;
  tier: SubscriptionTier;
  durationDays: number;
  discount?: number;
  used: boolean;
}
