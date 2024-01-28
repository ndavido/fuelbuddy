import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';

const HeartButton = styled(Animatable.View)`
  background-color: ${(props) => (props.isActive ? '#FFBABA' : '#eaedea')};
  padding: 7px;
  border-radius: 10px;
  transform: scale(${(props) => (props.isActive ? 1.2 : 1)});
  opacity: ${(props) => (props.isActive ? 0.8 : 1)};
`;

export const AnimatedHeartButton = ({ initialIsActive, onPress }) => {
  const [isActive, setIsActive] = React.useState(initialIsActive);

  const handlePress = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    if (onPress) {
      onPress(newIsActive);
    }
  };

  React.useEffect(() => {
    setIsActive(initialIsActive);
  }, [initialIsActive]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <HeartButton isActive={isActive} animation="pulse">
        <Entypo name="heart" size={26} color={isActive ? 'red' : '#b8bec2'} />
      </HeartButton>
    </TouchableOpacity>
  );
};

const GenericButton = styled(Animatable.View)`
  background-color: #6BFF91;
  padding: 7px;
  border-radius: 10px;
  transform: scale(1);
  opacity: 1;
`;

export const AnimatedGenericButton = ({ onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <GenericButton animation="pulse">
        <Entypo name="plus" size={26} color="#FFFFFF" />
      </GenericButton>
    </TouchableOpacity>
  );
};

const TGenericButton = styled(Animatable.View)`
  flex-direction: row;
  align-items: center;
  background-color: #3891FA;
  padding: 7px;
  border-radius: 10px;
  transform: scale(1);
  opacity: 1;
`;

const ButtonText = styled.Text`
  margin-left: 5px;
  color: #FFFFFF;
  font-size: 16px;
  font-family: 'Poppins_500Medium';
`;

export const TAnimatedGenericButton = ({ text, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <TGenericButton animation="pulse">
        <Entypo name="location-pin" size={26} color="#FFFFFF" />
        <ButtonText>{text}</ButtonText>
      </TGenericButton>
    </TouchableOpacity>
  );
};
