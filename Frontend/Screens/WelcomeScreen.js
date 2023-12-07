import React from 'react';
import { ImageBackground, Image, View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Styling
import { Main, ContainerWrapper, ContainerInner, ContainerContent, BttnDiv, TxtWrapper, WelcomeTxt } from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import Logo from '../styles/logo';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <Main>
      <Logo/>
      <ContainerWrapper>
          <ContainerInner>
            <ContainerContent>
              <TxtWrapper>
                <WelcomeTxt>
                  Welcome To fuelbuddy
                </WelcomeTxt>
                
                  <Text>Find it. Route it. fuelbuddy.\n</Text>
                <Text>The Friend Your Tank Deserves.</Text>
              </TxtWrapper>
              <BttnDiv>
                <PressableButton
                onPress={() => navigation.navigate('Register')}
                title='Get Started'
                bgColor='#6bff91'
                />
              </BttnDiv>
            </ContainerContent>
          </ContainerInner>
      </ContainerWrapper>
    </Main>
    
  );
};

export default WelcomeScreen;