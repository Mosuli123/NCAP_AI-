import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing } from '@/theme';

type Kind = 'careers' | 'qualifications' | 'providers';

/**
 * Toggles a favourite (saved item) and feeds the personalised journey.
 * Uses a text star so it renders identically across devices without icon fonts.
 */
export function FavouriteButton({ kind, id }: { kind: Kind; id: string }) {
  const { toggleFavourite, isFavourite } = useProfile();
  const active = isFavourite(kind, id);

  return (
    <Pressable
      onPress={() => toggleFavourite(kind, id)}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      style={[styles.btn, active && styles.btnActive]}
    >
      <Text style={[styles.star, active && styles.starActive]}>{active ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.sm,
  },
  btnActive: { backgroundColor: `${colors.accent}22`, borderColor: colors.accent },
  star: { fontSize: 20, color: colors.textMuted },
  starActive: { color: colors.accentDark },
});
