import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

// Styled Components and other imports
import {
    Main,
    ContainerWrapper,
    ContainerInner,
    ContainerContent,
    BttnDiv,
    BttnDiv2,
    InputWrapper,
    PhoneTxt,
    CCTxt
} from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';
import styled from "styled-components/native";

const PhoneContainer = styled(View)`
  flex-direction: row;
`;

const LoginScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        phone_number: '',
    });

    const countryCode = '353';

    const [message, setMessage] = useState('');

    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;

            const fullNum = `${countryCode}${formData.phone_number}`;

            // Add the API key to the request headers
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            /* TODO Remove!!! Dev Only */
            console.log(config);

            const response = await axios.post('ec2-54-172-255-239.compute-1.amazonaws.com/login', {
                ...formData,
                phone_number: fullNum
            }, config);
            if (response && response.data) {
                setMessage(response.data.message);

                if (response.data.message === 'Login code sent successfully!') {
                    navigation.navigate('LoginVerify', {phone: fullNum}); // Navigate to code verification screen
                }
            } else {
                // Handle other cases or errors if needed
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <Main>
            <Logo/>
            <ContainerWrapper>
                <ContainerInner>
                    <ContainerContent>
                        <BttnDiv2>
                            <PressableButton2
                                onPress={() => navigation.navigate('Register')}
                                title='Register'
                                bgColor='#6bff91'
                                txtColor='white'
                            />
                            <PressableButton2

                                title='Login'
                                bgColor='white'
                                txtColor='black'
                            />
                        </BttnDiv2>
                        <InputWrapper>
                            <Text>Phone Number</Text>
                            <PhoneContainer>
                                <CCTxt
                                    value="+353"
                                    editable={false}
                                    placeholder=""
                                    onChangeText={(text) => handleChange('country_code', text)}
                                />
                                <PhoneTxt
                                    placeholder=""
                                    maxLength={10}
                                    onChangeText={(text) => handleChange('phone_number', text)}
                                />
                            </PhoneContainer>

                            <Text>{message}</Text>
                            <BttnDiv>
                                <PressableButton
                                    onPress={handleLogin}
                                    title='Send Login Code'
                                    bgColor='#6bff91'
                                />
                            </BttnDiv>
                        </InputWrapper>
                    </ContainerContent>
                </ContainerInner>
            </ContainerWrapper>
        </Main>
    );
};

export default LoginScreen;
