import { View, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

// Updated to use the design system's soft shadow-based elevation instead of
// a hard border - matches Card.jsx's `boxShadow: var(--shadow-1)` treatment.
export default function Card({ children, style, elevated = true }: CardProps) {
  return <View style={[styles.card, elevated && theme.shadow.sm, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
  },
});
