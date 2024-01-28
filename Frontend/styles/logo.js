import React from 'react';
import styled from 'styled-components/native';

const LogoContainer = styled.SafeAreaView`
  height: 150px;
  width: 220px;
  top: 0;
  z-index: 1000;
  margin: auto;
  position: absolute;
`;

const LogoImg = styled.Image`
  flex: 1;
  resizeMode: contain;
  width: 100%;
`;

const Logo = () => (
  <LogoContainer>
    <LogoImg source={require('../assets/fuelbuddyLogo.png') }/>
  </LogoContainer>
);
export default Logo;