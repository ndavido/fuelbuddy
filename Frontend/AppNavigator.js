import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons'; // Import icons from Expo's vector-icons
import * as SecureStore from 'expo-secure-store';
import {useAuth} from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';

import Welcome from './Screens/WelcomeScreen';
import Dashboard from './Screens/DashboardScreen';
import Map from './Screens/MapScreen';
import Account from './Screens/AccountScreen';
import PersonalInfo from './Screens/PersonalInfoScreen';
import DeleteConfirm from './Screens/DeleteConfirmScreen';
import Login from './Screens/LoginScreen';
import LoginVerify from './Screens/LoginVerifyScreen';
import Register from './Screens/RegisterScreen';
import RegisterVerify from './Screens/RegisterVerifyScreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6BFF91',
        zIndex: 100,
    },
});

const RegisterNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="RegisterVerify" component={RegisterVerify}/>
        </Stack.Navigator>
    );
};

const LoginNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="LoginVerify" component={LoginVerify}/>
        </Stack.Navigator>
    );
};

const AccountNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Account" component={Account}/>
            <Stack.Screen name="PersonalInfo" component={PersonalInfo}/>
            <Stack.Screen name="DeleteConfirm" component={DeleteConfirm}/>
        </Stack.Navigator>
    );
};

function LoadingScreen({isVisible}) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress < 1) {
                    return prevProgress + 0.1;
                }
                clearInterval(interval);
                return 1;
            });
        }, 50); // Adjust timing here

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <View style={styles.loadingContainer}>
            <Progress.Bar color={'white'} borderColor={'transparent'} progress={progress} width={200}/>
            <Text>fuelbuddy Alpha Loading</Text>
        </View>
    );
}

const AppNavigator = () => {

    const {state, dispatch} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        const checkAuthState = async () => {
            try {
                // Check if token exists in AsyncStorage
                const token = await AsyncStorage.getItem('token');

                if (token) {
                    // Dispatch action to set user as authenticated
                    dispatch({type: 'LOGIN'});

                } else {
                    // Dispatch action to set user as not authenticated
                    dispatch({type: 'LOGOUT'});
                }
            } catch (error) {
                // Handle AsyncStorage or token retrieval errors
            }
        };

        checkAuthState();

        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <View style={{flex: 1, overflow: 0}}>
            <NavigationContainer>
                {state.isUserAuthenticated ? (
                    <Tab.Navigator
                        screenOptions={({route}) => ({
                            headerShown: false,
                            tabBarActiveTintColor: '#6BFF91',
                            tabBarInactiveTintColor: 'black',
                            tabBarStyle: {
                                backgroundColor: '#FFFFFF',
                            },
                            tabBarLabelStyle: {
                                fontSize: 16,
                            },
                            tabBarIcon: ({color, size}) => {
                                let iconName;

                                if (route.name === 'Dashboard') {
                                    iconName = 'th-large';
                                } else if (route.name === 'Map') {
                                    iconName = 'map';
                                } else if (route.name === 'Account') {
                                    iconName = 'user';
                                }

                                return <FontAwesome5 name={iconName} size={size} color="#6BFF91"/>; // Use FontAwesome5 from Expo
                            },
                        })}
                    >
                        <Tab.Screen name="Dashboard" component={Dashboard}/>
                        <Tab.Screen name="Map" component={Map}/>
                        <Tab.Screen name="Account" component={AccountNavigator}/>
                    </Tab.Navigator>
                ) : (
                    <Stack.Navigator screenOptions={{
                        headerShown: false
                    }}>
                        <Stack.Screen name="Welcome" component={Welcome}/>
                        <Stack.Screen name="Login" component={LoginNavigator}/>
                        <Stack.Screen name="Register" component={RegisterNavigator}/>
                    </Stack.Navigator>
                )}
            </NavigationContainer>
            <LoadingScreen isVisible={isLoading}/>
        </View>
    );
};

export default AppNavigator;
