import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons'; // Import icons from Expo's vector-icons
import * as SecureStore from 'expo-secure-store';
import {useAuth} from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Welcome from './Screens/WelcomeScreen';
import Dashboard from './Screens/DashboardScreen';
import Map from './Screens/MapScreen';
import Account from './Screens/AccountScreen';
import Login from './Screens/LoginScreen';
import LoginVerify from './Screens/LoginVerifyScreen';
import Register from './Screens/RegisterScreen';
import RegisterVerify from './Screens/RegisterVerifyScreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

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


const AppNavigator = () => {

    const {state, dispatch} = useAuth();

    useEffect(() => {
        const checkAuthState = async () => {
      try {
        // Check if token exists in AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (token) {
          // Dispatch action to set user as authenticated
          dispatch({ type: 'LOGIN' });

        } else {
            // Dispatch action to set user as not authenticated
            dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        // Handle AsyncStorage or token retrieval errors
      }
    };

    checkAuthState();
  }, [dispatch]);

    return (
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
                    <Tab.Screen name="Account" component={Account}/>
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

    );
};

export default AppNavigator;
