import styled from 'styled-components/native';
import {Dimensions, Animated} from 'react-native';

export const AccountWrapper = styled.View`
  height: 100%;
  width: 100%;
  margin: auto;
`;

export const AccountContent = styled.View`
  flex: 1 1 auto;
  position: relative;
  min-width: 1px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

export const AccountTopInfo = styled.View`
  position: relative;
  height: 300px;
  top: 85px;
  width: 100%;
`;

export const AccountTitle = styled.Text`
  font-size: 30px;
  margin: 10px;
  font-weight: 400;
  text-align: left;
  color: black;
`;

export const AccountUsername = styled.Text`
  padding: 5px;
  position: relative;
  text-align: center;
  font-family: 'Poppins_500Medium';
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
`;

export const DeveloperTick = styled.Text`
  font-size: 20px;
`;

export const AccountBottomInfo = styled(Animated.View)`
    position: relative;
    background-color: #F7F7F7;
    height: 1500px;
    width: 100%; 
    border-top-left-radius: 20px;
    border-top-right-radius: 20px; 
`;

export const AccountRegularInfo = styled.ScrollView`
    position: relative;
    background-color: #F7F7F7;
    height: auto;
    width: 100%;
  padding-top: 85px;
`;

export const AccountTxtWrapper = styled.View`
  margin: 20px;
  height: auto;
`;

export const AccountTxt = styled.Text`
  margin-bottom: 20px;
  padding: 12px;
  width: 100%;
  border-radius: 10px;
  background-color: ${props => props.bgColor};
  flex-direction: row;
  align-items: center;
`;

//background-color: ${Dimensions.get('window').width < 768 ? 'green' : 'blue'};