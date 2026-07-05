// Single source of truth for all design tokens.
// Change `accent` here to re-brand the entire app once Noor Masjid has real branding
// (Folder Structure §3.1 / UI Wireframes §1) — nothing else in the app should
// hardcode a color; every component reads from this file.

import { Appearance } from 'react-native';

// Determined once, at app launch, from the device's current system setting.
// See prior note: not live-switching mid-session by design (see git history
// / prior conversation) - a deliberate, documented trade-off.
const isDarkMode = Appearance.getColorScheme() === 'dark';

// Converted from the design system's OKLCH tokens to hex via actual color
// math (React Native's style engine doesn't parse oklch() at all).
const lightColors = {
  // Primary interactive accent = near-black, per the design system's
  // explicit intent: keep masjid green reserved for prayer-identity
  // moments only, not diluted as a generic "everything" color.
  accent: '#050608',
  accentHover: '#15161B',
  accentSubtle: '#E8E9F2',
  accentSubtleBorder: '#D5D7E1',

  // Islamic-identity accent = masjid green - the prayer countdown hero
  // and the "next prayer" row highlight, and nothing else.
  prayer: '#156F41',
  prayerDark: '#03532D',
  prayerSubtle: '#E3F8E9',
  prayerSubtleText: '#03532D',

  surface: '#FFFFFF',
  surfacePage: '#ECEFFE', // the lavender-tinted screen background from the design system
  surfaceSunken: '#E8E9F2',
  border: '#D5D7E1',
  borderStrong: '#B5B6C2',

  textPrimary: '#050608',
  textSecondary: '#46474F',
  textTertiary: '#8A8B97',
  textOnAccent: '#FFFFFF',

  danger: '#A83634',
  dangerSubtle: '#FFEBE8',
  success: '#156F41',
  successSubtle: '#E3F8E9',

  toggleOff: '#B5B6C2',

  // A third identity color, reserved for announcements specifically -
  // distinct from both the near-black UI accent and the masjid-green
  // prayer identity, matching EventCard.jsx's gold "special" tag treatment.
  accentGold: '#9C721C',

  // Kept for any remaining reference during the transition - map to the
  // closest equivalent in the new system rather than leaving them dangling.
  accentTintLight: '#E3F8E9',
  accentSoft: '#E3F8E9',
  accentSoftText: '#03532D',
  textMuted: '#8A8B97',
  surfaceMuted: '#E8E9F2',
};

const darkColors = {
  accent: '#E8E9F2',
  accentHover: '#D5D7E1',
  accentSubtle: '#2C2D34',
  accentSubtleBorder: '#46474F',

  prayer: '#82C298',
  prayerDark: '#C5EDD2',
  prayerSubtle: '#0F2E1F',
  prayerSubtleText: '#82C298',

  surface: '#15161B',
  surfacePage: '#0A0A0D',
  surfaceSunken: '#1F2028',
  border: '#2C2D34',
  borderStrong: '#46474F',

  textPrimary: '#F4F5FB',
  textSecondary: '#B5B6C2',
  textTertiary: '#676872',
  textOnAccent: '#050608',

  danger: '#E8837F',
  dangerSubtle: '#3A1F1E',
  success: '#82C298',
  successSubtle: '#0F2E1F',

  toggleOff: '#46474F',

  accentGold: '#E0B771',
  accentTintLight: '#0F2E1F',
  accentSoft: '#0F2E1F',
  accentSoftText: '#82C298',
  textMuted: '#676872',
  surfaceMuted: '#1F2028',
};

export const theme = {
  colors: isDarkMode ? darkColors : lightColors,
  radius: {
    sm: 10,
    control: 14, // was 12 - matches the design system's radius-md
    card: 20, // was 24 - matches radius-lg (the standard Card component)
    heroCard: 28, // new - radius-xl, specifically for the prayer countdown hero
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
    caption: 12, // was 13 - matches text-caption
    label: 13, // new - text-label, 600 weight
    body: 15,
    bodyLg: 17, // new
    title: 22, // matches text-h2
    subheading: 17, // new - text-h3
    heading: 28, // was 26 - matches text-h1
    // The single most important number in the app, per the design
    // system's own framing - deliberately large. Kept slightly smaller
    // than the spec's 54px (which risks overflow once seconds are shown,
    // per feedback item 7 - "HH:MM:SS" is a longer string than "H:MM").
    countdown: 44,
    countdownLabel: 14,
  },
  shadow: {
    // React Native shadow props (iOS) + elevation (Android) bundled together,
    // since RN doesn't support CSS box-shadow syntax directly.
    sm: { shadowColor: '#2E2A50', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    md: { shadowColor: '#2E2A50', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.09, shadowRadius: 20, elevation: 6 },
    lg: { shadowColor: '#2E2A50', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.16, shadowRadius: 45, elevation: 12 },
  },
} as const;

export type Theme = typeof theme;

