import React from 'react';
import styled from 'styled-components/native';

const LogoContainer = styled.SafeAreaView`
  top: 60px;
  height: 140px;
  width: 140px
  background-color: #FFFFFF;
  border-radius: 70px;
  z-index: 1000;
  margin: auto;
  position: relative;
`;

const LogoImg = styled.Image`
  flex: 1;
  width: 100%;
  border-radius: 70px;
`;

const AccountImg = () => (
  <LogoContainer>

      <LogoImg source={require('../assets/testAccountImg.jpg') }/>

  </LogoContainer>
);
export default AccountImg;