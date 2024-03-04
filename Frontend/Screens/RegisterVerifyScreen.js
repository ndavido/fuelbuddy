import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import { useCombinedContext } from "../CombinedContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const RegisterVerifyScreen = ({route}) => {
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



    const { login } = useCombinedContext();


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

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            console.log(url)

            const response = await axios.post(`${url}/register/verify`, formData, config);
            setMessage(response.data.message);

            if (response.data.message === 'Verification successful!' && response.data.access_token) {

                await AsyncStorage.setItem('token', response.data.access_token);

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

                await login(response.data.access_token);
            } else {
                console.log("uh oh")
            }
        } catch (error) {
            showErrorToast("Error");
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

                const response = await axios.post(`${url}/register`, {
                    full_name: route.params.full_name,
                    username: formData.username,
                    phone_number: route.params.phone_number
                }, config);

                if (response && response.data) {
                    showToast('Code resent successfully!');
                    updateResendCount();
                } else {
                    showErrorToast('Failed to resend code. Please try again.');
                }
            } catch (error) {
                showErrorToast('Failed to resend code. Please try again.');
            }
        } else {
            showErrorToast('Maximum resend limit reached.');
        }
        
    };

    return (
        <WelcomeMain>
            <Logo/>
            <Toast ref={toastRef} />
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
                            accessibilityLabel="Code Input"
                            placeholder=""
                            onChangeText={(text) => handleChange('code', text)}
                        />
                        <H6 tmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton accessibilityLabel="Verify Code Button" color="#6bff91" txtWidth="100%"
                                  txtColor="white" text="Register" onPress={handleVerify}/>
                        <ButtonButton accessibilityLabel="Resend Code Button" color="transparent" txtWidth="100%"
                                  txtColor="black" text="Resend Code" onPress={handleResendCode}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default RegisterVerifyScreen;