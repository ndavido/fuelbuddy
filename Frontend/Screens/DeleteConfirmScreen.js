import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";
import {useCombinedContext} from "../CombinedContext";

// Styling
import {
    AccountContainer, Container,
    Content,
    Main,
    TextWrapper, Wrapper,
} from '../styles/styles.js';
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6} from "../styles/text";
import {useNavigation} from "@react-navigation/native";
import {ButtonButton} from "../styles/buttons";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const DeleteConfirmScreen = () => {
    const navigate = useNavigation();

    const {logout} = useCombinedContext();

    const handleConfirmDelete = async () => {

        const handleLogout = async () => {
            try {
                await AsyncStorage.removeItem('token');

                delete axios.defaults.headers.common['Authorization'];

                await logout();

            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        try {
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                const decodedToken = jwtDecode(storedToken);
                console.log(decodedToken);

                const phone = decodedToken.sub;

                const response = await axios.post(`${url}/delete_account`, {phone_number: phone}, config);

                if (response.data.message === 'Account deleted successfully!') {
                    try {
                        handleLogout();

                    } catch (error) {
                        console.error('Error logging out:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error Deleting user account:', error);
        }
    };

    return (
        <Main>
            <MainLogo bButton={true} PageTxt='Account'/>
            <Wrapper>
                <AccountContainer>
                    <Content>
                        <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Delete Account</H3>
                        <TextWrapper>
                            <H5 tmargin='10px' bmargin='10px'>Are you Sure?</H5>
                            <H6 weight='400'>This Account Will be deleted immediately. All your data will be removed
                                from our servers.</H6>
                            <H6 bmargin='50px' weight='400'>This action is irreversible 😭.</H6>
                            <ButtonButton pos="single" iconColor="white" icon="cross" color="red"
                                  txtColor="black" txtMargin="15px" text="Delete My Account" onPress={handleConfirmDelete}/>
                            <ButtonButton pos="single" iconColor="white" icon="cross" color="#6BFF91"
                                  txtColor="black" txtMargin="15px" text="Keep My Account" onPress={() => navigate.goBack()}/>
                        </TextWrapper>
                    </Content>
                </AccountContainer>
            </Wrapper>
        </Main>
    );
};

export default DeleteConfirmScreen;
