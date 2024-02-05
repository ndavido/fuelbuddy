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
    AccountContainer,
    Main, TopDesign, TopInfo, WrapperScroll,
} from '../styles/styles.js';
import {
    DeveloperTick
} from '../styles/accountPage';
import {H1, H2, H3, H4, H5, H6, H8} from '../styles/text.js';
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';
import {ButtonButton} from "../styles/AnimatedIconButton";

const AccountScreen = () => {
    const navigate = useNavigation();
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const {logout} = useAuth();

    const handleLogout = async () => {
        try {
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
                <TopInfo>
                    <View style={{zIndex: 1000, top: 30}}>
                        <AccountImg/>
                        <H4 tmargin="10px" style={{textAlign: 'center'}}>{userInfo.full_name}</H4>
                        <H6 weight="400"
                            style={{textAlign: 'center'}}>@{userInfo.username} {userInfo.roles && userInfo.roles.includes("Developer") &&
                            <DeveloperTick>🧑‍💻</DeveloperTick>}</H6>
                    </View>
                    <TopDesign>
                        <H8 color="#F7F7F7" tmargin="10px">Hey x</H8>
                    </TopDesign>
                </TopInfo>
                <AccountContainer>
                    <ButtonButton pos="top" series="fa5" iconColor="#b8bec2" icon="user-astronaut" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Info" onPress={handleInfo}/>
                    <ButtonButton pos="bottom" series="fa5" iconColor="#b8bec2" icon="car" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Vehicle" onPress={handleVehicle}/>
                    <ButtonButton pos="top" series="mci" iconColor="#b8bec2" icon="gas-station" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Stations (NA)"/>
                    <ButtonButton pos="middle" series="mci" iconColor="#b8bec2" icon="routes" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Routes (NA)"/>
                    <ButtonButton pos="bottom" series="fa5" iconColor="#b8bec2" icon="user-friends" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Friends" onPress={handleFriends}/>
                    <ButtonButton pos="single" series="fa" iconColor="#b8bec2" icon="support" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="Support (NA)"/>

                    {/*Display the Developer button only if the user is a developer*/}
                    {userInfo.roles && userInfo.roles.includes("Developer") &&
                        <ButtonButton pos="single" iconColor="#b8bec2" icon="classic-computer" color="#FFFFFF"
                                      txtColor="black" txtMargin="15px" text="Developer Settings" onPress={handleDev}/>}

                    <ButtonButton pos="single" iconColor="#b8bec2" icon="cross" color="#FFFFFF" txtColor="black"
                                  txtMargin="15px" text="Log Out" onPress={handleLogout}/>

                    <H8 tmargin='60px' bmargin='5px' width='100%' style={{textAlign: 'center'}}>Version
                        Alpha</H8>
                    <H8 bmargin='25px' width='100%' style={{textAlign: 'center'}}>Made with 💖 by Team
                        fuelbuddy</H8>

                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default AccountScreen;