import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

// Styling
import {
    Content,
    Main, TextWrapper, Wrapper,
} from '../styles/styles';
import {
    AccountRegularInfo,
    AccountTxt,
} from '../styles/accountPage';
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6} from "../styles/text";

const url = process.env.REACT_APP_BACKEND_URL

const VehicleScreen = () => {
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

                  const response = await axios.post(`${url}/account`, { phone_number: phone }, config);

                  if (response.data && response.data.user) {
                    setUserInfo(response.data.user);

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
            <MainLogo bButton={true} PageTxt='Vehicle'/>
            <Wrapper>
                <AccountRegularInfo>
                    <Content>
                        <TextWrapper>
                            <H5 tmargin='10px' bmargin='10px'>My Car</H5>
                            <H6 bmargin='5px'>Make</H6>
                            <AccountTxt bgColor='grey' >CAR MAKE</AccountTxt>
                            <H6 bmargin='5px'>Model</H6>
                            <AccountTxt bgColor='#FFFFFF' >CAR MODEL</AccountTxt>
                            <H6 bmargin='5px'>Average Km/l</H6>
                            <AccountTxt bgColor='#FFFFFF' >CAR KM</AccountTxt>
                        </TextWrapper>
                    </Content>
                </AccountRegularInfo>
            </Wrapper>
        </Main>
    );
};

export default VehicleScreen;