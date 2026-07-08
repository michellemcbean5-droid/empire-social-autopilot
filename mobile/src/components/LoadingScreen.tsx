import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, LinearProgress } from '@rneui/themed';

import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface LoadingScreenProps {
  title: string;
  subtitle?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function LoadingScreen({ title, subtitle, showRetry, onRetry }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        {showRetry && onRetry && (
          <Text style={styles.retry} onPress={onRetry}>
            Tap to retry
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  spinner: {
    marginTop: SPACING.lg,
  },
  retry: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.lg,
    textDecorationLine: 'underline',
  },
});
