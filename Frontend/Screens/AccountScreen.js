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
    AccountTxt,
    AccountTxtWrapper,
    AccountUsername,
    DeveloperTick
} from '../styles/accountPage';
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';

const AccountScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

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
                  console.log(decodedToken);

                  const phone = decodedToken.sub;

                  const response = await axios.post('http://127.0.0.1:5000/account', { phone_number: phone }, config);

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
                            <AccountTitle>Account</AccountTitle>
                            <AccountImg/>
                            <AccountUsername>@{userInfo.username} {userInfo.roles && userInfo.roles.includes("Developer") &&
                                <DeveloperTick>🧑‍💻</DeveloperTick>}</AccountUsername>
                        </AccountContent>
                    </AccountTopInfo>
                    <AccountBottomInfo>
                        <AccountContent>
                            <AccountTxtWrapper>
                                <Text>Name</Text>
                                <AccountTxt>{userInfo.full_name}</AccountTxt>
                                <Text>Phone Number</Text>
                                <AccountTxt>{userInfo.phone_number}</AccountTxt>
                                <Text>Email</Text>
                                <AccountTxt>{userInfo.email}</AccountTxt>
                            </AccountTxtWrapper>
                            <Button title="Logout" onPress={handleLogout}/>
                        </AccountContent>
                    </AccountBottomInfo>
                </AccountInner>
            </AccountWrapper>
        </Main2>
    );
};

export default AccountScreen;
