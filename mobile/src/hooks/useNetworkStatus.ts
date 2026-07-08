import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { useAppStore } from '../store/appStore';

export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);
  const setOnline = useAppStore((state) => state.setOnline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? true;
      setIsOnline(online);
      setOnline(online);
    });

    return () => unsubscribe();
  }, [setOnline]);

  return isOnline;
}
