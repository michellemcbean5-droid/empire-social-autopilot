import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import type { SubscriptionTier } from '../types';

interface FeatureGateProps {
  requiredTier: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  elite: 3,
};

export function FeatureGate({ requiredTier, children, fallback }: FeatureGateProps) {
  const { user } = useAppStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const userTier = user?.tier || 'free';
  const hasAccess = TIER_RANK[userTier] >= TIER_RANK[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card containerStyle={styles.lockedCard}>
      <View style={styles.lockedHeader}>
        <Icon name="lock" type="material" color={COLORS.warning} size={24} />
        <Text style={styles.lockedTitle}>Premium Feature</Text>
      </View>
      <Text style={styles.lockedText}>
        This feature requires a {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription or higher.
      </Text>
      <Button
        title={`Upgrade to ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}`}
        type="clear"
        titleStyle={{ color: COLORS.primary }}
        onPress={() => navigation.navigate('Subscription', { highlightTier: requiredTier })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  lockedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 0,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  lockedTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  lockedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
});
