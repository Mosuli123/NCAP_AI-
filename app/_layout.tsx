import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/i18n';
import { OfflineBanner } from '@/components/OfflineBanner';
import { primeCache } from '@/services/api';
import { ProfileProvider } from '@/store/ProfileContext';
import { colors } from '@/theme';

/**
 * Root layout: wires up global providers (profile store, i18n, safe area,
 * gesture handler), primes the offline cache, and renders the offline banner
 * above the navigator.
 */
export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await primeCache();
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProfileProvider>
          <StatusBar style="light" backgroundColor={colors.primary} />
          <OfflineBanner />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.textInverse,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="career/[id]" options={{ title: 'Career' }} />
            <Stack.Screen name="qualification/[id]" options={{ title: 'Qualification' }} />
            <Stack.Screen name="provider/[id]" options={{ title: 'Provider' }} />
            <Stack.Screen name="quiz/[type]" options={{ title: 'Assessment' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          </Stack>
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
