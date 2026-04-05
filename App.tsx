import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AppStoreProvider } from './src/store/AppStore';
import { colors } from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppNavigator />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}

export default App;
