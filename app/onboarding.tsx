import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Chip, SectionTitle } from '@/components/ui';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n';
import { requestNotificationPermission, scheduleJourneyReminder } from '@/services/notifications';
import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing, typography } from '@/theme';
import type { Province, SupportedLanguage } from '@/types';

const PROVINCES: Province[] = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
];

/**
 * Three-step onboarding: (1) choose language, (2) optional basics, (3) POPIA
 * consent. Language and consent are captured up front to respect data-privacy
 * requirements and to make the app usable in the user's own language from the
 * very first screen (inclusivity).
 */
export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const { profile, setBasics, setConsent, completeMilestone } = useProfile();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [province, setProvince] = useState<Province | null>(null);
  const [dataConsent, setDataConsent] = useState(false);
  const [notifConsent, setNotifConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  const pickLanguage = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setBasics({ language: lang });
  };

  const finish = async () => {
    setBasics({
      displayName: name.trim() || undefined,
      grade: grade ? Number(grade) : undefined,
      province: province ?? undefined,
    });
    setConsent({ dataProcessing: dataConsent, notifications: notifConsent, analytics: analyticsConsent });
    completeMilestone('onboarded');

    if (notifConsent) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleJourneyReminder(60 * 60 * 24, t('home.subtitle'));
      }
    }

    // Onboarding complete — proceed to the (demo) sign-in screen.
    router.replace('/login');
  };

  const skip = async () => {
    completeMilestone('onboarded');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {step === 0 && (
        <View>
          <Text style={styles.title}>{t('onboarding.welcomeTitle')}</Text>
          <Text style={styles.body}>{t('onboarding.welcomeBody')}</Text>
          <SectionTitle>{t('onboarding.chooseLanguage')}</SectionTitle>
          <View style={styles.langGrid}>
            {SUPPORTED_LANGUAGES.map((l) => (
              <Chip
                key={l.code}
                label={l.nativeLabel}
                selected={i18n.language === l.code}
                onPress={() => pickLanguage(l.code)}
              />
            ))}
          </View>
          <View style={styles.actions}>
            <Button title={t('common.continue')} onPress={() => setStep(1)} />
            <View style={{ height: spacing.sm }} />
            <Button title={t('onboarding.skip')} variant="ghost" onPress={skip} />
          </View>
        </View>
      )}

      {step === 1 && (
        <View>
          <Text style={styles.title}>{t('onboarding.tellUs')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.namePlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            accessibilityLabel={t('onboarding.namePlaceholder')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('onboarding.gradePlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={grade}
            onChangeText={setGrade}
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel={t('onboarding.gradePlaceholder')}
          />
          <SectionTitle>{t('onboarding.selectProvince')}</SectionTitle>
          <View style={styles.langGrid}>
            {PROVINCES.map((p) => (
              <Chip key={p} label={p} selected={province === p} onPress={() => setProvince(province === p ? null : p)} />
            ))}
          </View>
          <View style={styles.actions}>
            <Button title={t('common.continue')} onPress={() => setStep(2)} />
            <View style={{ height: spacing.sm }} />
            <Button title={t('common.back')} variant="ghost" onPress={() => setStep(0)} />
          </View>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.title}>{t('onboarding.consentTitle')}</Text>
          <Text style={styles.body}>{t('onboarding.consentBody')}</Text>

          <ConsentRow label={t('onboarding.consentData')} value={dataConsent} onValueChange={setDataConsent} />
          <ConsentRow label={t('onboarding.consentNotifications')} value={notifConsent} onValueChange={setNotifConsent} />
          <ConsentRow label={t('onboarding.consentAnalytics')} value={analyticsConsent} onValueChange={setAnalyticsConsent} />

          <View style={styles.actions}>
            <Button title={t('onboarding.getStarted')} variant="accent" disabled={!dataConsent} onPress={finish} />
            <View style={{ height: spacing.sm }} />
            <Button title={t('common.back')} variant="ghost" onPress={() => setStep(1)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function ConsentRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.consentRow}>
      <Text style={styles.consentLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primaryLight, false: colors.border }}
        thumbColor={value ? colors.primary : '#f4f3f4'}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  title: { ...typography.h1, marginBottom: spacing.md },
  body: { ...typography.body, lineHeight: 24, marginBottom: spacing.lg, color: colors.textMuted },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
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
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  consentLabel: { ...typography.body, flex: 1 },
  actions: { marginTop: spacing.xl },
});
