import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import {H3, H4, H5, H6} from "../styles/text";
import {
    AccountContainer,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main,
    TextContainer,
    WelcomeMain,
    WrapperScroll
} from "../styles/styles";
import {ButtonButton} from "../styles/buttons";

const url = process.env.REACT_APP_BACKEND_URL

const CompleteVehicleScreen = () => {
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleSave = async () => {
        navigation.navigate('SetPreferences');
    };

    const handleSkip = async () => {
        navigation.navigate('SetPreferences');
    }

    useEffect(() => {
        updateUserFromBackend();
    }, []);

    return (
        <WelcomeMain>
            <WrapperScroll>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Complete Vehicle</H3>
                        <>
                            <H6 bmargin='5px'>Make</H6>
                            <TextContainer bgColor='grey' >CAR MAKE</TextContainer>
                            <H6 bmargin='5px'>Model</H6>
                            <TextContainer bgColor='#FFFFFF' >CAR MODEL</TextContainer>
                            <H6 bmargin='5px'>Year</H6>
                            <TextContainer bgColor='#FFFFFF' >CAR YEAR</TextContainer>
                            <H6 bmargin='5px'>Trim</H6>
                            <TextContainer bgColor='#FFFFFF' >CAR TRIM</TextContainer>
                            <H6 bmargin='5px'>Average Km/l</H6>
                            <TextContainer bgColor='#FFFFFF' >CAR KM</TextContainer>
                        </>
                        <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Continue" onPress={handleSave}/>
                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black" text="Skip" onPress={handleSkip}/>
                    </LRButtonDiv>
                </Content>
            </WrapperScroll>
        </WelcomeMain>
    );
};

export default CompleteVehicleScreen;