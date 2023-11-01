import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo's vector-icons
import { useAuth } from './Screens/AuthContext';

import Welcome from './Screens/WelcomeScreen';
import Home from './Screens/HomeScreen';
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
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterVerify" component={RegisterVerify} />
    </Stack.Navigator>
  );
};

const LoginNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginVerify" component={LoginVerify} />
    </Stack.Navigator>
  );
};


const AppNavigator = () => {

  const { state, dispatch } = useAuth();

  return (
    <NavigationContainer>
      {state.isUserAuthenticated ? (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'lightgray',
          },
          tabBarLabelStyle: {
            fontSize: 16,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                iconName = 'home';
            } else if (route.name === 'Map') {
                iconName = 'map';
            } else if (route.name === 'Account') {
                iconName = 'star';
            }

            return <Ionicons name={iconName} size={size} color={color} />; // Use Ionicons from Expo
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={LoginNavigator} />
          <Stack.Screen name="Register" component={RegisterNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
    
  );
};

export default AppNavigator;
