import React from 'react';
import styled from 'styled-components/native';

const ButtonContainer2 = styled.TouchableOpacity`
  padding: 12px;
  width: 50%;
  border-radius: 10px;
  background-color: ${props => props.bgColor};
`;

const ButtonText2 = styled.Text`
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_400Regular';
  color: white;
  color: ${props => props.txtColor};
`;

const PressableButton2 = ({ onPress, bgColor, txtColor, title }) => (
  <ButtonContainer2 onPress={onPress} bgColor={bgColor}>
    <ButtonText2 txtColor={txtColor}>{title}</ButtonText2>
  </ButtonContainer2>
);
export default PressableButton2;