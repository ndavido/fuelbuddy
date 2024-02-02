import React from 'react';
import styled from 'styled-components/native';

const ButtonContainer = styled.TouchableOpacity`
  width: ${props => props.width || '100%'};
  display: flex;
  padding: 12px;
  border-radius: 10px;
  background-color: ${props => props.bgColor};
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-family: 'Poppins_400Regular';
  width: 100%;
  text-align: center;
  color: ${props => props.txtColor || 'white'};
`;

const PressableButton = ({ width, onPress, txtColor, bgColor, title }) => (
  <ButtonContainer width={width} onPress={onPress} bgColor={bgColor}>
    <ButtonText txtColor={txtColor}>{title}</ButtonText>
  </ButtonContainer>
);
export default PressableButton;