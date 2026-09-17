import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/theme';

/**
 * Bottom tab navigator mirroring NCAP's information architecture:
 * Home, Explore (directories), Assess (questionnaires), My Journey, Get Help.
 * Emoji glyphs are used as icons so no icon-font asset is required and they
 * render consistently across Android and iOS.
 */
function TabIcon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 22, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <TabIcon glyph="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ color }) => <TabIcon glyph="🧭" color={color} />,
        }}
      />
      <Tabs.Screen
        name="assess"
        options={{
          title: t('tabs.assess'),
          tabBarIcon: ({ color }) => <TabIcon glyph="📝" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t('tabs.journey'),
          tabBarIcon: ({ color }) => <TabIcon glyph="🎯" color={color} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: t('tabs.help'),
          tabBarIcon: ({ color }) => <TabIcon glyph="☎️" color={color} />,
        }}
      />
    </Tabs>
  );
}
