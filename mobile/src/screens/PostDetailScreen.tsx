import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export function PostDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const { postId } = route.params;
  const { drafts, scheduled, published, updatePost, deletePost } = useAppStore();

  const post = [...drafts, ...scheduled, ...published].find((p) => p.id === postId);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const statusColors = {
    draft: COLORS.textMuted,
    scheduled: COLORS.info,
    published: COLORS.success,
    failed: COLORS.error,
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.header}>
          <View style={styles.platformRow}>
            <Icon
              name={
                post.platform === 'twitter'
                  ? 'twitter'
                  : post.platform === 'instagram'
                  ? 'instagram'
                  : post.platform === 'linkedin'
                  ? 'linkedin'
                  : post.platform === 'facebook'
                  ? 'facebook'
                  : 'music-note'
              }
              type="material-community"
              color={COLORS.primary}
              size={28}
            />
            <Text style={styles.platform}>
              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[post.status] + '20' },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors[post.status] }]}>
              {post.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.caption}>{post.caption}</Text>

        <View style={styles.hashtags}>
          {post.hashtags.map((tag, i) => (
            <Text key={i} style={styles.hashtag}>
              {tag}
            </Text>
          ))}
        </View>

        {post.scheduledFor && (
          <View style={styles.metaRow}>
            <Icon name="schedule" type="material" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>
              Scheduled for {new Date(post.scheduledFor).toLocaleString()}
            </Text>
          </View>
        )}

        {post.aiGenerated && (
          <View style={styles.aiBadge}>
            <Icon name="auto-fix-high" type="material" size={16} color={COLORS.secondary} />
            <Text style={styles.aiText}>AI-Generated Content</Text>
          </View>
        )}

        {post.engagementPrediction && (
          <View style={styles.predictionCard}>
            <Text style={styles.predictionTitle}>Engagement Prediction</Text>
            <View style={styles.predictionRow}>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionValue}>
                  {post.engagementPrediction.estimatedLikes}
                </Text>
                <Text style={styles.predictionLabel}>Est. Likes</Text>
              </View>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionValue}>
                  {post.engagementPrediction.estimatedShares}
                </Text>
                <Text style={styles.predictionLabel}>Est. Shares</Text>
              </View>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionValue}>
                  {post.engagementPrediction.estimatedComments}
                </Text>
                <Text style={styles.predictionLabel}>Est. Comments</Text>
              </View>
            </View>
            <Text style={styles.confidence}>
              Confidence: {Math.round(post.engagementPrediction.confidence * 100)}%
            </Text>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Edit Post"
          type="outline"
          containerStyle={{ flex: 1, marginRight: SPACING.sm }}
        />
        <Button
          title="Delete"
          type="outline"
          buttonStyle={{ borderColor: COLORS.error }}
          titleStyle={{ color: COLORS.error }}
          containerStyle={{ flex: 1, marginLeft: SPACING.sm }}
          onPress={() => deletePost(post.id)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platform: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  caption: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  hashtag: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary + '15',
    borderRadius: 8,
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  aiText: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  predictionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  predictionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  predictionItem: {
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  predictionLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  confidence: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingTop: 0,
  },
});
