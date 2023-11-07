import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

//Styling
import { Main, ContainerWrapper, ContainerInner, ContainerContent, BttnDiv, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt } from '../styles/wrapper';
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

  const countryCode = '353';

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
              <View style={{height:230, width:230, borderRadius:180, backgroundColor:'#3bb77b', position:'absolute', top:-150, left:-20, transform: [{scaleX: 2}]}}/>
              <View style={{height:220, width:220, borderRadius:200, backgroundColor:'#38e892', position:'absolute', top:-120, left:-80, transform: [{scaleX: 2}]}}/>
              <Text style={{position:'absolute', top:30, left:30, fontSize:18, fontWeight: 'bold', color:'white'}} >Register</Text>
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
                <Text>Country Code</Text>
                <InputTxt
                  value = "353"
                  editable = {false}
                  placeholder=""
                  onChangeText={(text) => handleChange('country_code', text)}
                />
                <Text>Phone Number</Text>
                <InputTxt
                  placeholder=""
                  onChangeText={(text) => handleChange('phone_number', text)}
                />
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