import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Local notification helpers powering the "Engagement and Notifications"
 * requirement. Uses on-device scheduled notifications (no server needed) so
 * reminders work even for users who are frequently offline. The same handler
 * can receive remote push once a backend is connected.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  let granted = settings.granted;
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted;
  }
  if (granted && Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Career journey reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return granted;
}

/** Schedules a gentle reminder to continue the career journey. */
export async function scheduleJourneyReminder(inSeconds: number, body: string): Promise<string | null> {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Khetha NCAP',
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, inSeconds),
        channelId: 'reminders',
      },
    });
  } catch (err) {
    console.warn('scheduleJourneyReminder failed', err);
    return null;
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn('cancelAllReminders failed', err);
  }
}
