import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
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

const DeveloperScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
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

                  const response = await axios.post('ec2-54-172-255-239.compute-1.amazonaws.com/account', { phone_number: phone }, config);

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
                    <AccountRegularInfo>
                        <AccountContent>
                            <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Developer Screen</H3>
                            <AccountTxtWrapper>
                                <H5 tmargin='10px' bmargin='10px'>Personal Information</H5>
                                <H6 bmargin='5px'>Username</H6>
                                <AccountTxt bgColor='grey' >@{userInfo.username}</AccountTxt>
                                <H6 bmargin='5px'>Name</H6>
                                <AccountTxt bgColor='#FFFFFF' >{userInfo.full_name}</AccountTxt>
                                <H6 bmargin='5px'>Phone Number</H6>
                                <AccountTxt bgColor='#FFFFFF' >{userInfo.phone_number}</AccountTxt>
                                <H6 bmargin='5px'>Email</H6>
                                <AccountTxt bgColor='#FFFFFF' >{userInfo.email}</AccountTxt>
                                <H5 tmargin='20px' bmargin='5px'>Delete Account</H5>
                                <H6 bmargin='20px' weight='400'>Not comfortable? Deleting your account will
                                    remove all data from our servers</H6>
                                <MenuButton title='Delete Account'
                                            bgColor='red'
                                            txtColor='white'
                                            onPress={handleDelete}
                                            emoji="🥲"/>
                            </AccountTxtWrapper>

                        </AccountContent>
                    </AccountRegularInfo>
                </AccountInner>
            </AccountWrapper>
        </Main2>
    );
};

export default DeveloperScreen;