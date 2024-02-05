import React from 'react';
import styled from 'styled-components/native';
import BackButton from './backButton';

const LogoContainer = styled.SafeAreaView`
  height: 85px;
  width: 100%;
  background-color: #FFFFFF;
  top: 0;
  z-index: 1000;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  margin: auto;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const LogoInner = styled.SafeAreaView`
  height: 25px;
  width:50%;
  bottom: 5px;
  z-index: 1000;
  margin: auto;
  position: absolute;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
  font-family: 'Poppins_500Medium';
`;

const MainLogo = ({ bButton, PageTxt }) => (
  <LogoContainer>
      {bButton ? <BackButton /> : null}
    <LogoInner>
        <ButtonText>{PageTxt}</ButtonText>
    </LogoInner>
  </LogoContainer>
);

export default MainLogo;