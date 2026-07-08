import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { Text, Button, Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Empire Social Autopilot',
    description:
      'The AI-powered social media engine that generates, schedules, and publishes content across all your platforms on autopilot.',
    icon: '🚀',
  },
  {
    title: 'AI-Powered Content',
    description:
      'Our AI generates on-brand captions, hashtags, and content tailored for each platform — Twitter, Instagram, LinkedIn, Facebook, and TikTok.',
    icon: '🤖',
  },
  {
    title: 'Smart Scheduling',
    description:
      'Posts are automatically scheduled at optimal times for each platform. Set it and forget it.',
    icon: '📅',
  },
  {
    title: 'Competitor Intelligence',
    description:
      'Track competitor performance, discover trending hashtags, and stay ahead of the curve with AI insights.',
    icon: '📊',
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setUser = useAppStore((state) => state.setUser);
  const [step, setStep] = React.useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setUser({
        id: 'user_' + Date.now(),
        name: 'Founder',
        email: '',
        tier: 'free',
        referralCode: 'EMPIRE' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralsCount: 0,
        masterAccess: false,
      });
      navigation.replace('MainTabs');
    }
  };

  const handleSkip = () => {
    setUser({
      id: 'user_' + Date.now(),
      name: 'Founder',
      email: '',
      tier: 'free',
      referralCode: 'EMPIRE' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      referralsCount: 0,
      masterAccess: false,
    });
    navigation.replace('MainTabs');
  };

  const current = ONBOARDING_STEPS[step];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{current.icon}</Text>
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {ONBOARDING_STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          title={step === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          containerStyle={styles.button}
          buttonStyle={{ paddingVertical: 14 }}
        />
        {step < ONBOARDING_STEPS.length - 1 && (
          <Button
            title="Skip"
            type="clear"
            onPress={handleSkip}
            titleStyle={{ color: COLORS.textSecondary }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  button: {
    marginBottom: SPACING.sm,
  },
});
