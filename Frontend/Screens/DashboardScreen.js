import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {jwtDecode} from "jwt-decode";

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

const DashboardScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Make an API request to fetch user account information from the backend
        const fetchUserInfo = async () => {
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

                    // TODO - Remove this console.log DEV only!!!
                    console.log(decodedToken);

                    const phone = decodedToken.sub;

                    const response = await axios.post('http://127.0.0.1:5000/account', {phone_number: phone}, config);

                    if (response.data && response.data.user) {
                        setUserInfo(response.data.user); // Set the user info directly

                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Main2>
            <MainLogo/>
            <AccountWrapper>
                <AccountInner>
                    <AccountTopInfo>
                        <AccountContent>
                            <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Dashboard</H3>
                        </AccountContent>
                    </AccountTopInfo>
                    <AccountRegularInfo>
                        <AccountContent>
                            <AccountTxtWrapper>
                                <H6 bmargin='5px'>Username</H6>
                                <H3>@{userInfo.username}</H3>
                            </AccountTxtWrapper>

                        </AccountContent>
                    </AccountRegularInfo>
                </AccountInner>
            </AccountWrapper>
        </Main2>
    );
};

export default DashboardScreen;