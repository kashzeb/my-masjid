import { createNavigationContainerRef } from '@react-navigation/native';
import type { PublicTabParamList } from './RootNavigator';

// Lets code outside the React tree (notification taps, or a screen nested
// deep in the Settings stack wanting to jump to a different tab) navigate
// without needing a component's own navigation prop.
//
// Deliberately its own file, not exported from RootNavigator.tsx directly -
// RootNavigator needs this value, and some screens (e.g. EditTimetableScreen)
// also need it, which previously created a require cycle: RootNavigator ->
// EditTimetableScreen -> RootNavigator. The `import type` below is erased
// entirely at compile time (TypeScript strips type-only imports), so it
// doesn't re-create that cycle at runtime.
export const navigationRef = createNavigationContainerRef<PublicTabParamList>();
