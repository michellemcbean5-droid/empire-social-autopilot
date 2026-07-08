import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { AIInsightsScreen } from '../screens/AIInsightsScreen';
import { CompetitorScreen } from '../screens/CompetitorScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { PromoCodeScreen } from '../screens/PromoCodeScreen';
import { BrandVoiceScreen } from '../screens/BrandVoiceScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { useAppStore } from '../store/appStore';

export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: undefined;
  PostDetail: { postId: string };
  AIInsights: undefined;
  CompetitorAnalysis: undefined;
  Subscription: { highlightTier?: string };
  PromoCode: undefined;
  BrandVoice: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Create: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'dashboard' : 'dashboard';
              break;
            case 'Calendar':
              iconName = focused ? 'event' : 'event-note';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'analytics' : 'analytics';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon name={iconName} type="material" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e1e3f',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen
        name="Create"
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="add-circle" type="material" size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((state) => state.user?.tier !== 'free' || state.calendars.length > 0);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0f23' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#0f0f23' },
      }}
    >
      {!hasCompletedOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Post Details' }}
      />
      <Stack.Screen
        name="AIInsights"
        component={AIInsightsScreen}
        options={{ title: 'AI Insights' }}
      />
      <Stack.Screen
        name="CompetitorAnalysis"
        component={CompetitorScreen}
        options={{ title: 'Competitor Analysis' }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: 'Subscription Plans' }}
      />
      <Stack.Screen
        name="PromoCode"
        component={PromoCodeScreen}
        options={{ title: 'Promo Code' }}
      />
      <Stack.Screen
        name="BrandVoice"
        component={BrandVoiceScreen}
        options={{ title: 'Brand Voice' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
}
