import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import ErrorBoundary from 'react-native-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigator from './src/navigation/RootNavigator';
import { useAppStore } from './src/store/appStore';
import { theme } from './src/constants/theme';
import { toastConfig } from './src/components/ToastConfig';
import { LoadingScreen } from './src/components/LoadingScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <SafeAreaProvider>
    <ThemeProvider theme={theme}>
      <LoadingScreen
        title="Something went wrong"
        subtitle={error.message}
        showRetry
        onRetry={resetError}
      />
    </ThemeProvider>
  </SafeAreaProvider>
);

export default function App() {
  const isReady = useAppStore((state) => state.isReady);
  const initialize = useAppStore((state) => state.initialize);

  React.useEffect(() => {
    initialize();
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <LoadingScreen title="Empire Social Autopilot" subtitle="Loading your empire..." />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
              <Toast config={toastConfig} />
            </NavigationContainer>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
