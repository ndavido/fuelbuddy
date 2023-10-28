import React from 'react';
import { Image, View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  logo: {
    width: '100%',
    height: '100%',
    position: '',
  },
});


const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
        <Image
        source={require('../assets/welcomeTemp.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text>FuelBUDDY</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default WelcomeScreen;