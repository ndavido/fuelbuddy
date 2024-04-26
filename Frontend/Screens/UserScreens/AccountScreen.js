import React, {useState, useEffect, useContext, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
    View,
    Text,
    Button,
    Animated,
    RefreshControl,
    Image,
    TouchableOpacity,
    Modal,
    ActivityIndicator, StyleSheet
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCombinedContext} from "../../CombinedContext";

// Styling
import {
    AccountContainer,
    Main, TopDesign, TopInfo, WrapperScroll, DeveloperTick, Container, ButtonContainer, SearchBox, Content
} from '../../styles/styles.js';
import {H1, H2, H3, H4, H5, H6, H8} from '../../styles/text.js';
import MainLogo from '../../styles/mainLogo';
import {AccountImg} from '../../styles/images';
import {ButtonButton} from "../../styles/buttons";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL;

const AccountScreen = () => {
    const navigate = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    const {token, userData, setUser, logout, updateUserFromBackend} = useCombinedContext();

    useEffect(() => {
        fetchProfilePicture();
    }, []);

    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(`${url}/load_profile_picture`, {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(response.data)
            if (response.data.profile_picture) setProfilePicture(response.data.profile_picture);

        } catch (error) {
            console.error(error);
        }
    };

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

    const handleUsersStation = async () => {
        try {
            navigate.navigate('UserStation');

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

    return (
        <Main>
            <MainLogo PageTxt='Account'/>
            <WrapperScroll refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                />
            }>
                {isLoading && (
                    <Modal visible={isLoading} transparent={true}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large"/>
                        </View>
                    </Modal>
                )}
                <TopInfo>
                    <View style={{zIndex: 1000, top: 20}}>
                        {profilePicture ? (

                                <AccountImg uri={`data:image/png;base64,${profilePicture}`}/>

                            ) :
                            <AccountImg/>
                        }
                        <H4 tmargin="10px" style={{textAlign: 'center'}}>{userData.first_name}</H4>
                        <H6 weight="400"
                            style={{
                                textAlign: 'center',
                                opacity: 0.5
                            }}>@{userData.username} {userData.roles && userData.roles.includes("Developer") &&
                            <DeveloperTick>🧑‍💻</DeveloperTick>}</H6>
                    </View>
                    <TopDesign>
                        <H8 color="#F7F7F7" tmargin="10px">Hey x</H8>
                    </TopDesign>
                </TopInfo>
                <AccountContainer>
                    <ButtonButton pos="top" series="fa5" iconColor="#b8bec2" icon="user-astronaut" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Account" onPress={handleInfo}/>
                    <ButtonButton pos="middle" series="fa5" iconColor="#b8bec2" icon="car" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Vehicle" onPress={handleVehicle}/>
                    <ButtonButton pos="bottom" series="mci" iconColor="#b8bec2" icon="gas-station" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="my Stations" onPress={handleUsersStation}/>
                    <ButtonButton pos="top" series="fa" iconColor="#b8bec2" icon="support" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="Support (NA)"/>
                    <ButtonButton pos="bottom" series="mci" iconColor="#b8bec2" icon="police-badge" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="Privacy Policy (NA)"/>

                    {/*Display the Developer button only if the user is a developer*/}
                    {userData.roles && userData.roles.includes("Developer") &&
                        <ButtonButton pos="single" iconColor="#b8bec2" icon="classic-computer" color="#FFFFFF"
                                      txtColor="black" txtMargin="15px" text="Developer Settings" onPress={handleDev}/>}

                    <ButtonButton pos="single" iconColor="#b8bec2" icon="cross" color="#FFFFFF" txtColor="black"
                                  txtMargin="15px" text="Log Out" onPress={handleLogout}/>

                    <H8 tmargin='60px' color='#b8bec2' bmargin='5px' width='100%' style={{textAlign: 'center'}}>Version
                        2.0.0</H8>
                    <H8 bmargin='25px' color='#b8bec2' width='100%' style={{textAlign: 'center'}}>Made with ❤️ by Team
                        fuelbuddy</H8>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    }
});

export default AccountScreen;