import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import * as SecureStore from 'expo-secure-store';

// Styling
import { Main, ContainerWrapper, ContainerInner, ContainerContent, BttnDiv, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

const LoginVerifyScreen = ({ route }) => {
  const navigation = useNavigation();
  
  const { dispatch } = useAuth(); // Get the dispatch function from the AuthContext
  console.log('Value of dispatch:', dispatch);

  const [formData, setFormData] = useState({
    phone_number: route.params.phone,
    code: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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

      const response = await axios.post('http://127.0.0.1:5000/login_verify', formData, config);
      setMessage(response.data.message);

      // If verification is successful, update the authentication state
      if (response.data.message === 'Login successful!') {
        dispatch({ type: 'LOGIN', payload: response.data.user });
        
        // Save the authentication state in SecureStore
        await SecureStore.setItemAsync('authState', JSON.stringify(response.data.user));
        
        navigation.navigate('Home');
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <Main>
      <Logo/>
      <ContainerWrapper>
          <ContainerInner>
            <ContainerContent>
              <InputWrapper>
              <Text>6-digits code sent to +{route.params.phone}</Text>
              <Text>Verification Code</Text>
              <InputTxt
                placeholder=""
                onChangeText={(text) => handleChange('code', text)}
              />
              <Text>{message}</Text>
              </InputWrapper>
            <BttnDiv>
                <PressableButton
                  onPress={handleVerify}
                  title='Verify'
                  bgColor='#6bff91'
                />
              </BttnDiv>
            </ContainerContent>
          </ContainerInner>
        </ContainerWrapper>
    </Main>
  );
};

export default LoginVerifyScreen;
