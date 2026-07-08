import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import Toast from 'react-native-toast-message';

import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export function PromoCodeScreen() {
  const { upgradeWithPromoCode, unlockMasterAccess, user } = useAppStore();
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = () => {
    if (!code.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter a promo code' });
      return;
    }

    setLoading(true);

    // Try master code first
    if (unlockMasterAccess(code.trim())) {
      Toast.show({
        type: 'success',
        text1: 'Master Access Unlocked!',
        text2: 'You now have Elite access.',
      });
      setLoading(false);
      return;
    }

    // Try promo code
    if (upgradeWithPromoCode(code.trim())) {
      Toast.show({
        type: 'success',
        text1: 'Promo Code Applied!',
        text2: `Upgraded to ${user?.tier?.charAt(0).toUpperCase() + user?.tier?.slice(1)} plan.`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Code',
        text2: 'Please check your promo code and try again.',
      });
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promo Code</Text>
        <Text style={styles.subtitle}>Enter a promo code or master access code</Text>
      </View>

      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter code (e.g., WELCOME50)"
          placeholderTextColor={COLORS.textMuted}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={20}
        />
        <Button
          title={loading ? 'Verifying...' : 'Apply Code'}
          onPress={handleSubmit}
          loading={loading}
          disabled={!code.trim()}
          containerStyle={{ marginTop: SPACING.lg }}
        />
      </Card>

      <Card containerStyle={styles.infoCard}>
        <Text style={styles.infoTitle}>Available Codes</Text>
        <View style={styles.codeList}>
          <View style={styles.codeItem}>
            <Icon name="ticket-percent" type="material-community" color={COLORS.success} size={20} />
            <View style={styles.codeInfo}>
              <Text style={styles.codeName}>WELCOME50</Text>
              <Text style={styles.codeDesc}>50% off Basic - 30 days</Text>
            </View>
          </View>
          <View style={styles.codeItem}>
            <Icon name="ticket-percent" type="material-community" color={COLORS.primary} size={20} />
            <View style={styles.codeInfo}>
              <Text style={styles.codeName}>PROLAUNCH</Text>
              <Text style={styles.codeDesc}>Free Pro - 14 days</Text>
            </View>
          </View>
          <View style={styles.codeItem}>
            <Icon name="ticket-percent" type="material-community" color={COLORS.accent} size={20} />
            <View style={styles.codeInfo}>
              <Text style={styles.codeName}>ELITE2026</Text>
              <Text style={styles.codeDesc}>Free Elite - 7 days</Text>
            </View>
          </View>
          <View style={styles.codeItem}>
            <Icon name="ticket-percent" type="material-community" color={COLORS.warning} size={20} />
            <View style={styles.codeInfo}>
              <Text style={styles.codeName}>FOUNDER</Text>
              <Text style={styles.codeDesc}>25% off Pro - 90 days</Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
    letterSpacing: 2,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  codeList: {
    gap: SPACING.md,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
  },
  codeInfo: {
    marginLeft: SPACING.md,
  },
  codeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  codeDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
