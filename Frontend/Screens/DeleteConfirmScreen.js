import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

// Styling
import {
    Main2,
} from '../styles/wrapper';
import {
    AccountWrapper,
    AccountInner,
    AccountContent,
    AccountTopInfo,
    AccountBottomInfo,
    AccountTitle,
    AccountRegularInfo,
    AccountTxt,
    AccountTxtWrapper,
    AccountUsername,
    DeveloperTick
} from '../styles/accountPage';
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';
import {MenuButton} from "../styles/accountButton";
import {H3, H4, H5, H6} from "../styles/text";
import {useNavigation} from "@react-navigation/native";

const DeleteConfirmScreen = () => {
    const navigate = useNavigation();
        const handleConfirmDelete = async () => {

            const apiKey = process.env.REACT_NATIVE_API_KEY;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };
            const handleLogout = async () => {
                try {
                    // Clear the token stored in AsyncStorage
                    await AsyncStorage.removeItem('token');

                    delete axios.defaults.headers.common['Authorization'];

                    navigation.navigate('Welcome');

                } catch (error) {
                    console.error('Error logging out:', error);
                }
            };

            try {
                const apiKey = process.env.REACT_NATIVE_API_KEY;

                // Add the API key to the request headers
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

                    const response = await axios.post('http://127.0.0.1:5000/delete_account', {phone_number: phone}, config);
                    
                    if (response.data.message === 'Account deleted successfully!') {
                        try {
                            // Clear the token stored in AsyncStorage
                            handleLogout();

                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        return (
        <Main2>
            <MainLogo bButton={true} />
            <AccountWrapper>
                <AccountInner>
                    <AccountRegularInfo>
                        <AccountContent>
                            <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Delete Account</H3>
                            <AccountTxtWrapper>
                                <H5 tmargin='10px' bmargin='10px'>Are you Sure?</H5>
                                <H6 weight='400'>This Account Will be deleted immediately. All your data will be removed from our servers.</H6>
                                <H6 bmargin='50px' weight='400'>This action is irreversible 😭.</H6>
                                <MenuButton title='Delete My Account'
                                            bgColor='red'
                                            txtColor='white'
                                            onPress={handleConfirmDelete}
                                            emoji="😢"/>
                                <MenuButton title='Keep My Account'
                                            bgColor='#6BFF91'
                                            txtColor='white'
                                            onPress={() => navigate.goBack()}
                                            emoji="🥹"/>
                            </AccountTxtWrapper>

                        </AccountContent>
                    </AccountRegularInfo>
                </AccountInner>
            </AccountWrapper>
        </Main2>
    );
};

export default DeleteConfirmScreen;
