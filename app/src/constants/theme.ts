// Single source of truth for all design tokens.
// Change `accent` here to re-brand the entire app once Noor Masjid has real branding
// (Folder Structure §3.1 / UI Wireframes §1) — nothing else in the app should
// hardcode a color; every component reads from this file.

export const theme = {
  colors: {
    accent: '#0F6E56', // placeholder teal — swap this one line to re-brand
    accentSoft: '#E1F5EE',
    accentSoftText: '#085041',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F4F1',
    border: '#E5E3DD',
    textPrimary: '#1A1A18',
    textSecondary: '#6B6A64',
    textMuted: '#9B9A93',
    toggleOff: '#D3D1C7',
  },
  radius: {
    card: 16,
    control: 8,
    pill: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
  },
  typography: {
    body: 15,
    caption: 13,
    title: 22,
  },
} as const;

export type Theme = typeof theme;
