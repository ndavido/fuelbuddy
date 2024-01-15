import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const Container = styled.View`
    position: absolute;
  padding: 10px;
    left: 0;
    bottom: 0;
`;

const BackButtonContainer = styled(TouchableOpacity)`
    padding: 10px;
    background-color: transparent; // You can customize the color
    border-radius: 5px;
    align-items: center;
`;

// Updated styling for the FontAwesome5 icon
const Icon = styled(FontAwesome5)`
    color: #515151;
    font-size: 18px;
`;

const BackButton = ({ title = 'Back' }) => {
    const navigation = useNavigation();

    return (
        <Container>
            <BackButtonContainer onPress={() => navigation.goBack()}>
               <Icon name="arrow-left" />
            </BackButtonContainer>
        </Container>

    );
};

export default BackButton;