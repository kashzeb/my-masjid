import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './RootNavigator';

function App() {
  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

registerRootComponent(App);
