import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

// Styling
import {
    Main,
} from '../styles/styles';
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

const VehicleScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
    };

    useEffect(() => {
        // TODO Make an API request to fetch user account information from the backend
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
                <AccountRegularInfo>
                    <AccountContent>
                        <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Vehicle</H3>
                        <AccountTxtWrapper>
                            <H5 tmargin='10px' bmargin='10px'>My Car</H5>
                            <H6 bmargin='5px'>Make</H6>
                            <AccountTxt bgColor='grey' >CAR MAKE</AccountTxt>
                            <H6 bmargin='5px'>Model</H6>
                            <AccountTxt bgColor='#FFFFFF' >CAR MODEL</AccountTxt>
                            <H6 bmargin='5px'>Average Km/l</H6>
                            <AccountTxt bgColor='#FFFFFF' >CAR KM</AccountTxt>
                        </AccountTxtWrapper>
                    </AccountContent>
                </AccountRegularInfo>
            </AccountWrapper>
        </Main2>
    );
};

export default VehicleScreen;