import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import LogoSrc from '../assets/welcomeTemp.jpg';

export const Main = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

export const Main2 = styled.View`
  flex: 1;
  overflow: hidden;
  background-color: #6BFF91;
`;

export const ContainerWrapper = styled.View`
  height: 100%;
  width: 100%;
  margin: auto;
`;

export const ContainerInner = styled.View`
  margin: 20px;
  position: relative;
  flex: 1 1 auto;
`;

export const ContainerContent = styled.View`
    flex: 1 1 auto;
    position: relative;
    min-width: 1px;
    max-width: 500px;
    margin: 0 auto;
    width: 100%; 
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
  width: 100%;
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
  padding-top: 100px;
  margin: auto;
  position: relative;
`;

export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: 30px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;

export const PhoneTxt = styled.TextInput`
  flex: 4;
  margin-bottom: 10px;
  padding: 10px;
  height: 30px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;

export const CCTxt = styled.TextInput`
  flex: 1;
  margin-bottom: 10px;
  padding: 10px;
  height: 30px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;