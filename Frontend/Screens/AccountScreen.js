import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button, Animated, RefreshControl} from 'react-native';
import axios from 'axios';
import {PanGestureHandler, GestureHandlerRootView, State} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";
import {useAuth} from '../AuthContext';

// Styling
import {
    DashboardContainer,
    Main, WrapperScroll,
} from '../styles/styles.js';
import {
    AccountWrapper,
    AccountInner,
    AccountContent,
    AccountTopInfo,
    AccountBottomInfo,
    AccountTitle,
    AccountTxt,
    AccountTxtWrapper,
    AccountUsername,
    DeveloperTick
} from '../styles/accountPage';
import {H1, H2, H3, H4, H5, H6, H8} from '../styles/text.js';
import {MenuButton, MenuButtonTop, MenuButtonMiddle, MenuButtonBottom} from "../styles/accountButton";
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';

const AccountScreen = () => {
    const navigate = useNavigation();
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const {logout} = useAuth();

    const translateY = new Animated.Value(0);

    const onGestureEvent = Animated.event(
        [{nativeEvent: {translationY: translateY}}],
        {useNativeDriver: true}
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            let {translationY, velocityY} = event.nativeEvent;

            // Define the swipe threshold and target position
            const SWIPE_THRESHOLD = 100;
            const TARGET_TRANSLATE_Y = -140;

            if (translationY < -SWIPE_THRESHOLD) {
                // Swipe up
                Animated.spring(translateY, {
                    toValue: TARGET_TRANSLATE_Y,
                    useNativeDriver: true,
                }).start();
            } else if (translationY > SWIPE_THRESHOLD && velocityY > 0) {
                // Swipe down
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    const handleLogout = async () => {
        try {
            // Clear the token stored in AsyncStorage
            await AsyncStorage.removeItem('token');

            delete axios.defaults.headers.common['Authorization'];

            await logout();

        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleInfo = async () => {
        try {
            navigate.navigate('PersonalInfo');

        } catch (error) {
            console.error('Error Loading Information:', error);
        }
    };

    const handleVehicle = async () => {
        try {
            navigate.navigate('Vehicle');

        } catch (error) {
            console.error('Error Loading Vehicle Information:', error);
        }
    };

    const handleFriends = async () => {
        try {
            navigate.navigate('Friends');

        } catch (error) {
            console.error('Error Loading Friends:', error);
        }
    }

    const handleDev = async () => {
        try {
            navigate.navigate('Developer');

        } catch (error) {
            console.error('Error Loading Dev Menu:', error);
        }
    };

    useEffect(() => {
        // Make an API request to fetch user account information from the backend
        const fetchUserInfo = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                if (userDataJson) {
                    setUserInfo(JSON.parse(userDataJson));
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Main>
            <MainLogo PageTxt='Account'/>
            <WrapperScroll refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                />
            }>

                <AccountTopInfo>
                    <AccountContent>
                        <AccountImg/>
                        <H5>{userInfo.full_name}</H5>
                        <H6>@{userInfo.username} {userInfo.roles && userInfo.roles.includes("Developer") &&
                            <DeveloperTick>🧑‍💻</DeveloperTick>}</H6>
                    </AccountContent>
                </AccountTopInfo>
                <DashboardContainer>
                    <AccountContent>
                        <AccountTxtWrapper>
                            <MenuButtonTop title='my Information'
                                           bgColor='white'
                                           txtColor='black'
                                           emoji="🕴️"
                                           onPress={handleInfo}/>
                            <MenuButtonBottom title='my vehicle'
                                              bgColor='white'
                                              txtColor='black'
                                              emoji="🚗"
                                              onPress={handleVehicle}/>
                            <MenuButtonTop title='my stations (NA)'
                                           bgColor='white'
                                           txtColor='black'
                                           emoji="⛽"/>
                            <MenuButtonMiddle title='my savings (NA)'
                                              bgColor='white'
                                              txtColor='black'
                                              emoji="💵"/>
                            <MenuButtonBottom title='my friends'
                                              bgColor='white'
                                              txtColor='black'
                                              emoji="🧑‍🤝‍🧑"
                                              onPress={handleFriends}/>
                            <MenuButton title='Privacy Settings (NA)'
                                        bgColor='white'
                                        txtColor='black'
                                        emoji="🔏"/>
                            <MenuButton title='Support (NA)'
                                        bgColor='white'
                                        txtColor='black'
                                        emoji="👷‍♂️"/>

                            {/*Display the Developer button only if the user is a developer*/}
                            {userInfo.roles && userInfo.roles.includes("Developer") &&
                                <MenuButton title='Developer Menu'
                                            bgColor='white'
                                            txtColor='black'
                                            onPress={handleDev}
                                            emoji="✨"/>}

                            <MenuButton title='Log Out'
                                        bgColor='white'
                                        txtColor='black'
                                        onPress={handleLogout}
                                        emoji="🥲"/>
                            <H8>Version 0.1</H8>
                        </AccountTxtWrapper>
                    </AccountContent>
                </DashboardContainer>

            </WrapperScroll>
        </Main>
    );
};

export default AccountScreen;