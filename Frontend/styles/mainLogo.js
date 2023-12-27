import React from 'react';
import styled from 'styled-components/native';
import {H6} from "../styles/text";

const LogoContainer = styled.SafeAreaView`
  height: 85px;
  width: 100%;
  background-color: #FFFFFF;
  top: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px; 
  z-index: 1000;
  margin: auto;
  position: absolute;
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

const MainLogo = () => (
  <LogoContainer>
    <LogoInner>
      <LogoImg source={require('../assets/fuelbuddyLogoShort.png') }/>
    </LogoInner>
  </LogoContainer>
);
export default MainLogo;