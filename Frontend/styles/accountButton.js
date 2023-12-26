import React from 'react';
import styled from 'styled-components/native';

const ButtonContainer = styled.TouchableOpacity`
  margin-bottom: 20px;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row; // Arrange items horizontally
  align-items: center; // Align items vertically in the center
`;

const ButtonContainerTop = styled.TouchableOpacity`
  padding: 12px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row; // Arrange items horizontally
  align-items: center; // Align items vertically in the center
`;

const ButtonContainerMiddle = styled.TouchableOpacity`
  padding: 12px;
  width: 100%;
  background-color: ${props => props.bgColor};
  flex-direction: row; // Arrange items horizontally
  align-items: center; // Align items vertically in the center
`;

const ButtonContainerBottom = styled.TouchableOpacity`
  margin-bottom: 20px;
  padding: 12px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row; // Arrange items horizontally
  align-items: center; // Align items vertically in the center
`;

const EmojiText = styled.Text`
  font-size: 20px; // You can adjust the size of the emoji here
`;

const ButtonText = styled.Text`
  font-size: 14px;
  text-height: 14px;
  align-items: center;
    justify-content: center;
  display: flex;
  color: white;
  font-family: 'Poppins_500Medium';
  color: ${props => props.txtColor};
  margin-left: 10px; // Add some space between emoji and text
`;

export const MenuButton = ({onPress, bgColor, txtColor, title, emoji}) => (
    <ButtonContainer onPress={onPress} bgColor={bgColor}>
        <EmojiText>{emoji}</EmojiText>
        <ButtonText txtColor={txtColor}>{title}</ButtonText>
    </ButtonContainer>
);

export const MenuButtonTop = ({onPress, bgColor, txtColor, title, emoji}) => (
    <ButtonContainerTop onPress={onPress} bgColor={bgColor}>
        <EmojiText>{emoji}</EmojiText>
        <ButtonText txtColor={txtColor}>{title}</ButtonText>
    </ButtonContainerTop>
);

export const MenuButtonMiddle = ({onPress, bgColor, txtColor, title, emoji}) => (
    <ButtonContainerMiddle onPress={onPress} bgColor={bgColor}>
        <EmojiText>{emoji}</EmojiText>
        <ButtonText txtColor={txtColor}>{title}</ButtonText>
    </ButtonContainerMiddle>
);

export const MenuButtonBottom = ({onPress, bgColor, txtColor, title, emoji}) => (
    <ButtonContainerBottom onPress={onPress} bgColor={bgColor}>
        <EmojiText>{emoji}</EmojiText>
        <ButtonText txtColor={txtColor}>{title}</ButtonText>
    </ButtonContainerBottom>
);
