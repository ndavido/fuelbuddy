import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../AuthContext';

// Styling
import {
    Main,
    ContainerWrapper,
    ContainerInner,
    ContainerContent,
    BttnDiv,
    TxtWrapper,
    WelcomeTxt,
    BttnDiv2,
    InputWrapper,
    InputTxt,
} from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

const RegisterVerifyScreen = ({route}) => {
    const navigation = useNavigation();
    const {dispatch} = useAuth(); // Get the dispatch function from the AuthContext

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

            const response = await axios.post('http://127.0.0.1:5000/register/verify', formData, config);
            setMessage(response.data.message);

            // If verification is successful, update the authentication state
            if (response.data.message === 'Verification successful!') {
                dispatch({type: 'LOGIN', payload: response.data.user}); // Update the user in the state
                navigation.navigate('Home'); // Change 'Home' to the screen you want to navigate to
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

                const response = await axios.post('http://127.0.0.1:5000/register', {
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
        <Main>
            <Logo/>
            <ContainerWrapper>
                <ContainerInner>
                    <ContainerContent>
                        <InputWrapper>
                            <Text>Name {route.params.full_name}</Text>
                            <Text>6-digits code sent to +{route.params.phone_number}</Text>
                            <Text>Username</Text>
                            <InputTxt
                                placeholder=""
                                value={route.params.username}
                                editable={false}
                                onChangeText={(text) => handleChange('username', text)}
                                readonly
                            />
                            <Text>Verification Code</Text>
                            <InputTxt
                                placeholder=""
                                onChangeText={(text) => handleChange('code', text)}
                            />
                            <Text>{message}</Text>
                            <PressableButton
                                onPress={handleResendCode}
                                title="Resend Code"
                                bgColor="#6bff91"
                            />
                        </InputWrapper>
                        <BttnDiv>
                            <PressableButton
                                onPress={handleVerify}
                                title="Verify"
                                bgColor="#6bff91"
                            />
                        </BttnDiv>
                    </ContainerContent>
                </ContainerInner>
            </ContainerWrapper>
        </Main>
    );
};

export default RegisterVerifyScreen;