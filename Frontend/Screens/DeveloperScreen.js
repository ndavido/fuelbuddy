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

const DeveloperScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
    };

    useEffect(() => {
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

                  const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/account`, { phone_number: phone }, config);

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
        <Main>
            <MainLogo bButton={true}/>
            <AccountWrapper>
                    <AccountRegularInfo>
                        <AccountContent>
                            <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Developer Screen</H3>
                            <AccountTxtWrapper>

                            </AccountTxtWrapper>

                        </AccountContent>
                    </AccountRegularInfo>
            </AccountWrapper>
        </Main>
    );
};

export default DeveloperScreen;