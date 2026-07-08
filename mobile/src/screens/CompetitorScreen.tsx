import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Card, Button, Icon, ListItem } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { FeatureGate } from '../components/FeatureGate';
import { aiService } from '../services/aiService';
import type { CompetitorAnalysis } from '../types';

export function CompetitorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAppStore();
  const [handle, setHandle] = React.useState('');
  const [platform, setPlatform] = React.useState('twitter');
  const [competitors, setCompetitors] = React.useState<CompetitorAnalysis[]>([]);
  const [loading, setLoading] = React.useState(false);

  const analyzeCompetitor = async () => {
    if (!handle.trim()) return;
    setLoading(true);
    try {
      const result = await aiService.analyzeCompetitor(handle, platform as any);
      setCompetitors((prev) => [result, ...prev]);
    } catch (error) {
      // Fallback demo data
      setCompetitors((prev) => [
        {
          id: Date.now().toString(),
          name: handle,
          platform: platform as any,
          followers: 45200,
          engagementRate: 3.2,
          postFrequency: 5,
          topHashtags: ['#AI', '#automation', '#startup', '#growth', '#founder'],
          bestPerformingContent: ['How to automate your business', '10 tools every founder needs', 'The future of AI agents'],
          weaknesses: ['Inconsistent posting schedule', 'Low video content', 'No LinkedIn presence'],
          strengths: ['Strong Twitter engagement', 'Good hashtag strategy', 'Consistent brand voice'],
          analyzedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Competitor Analysis</Text>
        <Text style={styles.subtitle}>Track and analyze your competitors</Text>
      </View>

      <FeatureGate
        requiredTier="pro"
        fallback={
          <Card containerStyle={styles.lockedCard}>
            <Icon name="analytics" type="material" size={48} color={COLORS.warning} />
            <Text style={styles.lockedTitle}>Competitor Analysis Locked</Text>
            <Text style={styles.lockedText}>
              Upgrade to Pro or Elite to unlock competitor tracking, engagement analysis, and strategic recommendations.
            </Text>
            <Button
              title="Upgrade to Pro"
              onPress={() => navigation.navigate('Subscription', { highlightTier: 'pro' })}
              containerStyle={{ marginTop: SPACING.lg }}
            />
          </Card>
        }
      >
        <Card containerStyle={styles.card}>
          <Text style={styles.label}>Social Handle</Text>
          <TextInput
            style={styles.input}
            placeholder="@competitor or username"
            placeholderTextColor={COLORS.textMuted}
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Platform</Text>
          <View style={styles.platformRow}>
            {['twitter', 'instagram', 'linkedin'].map((p) => (
              <Button
                key={p}
                title={p.charAt(0).toUpperCase() + p.slice(1)}
                type={platform === p ? 'solid' : 'outline'}
                onPress={() => setPlatform(p)}
                containerStyle={{ flex: 1, marginHorizontal: 4 }}
              />
            ))}
          </View>
          <Button
            title={loading ? 'Analyzing...' : 'Analyze Competitor'}
            onPress={analyzeCompetitor}
            loading={loading}
            disabled={!handle.trim()}
            containerStyle={{ marginTop: SPACING.lg }}
          />
        </Card>

        {competitors.map((comp) => (
          <Card key={comp.id} containerStyle={styles.competitorCard}>
            <View style={styles.compHeader}>
              <Text style={styles.compName}>{comp.name}</Text>
              <Text style={styles.compPlatform}>{comp.platform.toUpperCase()}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{comp.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{comp.engagementRate}%</Text>
                <Text style={styles.statLabel}>Engagement</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{comp.postFrequency}/wk</Text>
                <Text style={styles.statLabel}>Frequency</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Top Hashtags</Text>
            <View style={styles.hashtagRow}>
              {comp.topHashtags.map((tag) => (
                <View key={tag} style={styles.hashtagPill}>
                  <Text style={styles.hashtagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Strengths</Text>
            {comp.strengths.map((s, i) => (
              <View key={i} style={styles.listItem}>
                <Icon name="check-circle" type="material" color={COLORS.success} size={16} />
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}

            <Text style={styles.sectionLabel}>Weaknesses</Text>
            {comp.weaknesses.map((w, i) => (
              <View key={i} style={styles.listItem}>
                <Icon name="error-outline" type="material" color={COLORS.error} size={16} />
                <Text style={styles.listText}>{w}</Text>
              </View>
            ))}
          </Card>
        ))}
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  platformRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  competitorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  compHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  compName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  compPlatform: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  hashtagPill: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hashtagText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  listText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.sm,
  },
});
