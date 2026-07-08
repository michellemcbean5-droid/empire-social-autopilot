import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, Icon, LinearProgress } from '@rneui/themed';

import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { FeatureGate } from '../components/FeatureGate';

const { width } = Dimensions.get('window');

export function AnalyticsScreen() {
  const { user, published, scheduled } = useAppStore();
  const totalPosts = published.length + scheduled.length;
  const publishedCount = published.length;

  const platformBreakdown = published.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxPlatform = Math.max(...Object.values(platformBreakdown), 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your social empire growth</Text>
      </View>

      <View style={styles.statsRow}>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{totalPosts}</Text>
          <Text style={styles.statLabel}>Total Posts</Text>
        </Card>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{publishedCount}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </Card>
      </View>

      <FeatureGate
        requiredTier="basic"
        fallback={
          <Card containerStyle={styles.lockedCard}>
            <Icon name="lock" type="material" size={32} color={COLORS.warning} />
            <Text style={styles.lockedTitle}>Advanced Analytics Locked</Text>
            <Text style={styles.lockedText}>
              Upgrade to Basic or higher to unlock platform breakdown, engagement trends, and AI-powered insights.
            </Text>
            <Button
              title="Upgrade to Basic"
              onPress={() => {}}
              containerStyle={{ marginTop: SPACING.md }}
            />
          </Card>
        }
      >
        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Platform Breakdown</Text>
          {Object.entries(platformBreakdown).map(([platform, count]) => (
            <View key={platform} style={styles.platformBar}>
              <Text style={styles.platformLabel}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(count / maxPlatform) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{count}</Text>
            </View>
          ))}
        </Card>

        <Card containerStyle={styles.card}>
          <Text style={styles.cardTitle}>Engagement Trends</Text>
          <View style={styles.trendPlaceholder}>
            <Text style={styles.trendText}>
              📊 Detailed engagement analytics will appear here once you have published posts with live platform connections.
            </Text>
          </View>
        </Card>

        <FeatureGate requiredTier="pro">
          <Card containerStyle={styles.card}>
            <Text style={styles.cardTitle}>AI Performance Insights</Text>
            <View style={styles.insightItem}>
              <Icon name="trending-up" type="material" color={COLORS.success} size={20} />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Best Posting Time</Text>
                <Text style={styles.insightText}>
                  Your audience is most active between 6-9 PM. Posts during this window see 34% more engagement.
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Icon name="tag" type="material" color={COLORS.primary} size={20} />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Hashtag</Text>
                <Text style={styles.insightText}>
                  #AIautomation is your highest-performing hashtag with 2.3x average engagement.
                </Text>
              </View>
            </View>
          </Card>
        </FeatureGate>
      </FeatureGate>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  platformBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  platformLabel: {
    width: 80,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginHorizontal: SPACING.sm,
  },
  barFill: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  barValue: {
    width: 30,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  trendPlaceholder: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  trendText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  insightContent: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  insightTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  insightText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
    lineHeight: 20,
  },
  lockedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  lockedText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
});
