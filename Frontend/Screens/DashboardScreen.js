import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {LineChart, PieChart} from 'react-native-chart-kit'; // Assuming you're using chart-kit for charts
import {jwtDecode} from "jwt-decode";

//Styling
import {
    Main,
    Wrapper,
    WrapperScroll,
    Content,
    DashboardContainer,
    Card,
    CardTitle,
    BudgetText,
    TitleContainer, Cardsml, Cardlrg,
    CardOverlap, DashboardLegal, CardContainer
} from '../styles/styles.js';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import MainLogo from '../styles/mainLogo';
import {AccountContent, AccountTopInfo, AccountUsername, DeveloperTick} from "../styles/accountPage";
import {H3, H5, H6, H7} from "../styles/text";
import AccountImg from "../styles/accountImg";

// Your dashboard component
const DashboardScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    // Define the data for charts (placeholders for now)
    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99],
                strokeWidth: 2,
            },
        ],
    };

    const pieChartData = [
        {name: '', amount: 40, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15},
        {name: '', amount: 20, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15},
    ];

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const userDataJson = await AsyncStorage.getItem('userData');
            if (userDataJson) {
                setUserInfo(JSON.parse(userDataJson));
            }
        } catch (error) {
            console.error('Error fetching user account information:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserInfo();
            // Return a cleanup function if needed
            return () => {
                // Cleanup code goes here
            };
        }, [])
    );

    // Render the components
    return (
        <Main>
            <MainLogo/>
            <WrapperScroll>
                <TitleContainer>
                    <H3 tmargin='100px' lmargin='20px' bmargin='10px'>My Dashboard</H3>
                </TitleContainer>
                <DashboardContainer>
                    <CardOverlap>
                        <CardContainer>
                            <Cardsml>
                                <H7 style={{opacity: 0.5}}>Total Budget</H7>
                                <H5>Spending</H5>

                            </Cardsml>
                            <Cardsml>
                                <H7 style={{opacity: 0.5}}>Routes</H7>
                                <H5>Saved Routes</H5>


                            </Cardsml>
                        </CardContainer>
                        <Cardlrg>
                            <H7 style={{opacity: 0.5}}>Total Budget</H7>
                            <H5>Breakdown</H5>

                        </Cardlrg>
                        <Cardlrg>
                            <H7 style={{opacity: 0.5}}>Vehicle</H7>
                            <H5>My Car</H5>

                        </Cardlrg>
                        <Cardlrg>
                            <H7 style={{opacity: 0.5}}>News</H7>
                            <H5>Trending Stories</H5>

                        </Cardlrg>
                    </CardOverlap>
                </DashboardContainer>
                <DashboardLegal>
                    <H6 bmargin='5px'>Made with 💖 by Team fuelbuddy</H6>
                </DashboardLegal>
            </WrapperScroll>
        </Main>
    );
};

export default DashboardScreen;