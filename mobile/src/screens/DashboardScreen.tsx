import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Badge, LinearProgress } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { PostCard } from '../components/PostCard';
import { InsightCard } from '../components/InsightCard';
import { FeatureGate } from '../components/FeatureGate';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, calendars, scheduled, published, isLoading, sync } = useAppStore();
  const isOnline = useNetworkStatus();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

  const recentPosts = [...scheduled, ...published].slice(0, 5);
  const postsThisWeek = published.filter((p) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(p.createdAt) > weekAgo;
  }).length;

  const tierColor = {
    free: COLORS.textMuted,
    basic: COLORS.info,
    pro: COLORS.secondary,
    elite: COLORS.accent,
  }[user?.tier || 'free'];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.name}>{user?.name || 'Founder'}</Text>
          </View>
          <Badge
            value={user?.tier?.toUpperCase() || 'FREE'}
            badgeStyle={{ backgroundColor: tierColor, paddingHorizontal: 8 }}
            textStyle={{ fontWeight: '700', fontSize: 12 }}
          />
        </View>
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>You're offline. Changes will sync when you reconnect.</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{calendars.length}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </Card>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{scheduled.length}</Text>
          <Text style={styles.statLabel}>Scheduled</Text>
        </Card>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{postsThisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <Button
            type="clear"
            title="View All"
            titleStyle={{ color: COLORS.primary, fontSize: 14 }}
            onPress={() => navigation.navigate('AIInsights')}
          />
        </View>
        <FeatureGate requiredTier="basic" fallback={<InsightCard type="upgrade" />}>
          <InsightCard
            type="trend"
            title="Peak Engagement Window"
            description="Your audience is most active between 6-9 PM. Schedule posts during this window for 34% more engagement."
            confidence={0.87}
          />
          <InsightCard
            type="content"
            title="Trending Hashtag Opportunity"
            description="#AIautomation is trending up 156% this week. Consider creating content around this topic."
            confidence={0.92}
            actionable
            actionText="Create Post"
            onAction={() => navigation.navigate('MainTabs', { screen: 'Create' })}
          />
        </FeatureGate>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Button
            type="clear"
            title="Calendar"
            titleStyle={{ color: COLORS.primary, fontSize: 14 }}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Calendar' })}
          />
        </View>
        {recentPosts.length === 0 ? (
          <Card containerStyle={styles.emptyCard}>
            <Text style={styles.emptyText}>No posts yet. Create your first campaign!</Text>
            <Button
              title="Create Post"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Create' })}
              containerStyle={{ marginTop: SPACING.md }}
            />
          </Card>
        ) : (
          recentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
            />
          ))
        )}
      </View>

      {user?.tier === 'free' && (
        <Card containerStyle={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Unlock AI-Powered Growth</Text>
          <Text style={styles.upgradeText}>
            Upgrade to Pro for unlimited AI content generation, competitor analysis, and advanced analytics.
          </Text>
          <Button
            title="Upgrade Now"
            onPress={() => navigation.navigate('Subscription', { highlightTier: 'pro' })}
            containerStyle={{ marginTop: SPACING.md }}
          />
        </Card>
      )}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  offlineBanner: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.md,
  },
  offlineText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  upgradeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  upgradeTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  upgradeText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
});
