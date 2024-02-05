import React from 'react';
import styled from 'styled-components/native';

const LogoContainer = styled.SafeAreaView`
  height: 80px;
  width: 100%;
  position: relative;
`;

const LogoImg = styled.Image`
  flex: 1;
  width: 80px;
  height: 80px;
  margin: auto;
  border-radius: 40px;
`;

const AccountImg = () => (
  <LogoContainer>
      <LogoImg source={require('../assets/testAccountImg.jpg') }/>
  </LogoContainer>
);
export default AccountImg;