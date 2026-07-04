import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Fixes the status-bar-overlap issue: every screen should sit inside this
// rather than a plain View, so content never renders under the OS status
// bar (clock, battery, etc). Only pads the top edge — bottom is handled by
// the tab bar itself now that it's flush with the screen (not floating).
export default function ScreenContainer({ children, style }: ScreenContainerProps) {
  return (
    <SafeAreaView edges={['top']} style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surfaceMuted },
});
