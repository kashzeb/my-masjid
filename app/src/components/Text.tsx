import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { theme } from '@/constants/theme';

// App-wide <Text>: applies the Manrope font family matching each style's
// fontWeight. Custom fonts on Android ignore fontWeight, so mapping the
// weight to a specific font file is what makes bold text actually bold.
const FAMILY_BY_WEIGHT: Record<string, string> = {
  normal: theme.font.regular,
  '100': theme.font.regular,
  '200': theme.font.regular,
  '300': theme.font.regular,
  '400': theme.font.regular,
  '500': theme.font.medium,
  '600': theme.font.semibold,
  bold: theme.font.bold,
  '700': theme.font.bold,
  '800': theme.font.extrabold,
  '900': theme.font.extrabold,
};

export function fontFor(weight: TextStyle['fontWeight']): string {
  return FAMILY_BY_WEIGHT[String(weight ?? '400')] ?? theme.font.regular;
}

export default function Text({ style, ...rest }: TextProps) {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const { fontWeight, fontFamily, ...others } = flat;
  return <RNText {...rest} style={[others, { fontFamily: fontFamily ?? fontFor(fontWeight) }]} />;
}
