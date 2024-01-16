import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';
import {H1, H2, H3, H4, H5, H6, Img, Txt} from '../styles/text.js';


const RegisterVerifyScreen = ({route}) => {
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: route.params.username,
        code: '',
    });

    const [message, setMessage] = useState('');
    const [resendCount, setResendCount] = useState(0);
    const maxResendLimit = 2;

    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
    };

    const handleVerify = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;

            // Add the API key to the request headers
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post('${process.env.BACKEND_URL}/register/verify', formData, config);
            setMessage(response.data.message);

            // If verification is successful, update the authentication state
            if (response.data.message === 'Verification successful!' && response.data.access_token) {
                // Store the received access token securely
                await AsyncStorage.setItem('token', response.data.access_token);

                // Attach the access token to the request headers for subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                await login(response.data.access_token);
            } else {
                console.log("Uh Oh")
            }
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    const updateResendCount = () => {
        setResendCount(resendCount + 1);
    };

    const handleResendCode = async () => {
        if (resendCount < maxResendLimit) {
            try {
                const apiKey = process.env.REACT_NATIVE_API_KEY;

                // Add the API key to the request headers
                const config = {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                };

                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                    full_name: route.params.full_name,
                    username: formData.username,
                    phone_number: route.params.phone_number
                }, config);

                // Check the response status or message to confirm code resent successfully
                if (response && response.data) {
                    setMessage('Code resent successfully!');
                    updateResendCount(); // Increment resend count
                } else {
                    setMessage('Failed to resend code. Please try again.');
                }
            } catch (error) {
                setMessage('Failed to resend code. Please try again.');
            }
        } else {
            setMessage('Maximum resend limit reached.');
        }
    };

    return (
        <WelcomeMain>
            <Logo/>
            <Wrapper>
                <Content>
                    <Container>
                        <H6 tmargin='229px' bmargin='40px'>6-digits code sent to +{route.params.phone_number}</H6>
                        <H6 bmargin='5px'>Username</H6>
                        <InputTxt
                            placeholder=""
                            value={route.params.username}
                            editable={false}
                            onChangeText={(text) => handleChange('username', text)}
                            readonly
                        />
                        <H6 bmargin='5px'>Verification Code</H6>
                        <InputTxt
                            placeholder=""
                            onChangeText={(text) => handleChange('code', text)}
                        />
                        <H6 tmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <PressableButton
                            onPress={handleVerify}
                            title="Register"
                            bgColor="#6bff91"
                        />
                        <PressableButton
                            onPress={handleResendCode}
                            title="Resend Code"
                            bgColor="white"
                            txtColor="black"
                        />
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default RegisterVerifyScreen;