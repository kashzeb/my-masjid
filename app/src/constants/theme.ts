// Single source of truth for all design tokens.
// Every component reads colors, fonts, spacing and shadows from here, so a
// re-brand is an edit to this file only (Folder Structure §3.1).

import { Appearance } from 'react-native';

// Determined once at launch from the device setting (not live-switching
// mid-session - a deliberate, documented trade-off).
const isDarkMode = Appearance.getColorScheme() === 'dark';

// Palette: warm neutrals, masjid green for prayer moments and primary
// actions, gold for announcements and the Hijri date. Nothing else is
// colored, which is what keeps the app calm rather than busy.
const lightColors = {
  accent: '#0B4F30',
  accentHover: '#083D25',
  accentSubtle: '#E9EDE6',
  accentSubtleBorder: '#D7DCD3',

  prayer: '#156F41',
  prayerDark: '#03532D',
  prayerDeep: '#01391F',
  prayerSubtle: '#E3F5E8',
  prayerBorder: '#BFE6CC',
  prayerSubtleText: '#03532D',
  prayerOnDark: '#A9DDBC',

  surface: '#FFFFFF',
  surfacePage: '#F4F5F0',
  surfaceSunken: '#ECEEE7',
  skeleton: '#E3E5DE',
  border: '#E4E6DE',
  borderStrong: '#C9CCC2',

  textPrimary: '#101311',
  textSecondary: '#545A54',
  textTertiary: '#8A8F8A',
  textOnAccent: '#FFFFFF',

  danger: '#A83634',
  dangerSubtle: '#FCEBE8',
  success: '#156F41',
  successSubtle: '#E3F5E8',

  toggleOff: '#C9CCC2',

  accentGold: '#9C721C',
  goldBright: '#E0B771',
  goldSubtle: '#F8EFD9',

  // Legacy aliases still referenced by a few components.
  accentTintLight: '#E3F5E8',
  accentSoft: '#E3F5E8',
  accentSoftText: '#03532D',
  textMuted: '#8A8F8A',
  surfaceMuted: '#ECEEE7',
};

const darkColors: typeof lightColors = {
  accent: '#2F8F5B',
  accentHover: '#3BA36A',
  accentSubtle: '#1D221F',
  accentSubtleBorder: '#2C332E',

  prayer: '#82C298',
  prayerDark: '#0E5A35',
  prayerDeep: '#063820',
  prayerSubtle: '#12291C',
  prayerBorder: '#1F4A30',
  prayerSubtleText: '#9FDDB5',
  prayerOnDark: '#A9DDBC',

  surface: '#151917',
  surfacePage: '#0B0D0C',
  surfaceSunken: '#1D221F',
  skeleton: '#202622',
  border: '#262C28',
  borderStrong: '#3A423D',

  textPrimary: '#F2F4F1',
  textSecondary: '#B4BBB5',
  textTertiary: '#737B75',
  textOnAccent: '#FFFFFF',

  danger: '#E8837F',
  dangerSubtle: '#3A1F1E',
  success: '#82C298',
  successSubtle: '#12291C',

  toggleOff: '#3A423D',

  accentGold: '#E0B771',
  goldBright: '#E0B771',
  goldSubtle: '#2C2413',

  accentTintLight: '#12291C',
  accentSoft: '#12291C',
  accentSoftText: '#9FDDB5',
  textMuted: '#737B75',
  surfaceMuted: '#1D221F',
};

export const theme = {
  isDark: isDarkMode,
  colors: isDarkMode ? darkColors : lightColors,
  // Manrope, loaded in App.tsx. Components set fontWeight as usual; the
  // shared <Text> maps the weight to the matching font file.
  font: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    extrabold: 'Manrope_800ExtraBold',
  },
  radius: {
    sm: 10,
    control: 14,
    card: 20,
    heroCard: 26,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    sm3: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    caption: 12,
    label: 13,
    body: 15,
    bodyLg: 17,
    title: 20,
    subheading: 17,
    heading: 28,
    countdown: 42,
    countdownLabel: 12,
  },
  shadow: {
    sm: { shadowColor: '#1B2A1F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDarkMode ? 0 : 0.05, shadowRadius: 8, elevation: isDarkMode ? 0 : 1 },
    md: { shadowColor: '#0B3D22', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 8 },
    lg: { shadowColor: '#0B3D22', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.22, shadowRadius: 40, elevation: 14 },
  },
} as const;

export type Theme = typeof theme;
