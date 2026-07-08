import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@rneui/themed';

import { LoadingScreen } from '../src/components/LoadingScreen';
import { PostCard } from '../src/components/PostCard';
import { InsightCard } from '../src/components/InsightCard';
import { FeatureGate } from '../src/components/FeatureGate';
import { theme } from '../src/constants/theme';
import { useAppStore } from '../src/store/appStore';
import { resetStore } from './setup';

function renderWithTheme(component: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
}

describe('LoadingScreen', () => {
  it('should render title', () => {
    const { getByText } = renderWithTheme(
      <LoadingScreen title="Loading" />
    );
    expect(getByText('Loading')).toBeTruthy();
  });

  it('should render subtitle when provided', () => {
    const { getByText } = renderWithTheme(
      <LoadingScreen title="Loading" subtitle="Please wait..." />
    );
    expect(getByText('Please wait...')).toBeTruthy();
  });

  it('should show retry button when enabled', () => {
    const mockRetry = jest.fn();
    const { getByText } = renderWithTheme(
      <LoadingScreen title="Error" showRetry onRetry={mockRetry} />
    );
    expect(getByText('Tap to retry')).toBeTruthy();
  });
});

describe('PostCard', () => {
  const mockPost = {
    id: 'post-1',
    platform: 'twitter' as const,
    caption: 'Test caption for Twitter',
    hashtags: ['#test', '#twitter'],
    status: 'draft' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: true,
  };

  it('should render post caption', () => {
    const { getByText } = renderWithTheme(
      <PostCard post={mockPost} />
    );
    expect(getByText('Test caption for Twitter')).toBeTruthy();
  });

  it('should render platform name', () => {
    const { getByText } = renderWithTheme(
      <PostCard post={mockPost} />
    );
    expect(getByText('TWITTER')).toBeTruthy();
  });

  it('should show AI badge for AI-generated posts', () => {
    const { getByText } = renderWithTheme(
      <PostCard post={mockPost} />
    );
    expect(getByText('AI')).toBeTruthy();
  });
});

describe('InsightCard', () => {
  it('should render upgrade card when type is upgrade', () => {
    const { getByText } = renderWithTheme(
      <InsightCard type="upgrade" />
    );
    expect(getByText('AI Insights Locked')).toBeTruthy();
  });

  it('should render insight with title and description', () => {
    const { getByText } = renderWithTheme(
      <InsightCard
        type="trend"
        title="Trending Topic"
        description="This is a trending topic"
        confidence={0.85}
      />
    );
    expect(getByText('Trending Topic')).toBeTruthy();
    expect(getByText('This is a trending topic')).toBeTruthy();
    expect(getByText('Confidence: 85%')).toBeTruthy();
  });

  it('should render action button when actionable', () => {
    const { getByText } = renderWithTheme(
      <InsightCard
        type="content"
        title="Content Idea"
        description="Create this post"
        actionable
        actionText="Create Now"
        onAction={() => {}}
      />
    );
    expect(getByText('Create Now')).toBeTruthy();
  });
});

describe('FeatureGate', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should render children when user has access', () => {
    useAppStore.getState().setTier('pro');

    const { getByText } = renderWithTheme(
      <FeatureGate requiredTier="basic">
        <Text>Premium Content</Text>
      </FeatureGate>
    );
    expect(getByText('Premium Content')).toBeTruthy();
  });

  it('should render fallback when user lacks access', () => {
    const { getByText } = renderWithTheme(
      <FeatureGate
        requiredTier="pro"
        fallback={<Text>Locked</Text>}
      >
        <Text>Premium Content</Text>
      </FeatureGate>
    );
    expect(getByText('Locked')).toBeTruthy();
  });

  it('should render locked card when no fallback provided', () => {
    const { getByText } = renderWithTheme(
      <FeatureGate requiredTier="pro">
        <Text>Premium Content</Text>
      </FeatureGate>
    );
    expect(getByText('Premium Feature')).toBeTruthy();
  });
});
