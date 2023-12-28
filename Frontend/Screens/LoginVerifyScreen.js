import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

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

const LoginVerifyScreen = ({ route }) => {

  const { dispatch } = useAuth(); // Get the dispatch function from the AuthContext

  const [formData, setFormData] = useState({
    phone_number: route.params.phone,
    code: '',
  });

  const [message, setMessage] = useState('');
  const [resendCount, setResendCount] = useState(0); // Counter for resend attempts
  const maxResendLimit = 2; // Maximum resend limit

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

      const response = await axios.post('http://ec2-54-172-255-239.compute-1.amazonaws.com/login_verify', formData, config);

      setMessage(response.data.message);

      // If verification is successful, update the authentication state
      if (response.data.message === 'Login successful!' && response.data.access_token) {
        // Store the received access token securely
        await AsyncStorage.setItem('token', response.data.access_token);

        // Attach the access token to the request headers for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        navigation.navigate('Dashboard');
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

      // Replace the placeholder with your actual code to resend the verification code
      const response = await axios.post(
        'http://127.0.0.1:5000/login', // Replace with your endpoint URL
        {
          phone_number: formData.phone_number,
        },
        config
      );

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
      <Logo />
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

export default LoginVerifyScreen;