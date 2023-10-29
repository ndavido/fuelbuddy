import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

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
    <View>
      <Text>Login Verification</Text>
      <TextInput
        placeholder="Phone Number"
        onChangeText={(text) => handleChange('phone_number', text)}
      />
      <TextInput
        placeholder="Verification Code"
        onChangeText={(text) => handleChange('code', text)}
      />
      <Button title="Verify" onPress={handleVerify} />
      <Text>{message}</Text>
    </View>
  );
};

export default LoginVerifyScreen;
