import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { useAppStore } from '../store/appStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications(): void {
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const setupNotifications = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('Push notification permission not granted');
          return;
        }

        // Get push token (for production, send to backend)
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PROJECT_ID || 'your-project-id',
        });

        if (isMounted) {
          console.log('Push token:', tokenData.data);
        }

        // Schedule demo notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Welcome to Empire Social Autopilot!',
            body: 'Your social media empire starts now. Create your first campaign.',
            data: { type: 'welcome' },
          },
          trigger: { seconds: 5 },
        });
      } catch (error) {
        console.error('Notification setup failed:', error);
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification.request.content);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification response:', data);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);
}
