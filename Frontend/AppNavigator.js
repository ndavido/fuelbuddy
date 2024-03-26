import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons';
import {useCombinedContext} from './CombinedContext';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import * as Progress from 'react-native-progress';
import {jwtDecode} from 'jwt-decode';

/* Login & Reg */
import WelcomeScreen from './Screens/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen';
import LoginVerifyScreen from './Screens/LoginVerifyScreen';
import RegisterScreen from './Screens/RegisterScreen';
import RegisterVerifyScreen from './Screens/RegisterVerifyScreen';

/* Complete Reg */
import CompleteProfileScreen from "./Screens/CompleteProfileScreen";
import CompleteVehicleScreen from "./Screens/CompleteVehicleScreen";
import SetPreferencesScreen from "./Screens/SetPreferencesScreen";

/* Main Screens */
import DashboardScreen from './Screens/DashboardScreen';
import MapScreen from './Screens/MapScreen';
import ScanScreen from './Screens/ScanScreen';
import AccountScreen from './Screens/AccountScreen';

/* OCR */
import BudgetReceipt from './Screens/ReceiptBudgetScreen'
import StationReceipt from './Screens/ReceiptStationScreen'
import ConfirmReceipt from './Screens/ReceiptConfirmScreen'

/* Friends */
import FriendsScreen from './Screens/FriendsScreen';
import FProfileScreen from "./Screens/FriendsProfileScreen";

/* Secondary Screens */
import PersonalInfoScreen from './Screens/PersonalInfoScreen';
import DeleteConfirmScreen from './Screens/DeleteConfirmScreen';
import VehicleScreen from './Screens/VehicleScreen';
import DeveloperScreen from './Screens/DeveloperScreen';
import UserStationScreen from "./Screens/UserStationScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";

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

const RegistrationFlow = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="CompleteProfile">
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen}/>
            <Stack.Screen name="CompleteVehicle" component={CompleteVehicleScreen}/>
            <Stack.Screen name="SetPreferences" component={SetPreferencesScreen}/>
        </Stack.Navigator>
    );
};

const RegisterNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
            <Stack.Screen name="RegisterVerify" component={RegisterVerifyScreen}/>
        </Stack.Navigator>
    );
};

const LoginNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="LoginVerify" component={LoginVerifyScreen}/>
        </Stack.Navigator>
    );
};

const AccountNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="AccountScreen" component={AccountScreen}/>
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen}/>
            <Stack.Screen name="DeleteConfirm" component={DeleteConfirmScreen}/>
            <Stack.Screen name="Vehicle" component={VehicleScreen}/>
            <Stack.Screen name="Developer" component={DeveloperScreen}/>
            <Stack.Screen name="UserStation" component={UserStationScreen}/>
        </Stack.Navigator>
    );
};

const FriendNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Friends">
            <Stack.Screen name="Friends" component={FriendsScreen}/>
            <Stack.Screen name="FriendsProfile" component={FProfileScreen}/>
        </Stack.Navigator>
    );
}

const ScanFlow = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="OCR">
            <Stack.Screen name="OCR" component={ScanScreen}/>
            <Stack.Screen name="BudgetReceipt" component={BudgetReceipt}/>
            <Stack.Screen name="StationReceipt" component={StationReceipt}/>
            <Stack.Screen name="ConfirmReceipt" component={ConfirmReceipt}/>
        </Stack.Navigator>
    )
}

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
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return isVisible ? (
        <View style={styles.loadingContainer}>
            <Progress.Bar color={'white'} borderColor={'transparent'} progress={progress} width={200}/>
            <Text>Loading...</Text>
        </View>
    ) : null;
}

const AppNavigator = () => {
    const {state: authState, dispatch: authDispatch, userData} = useCombinedContext();

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token) {
                    authDispatch({type: 'LOGIN'});

                } else {
                    authDispatch({type: 'LOGOUT'});
                }
            } catch (error) {
                // TODO Handle AsyncStorage or token retrieval errors
            }
        };

        checkAuthState();

    }, [authDispatch]);

    return (
        <View style={{flex: 1, overflow: 'hidden'}}>
            <StatusBar translucent backgroundColor="#FFFFFF" barStyle="dark-content"/>
            <NavigationContainer>
                {authState.isUserAuthenticated ? (
                    userData.reg_full ? (
                        <Tab.Navigator
                            screenOptions={({route}) => ({
                                headerShown: false,
                                tabBarActiveTintColor: '#6BFF91',
                                tabBarInactiveTintColor: '#515151',
                                tabBarStyle: {
                                    backgroundColor: '#FFFFFF',
                                },
                                tabBarLabelStyle: {
                                    fontSize: 16,
                                },
                                tabBarLabel: '',
                                tabBarIcon: ({color, size, focused}) => {
                                    let iconName;

                                    const iconStyle = {
                                        marginBottom: focused ? 3 : 0,
                                    };

                                    let iconSize = 22;

                                    if (route.name === 'Dashboard') {
                                        iconName = 'chart-bar';
                                    } else if (route.name === 'Map') {
                                        iconName = 'map-marked-alt';
                                    } else if (route.name === 'Scan') {
                                        iconName = 'camera';
                                        iconSize = 26;
                                    } else if (route.name === 'Buddies') {
                                        iconName = 'user-friends';
                                    } else if (route.name === 'Account') {
                                        iconName = 'user-astronaut';
                                    }

                                    let iconColor = focused ? '#6BFF91' : '#515151';

                                    return <FontAwesome5 name={iconName} size={iconSize} color={iconColor}
                                                         style={iconStyle}/>;
                                },
                            })}
                        >
                            <Tab.Screen name="Dashboard" component={DashboardScreen}/>
                            <Tab.Screen name="Map" component={MapScreen}/>
                            <Tab.Screen name="Scan" component={ScanFlow}/>
                            <Tab.Screen name="Buddies" component={FriendNavigator}/>
                            <Tab.Screen name="Account" component={AccountNavigator}/>
                        </Tab.Navigator>
                    ) : (
                        <RegistrationFlow/>
                    )
                ) : (
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                        <Stack.Screen name="Login" component={LoginNavigator}/>
                        <Stack.Screen name="Register" component={RegisterNavigator}/>
                    </Stack.Navigator>
                )}
            </NavigationContainer>
            <LoadingScreen isVisible={authState.isLoading}/>
        </View>
    );
};

export default AppNavigator;