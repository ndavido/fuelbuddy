import React from 'react';
import styled from 'styled-components/native';

const LogoContainer = styled.View`
  height: 150px;
  width: 220px;
  top: 0;
  margin-top: 50px;
  z-index: 1000;
  position: absolute;
`;

const LogoImg = styled.Image`
  flex: 1;
  resizeMode: contain;
  width: 100%;
`;

export const Logo = () => (
  <LogoContainer>
    <LogoImg source={require('../assets/fbLogos/fuelbuddyLogo.png') }/>
  </LogoContainer>
);

const AccountImgContainer = styled.View`
  height: 100px;
  width: 100%;
  position: relative;
`;

const AccountImgImg = styled.Image`
  flex: 1;
  width: 100px;
  height: 100px;
  margin: auto;
  background-color: #6BFF91;
  border-radius: 50px;
`;

export const AccountImg = ({ uri }) => (
  <AccountImgContainer>
    <AccountImgImg source={uri ? { uri } : require('../assets/defaultAcount.jpg')} />
  </AccountImgContainer>
);