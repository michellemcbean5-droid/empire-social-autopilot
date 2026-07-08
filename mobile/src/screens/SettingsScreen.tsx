import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Text, Card, Button, Icon, ListItem, Avatar, Switch } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, brandVoice, setBrandVoice, logout, sync } = useAppStore();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [autoPublish, setAutoPublish] = React.useState(false);

  const tierColor = {
    free: COLORS.textMuted,
    basic: COLORS.info,
    pro: COLORS.secondary,
    elite: COLORS.accent,
  }[user?.tier || 'free'];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Empire Social Autopilot! Use my referral code ${user?.referralCode} for bonus features. Download at https://qempireai.com/app`,
      });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Share failed' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card containerStyle={styles.profileCard}>
        <View style={styles.profileRow}>
          <Avatar
            rounded
            size="large"
            source={user?.avatar ? { uri: user.avatar } : undefined}
            icon={{ name: 'person', type: 'material' }}
            containerStyle={{ backgroundColor: COLORS.primary }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
            <View style={styles.tierBadge}>
              <Text style={[styles.tierText, { color: tierColor }]}>
                {user?.tier?.toUpperCase() || 'FREE'}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <ListItem
          onPress={() => navigation.navigate('Subscription')}
          containerStyle={styles.listItem}
        >
          <Icon name="crown" type="material-community" color={COLORS.warning} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Manage Subscription</ListItem.Title>
            <ListItem.Subtitle style={styles.listItemSubtitle}>
              Current: {user?.tier?.charAt(0).toUpperCase() + user?.tier?.slice(1) || 'Free'}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          onPress={() => navigation.navigate('PromoCode')}
          containerStyle={styles.listItem}
        >
          <Icon name="ticket-percent" type="material-community" color={COLORS.success} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Promo Code</ListItem.Title>
            <ListItem.Subtitle style={styles.listItemSubtitle}>
              Unlock free trial or discounts
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <ListItem containerStyle={styles.listItem}>
          <Icon name="notifications" type="material" color={COLORS.primary} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Push Notifications</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            color={COLORS.primary}
          />
        </ListItem>

        <ListItem containerStyle={styles.listItem}>
          <Icon name="dark-mode" type="material" color={COLORS.primary} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Dark Mode</ListItem.Title>
          </ListItem.Content>
          <Switch value={darkMode} onValueChange={setDarkMode} color={COLORS.primary} />
        </ListItem>

        <ListItem containerStyle={styles.listItem}>
          <Icon name="auto-fix-high" type="material" color={COLORS.primary} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Auto-Publish</ListItem.Title>
            <ListItem.Subtitle style={styles.listItemSubtitle}>
              Publish scheduled posts automatically
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch value={autoPublish} onValueChange={setAutoPublish} color={COLORS.primary} />
        </ListItem>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.sectionTitle}>Brand & Content</Text>
        <ListItem
          onPress={() => navigation.navigate('BrandVoice')}
          containerStyle={styles.listItem}
        >
          <Icon name="record-voice-over" type="material" color={COLORS.secondary} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Brand Voice</ListItem.Title>
            <ListItem.Subtitle style={styles.listItemSubtitle}>
              {brandVoice.name} — {brandVoice.tone}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.sectionTitle}>Referrals</Text>
        <View style={styles.referralBox}>
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <TouchableOpacity style={styles.referralCode} onPress={handleShare}>
            <Text style={styles.referralCodeText}>{user?.referralCode}</Text>
            <Icon name="share" type="material" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.referralCount}>
            {user?.referralsCount || 0} friends joined
          </Text>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ListItem onPress={sync} containerStyle={styles.listItem}>
          <Icon name="sync" type="material" color={COLORS.info} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Sync Now</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          onPress={() => navigation.navigate('Notifications')}
          containerStyle={styles.listItem}
        >
          <Icon name="notifications-active" type="material" color={COLORS.warning} />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>Notification History</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem onPress={logout} containerStyle={styles.listItem}>
          <Icon name="logout" type="material" color={COLORS.error} />
          <ListItem.Content>
            <ListItem.Title style={[styles.listItemTitle, { color: COLORS.error }]}>
              Sign Out
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Card>

      <Text style={styles.version}>Empire Social Autopilot v1.0.0</Text>
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
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tierBadge: {
    marginTop: SPACING.sm,
  },
  tierText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  listItem: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  listItemSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  referralBox: {
    padding: SPACING.lg,
  },
  referralLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  referralCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  referralCodeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  referralCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginVertical: SPACING.lg,
  },
});
