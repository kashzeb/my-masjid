import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { theme } from '@/constants/theme';

export default function OfflineBanner({ message = 'Offline · showing saved timings' }: { message?: string }) {
  return (
    <View style={styles.pill}>
      <Icon name="cloud-off-outline" size={15} color={theme.colors.textSecondary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: theme.spacing.sm3,
  },
  text: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '500' },
});
