import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
    position: absolute;
    top: 0;
    bottom: 0;
`;

const BackButtonContainer = styled(TouchableOpacity)`
    padding: 10px;
    background-color: #007bff; // You can customize the color
    border-radius: 5px;
    align-items: center;
`;

const ButtonText = styled(Text)`
    color: white;
    font-size: 16px;
`;

const BackButton = ({ title = 'Back' }) => {
    const navigation = useNavigation();

    return (
        <Container>
            <BackButtonContainer onPress={() => navigation.goBack()}>
                <ButtonText>{title}</ButtonText>
            </BackButtonContainer>
        </Container>

    );
};

export default BackButton;