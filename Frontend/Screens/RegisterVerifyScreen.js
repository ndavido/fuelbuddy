import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegisterVerifyScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: '',
    code: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/register/verify', formData);
      setMessage(response.data.message);

      // If verification is successful, you can navigate to another screen (e.g., the home screen)
      if (response.data.message === 'Verification successful!') {
        navigation.navigate('Home'); // Change 'Home' to the screen you want to navigate to
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <View>
      <Text>Verification Screen</Text>
      <TextInput
        placeholder="Username"
        onChangeText={(text) => handleChange('username', text)}
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

export default RegisterVerifyScreen;