import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin, typed wrapper over AsyncStorage. All persistence is local-first so the
 * app works fully offline; keys are namespaced to avoid collisions.
 */
const NS = '@khetha_ncap';

export const StorageKeys = {
  profile: `${NS}/profile`,
  onboardingDone: `${NS}/onboarding_done`,
  cachedCareers: `${NS}/cache/careers`,
  cachedQualifications: `${NS}/cache/qualifications`,
  cachedProviders: `${NS}/cache/providers`,
  lastSyncAt: `${NS}/last_sync_at`,
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.warn(`storage.getItem failed for ${key}`, err);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`storage.setItem failed for ${key}`, err);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`storage.removeItem failed for ${key}`, err);
  }
}

/** Clears all app data — used by "Delete my data" (POPIA right to erasure). */
export async function clearAll(): Promise<void> {
  try {
    const keys = Object.values(StorageKeys);
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    console.warn('storage.clearAll failed', err);
  }
}
