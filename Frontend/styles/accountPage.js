import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import LogoSrc from '../assets/welcomeTemp.jpg';

export const AccountWrapper = styled.View`
  height: 100%;
  width: 100%;
  margin: auto;
`;

export const AccountInner = styled.View`
  position: relative;
  flex: 1 1 auto;
`;

export const AccountContent = styled.View`
    flex: 1 1 auto;
    position: relative;
    min-width: 1px;
    margin: 10px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%; 
`;

export const AccountTopInfo = styled.View`
    position: relative;
    height: 45%;
    width: 100%; 
`;

export const AccountTitle = styled.Text`
  font-size: 30px;
  margin: 10px;
  font-weight: 400;
  text-align: left;
  color: black;
  top: 120px;
`;

export const AccountUsername = styled.Text`
  margin-bottom: 10px;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
`;

export const AccountBottomInfo = styled.View`
    position: relative;
    background-color: white;
    height: 55%;
    width: 100%; 
    border-top-left-radius: 20px;
    border-top-right-radius: 20px; 
`;

export const AccountTxtWrapper = styled.View`
    margin: 20px;
    padding-top: 20px;
`;

export const AccountTxt = styled.Text`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  line-height: 20px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;

//background-color: ${Dimensions.get('window').width < 768 ? 'green' : 'blue'};

export const TxtWrapper = styled.View`
  position: absolute;
  top: 50%;
  text-align: center;
  display: inline-block;
`;

export const WelcomeTxt = styled.Text`
  font-size: 25px;
  text-align: center;
  color: black;
`;

export const BttnDiv = styled.View`
  height: auto;
  width: 100%;
  display: inline-block;
  margin: auto;
  bottom: 40;
  position: absolute;
`;

export const BttnDiv2 = styled.View`
  height: auto;
  padding: 20px;
  width: 100%;
  flex-direction: row;
  margin: auto;
  top: 100;
  position: absolute;
`;

export const InputWrapper = styled.View`
  height: auto;
  width: 100%;
  top: 40%;
  margin: auto;
  position: absolute;
`;

export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: 30px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;