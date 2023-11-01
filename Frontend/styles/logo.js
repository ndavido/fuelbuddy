import React from 'react';
import styled from 'styled-components/native';

const LogoContainer = styled.View`
  height: 150px;
  width: 100%;
  top: 0;
  margin: auto;
  max-width: 300px;
  position: absolute;
`;

const LogoImg = styled.Image`
  top: 60px;
  height: 50px;
  width: auto;
  position: relative;
`;

const Logo = () => (
  <LogoContainer>
    <LogoImg source={require('../assets/fuelbuddyLogo.png')} resizeMode="cover"/>
  </LogoContainer>
);
export default Logo;