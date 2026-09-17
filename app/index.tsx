import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { LoadingState, Screen } from '@/components/ui';
import { isSignedIn } from '@/services/auth';
import { StorageKeys, getItem } from '@/services/storage';

type Decision = 'onboarding' | 'login' | 'tabs';

/**
 * Entry route. Decides the first screen:
 *  - not onboarded          -> onboarding
 *  - onboarded, not signed  -> login (demo sign-in / guest)
 *  - onboarded and signed   -> home tabs
 */
export default function Index() {
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    (async () => {
      const onboarded = await getItem<boolean>(StorageKeys.onboardingDone);
      if (!onboarded) {
        setDecision('onboarding');
        return;
      }
      const signed = await isSignedIn();
      const guest = await getItem<boolean>(StorageKeys.guestMode);
      setDecision(signed || guest ? 'tabs' : 'login');
    })();
  }, []);

  if (decision === null) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (decision === 'tabs') return <Redirect href="/(tabs)/home" />;
  if (decision === 'login') return <Redirect href="/login" />;
  return <Redirect href="/onboarding" />;
}
