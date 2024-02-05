import React, {useEffect} from 'react';
import {AuthProvider} from './AuthContext';
import AppNavigator from './AppNavigator';
import {useFonts, Poppins_500Medium, Poppins_400Regular, Poppins_600SemiBold} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import {GestureHandlerRootView} from "react-native-gesture-handler";

function App() {
    let [fontsLoaded] = useFonts({
        Poppins_500Medium,
        Poppins_400Regular,
        Poppins_600SemiBold
    });

    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                console.warn(e);
            } finally {
                if (fontsLoaded) {
                    await SplashScreen.hideAsync();
                }
            }
        }

        prepare();
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <AuthProvider>
                <AppNavigator/>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}

export default App;
