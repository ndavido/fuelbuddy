import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, Button, StyleSheet, Modal} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import MainLogo from '../styles/mainLogo';
import {MenuButton} from '../styles/accountButton';
import {InputTxt, Main} from '../styles/styles';
import {
    AccountWrapper,
    AccountContent,
    AccountTxtWrapper,
    AccountRegularInfo,
    AccountTxt,
} from '../styles/accountPage';
import {jwtDecode} from "jwt-decode";
import {H3, H5, H6} from "../styles/text";

const apiKey = process.env.REACT_NATIVE_API_KEY;

const ScanScreen = () => {
    const [loading, setLoading] = useState(true);


    return (
        <Main>
            <MainLogo/>
            <AccountWrapper>
                <AccountRegularInfo>
                    <AccountContent>
                        <AccountTxtWrapper>
                            <H5 tmargin='10px' bmargin='10px'>Placeholder, Feature TBC</H5>
                        </AccountTxtWrapper>
                    </AccountContent>
                </AccountRegularInfo>
            </AccountWrapper>
        </Main>
    );
};

export default ScanScreen;
