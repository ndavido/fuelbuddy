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

export const DeveloperTick = styled.Text`
  font-size: 20px;
  margin-left: 2px;
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