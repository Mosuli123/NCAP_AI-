import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card, SectionTitle } from '@/components/ui';
import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Home dashboard — the personalised landing screen. Greets the user, surfaces
 * the three core NCAP tools, links to the directories, and shows the next
 * incomplete journey step so users always know what to do next.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const greeting = profile.displayName
    ? `${t('home.greeting')}, ${profile.displayName}`
    : t('home.greetingGuest');

  const nextMilestone = profile.journey.find((m) => !m.completedAt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>{greeting} 👋</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      {nextMilestone && (
        <Card style={styles.resumeCard} onPress={() => router.push('/(tabs)/journey')}>
          <Text style={styles.resumeLabel}>{t('home.continueJourney')}</Text>
          <Text style={styles.resumeTitle}>{nextMilestone.label}</Text>
          <Text style={styles.resumeCta}>{t('home.resume')} →</Text>
        </Card>
      )}

      <SectionTitle>{t('home.quickActions')}</SectionTitle>
      <ToolCard
        emoji="📚"
        title={t('home.subjectChooser')}
        desc={t('home.subjectChooserDesc')}
        color={colors.primary}
        onPress={() => router.push('/(tabs)/assess')}
      />
      <ToolCard
        emoji="🧩"
        title={t('home.jobFit')}
        desc={t('home.jobFitDesc')}
        color={colors.primaryLight}
        onPress={() => router.push('/quiz/jobfit')}
      />
      <ToolCard
        emoji="💡"
        title={t('home.careerChoice')}
        desc={t('home.careerChoiceDesc')}
        color={colors.accentDark}
        onPress={() => router.push('/quiz/careerchoice')}
      />

      <SectionTitle>{t('home.directories')}</SectionTitle>
      <View style={styles.grid}>
        <DirTile emoji="💼" label={t('home.careers')} onPress={() => router.push('/(tabs)/explore?tab=careers')} />
        <DirTile
          emoji="🎓"
          label={t('home.qualifications')}
          onPress={() => router.push('/(tabs)/explore?tab=qualifications')}
        />
        <DirTile
          emoji="🏫"
          label={t('home.providers')}
          onPress={() => router.push('/(tabs)/explore?tab=providers')}
        />
      </View>
    </ScrollView>
  );
}

function ToolCard({
  emoji,
  title,
  desc,
  color,
  onPress,
}: {
  emoji: string;
  title: string;
  desc: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Card style={styles.toolCard} onPress={onPress} accessibilityLabel={`${title}. ${desc}`}>
      <View style={[styles.toolIcon, { backgroundColor: `${color}22` }]}>
        <Text style={{ fontSize: 26 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolDesc}>{desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Card>
  );
}

function DirTile({ emoji, label, onPress }: { emoji: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={styles.tile}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={{ fontSize: 30 }}>{emoji}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  greeting: { ...typography.h2, color: colors.textInverse },
  subtitle: { color: colors.textInverse, opacity: 0.9, marginTop: spacing.xs, fontSize: 15 },
  resumeCard: { borderColor: colors.accent, borderWidth: 1.5, marginBottom: spacing.lg },
  resumeLabel: { ...typography.caption, color: colors.accentDark, fontWeight: '700' },
  resumeTitle: { ...typography.h3, marginVertical: spacing.xs },
  resumeCta: { color: colors.primary, fontWeight: '700' },
  toolCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  toolIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  toolTitle: { ...typography.label, fontSize: 16 },
  toolDesc: { ...typography.caption, marginTop: 2 },
  chevron: { fontSize: 28, color: colors.textMuted, marginLeft: spacing.sm },
  grid: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  tileLabel: { ...typography.label, fontSize: 13, textAlign: 'center' },
});
