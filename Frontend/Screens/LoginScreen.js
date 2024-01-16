import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styled from "styled-components/native";
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

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

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                ...formData,
                phone_number: fullNum
            }, config);
            console.log(response.data)
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
        <WelcomeMain>
            <Logo/>
            <Wrapper>
                <Content>
                    <LRContainer>
                        <PressableButton2
                            onPress={() => navigation.navigate('Register')}
                            title='Register'
                            bgColor='#6bff91'
                            txtColor='white'
                        />
                        <PressableButton2
                            title='Login'
                            bgColor='F7F7F7'
                            txtColor='black'
                        />
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
                                placeholder=""
                                maxLength={10}
                                onChangeText={(text) => handleChange('phone_number', text)}
                            />
                        </PhoneContainer>

                        <H6>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <PressableButton
                            onPress={handleLogin}
                            title='Send Login Code'
                            bgColor='#6bff91'
                        />
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default LoginScreen;
