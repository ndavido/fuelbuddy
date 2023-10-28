import React from 'react';
import { ImageBackground, Image, View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end",
  },
  buttonWrapper: {
    margin: 'auto',
    maxWidth: '400px',
  },
  tint: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    overflow: 'hidden',
    zIndex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: '.2',
  },
  bttn: {
    zIndex: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});


const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/welcomeTemp.jpg')} resizeMode="cover" style={styles.image}>
        <View
          style={styles.logo}
        />
        <View style={styles.buttonWrapper}>
          <Button
            style={styles.bttn}
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            style={styles.bttn}
            title="Register"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </ImageBackground>
        
      
    </View>
  );
};

export default WelcomeScreen;