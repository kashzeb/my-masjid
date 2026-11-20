import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}

// White rounded surface with a hairline border and a whisper of shadow.
export default function Card({ children, style, elevated = true }: CardProps) {
  return <View style={[styles.card, elevated && theme.shadow.sm, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
