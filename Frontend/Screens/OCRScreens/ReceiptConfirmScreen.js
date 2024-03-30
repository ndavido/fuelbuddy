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

const url = process.env.REACT_APP_BACKEND_URL

const ReceiptConfirmScreen = () => {
    const navigation = useNavigation();
    const {userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleFinish = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            navigation.navigate('OCR');

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
                        <H3 tmargin='20px' bmargin='20px'>All Set</H3>
                        <>
                            <H6 bmargin='5px'>Ty</H6>
                        </>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Finish" onPress={handleFinish}/>
                    </LRButtonDiv>
                </Content>
            </WrapperScroll>
        </WelcomeMain>
    );
};

export default ReceiptConfirmScreen;