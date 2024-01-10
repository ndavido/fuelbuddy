import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

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
  width: 100%;
  display: block;
`;

export const WelcomeTxt = styled.Text`
  font-size: 25px;
  width: 100%;
  text-align: center;
  color: black;
`;

export const BttnDiv = styled.View`
  height: auto;
  width: calc(100% - 40px);
  margin-bottom: 115px;
  margin-left: 20px;
  margin-right: 20px;
  display: inline-block;
  bottom: 0;
  position: absolute;
`;

