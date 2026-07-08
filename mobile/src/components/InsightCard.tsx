import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, Card, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface InsightCardProps {
  type?: string;
  title?: string;
  description?: string;
  confidence?: number;
  actionable?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export function InsightCard({
  type = 'generic',
  title,
  description,
  confidence,
  actionable,
  actionText = 'Take Action',
  onAction,
}: InsightCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (type === 'upgrade') {
    return (
      <Card containerStyle={styles.upgradeCard}>
        <View style={styles.upgradeHeader}>
          <Icon name="lock" type="material" color={COLORS.warning} size={24} />
          <Text style={styles.upgradeTitle}>AI Insights Locked</Text>
        </View>
        <Text style={styles.upgradeText}>
          Upgrade to Basic or higher to unlock AI-powered insights, trending hashtags, and content recommendations.
        </Text>
        <Button
          title="Upgrade Now"
          type="clear"
          titleStyle={{ color: COLORS.primary }}
          onPress={() => navigation.navigate('Subscription', { highlightTier: 'basic' })}
        />
      </Card>
    );
  }

  const iconMap: Record<string, { name: string; color: string }> = {
    trend: { name: 'trending-up', color: COLORS.success },
    hashtag: { name: 'tag', color: COLORS.primary },
    content: { name: 'lightbulb', color: COLORS.warning },
    timing: { name: 'schedule', color: COLORS.info },
    competitor: { name: 'people', color: COLORS.accent },
    generic: { name: 'insights', color: COLORS.secondary },
  };

  const icon = iconMap[type] || iconMap.generic;

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: icon.color + '15' }]}>
          <Icon name={icon.name} type="material" color={icon.color} size={20} />
        </View>
        <View style={styles.meta}>
          <Text style={styles.type}>{type.toUpperCase()}</Text>
          {confidence !== undefined && (
            <Text style={styles.confidence}>Confidence: {Math.round(confidence * 100)}%</Text>
          )}
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionable && onAction && (
        <Button
          title={actionText}
          type="clear"
          titleStyle={{ color: COLORS.primary }}
          onPress={onAction}
          containerStyle={{ alignSelf: 'flex-start', marginTop: SPACING.sm }}
        />
      )}
    </Card>
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
  upgradeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  upgradeTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  upgradeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  type: {
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
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
});
