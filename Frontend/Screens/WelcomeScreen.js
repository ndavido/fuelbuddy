import React from 'react';
import { ImageBackground, Image, View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Styling
import { StyledView, BttnDiv, BttnWrapper } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import Logo from '../styles/logo';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <StyledView>
      <ImageBackground source={require('../assets/welcomeTemp.jpg')} resizeMode="cover" style={{ flex: 1, width: '100%' }}>
        <Logo/>
        <BttnWrapper>
          <BttnDiv>
            <PressableButton
              onPress={() => navigation.navigate('Login')}
              title='Login'
              bgColor='#2196f3'
            />
            <PressableButton
              onPress={() => navigation.navigate('Register')}
              title='Register'
              bgColor='red'
            />
          </BttnDiv>
        </BttnWrapper>
      </ImageBackground>
        
      
    </StyledView>
  );
};

export default WelcomeScreen;