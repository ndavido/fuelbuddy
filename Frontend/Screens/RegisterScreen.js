import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

//Styling
import { StyledView, BttnDiv, BttnWrapper, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone_number: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

const handleRegister = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/register', formData);
    if (response && response.data) {
      setMessage(response.data.message);

      if (response.data.message === 'Verification code sent successfully!') {
        navigation.navigate('RegisterVerify');
      }
    } else {
      // else
    }
  } catch (error) {
    setMessage(error.response?.data?.error || 'An error occurred.');
  }
};


  return (
    <StyledView>
      <Logo/>
      <BttnWrapper>
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
          <Text>Username</Text>
          <InputTxt
            placeholder=""
            onChangeText={(text) => handleChange('username', text)}
          />
          <Text>Phone Number</Text>
          <InputTxt
            placeholder=""
            onChangeText={(text) => handleChange('phone_number', text)}
          />
        </InputWrapper>
        
      <BttnDiv>
          <PressableButton
            onPress={handleRegister}
            title='Send Register Code'
            bgColor='#6bff91'
          />
        </BttnDiv>
      <Text>{message}</Text>
      </BttnWrapper>
    </StyledView>
  );
};

export default RegisterScreen;