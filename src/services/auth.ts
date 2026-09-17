import * as SecureStore from 'expo-secure-store';

/**
 * Authentication & consent scaffold (advantageous requirement: "Secure Digital
 * Identity and Integration").
 *
 * This provides the seam for integrating with a national identity / SSO
 * provider (e.g. DHET / Khetha OIDC or the government's secure sign-in). Tokens
 * are stored in the device secure enclave via expo-secure-store rather than
 * plain AsyncStorage, keeping citizen credentials protected.
 *
 * The app works fully without sign-in (anonymous, local-only profile). Signing
 * in is optional and only enables cloud sync / cross-device continuity once a
 * backend is connected.
 */

const ACCESS_TOKEN_KEY = 'khetha_access_token';
const REFRESH_TOKEN_KEY = 'khetha_refresh_token';
const ID_TOKEN_KEY = 'khetha_id_token';

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

/** Persists tokens securely after a successful OIDC exchange. */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.idToken) await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function isSignedIn(): Promise<boolean> {
  return (await getAccessToken()) !== null;
}

/** Clears all credentials — used on sign-out and on "delete my data". */
export async function signOut(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(ID_TOKEN_KEY),
  ]);
}

/**
 * Placeholder for the OIDC/OAuth2 sign-in flow. Wire this to expo-auth-session
 * and the DHET/Khetha identity provider when the backend is available. Returns
 * null in this offline build so callers keep the anonymous experience.
 */
export async function signInWithNcap(): Promise<AuthUser | null> {
  // Intentionally not implemented in the offline build.
  // Example (once configured):
  //   const discovery = await fetchDiscovery('https://id.dhet.gov.za');
  //   const result = await promptAsync(...);
  //   await storeTokens({ accessToken: result.accessToken, ... });
  return null;
}
