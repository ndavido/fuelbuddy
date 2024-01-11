import React from 'react';
import styled from 'styled-components/native';
import BackButton from './backButton'; // Import your BackButton component

const LogoContainer = styled.SafeAreaView`
  height: 85px;
  width: 100%;
  background-color: #FFFFFF;
  top: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px; 
  z-index: 1000;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  margin: auto;
  position: absolute;
  align-items: center; // Center items horizontally
  justify-content: center; // Center items vertically
`;

const LogoInner = styled.SafeAreaView`
  height: 30px;
  width:100%;
  bottom: 15px;
  z-index: 1000;
  margin: auto;
  position: absolute;
`;

const LogoImg = styled.Image`
  flex: 1;
  resizeMode: contain;
  width: 100%;
`;

const MainLogo = ({ bButton }) => (
  <LogoContainer>
    <LogoInner>
      <LogoImg source={require('../assets/fuelbuddyLogoShort.png')}/>
    </LogoInner>
  </LogoContainer>
);

export default MainLogo;