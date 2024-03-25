import React from 'react';
import styled, {css} from "styled-components/native";
import {FontAwesome5} from "@expo/vector-icons";

/* Main Styling */
export const Main = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: #6BFF91;
`;

export const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  top: 80px;
  margin: auto;
`;

export const WrapperScroll = styled.ScrollView`
  height: 100%;
  width: 100%;
  top: 80px;
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
  margin-bottom: 150px;
  bottom: 0;
  padding: 20px;
  position: absolute;
`;

export const TitleContainer = styled.View`
  position: relative;
  height: 130px;
  width: 100%;
`;

export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  line-height: 18px;
  background-color: ${props => props.bcolor || '#F7F7F7'};
  border-radius: 10px;
  ${(props) => props.inputErrorBorder && redBorderColor}
  ${(props) => props.inputErrorBorder1 && redBorderColor}
`;

export const TextContainer = styled.Text`
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  line-height: 18px;
  background-color: ${props => props.bcolor || '#F7F7F7'};
  border-radius: 10px;
`;

export const ButtonContainer = styled.View`
  margin-bottom: 30px;
  margin-top: 15px;
  justify-content: space-between;
  flex-direction: row;
  height: 40px;
  width: 100%
`;

export const TextWrapper = styled.View`
  margin: 10px;
  height: auto;
`;


/* Welcome Screen */
export const WelcomeMain = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.View`
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

const redBorderColor = css`
  border-color: red;
  border-width: 1px;
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
  ${(props) => props.errorBorder && redBorderColor}
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
  padding-bottom: 100px;
`;

export const CardOverlap = styled.View`
  margin-top: -50px;
  display: flex;
`;

export const CardContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Card = styled.View`
  background-color: #ffffff;
  flex: 1;
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


/* Friends Screen */
export const FContainer = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 12px;
 
`;

export const FSButtonContainer = styled.TouchableOpacity`
  padding: 8px;
  width: ${props => props.width};
  border-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row;
  display: inline-flex;
  boxSizing: 'border-box'
`;

export const AddFriendButton = styled.Text`
  color: green;
`;


/* Account Screen */
export const TopInfo = styled.View`
  position: relative;
  height: 200px;
  top: 10px;
  width: 100%;
`;

export const TopDesign = styled.View`
  position: absolute;
  background-color: #F7F7F7;
  height: 130px;
  bottom: 0px;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 0;
`;

export const AccountContainer = styled.View`
  background-color: #F7F7F7;
  position: relative;
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 70px;
`;

export const DeveloperTick = styled.Text`
  font-size: 14px;
`;

/* Modals */
export const ModalContent = styled.View`
  background-color: white;
    padding: 20px;
    border-radius: 20px;
    margin: 50px;
    min-width: 350px;
    min-height: 200px;
    border: 1px solid #ddd;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F7F7F7;
  border-radius: 10px;
  padding: 8px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 8px;
  font-size: 16px;
  color: #333;
`;

export const SearchBox = ({ placeholder, onChangeText, value }) => {
  return (
    <SearchContainer>
      <FontAwesome5 name="search" size={18} color="#b8bec2" />
      <SearchInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        onChangeText={onChangeText}
        value={value}
      />
    </SearchContainer>
  );
};