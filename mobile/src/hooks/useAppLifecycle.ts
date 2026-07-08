import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAppStore } from '../store/appStore';

export function useAppLifecycle(): void {
  const sync = useAppStore((state) => state.sync);
  const triggerUpgradePrompt = useAppStore((state) => state.triggerUpgradePrompt);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground - sync data and check for upgrade prompt
        sync();
        triggerUpgradePrompt();
      }
    },
    [sync, triggerUpgradePrompt]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);
}
