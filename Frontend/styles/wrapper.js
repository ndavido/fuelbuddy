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

export const BttnDiv = styled.View`
  height: auto;
  padding: 20px;
  width: 100%;
  margin: auto;
  bottom: 0;
  max-width: 600px;
  position: absolute;
`;