import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import axios from 'axios';

//Styling
import { Main, ContainerWrapper, ContainerInner, ContainerContent, BttnDiv, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt, PhoneTxt, CCTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

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
    setFormData({ ...formData, [name]: value });
    switch (name) {
      case 'full_name':
        setNameError(value.length < 1 ? 'Name is required' : '');
        break;
      case 'username':
        setUsernameError(value.length < 6 ? 'Username must be at least 6 characters long' : '');
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

    // Add the API key to the request headers
    const config = {
      headers: {
        'X-API-Key': apiKey,
      },
    };

    const response = await axios.post('http://127.0.0.1:5000/register', { ...formData, phone_number: fullNum }, config);
    if (response && response.data) {
      setMessage(response.data.message);

      if (response.data.message === 'Verification code sent successfully!') {
        
        navigation.navigate('RegisterVerify', { username: formData.username, phone: fullNum });
      }
    } else {
      // else
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
                  title='Register'
                  bgColor='white'
                  txtColor='black'
                />
                <PressableButton2
                  onPress={() => navigation.navigate('Login')}
                  title='Login'
                  bgColor='#6bff91'
                  txtColor='white'
                />
              </BttnDiv2>
              <InputWrapper>

                <Text>Name</Text>
                <InputTxt
                  placeholder=""
                  onChangeText={(text) => handleChange('full_name', text)}
                />
                {nameError ? <Text style={{ color: 'red' }}>{nameError}</Text> : null}

                <Text>Username</Text>
                <InputTxt
                  placeholder=""
                  onChangeText={(text) => handleChange('username', text)}
                />
                {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}

                <Text>Phone Number</Text>
                <PhoneContainer>
                  <CCTxt
                  value = "+353"
                  editable = {false}
                  placeholder=""
                  onChangeText={(text) => handleChange('country_code', text)}
                  />

                  <PhoneTxt
                    placeholder=""
                    maxLength={10}
                    onChangeText={(text) => handleChange('phone_number', text)}
                  />
                </PhoneContainer>

                {phoneError ? <Text style={{ color: 'red' }}>{phoneError}</Text> : null}
                <Text>{message}</Text>
              </InputWrapper>
              
              <BttnDiv>
                <PressableButton
                  onPress={handleRegister}
                  title='Send Register Code'
                  bgColor='#6bff91'
                />
              </BttnDiv>
            </ContainerContent>
          </ContainerInner>
        </ContainerWrapper>
    </Main>
  );
};

export default RegisterScreen;