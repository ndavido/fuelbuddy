import React from 'react';
import { AuthProvider } from './AuthContext';
import AppNavigator from './AppNavigator';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';

function App() {
    let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
