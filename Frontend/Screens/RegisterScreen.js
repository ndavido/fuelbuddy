import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

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
    <View>
      <Text>User Registration</Text>
      <TextInput
        placeholder="Full Name"
        onChangeText={(text) => handleChange('full_name', text)}
      />
      <TextInput
        placeholder="Username"
        onChangeText={(text) => handleChange('username', text)}
      />
      <TextInput
        placeholder="Phone Number"
        onChangeText={(text) => handleChange('phone_number', text)}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text>{message}</Text>
    </View>
  );
};

export default RegisterScreen;