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
import {PanGestureHandler, GestureHandlerRootView, State} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from '@gorhom/bottom-sheet';
import {useCombinedContext} from "../CombinedContext";
import * as ImagePicker from "expo-image-picker";
import {Camera} from "expo-camera";
import {jwtDecode} from "jwt-decode";

// Styling
import {
    AccountContainer,
    Main, TopDesign, TopInfo, WrapperScroll, DeveloperTick, Container, ButtonContainer, SearchBox, Content
} from '../styles/styles.js';
import {H1, H2, H3, H4, H5, H6, H8} from '../styles/text.js';
import MainLogo from '../styles/mainLogo';
import {AccountImg} from '../styles/images';
import {ButtonButton} from "../styles/buttons";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL;

const AccountScreen = () => {
    const navigate = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const bottomSheetRef = useRef(null);

    const {token, userData, setUser, logout, updateUserFromBackend} = useCombinedContext();

    const requestPermissions = async () => {
        const {cameraStatus} = await Camera.requestCameraPermissionsAsync();
        const {mediaLibraryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    };

    const openImageSheet = () => {
        bottomSheetRef.current.expand();
    };

    const closeImageSheet = () => {
        bottomSheetRef.current.close();
    };

    const pickImage = async () => {
        try {
            const hasPermissions = requestPermissions();
            if (!hasPermissions) {
                console.error('Permissions not granted');
            } else {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 4],
                    quality: 1,
                });

                if (!result.canceled) {
                    setLoading(true)
                    await setImageUri(result.assets[0].uri);
                    console.log('imageUri:', imageUri);
                    setLoading(false);
                    openImageSheet();
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const uploadProfilePicture = async () => {
        if (!imageUri) {
            return;
        }

        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result.replace(/^data:image\/\w+;base64,/, "");

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({profile_picture: base64data})
                };

                console.log('requestOptions:', requestOptions);
                const backendResponse = await fetch(`${url}/upload_profile_picture`, requestOptions);

                if (!backendResponse.ok) {
                    console.error('Error sending image to backend:', await backendResponse.text());
                    return;
                } else {
                    const responseData = await backendResponse.json();
                    updateUserFromBackend();
                    console.log('Response:', responseData);
                    setImageUri(null);
                }
            }
        } catch (error) {
            console.error('Error sending image to backend:', error);
        } finally {
            closeImageSheet();
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
                    <View style={{zIndex: 1000, top: 30}}>
                        {userData.profile_picture ? (
                            <TouchableOpacity onPress={pickImage}>
                                <AccountImg uri={`data:image/png;base64,${userData.profile_picture}`}/>
                            </TouchableOpacity>
                        ) : <AccountImg/>}
                        <H4 tmargin="10px" style={{textAlign: 'center'}}>{userData.first_name}</H4>
                        <H6 weight="400"
                            style={{textAlign: 'center'}}>@{userData.username} {userData.roles && userData.roles.includes("Developer") &&
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
                    <ButtonButton pos="single" series="mci" iconColor="#b8bec2" icon="police-badge" color="#FFFFFF"
                                  txtColor="black" txtMargin="15px" text="Privacy Policy (NA)"/>

                    {/*Display the Developer button only if the user is a developer*/}
                    {userData.roles && userData.roles.includes("Developer") &&
                        <ButtonButton pos="single" iconColor="#b8bec2" icon="classic-computer" color="#FFFFFF"
                                      txtColor="black" txtMargin="15px" text="Developer Settings" onPress={handleDev}/>}

                    <ButtonButton pos="single" iconColor="#b8bec2" icon="cross" color="#FFFFFF" txtColor="black"
                                  txtMargin="15px" text="Log Out" onPress={handleLogout}/>

                    <H8 tmargin='60px' color='#b8bec2' bmargin='5px' width='100%' style={{textAlign: 'center'}}>Version
                        Alpha</H8>
                    <H8 bmargin='25px' color='#b8bec2' width='100%' style={{textAlign: 'center'}}>Made with ❤️ by Team
                        fuelbuddy</H8>
                </AccountContainer>
                <BottomSheet snapPoints={['99%', '99%']}
                             enablePanDownToClose={true}
                             index={-1}
                             ref={bottomSheetRef}
                             backgroundStyle={{
                                 backgroundColor: '#FFFFFF',
                             }}>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Confirm Profile Picture</H3>
                        <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                            <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                <ButtonButton icon="check" color="#6BFF91" iconColor="#FFFFFF" text="Confirm" accessible={true}
                                              accessibilityLabel="Confirm PP Button"
                                              onPress={uploadProfilePicture} disabled={!imageUri}/>
                            </View>
                        </ButtonContainer>
                        <Content>
                            {imageUri && <Image source={{uri: imageUri}} style={{
                                flex: 1,
                                width: 300,
                                height: 300,
                                resizeMode: 'contain',
                                position: 'absolute',
                            }}/>}
                        </Content>
                    </Container>
                </BottomSheet>
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