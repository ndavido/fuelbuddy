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
  margin-bottom: 115px;
  bottom: 0;
  padding: 20px;
  position: absolute;
`;

export const TitleContainer = styled.View`
  position: relative;
  background-color: purple;
  height: 150px;
  width: 100%;
`;


/* Welcome Screen */
export const WelcomeMain = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

export const WelcomeButtonDiv = styled.View`
  height: auto;
  width: 100%;
  margin-bottom: 115px;
  bottom: 0;
  padding: 20px;
  position: absolute;
`;

const LogoContainer = styled.SafeAreaView`
  height: 20%;
  width: 100%;
  margin-top: 225px;
  margin-bottom: 50px;
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
export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  line-height: 18px;
  background-color: #F7F7F7;
  border-radius: 10px;
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
  height: auto;
  line-height: 18px;
  background-color: #F7F7F7;
  border-radius: 10px;
`;

export const LRButtonDiv = styled.View`
  height: auto;
  width: 100%;
  margin-top: 500px;
  padding: 20px;
  position: absolute;
`;


/* Dashboard Screen */
export const DashboardContainer = styled.View`
  background-color: #F7F7F7;
  position: relative;
  display: inline-block;
  opacity: 0.5;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`;
export const Card = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const BudgetText = styled.Text`
  font-size: 32px;
  color: green;
  font-weight: bold;
  text-align: center;
`;


/* Account Screen */