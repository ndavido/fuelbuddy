import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styled from "styled-components/native";
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Toast from '../Components/Toast.js';
import {forwardRef, useRef, useImperativeHandle} from 'react';

//Styling
import {
    WelcomeMain,
    InputTxt,
    PhoneTxt,
    CCTxt,
    ButtonDiv,
    Content,
    Wrapper,
    Container,
    LRContainer, LRButtonDiv
} from "../styles/styles";
import {Logo} from '../styles/images';
import {H1, H2, H3, H4, H5, H6, Img, Txt} from '../styles/text.js';
import {ButtonButton} from "../styles/buttons";

const url = process.env.REACT_APP_BACKEND_URL

const PhoneContainer = styled(View)`
  flex-direction: row;
`;

const LoginScreen = () => {
    const toastRef = useRef(null);
    const [errorBorder, setErrorBorder] = useState(false);

    const showToast = () => {
        if (toastRef.current) {
            toastRef.current.success('This is a success message');
        }
    };

    const showErrorToast = (message) => {
        if (toastRef.current) {
            toastRef.current.error(message);
            console.log("error toast call")
        }
    };

    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        phone_number: '',
    });

    console.log(url)

    const countryCode = '353';

    const [message, setMessage] = useState('');

    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const fullNum = `${countryCode}${formData.phone_number}`;
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            /* TODO Remove!!! Dev Only */
            console.log(config);

            const response = await axios.post(`${url}/login`, {
                ...formData,
                phone_number: fullNum
            }, config);

            console.log(response.data);

            if (response && response.data) {
                setMessage(response.data.message);

                if (response.data.message === 'Login code sent successfully!') {
                    navigation.navigate('LoginVerify', {phone: fullNum});
                } else {
                    showErrorToast(response.data.message);
                }
            } else {
                const phoneNumberPattern = /^(08\d{8}|8\d{8})$/;
                const shortNum = formData.phone_number;
                console.log(shortNum);
                if (!phoneNumberPattern.test(shortNum)) {
                    showErrorToast('Please enter a valid phone number (e.g. 8XXXXXXXX or 08XXXXXXXX)');
                } else {
                    showErrorToast('Account with this number not found.');
                }
                setErrorBorder(true);
            }
        } catch (error) {
            const phoneNumberPattern = /^(08\d{8}|8\d{8})$/;
            const shortNum = formData.phone_number;
            console.log(shortNum);
            if (!phoneNumberPattern.test(shortNum)) {
                showErrorToast('Please enter a valid phone number (e.g. 8XXXXXXXX or 08XXXXXXXX)');
            } else {
                showErrorToast(error.response?.data?.error || 'Account with this number not found.'); // Set message to error.response.data.error
            }
            setErrorBorder(true);
        }
    };

    return (
        <WelcomeMain>
            <Logo/>
            <Toast ref={toastRef}/>
            <Wrapper>
                <Content>
                    <LRContainer>
                        <ButtonButton accessibilityLabel="Register Button" accessible={true} color="#6bff91" txtWidth="100%" width="50%"
                                  txtColor="white" text="Register" onPress={() => navigation.navigate('Register')}/>
                        <ButtonButton color="#F7F7F7" txtWidth="100%" width="50%"
                                  txtColor="black" text="Login"/>
                    </LRContainer>
                    <Container>
                        <H6 bmargin='5px'>Phone Number</H6>
                        <PhoneContainer>
                            <CCTxt
                                value="+353"
                                editable={false}
                                placeholder=""
                                onChangeText={(text) => handleChange('country_code', text)}
                            />
                            <PhoneTxt
                                accessibilityLabel="Phone Input"
                                errorBorder={errorBorder}
                                placeholder=""
                                maxLength={10}
                                onChangeText={(text) => handleChange('phone_number', text)}
                            />
                        </PhoneContainer>

                    </Container>
                    <LRButtonDiv>
                        <ButtonButton accessibilityLabel="Send Login Code" color="#6bff91" txtWidth="100%" accessible={true}
                                  txtColor="white" text="Send Login Code" onPress={handleLogin}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default LoginScreen;
