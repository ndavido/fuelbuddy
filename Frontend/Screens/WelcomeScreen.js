import React from 'react';
import {ImageBackground, Image, View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Styling
import {WelcomeMain, ButtonDiv, Content, Wrapper, WelcomeImg} from "../styles/styles";
import PressableButton from '../styles/buttons';
import Logo from '../styles/logo';
import {H1, H2, H3, H4, H5, H6, Img, Txt} from '../styles/text.js';

const WelcomeScreen = () => {
    const navigation = useNavigation();

    return (
        <WelcomeMain>
            <Logo/>
            <Wrapper>
                <Content>
                    <WelcomeImg/>
                    <Txt>
                        <H1 width="100%" style={{textAlign: 'center'}}>
                            Welcome
                        </H1>

                        <H6 weight="400" width="100%" style={{opacity: 0.5, textAlign: 'center'}}>Find it. Route it. fuelbuddy.</H6>
                        <H6 weight="400" width="100%" style={{opacity: 0.5, textAlign: 'center'}}>The Friend Your Tank Deserves.</H6>
                    </Txt>
                    <ButtonDiv>
                        <PressableButton
                            onPress={() => navigation.navigate('Register')}
                            title='Get Started'
                            bgColor='#6bff91'
                        />
                    </ButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>

    );
};

export default WelcomeScreen;