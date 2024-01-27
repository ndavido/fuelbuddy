import React from 'react';
import styled from "styled-components/native";

/* Main Styling */
export const Main = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: #6BFF91;
`;

export const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  margin: auto;
`;

export const WrapperScroll = styled.ScrollView`
  height: 100%;
  width: 100%;
  margin: auto;
`;

export const Content = styled.View`
  flex: 1 1 auto;
  position: relative;
  min-width: 1px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

export const Container = styled.View`
  height: auto;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  position: relative;
`;

export const ButtonDiv = styled.View`
  height: auto;
  width: 100%;
  margin-bottom: 100px;
  bottom: 0;
  padding: 20px;
  position: absolute;
`;

export const TitleContainer = styled.View`
  position: relative;
  height: 200px;
  width: 100%;
`;

export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  line-height: 18px;
  background-color: ${props => props.bcolor || '#F7F7F7'};
  border-radius: 10px;
`;

export const ButtonContainer = styled.View`
  margin-bottom: 30px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  height: 40px;
`;

const ButtContainer = styled.TouchableOpacity`
  padding: 12px;
  width: ${props => props.width};
  border-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row;
  display: inline-flex;
`;

const EmojiText = styled.Text`
  font-size: 12px;
  align-items: center;
  justify-content: center;
  line-height: 20px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-family: 'Poppins_500Medium';
  color: ${props => props.txtColor};
  margin-left: 10px;
`;

export const MenuButton = ({onPress, width, bgColor, txtColor, title, emoji}) => (
    <ButtContainer onPress={onPress} width={width} bgColor={bgColor}>
        <EmojiText>{emoji}</EmojiText>
        <ButtonText txtColor={txtColor}>{title}</ButtonText>
    </ButtContainer>
);


/* Welcome Screen */
export const WelcomeMain = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.SafeAreaView`
  height: 20%;
  width: 100%;
  margin-top: 225px;
  margin-bottom: 40px;
  z-index: 1000;
  position: relative;
`;

const LogoImg = styled.Image`
  flex: 1;
  resizeMode: contain;
  width: 100%;
`;

export const WelcomeImg = () => (
    <LogoContainer>
        <LogoImg source={require('../assets/welcome.png')}/>
    </LogoContainer>
);


/* Login & Register Screen */
export const LRContainer = styled.View`
  height: auto;
  padding: 5px;
  border-radius: 10px;
  width: calc(100% - 20px);
  flex-direction: row;
  background-color: #F7F7F7;
  margin-bottom: 10px;
  margin-top: 160px;
  margin-left: 10px;
  margin-right: 10px;
  position: relative;
`;

export const PhoneTxt = styled.TextInput`
  width: 82%;
  margin-left: 2%;
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  line-height: 18px;
  background-color: #F7F7F7;
  border-radius: 10px;
`;

export const CCTxt = styled.TextInput`
  width: 16%;
  margin-bottom: 10px;
  padding: 10px;
  text-align: center;
  height: auto;
  line-height: 18px;
  background-color: #F7F7F7;
  border-radius: 10px;
`;

export const LRButtonDiv = styled.View`
  height: auto;
  width: 100%;
  margin-top: 520px;
  padding: 20px;
  position: absolute;
`;


/* Dashboard Screen */
export const DashboardContainer = styled.View`
  background-color: #F7F7F7;
  position: relative;
  display: inline-block;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 10px;
`;

export const DashboardLegal = styled.View`
  background-color: #F7F7F7;
  position: relative;
  text-align: center;
  height: auto;
  padding: 20px;
`;

export const CardOverlap = styled.View`
  margin-top: -50px;
  display: flex;
`;

export const CardContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Cardlrg = styled.View`
  background-color: #ffffff;
  min-height: 300px;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
`;

export const Cardsml = styled.View`
  background-color: #ffffff;
  flex: 1;
  min-height: 180px;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;


/* Account Screen */