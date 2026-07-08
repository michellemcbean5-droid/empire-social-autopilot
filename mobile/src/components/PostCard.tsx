import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, Card } from '@rneui/themed';

import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const statusColors = {
    draft: COLORS.textMuted,
    scheduled: COLORS.info,
    published: COLORS.success,
    failed: COLORS.error,
  };

  const platformIcons: Record<string, string> = {
    twitter: 'twitter',
    instagram: 'instagram',
    linkedin: 'linkedin',
    facebook: 'facebook',
    tiktok: 'music-note',
  };

  const platformIconTypes: Record<string, string> = {
    twitter: 'material-community',
    instagram: 'material-community',
    linkedin: 'material-community',
    facebook: 'material-community',
    tiktok: 'material',
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card containerStyle={styles.card}>
        <View style={styles.header}>
          <View style={styles.platformRow}>
            <Icon
              name={platformIcons[post.platform] || 'circle'}
              type={platformIconTypes[post.platform] || 'material'}
              color={COLORS.primary}
              size={20}
            />
            <Text style={styles.platform}>
              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[post.status] + '20' }]}>
            <Text style={[styles.statusText, { color: statusColors[post.status] }]}>
              {post.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.caption} numberOfLines={3}>
          {post.caption}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.hashtags} numberOfLines={1}>
            {post.hashtags.slice(0, 3).join(' ')}
            {post.hashtags.length > 3 && ' ...'}
          </Text>
          {post.aiGenerated && (
            <View style={styles.aiBadge}>
              <Icon name="auto-fix-high" type="material" color={COLORS.secondary} size={12} />
              <Text style={styles.aiText}>AI</Text>
            </View>
          )}
        </View>

        {post.scheduledFor && (
          <Text style={styles.scheduledTime}>
            <Icon name="schedule" type="material" color={COLORS.textMuted} size={12} />
            {' '}{new Date(post.scheduledFor).toLocaleDateString()}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platform: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  caption: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hashtags: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary + '15',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  aiText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  scheduledTime: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
  },
});
