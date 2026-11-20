import { View, StyleSheet } from 'react-native';
import Skeleton from '@/components/Skeleton';
import { theme } from '@/constants/theme';

// Placeholder shown on the very first launch while timings load (later
// launches render the cached timetable instantly instead).
export default function HomeSkeleton() {
  return (
    <View>
      <View style={styles.header}>
        <Skeleton width={44} height={44} radius={14} />
        <View style={styles.headerText}>
          <Skeleton width={120} height={11} />
          <Skeleton width={170} height={20} style={styles.gapTop} />
        </View>
      </View>
      <Skeleton height={120} radius={theme.radius.heroCard} style={styles.hero} />
      <View style={styles.list}>
        <Skeleton width={70} height={16} style={styles.sectionLabel} />
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.row}>
            <Skeleton width={36} height={36} radius={11} />
            <Skeleton height={14} style={styles.rowName} />
            <Skeleton width={110} height={14} />
          </View>
        ))}
      </View>
      <Skeleton height={68} radius={theme.radius.card} style={styles.hero} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, marginBottom: theme.spacing.md },
  headerText: { marginLeft: theme.spacing.sm3 },
  gapTop: { marginTop: 8 },
  hero: { marginHorizontal: theme.spacing.md, width: undefined },
  list: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.lg },
  sectionLabel: { marginBottom: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  rowName: { flex: 1, width: undefined },
});
