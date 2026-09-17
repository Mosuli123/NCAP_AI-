import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { getItem, removeItem, setItem } from './storage';

/**
 * Authentication & consent scaffold (advantageous requirement: "Secure Digital
 * Identity and Integration").
 *
 * This provides the seam for integrating with a national identity / SSO
 * provider (e.g. DHET / Khetha OIDC or the government's secure sign-in). Tokens
 * are stored in the device secure enclave via expo-secure-store rather than
 * plain AsyncStorage, keeping citizen credentials protected.
 *
 * For DEMO / TESTING the app ships with local dummy credentials (see
 * DEMO_CREDENTIALS) so reviewers can sign in without a live backend. The app
 * also still works fully anonymously if the user taps "Skip".
 */

const ACCESS_TOKEN_KEY = 'khetha_access_token';
const REFRESH_TOKEN_KEY = 'khetha_refresh_token';
const ID_TOKEN_KEY = 'khetha_id_token';
const USER_KEY = 'khetha_auth_user';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}

export interface AuthUser {
  subject: string;
  name?: string;
  email?: string;
}

/**
 * Demo credentials for testing the login flow. These are NOT real accounts and
 * carry no privileges — they only unlock the local, on-device demo experience.
 * Replace this whole block with a real identity provider before production.
 */
export const DEMO_CREDENTIALS = [
  { email: 'learner@khetha.co.za', password: 'khetha123', name: 'Thabo Learner' },
  { email: 'demo@ncap.gov.za', password: 'demo123', name: 'NCAP Demo User' },
];

/**
 * expo-secure-store is unavailable on web. We fall back to namespaced
 * AsyncStorage there so the demo login also works in `expo start --web`.
 */
const secure = {
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') return setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return getItem<string>(key);
    return SecureStore.getItemAsync(key);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') return removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};

/** Persists tokens securely after a successful sign-in / OIDC exchange. */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await secure.set(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) await secure.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.idToken) await secure.set(ID_TOKEN_KEY, tokens.idToken);
}

export async function getAccessToken(): Promise<string | null> {
  return secure.get(ACCESS_TOKEN_KEY);
}

export async function isSignedIn(): Promise<boolean> {
  return (await getAccessToken()) !== null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const raw = await secure.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Clears all credentials — used on sign-out and on "delete my data". */
export async function signOut(): Promise<void> {
  await Promise.all([
    secure.remove(ACCESS_TOKEN_KEY),
    secure.remove(REFRESH_TOKEN_KEY),
    secure.remove(ID_TOKEN_KEY),
    secure.remove(USER_KEY),
  ]);
}

export type SignInResult = { ok: true; user: AuthUser } | { ok: false; error: 'invalid_credentials' };

/**
 * DEMO sign-in against the local dummy credentials. Simulates a small network
 * delay, then stores a fake token + user securely. Swap the credential check
 * for a real request to signInWithNcap() when a backend is available.
 */
export async function signInWithDemo(email: string, password: string): Promise<SignInResult> {
  await new Promise((r) => setTimeout(r, 400)); // simulate latency
  const match = DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
  );
  if (!match) return { ok: false, error: 'invalid_credentials' };

  const user: AuthUser = { subject: `demo:${match.email}`, name: match.name, email: match.email };
  await storeTokens({ accessToken: `demo-token-${Date.now()}`, expiresAt: Date.now() + 3600_000 });
  await secure.set(USER_KEY, JSON.stringify(user));
  return { ok: true, user };
}

/**
 * Placeholder for the real OIDC/OAuth2 sign-in flow. Wire this to
 * expo-auth-session and the DHET/Khetha identity provider when the backend is
 * available. Returns null in this offline build so callers keep the demo flow.
 */
export async function signInWithNcap(): Promise<AuthUser | null> {
  // Intentionally not implemented in the offline build.
  return null;
}
