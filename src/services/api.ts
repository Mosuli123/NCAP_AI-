import Constants from 'expo-constants';

import { careers as seedCareers } from '@/data/careers';
import { providers as seedProviders } from '@/data/providers';
import { qualifications as seedQualifications } from '@/data/qualifications';
import type { Career, Provider, Qualification } from '@/types';

import { StorageKeys, getItem, setItem } from './storage';

/**
 * API abstraction layer.
 *
 * The app is offline-first: every call resolves from bundled seed data or a
 * local cache. When connectivity and a real NCAP API are available, the
 * `fetchRemote` helper is the single seam to plug in live, authenticated
 * requests to https://ncap.careerhelp.org.za without touching the screens.
 *
 * This design satisfies the "API-based interoperability with NCAP" advantageous
 * requirement while guaranteeing the app remains fully functional with no
 * network (rural / low-bandwidth users).
 */

const BASE_URL =
  (Constants.expoConfig?.extra?.ncapApiBaseUrl as string | undefined) ?? 'https://ncap.careerhelp.org.za/api';

interface RemoteOptions {
  authToken?: string;
  signal?: AbortSignal;
}

/**
 * Attempts a live NCAP request. Returns null on any failure so callers can
 * transparently fall back to cached / seed data.
 */
async function fetchRemote<T>(path: string, opts: RemoteOptions = {}): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(opts.authToken ? { Authorization: `Bearer ${opts.authToken}` } : {}),
      },
      signal: opts.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getCareers(opts?: RemoteOptions): Promise<Career[]> {
  const remote = await fetchRemote<Career[]>('/careers', opts);
  if (remote?.length) {
    await setItem(StorageKeys.cachedCareers, remote);
    await setItem(StorageKeys.lastSyncAt, new Date().toISOString());
    return remote;
  }
  const cached = await getItem<Career[]>(StorageKeys.cachedCareers);
  return cached?.length ? cached : seedCareers;
}

export async function getQualifications(opts?: RemoteOptions): Promise<Qualification[]> {
  const remote = await fetchRemote<Qualification[]>('/qualifications', opts);
  if (remote?.length) {
    await setItem(StorageKeys.cachedQualifications, remote);
    return remote;
  }
  const cached = await getItem<Qualification[]>(StorageKeys.cachedQualifications);
  return cached?.length ? cached : seedQualifications;
}

export async function getProviders(opts?: RemoteOptions): Promise<Provider[]> {
  const remote = await fetchRemote<Provider[]>('/providers', opts);
  if (remote?.length) {
    await setItem(StorageKeys.cachedProviders, remote);
    return remote;
  }
  const cached = await getItem<Provider[]>(StorageKeys.cachedProviders);
  return cached?.length ? cached : seedProviders;
}

/** Warm the cache from seed data on first run so directories load instantly. */
export async function primeCache(): Promise<void> {
  const existing = await getItem<Career[]>(StorageKeys.cachedCareers);
  if (!existing) {
    await setItem(StorageKeys.cachedCareers, seedCareers);
    await setItem(StorageKeys.cachedQualifications, seedQualifications);
    await setItem(StorageKeys.cachedProviders, seedProviders);
  }
}
