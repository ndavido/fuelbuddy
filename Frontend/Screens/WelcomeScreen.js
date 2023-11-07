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
              <View style={{height:230, width:230, borderRadius:180, backgroundColor:'#3bb77b', position:'absolute', top:-150, left:-20, transform: [{scaleX: 2}]}}/>
              <View style={{height:220, width:220, borderRadius:200, backgroundColor:'#38e892', position:'absolute', top:-120, left:-80, transform: [{scaleX: 2}]}}/>
              
              <TxtWrapper>
                <WelcomeTxt>
                  Welcome To fuelbuddy
                </WelcomeTxt>
                
                {/* <Text>Sample Text Sample Text Sample</Text> */}
              </TxtWrapper>
              <BttnDiv>
                <PressableButton
                onPress={() => navigation.navigate('Register')}
                title='Register'
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