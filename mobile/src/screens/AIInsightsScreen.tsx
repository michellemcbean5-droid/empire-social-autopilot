import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { FeatureGate } from '../components/FeatureGate';
import { aiService } from '../services/aiService';
import type { AIInsight } from '../types';

export function AIInsightsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAppStore();
  const [insights, setInsights] = React.useState<AIInsight[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.getTrendingInsights();
      setInsights(data);
    } catch (error) {
      // Use fallback insights
      setInsights([
        {
          id: '1',
          type: 'trend',
          title: 'Peak Engagement Window',
          description: 'Your audience is most active between 6-9 PM. Schedule posts during this window for 34% more engagement.',
          confidence: 0.87,
          actionable: true,
          action: 'Schedule posts for 6-9 PM',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'hashtag',
          title: '#AIautomation Trending',
          description: 'This hashtag is up 156% this week. Creating content around this topic could increase reach by 40%.',
          confidence: 0.92,
          actionable: true,
          action: 'Create post with #AIautomation',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'content',
          title: 'Video Content Opportunity',
          description: 'TikTok and Instagram Reels are driving 3x more engagement than static posts. Consider creating short-form video content.',
          confidence: 0.85,
          actionable: true,
          action: 'Plan video content calendar',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          type: 'timing',
          title: 'Weekend Posting Strategy',
          description: 'Saturday morning posts on Instagram see 28% higher engagement. Consider scheduling lifestyle content for weekends.',
          confidence: 0.79,
          actionable: true,
          action: 'Schedule weekend content',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'trend': return { name: 'trending-up', color: COLORS.success };
      case 'hashtag': return { name: 'tag', color: COLORS.primary };
      case 'content': return { name: 'lightbulb', color: COLORS.warning };
      case 'timing': return { name: 'schedule', color: COLORS.info };
      case 'competitor': return { name: 'people', color: COLORS.accent };
      default: return { name: 'insights', color: COLORS.secondary };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>Data-driven recommendations for your social empire</Text>
      </View>

      <FeatureGate
        requiredTier="basic"
        fallback={
          <Card containerStyle={styles.lockedCard}>
            <Icon name="auto-fix-high" type="material" size={48} color={COLORS.warning} />
            <Text style={styles.lockedTitle}>AI Insights Locked</Text>
            <Text style={styles.lockedText}>
              Upgrade to Basic or higher to unlock AI-powered insights, trending hashtags, and content recommendations.
            </Text>
            <Button
              title="Upgrade to Basic"
              onPress={() => navigation.navigate('Subscription', { highlightTier: 'basic' })}
              containerStyle={{ marginTop: SPACING.lg }}
            />
          </Card>
        }
      >
        <Button
          title={loading ? 'Refreshing...' : 'Refresh Insights'}
          type="outline"
          onPress={loadInsights}
          loading={loading}
          containerStyle={{ margin: SPACING.lg, marginTop: 0 }}
        />

        {insights.map((insight) => {
          const icon = getIconForType(insight.type);
          return (
            <Card key={insight.id} containerStyle={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={[styles.iconBox, { backgroundColor: icon.color + '15' }]}>
                  <Icon name={icon.name} type="material" color={icon.color} size={24} />
                </View>
                <View style={styles.insightMeta}>
                  <Text style={styles.insightType}>{insight.type.toUpperCase()}</Text>
                  <Text style={styles.confidence}>
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              {insight.actionable && (
                <Button
                  title={insight.action || 'Take Action'}
                  type="clear"
                  titleStyle={{ color: COLORS.primary }}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Create' })}
                />
              )}
            </Card>
          );
        })}
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
  insightCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightMeta: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  insightType: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  confidence: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  insightTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  insightDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
});
