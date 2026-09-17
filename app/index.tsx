import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { LoadingState, Screen } from '@/components/ui';
import { StorageKeys, getItem } from '@/services/storage';

/**
 * Entry route. Sends first-time users through onboarding, and returning users
 * straight to the home tabs. Onboarding completion is stored on-device.
 */
export default function Index() {
  const [decision, setDecision] = useState<'onboarding' | 'tabs' | null>(null);

  useEffect(() => {
    (async () => {
      const done = await getItem<boolean>(StorageKeys.onboardingDone);
      setDecision(done ? 'tabs' : 'onboarding');
    })();
  }, []);

  if (decision === null) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return decision === 'tabs' ? <Redirect href="/(tabs)/home" /> : <Redirect href="/onboarding" />;
}
