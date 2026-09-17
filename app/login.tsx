import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@/components/ui';
import { DEMO_CREDENTIALS, signInWithDemo } from '@/services/auth';
import { StorageKeys, setItem } from '@/services/storage';
import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Demo login screen. Uses local dummy credentials (DEMO_CREDENTIALS) so the
 * sign-in flow can be tested without a backend. A one-tap "Use demo account"
 * button pre-fills valid credentials, and "Continue as guest" preserves the
 * fully anonymous experience.
 */
export default function Login() {
  const { t } = useTranslation();
  const { setBasics } = useProfile();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishToApp = async () => {
    await setItem(StorageKeys.onboardingDone, true);
    router.replace('/(tabs)/home');
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    const result = await signInWithDemo(email, password);
    setLoading(false);
    if (result.ok) {
      setBasics({ displayName: result.user.name });
      await finishToApp();
    } else {
      setError(t('login.invalid'));
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS[0].email);
    setPassword(DEMO_CREDENTIALS[0].password);
    setError(null);
  };

  const guest = async () => {
    await setItem(StorageKeys.guestMode, true);
    await finishToApp();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.appName}>{t('common.appName')}</Text>
          <Text style={styles.tagline}>{t('common.tagline')}</Text>
        </View>

        <Text style={styles.title}>{t('login.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('login.email')}
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          accessibilityLabel={t('login.email')}
        />
        <TextInput
          style={styles.input}
          placeholder={t('login.password')}
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel={t('login.password')}
        />

        {error && (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Button title={t('login.signIn')} onPress={submit} loading={loading} />
        <View style={{ height: spacing.sm }} />
        <Button title={t('login.guest')} variant="ghost" onPress={guest} />

        <Card style={styles.demoCard}>
          <Text style={styles.demoTitle}>🔑 {t('login.demoTitle')}</Text>
          <Text style={styles.demoLine}>{t('login.email')}: {DEMO_CREDENTIALS[0].email}</Text>
          <Text style={styles.demoLine}>{t('login.password')}: {DEMO_CREDENTIALS[0].password}</Text>
          <View style={{ height: spacing.sm }} />
          <Button title={t('login.useDemo')} variant="accent" onPress={fillDemo} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 56 },
  appName: { ...typography.h1, marginTop: spacing.sm },
  tagline: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xs },
  title: { ...typography.h3, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },
  error: { color: colors.danger, marginBottom: spacing.md, fontWeight: '600' },
  demoCard: { marginTop: spacing.xl, backgroundColor: colors.surface, borderColor: colors.accent },
  demoTitle: { ...typography.label, marginBottom: spacing.sm },
  demoLine: { ...typography.body, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
});
