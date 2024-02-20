import styled from 'styled-components/native';

export const AccountRegularInfo = styled.ScrollView`
    position: relative;
    background-color: #F7F7F7;
    height: 100%;
    width: 100%;
    padding-top: 20px;
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