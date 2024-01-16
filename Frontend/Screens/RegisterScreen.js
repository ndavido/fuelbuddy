import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
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

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        phone_number: '',
    });

    const countryCode = '353';

    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
        switch (name) {
            case 'full_name':
                if (value.length > 20) {
                    setNameError('Name must not exceed 20 characters');
                } else {
                    setNameError(value.length < 1 ? 'Name is required' : '');
                }
                break;
            case 'username':
                if (value.length > 20) {
                    setUsernameError('Username must not exceed 20 characters');
                } else {
                    setUsernameError(value.length < 6 ? 'Username must be at least 6 characters long' : '');
                }
                break;
            case 'phone_number':
                setPhoneError(value.length < 1 ? 'Phone number is required' : '');
                break;
            default:
                break;
        }
    };


    const handleRegister = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;

            const fullNum = `${countryCode}${formData.phone_number}`;

            const user = `${formData.username}`;

            const username = user.toLowerCase();

            // Add the API key to the request headers
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                ...formData,
                username: username,
                phone_number: fullNum
            }, config);
            if (response && response.data) {
                setMessage(response.data.message);

                if (response.data.message === 'Verification code sent successfully!') {

                    navigation.navigate('RegisterVerify', {
                        username: username,
                        phone_number: fullNum,
                        full_name: formData.full_name
                    });
                }
            } else {
                // else
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
                            title='Register'
                            bgColor='F7F7F7'
                            txtColor='black'
                        />
                        <PressableButton2
                            onPress={() => navigation.navigate('Login')}
                            title='Login'
                            bgColor='#6bff91'
                            txtColor='white'
                        />
                    </LRContainer>
                    <Container>
                        <H6 bmargin='5px'>Name</H6>
                        <InputTxt
                            placeholder=""
                            onChangeText={(text) => handleChange('full_name', text)}
                        />
                        {nameError ? <Text style={{color: 'red'}}>{nameError}</Text> : null}

                        <H6 bmargin='5px'>Username</H6>
                        <InputTxt
                            placeholder=""
                            onChangeText={(text) => handleChange('username', text)}
                        />
                        {usernameError ? <Text style={{color: 'red'}}>{usernameError}</Text> : null}

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

                        {phoneError ? <Text style={{color: 'red'}}>{phoneError}</Text> : null}
                        <H6 tmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <PressableButton
                            onPress={handleRegister}
                            title='Send Register Code'
                            bgColor='#6bff91'
                        />
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default RegisterScreen;