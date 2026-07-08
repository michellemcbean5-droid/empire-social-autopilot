import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Icon, Button } from '@rneui/themed';

import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import type { Notification } from '../types';

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Post Published Successfully',
    body: 'Your Twitter post "How AI agents build businesses" has been published.',
    type: 'post_published',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    title: 'AI Insight: Trending Hashtag',
    body: '#AIautomation is trending up 156% this week. Consider creating content around this topic.',
    type: 'insight',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Upgrade to Pro',
    body: 'Unlock competitor analysis, unlimited AI generations, and advanced analytics.',
    type: 'upgrade',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '4',
    title: 'Post Failed to Publish',
    body: 'Your LinkedIn post failed to publish. Please check your connection and retry.',
    type: 'post_failed',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function NotificationsScreen() {
  const { user } = useAppStore();
  const [notifications, setNotifications] = React.useState(DEMO_NOTIFICATIONS);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'post_published': return { name: 'check-circle', color: COLORS.success };
      case 'post_failed': return { name: 'error', color: COLORS.error };
      case 'insight': return { name: 'lightbulb', color: COLORS.warning };
      case 'upgrade': return { name: 'star', color: COLORS.accent };
      case 'reminder': return { name: 'schedule', color: COLORS.info };
      default: return { name: 'notifications', color: COLORS.primary };
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Text style={styles.unreadBadge}>{unreadCount} unread</Text>
        )}
      </View>

      {notifications.length === 0 ? (
        <Card containerStyle={styles.emptyCard}>
          <Icon name="notifications-off" type="material" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </Card>
      ) : (
        notifications.map((notification) => {
          const icon = getIconForType(notification.type);
          return (
            <Card
              key={notification.id}
              containerStyle={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
            >
              <View style={styles.notificationRow}>
                <View style={[styles.iconBox, { backgroundColor: icon.color + '15' }]}>
                  <Icon name={icon.name} type="material" color={icon.color} size={20} />
                </View>
                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationBody}>{notification.body}</Text>
                  <Text style={styles.timeAgo}>
                    {getTimeAgo(notification.createdAt)}
                  </Text>
                </View>
              </View>
              {!notification.read && (
                <Button
                  title="Mark as Read"
                  type="clear"
                  titleStyle={{ color: COLORS.primary, fontSize: 12 }}
                  onPress={() => markAsRead(notification.id)}
                  containerStyle={{ alignSelf: 'flex-end', marginTop: SPACING.sm }}
                />
              )}
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  unreadBadge: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  notificationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.md,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notificationRow: {
    flexDirection: 'row',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  notificationBody: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    lineHeight: 20,
  },
  timeAgo: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
  },
});
