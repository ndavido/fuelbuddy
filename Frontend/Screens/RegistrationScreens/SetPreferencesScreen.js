import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, RefreshControl} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../../styles/mainLogo';
import {H3, H4, H5, H6} from "../../styles/text";
import {
    AccountContainer,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main,
    TextContainer,
    WelcomeMain,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton} from "../../styles/buttons";
import {Logo} from "../../styles/images";
import Slider from "@react-native-community/slider";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const SetPreferencesScreen = () => {
    const navigation = useNavigation();
    const {userData, setUser, updateUserFromBackend, token} = useCombinedContext();
    const [tempRadius, setTempRadius] = useState(userData.radius_preferences || 30);

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleUpdateRadius = async (radius) => {
        try {
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            };

            const data = {
                radius_preferences: radius,
            };

            const updatedUserData = {
                ...userData,
                radius_preferences: radius,
            };

            const response = await axios.patch(`${url}/save_preferences`, data, config);

            if (response.data) {
                console.log("Update successful");

                await setUser({...updatedUserData});

            } else {
                console.log("Update unsuccessful");
            }
        } catch (error) {
            console.error('Error updating user Radius:', error);
        }
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedSetTempRadius = debounce(setTempRadius, 150);

    const handleFinish = async () => {
        try {

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            };

            const updatedUserData = {
                ...userData,
                reg_full: true,
            };

            const response = await axios.get(`${url}/complete_registration`, config);

            if (response.data && response.data.message === 'Account updated successfully') {
                setUser({...updatedUserData});

            } else {
                console.log("Update unsuccessful");
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    useEffect(() => {
        updateUserFromBackend();
    }, []);

    return (
        <WelcomeMain>
            <WrapperScroll>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Set Preferences</H3>
                        <>
                            <H5>Map Radius</H5>
                            <H6 style={{opacity: 0.6}}>Higher Kilometers can cause performance Issues</H6>
                            <View>
                                <Slider
                                    value={userData.radius_preferences}
                                    onValueChange={debouncedSetTempRadius}
                                    minimumValue={30}
                                    maximumValue={400}
                                    step={10}
                                />
                                <H5>Radius: {tempRadius}km</H5>
                                <ButtonContainer style={{display: 'flex'}}>
                                    <ButtonButton place="right" txtWidth="100%" width="40%" text="Save Radius"
                                                  onPress={() => handleUpdateRadius(tempRadius)}
                                                  disabled={!userData.radius_preferences || tempRadius === userData.radius_preferences}/>
                                </ButtonContainer>
                            </View>
                        </>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Finish" accessibilityLabel="Finish" onPress={handleFinish}
                                      accessible={true}/>
                    </LRButtonDiv>
                </Content>
            </WrapperScroll>
        </WelcomeMain>
    );
};

export default SetPreferencesScreen;