import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

// Styling
import { Main, ContainerWrapper, ContainerInner, ContainerContent, BttnDiv, TxtWrapper, WelcomeTxt, BttnDiv2, InputWrapper, InputTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';

const RegisterVerifyScreen = ({ route }) => {
  const navigation = useNavigation();
  const { dispatch } = useAuth(); // Get the dispatch function from the AuthContext

  const [formData, setFormData] = useState({
    username: route.params.username,
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

      const response = await axios.post('ec2-54-172-255-239.compute-1.amazonaws.com/register/verify', formData, config);
      setMessage(response.data.message);

      // If verification is successful, update the authentication state
      if (response.data.message === 'Verification successful!') {
        dispatch({ type: 'LOGIN', payload: response.data.user }); // Update the user in the state
        navigation.navigate('Home'); // Change 'Home' to the screen you want to navigate to
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
              <View style={{height:230, width:230, borderRadius:180, backgroundColor:'#3bb77b', position:'absolute', top:-150, left:-20, transform: [{scaleX: 2}]}}/>
              <View style={{height:220, width:220, borderRadius:200, backgroundColor:'#38e892', position:'absolute', top:-120, left:-80, transform: [{scaleX: 2}]}}/>
              <Text style={{position:'absolute', top:30, left:30, fontSize:18, fontWeight: 'bold', color:'white'}} >Register Verify</Text>
              <InputWrapper>
                <Text>6-digits code sent to +{route.params.phone}</Text>
                <Text>Username</Text>
                <InputTxt
                  placeholder=""
                  value = {route.params.username}
                  editable = {false}
                  onChangeText={(text) => handleChange('username', text)} readonly
                />
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

export default RegisterVerifyScreen;