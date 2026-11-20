import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { theme } from '@/constants/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// One icon set across the whole app (Material Community, outline style),
// so every screen speaks the same visual language.
export default function Icon({ name, size = 20, color = theme.colors.textPrimary }: IconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
