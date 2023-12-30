import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNavigator from './AppNavigator';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

function App() {
    let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

    if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
