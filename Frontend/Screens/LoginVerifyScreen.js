import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import {useCombinedContext} from "../CombinedContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Toast from '../Components/Toast.js';
import {forwardRef, useImperativeHandle} from 'react';

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

const LoginVerifyScreen = ({route}) => {
    const toastRef = useRef(null);
    const [errorBorder, setErrorBorder] = useState(false);
    
    const showToast = (message) => {
        if (toastRef.current) {
          toastRef.current.success(message);
        }
      };
    
      const showErrorToast = (message) => {
        if (toastRef.current) {
          toastRef.current.error(message);
          console.log("error toast call")
        }
      };

    const navigation = useNavigation();
    const {login} = useCombinedContext();

    const [formData, setFormData] = useState({
        phone_number: route.params.phone,
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

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post(`${url}/login/verify`, formData, config);

            if (response.data.message === 'Login successful!' && response.data.access_token) {

                await AsyncStorage.setItem('token', response.data.access_token);

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                await login(response.data.access_token);
                
            } else {
                console.log("Uh Oh")
            }
        } catch (error) {
            showErrorToast(error.response.data.error);
        }
    };

    const updateResendCount = () => {
        setResendCount(resendCount + 1);
    };

    const handleResendCode = async () => {
        if (resendCount < maxResendLimit) {
            try {
                const apiKey = process.env.REACT_NATIVE_API_KEY;

                const config = {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                };

                const response = await axios.post(`${url}/login`, { phone_number: formData.phone_number, }, config );

                if (response && response.data) {                   
                    showToast('Code resent successfully!');
                    updateResendCount();
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
            <Toast ref={toastRef} />
            <Wrapper>
                <Content>
                    <Container>
                        <H6 tmargin='229px' bmargin='40px'>6-digits code sent to +{route.params.phone}</H6>
                        <H6 bmargin='5px'>Verification Code</H6>
                        <InputTxt
                            accessibilityLabel="Code Input"
                            placeholder=""
                            onChangeText={(text) => handleChange('code', text)}
                        />
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton accessibilityLabel="Verify Code Button" color="#6bff91" txtWidth="100%"
                                  txtColor="white" text="Verify" onPress={handleVerify}/>
                        <ButtonButton accessibilityLabel="Resend Code Button" color="transparent" txtWidth="100%"
                                  txtColor="black" text="Resend Code" onPress={handleResendCode}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default LoginVerifyScreen;