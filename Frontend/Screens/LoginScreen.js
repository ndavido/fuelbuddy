import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    phone_number: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', formData);
      if (response && response.data) {
        setMessage(response.data.message);

        if (response.data.message === 'Login code sent successfully!') {
          navigation.navigate('LoginVerify'); // Navigate to code verification screen
        }
      } else {
        // Handle other cases or errors if needed
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Phone Number"
        onChangeText={(text) => handleChange('phone_number', text)}
      />
      <Button title="Send Login Code" onPress={handleLogin} />
      <Text>{message}</Text>
    </View>
  );
};

export default LoginScreen;