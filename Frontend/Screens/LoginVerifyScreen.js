import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

//Styling
import { StyledView, BttnDiv, BttnWrapper, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

const LoginVerifyScreen = () => {
  const navigation = useNavigation();
  const { dispatch } = useAuth(); // Get the dispatch function from the AuthContext

  const [formData, setFormData] = useState({
    phone_number: '',
    code: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login_verify', formData);
      setMessage(response.data.message);

      // If verification is successful, update the authentication state
      if (response.data.message === 'Login successful!') {
        dispatch({ type: 'LOGIN', payload: response.data.user }); // Update the user in the state
        navigation.navigate('Home'); // Change 'Home' to the screen you want to navigate to
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <StyledView>
      <Logo/>
      <BttnWrapper>
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
        <InputTxt
          placeholder=""
          onChangeText={(text) => handleChange('phone_number', text)}
        />
        <Text>Verification Code</Text>
        <InputTxt
          placeholder=""
          onChangeText={(text) => handleChange('code', text)}
        />
        </InputWrapper>
      <BttnDiv>
          <PressableButton
            onPress={handleVerify}
            title='Verify'
            bgColor='#6bff91'
          />
        </BttnDiv>
      <Text>{message}</Text>
      </BttnWrapper>
    </StyledView>
  );
};

export default LoginVerifyScreen;
