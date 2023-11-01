import styled from 'styled-components/native';
import LogoSrc from '../assets/welcomeTemp.jpg';

export const StyledView = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

export const BttnWrapper = styled.View`
  height: 100%;
  width: 100%;
  margin: auto;
  max-width: 300px;
  position: relative;
`;

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
  padding: 20px;
  width: 100%;
  margin: auto;
  bottom: 0;
  max-width: 600px;
  position: absolute;
`;

export const BttnDiv2 = styled.View`
  height: auto;
  padding: 20px;
  width: 100%;
  display: inline-block;
  margin: auto;
  top: 100;
  max-width: 600px;
  position: absolute;
`;

export const InputWrapper = styled.View`
  height: auto;
  width: 100%;
  top: 40%;
  margin: auto;
  max-width: 300px;
  position: absolute;
`;

export const InputTxt = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px;
  height: 30px;
  background-color: #E1E1E1;
  border-radius: 10px;
`;