import { jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '@rneui/themed';

import { useAppStore } from '../src/store/appStore';
import { theme } from '../src/constants/theme';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock expo modules
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-id')),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('expo-constants', () => ({
  expoConfig: { extra: { eas: { projectId: 'test' } } },
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'empiresocial://'),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-error-boundary', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Helper to render with providers
export function renderWithProviders(component: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
}

// Reset store between tests
export function resetStore() {
  useAppStore.setState({
    isReady: false,
    isOnline: true,
    lastSyncAt: null,
    user: {
      id: 'guest',
      name: 'Guest User',
      email: '',
      tier: 'free',
      referralCode: 'TEST123',
      referralsCount: 0,
      masterAccess: false,
    },
    isAuthenticated: false,
    calendars: [],
    drafts: [],
    scheduled: [],
    published: [],
    brandVoice: {
      name: 'Q-Empire',
      tone: 'bold, motivational, entrepreneurial',
      emoji: true,
      cta: 'Automate your empire today.',
      hashtagsBase: ['#QEmpire', '#AIautomation', '#Entrepreneur'],
    },
    isLoading: false,
    error: null,
    selectedCalendarId: null,
    showUpgradePrompt: false,
    lastUpgradePromptAt: null,
    adFreeUntil: null,
  });
}
