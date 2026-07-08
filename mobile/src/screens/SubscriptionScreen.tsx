import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon, Badge } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { SubscriptionPlan } from '../types';

const PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    description: 'Get started with basic social scheduling',
    features: [
      '3 AI content generations/month',
      '1 content calendar',
      '2 platforms (Twitter + Instagram)',
      'Basic scheduling',
      'Ad-supported',
    ],
    limits: {
      calendarsPerMonth: 1,
      postsPerMonth: 30,
      platforms: 2,
      aiGenerations: 3,
      analyticsRetentionDays: 7,
      competitorTracking: 0,
      teamMembers: 1,
    },
  },
  {
    tier: 'basic',
    name: 'Basic',
    price: 9.99,
    priceAnnual: 99.99,
    description: 'Perfect for solo creators',
    features: [
      '20 AI content generations/month',
      '5 content calendars',
      'All 5 platforms',
      'Advanced scheduling',
      'AI insights & trending hashtags',
      '7-day analytics retention',
      'No ads',
    ],
    limits: {
      calendarsPerMonth: 5,
      postsPerMonth: 150,
      platforms: 5,
      aiGenerations: 20,
      analyticsRetentionDays: 7,
      competitorTracking: 0,
      teamMembers: 1,
    },
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 29.99,
    priceAnnual: 299.99,
    description: 'For growing businesses',
    features: [
      '100 AI content generations/month',
      'Unlimited content calendars',
      'All 5 platforms',
      'Smart scheduling with AI optimization',
      'AI insights & content recommendations',
      'Competitor analysis (3 competitors)',
      '30-day analytics retention',
      'Priority support',
      'No ads',
    ],
    limits: {
      calendarsPerMonth: Infinity,
      postsPerMonth: 500,
      platforms: 5,
      aiGenerations: 100,
      analyticsRetentionDays: 30,
      competitorTracking: 3,
      teamMembers: 3,
    },
    popular: true,
  },
  {
    tier: 'elite',
    name: 'Elite',
    price: 99.99,
    priceAnnual: 999.99,
    description: 'For agencies and power users',
    features: [
      'Unlimited AI content generation',
      'Unlimited everything',
      'All 5 platforms + API access',
      'Advanced AI with custom models',
      'Unlimited competitor tracking',
      '1-year analytics retention',
      'Team collaboration (10 members)',
      'White-label options',
      'Dedicated account manager',
      'No ads',
    ],
    limits: {
      calendarsPerMonth: Infinity,
      postsPerMonth: Infinity,
      platforms: 5,
      aiGenerations: Infinity,
      analyticsRetentionDays: 365,
      competitorTracking: Infinity,
      teamMembers: 10,
    },
  },
];

export function SubscriptionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Subscription'>>();
  const { user, setTier } = useAppStore();
  const [isAnnual, setIsAnnual] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState(user?.tier || 'free');

  const highlightTier = route.params?.highlightTier;

  const handleSubscribe = (tier: string) => {
    setTier(tier as any);
    setSelectedTier(tier);
    // In production, this would trigger react-native-iap
    // For now, we simulate the upgrade
    alert(`Subscribed to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Unlock the full power of your social empire</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, !isAnnual && styles.toggleActive]}
          onPress={() => setIsAnnual(false)}
        >
          <Text style={[styles.toggleText, !isAnnual && styles.toggleTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, isAnnual && styles.toggleActive]}
          onPress={() => setIsAnnual(true)}
        >
          <Text style={[styles.toggleText, isAnnual && styles.toggleTextActive]}>
            Annual <Text style={styles.saveBadge}>Save 20%</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {PLANS.map((plan) => {
        const isCurrent = user?.tier === plan.tier;
        const isHighlighted = highlightTier === plan.tier;
        const price = isAnnual ? plan.priceAnnual / 12 : plan.price;

        return (
          <Card
            key={plan.tier}
            containerStyle={[
              styles.planCard,
              isCurrent && styles.currentPlan,
              isHighlighted && styles.highlightedPlan,
              plan.popular && styles.popularPlan,
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            {isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentText}>CURRENT</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
                <Text style={styles.pricePeriod}>/mo</Text>
              </View>
              {isAnnual && plan.priceAnnual > 0 && (
                <Text style={styles.annualPrice}>${plan.priceAnnual}/year billed annually</Text>
              )}
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            <View style={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                  <Icon name="check" type="material" color={COLORS.success} size={18} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <Button
              title={isCurrent ? 'Current Plan' : plan.tier === 'free' ? 'Continue Free' : 'Subscribe'}
              disabled={isCurrent}
              type={isCurrent ? 'outline' : 'solid'}
              onPress={() => handleSubscribe(plan.tier)}
              containerStyle={{ marginTop: SPACING.lg }}
              buttonStyle={plan.popular && !isCurrent ? { backgroundColor: COLORS.accent } : undefined}
            />
          </Card>
        );
      })}

      <Button
        title="Have a Promo Code?"
        type="clear"
        onPress={() => navigation.navigate('PromoCode')}
        containerStyle={{ marginBottom: SPACING.xl }}
      />
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
    alignItems: 'center',
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.text,
  },
  saveBadge: {
    color: COLORS.success,
    fontSize: FONT_SIZE.xs,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  currentPlan: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  highlightedPlan: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularText: {
    color: '#fff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    left: SPACING.lg,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  currentText: {
    color: '#fff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  planHeader: {
    marginBottom: SPACING.md,
  },
  planName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pricePeriod: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  annualPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  planDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
  },
  featuresList: {
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
  },
});
