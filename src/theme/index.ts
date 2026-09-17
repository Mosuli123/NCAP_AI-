/**
 * Khetha NCAP design system.
 *
 * Colours are drawn from the DHET / Khetha palette and tuned for WCAG AA
 * contrast so the app remains legible for low-vision users and in bright
 * outdoor conditions common for mobile-first users in South Africa.
 */

export const colors = {
  primary: '#0B4F6C', // DHET deep teal
  primaryDark: '#073849',
  primaryLight: '#1B7A9E',
  accent: '#F4A300', // Khetha gold — call-to-action
  accentDark: '#C97F00',
  success: '#2E7D32',
  danger: '#C62828',
  warning: '#ED6C02',
  info: '#0277BD',

  background: '#FFFFFF',
  surface: '#F4F7F9',
  surfaceAlt: '#E8EEF2',
  border: '#D3DDE3',

  text: '#12232E',
  textMuted: '#4A5A66',
  textInverse: '#FFFFFF',

  // RIASEC / interest category accents (used in questionnaire results)
  riasec: {
    R: '#8D6E63', // Realistic
    I: '#5C6BC0', // Investigative
    A: '#EC407A', // Artistic
    S: '#26A69A', // Social
    E: '#FFA726', // Enterprising
    C: '#78909C', // Conventional
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
} as const;

export const typography = {
  h1: { fontSize: fontSize.xxl, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: fontSize.xl, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: fontSize.lg, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: fontSize.md, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: fontSize.md, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: fontSize.sm, fontWeight: '400' as const, color: colors.textMuted },
  label: { fontSize: fontSize.sm, fontWeight: '600' as const, color: colors.text },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const theme = { colors, spacing, radius, fontSize, typography, shadow };
export type Theme = typeof theme;
