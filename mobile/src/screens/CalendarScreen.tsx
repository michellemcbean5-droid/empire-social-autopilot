import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ListItem, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { formatDate, groupByDate } from '../utils/dateUtils';

export function CalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { calendars, scheduled, published, sync } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  }, [sync]);

  const allPosts = [...scheduled, ...published].sort(
    (a, b) => new Date(b.scheduledFor || b.createdAt).getTime() - new Date(a.scheduledFor || a.createdAt).getTime()
  );

  const grouped = groupByDate(allPosts);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Content Calendar</Text>
        <Text style={styles.subtitle}>
          {allPosts.length} posts across {calendars.length} campaigns
        </Text>
      </View>

      {calendars.length === 0 && (
        <Card containerStyle={styles.emptyCard}>
          <Icon name="event-note" type="material" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No campaigns yet</Text>
          <Text style={styles.emptyText}>
            Create your first content calendar to start scheduling posts.
          </Text>
          <Button
            title="Create Campaign"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Create' })}
            containerStyle={{ marginTop: SPACING.lg }}
          />
        </Card>
      )}

      {Object.entries(grouped).map(([date, posts]) => (
        <View key={date} style={styles.daySection}>
          <Text style={styles.dayHeader}>{formatDate(date)}</Text>
          {posts.map((post) => (
            <Card key={post.id} containerStyle={styles.postCard}>
              <ListItem
                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
              >
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
                  size={24}
                />
                <ListItem.Content>
                  <ListItem.Title style={styles.postPlatform}>
                    {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.postCaption} numberOfLines={2}>
                    {post.caption}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <View style={styles.statusBadge}>
                  <Text
                    style={[
                      styles.statusText,
                      post.status === 'published' && styles.statusPublished,
                      post.status === 'scheduled' && styles.statusScheduled,
                      post.status === 'failed' && styles.statusFailed,
                    ]}
                  >
                    {post.status.toUpperCase()}
                  </Text>
                </View>
              </ListItem>
            </Card>
          ))}
        </View>
      ))}
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
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  daySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  dayHeader: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  postPlatform: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: FONT_SIZE.md,
  },
  postCaption: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  statusPublished: {
    color: COLORS.success,
  },
  statusScheduled: {
    color: COLORS.info,
  },
  statusFailed: {
    color: COLORS.error,
  },
});
