import React from 'react';
import {ImageBackground, Image, View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Styling
import {WelcomeMain, ButtonDiv, Content, Wrapper, WelcomeImg} from "../../styles/styles";
import {Logo} from '../../styles/images';
import {H1, H2, H3, H4, H5, H6, Img, Txt} from '../../styles/text.js';
import {ButtonButton} from "../../styles/buttons";

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

                        <H5 weight="400" width="100%" style={{opacity: 0.5, textAlign: 'center'}}>The Friend Your Tank Deserves.</H5>
                    </Txt>
                    <ButtonDiv>
                        <ButtonButton accessibilityLabel="Welcome Button" color="#6bff91" txtWidth="100%" accessible={true}
                                  txtColor="white" text="Get Started" onPress={() => navigation.navigate('Register')}/>
                    </ButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>

    );
};

export default WelcomeScreen;