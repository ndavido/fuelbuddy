import React from 'react';
import { TouchableOpacity } from 'react-native';
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

const AnimatedHeartButton = ({ initialIsActive, onPress }) => {
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

export default AnimatedHeartButton;
