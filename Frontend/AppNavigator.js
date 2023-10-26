import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo's vector-icons

import HomeScreen from './Screens/HomeScreen';
import Map from './Screens/MapScreen';
import AccountScreen from './Screens/AccountScreen';
import MapScreen from './Screens/MapScreen';
import RegisterScreen from './Screens/RegisterScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
