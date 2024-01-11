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
    Content,
    DashboardContainer,
    Card,
    CardTitle,
    BudgetText,
    TitleContainer
} from '../styles/styles.js';
import {
    Main2,
    ContainerWrapper,
    ContainerInner,
    ContainerContent,
    BttnDiv,
    TxtWrapper,
    WelcomeTxt,
    BttnDiv2,
    InputWrapper,
    InputTxt
} from '../styles/wrapper';
import PressableButton from '../styles/buttons';
import PressableButton2 from '../styles/buttons2';
import Logo from '../styles/logo';
import MainLogo from '../styles/mainLogo';
import {AccountContent, AccountTopInfo, AccountUsername, DeveloperTick} from "../styles/accountPage";
import {H3, H6} from "../styles/text";
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
            <Wrapper>
                <TitleContainer>
                    <H3 tmargin='20px' lmargin='20px' bmargin='10px'>My Dashboard</H3>
                </TitleContainer>
                <DashboardContainer>
                    <Card>
                        <CardTitle>Total Budget Spending</CardTitle>
                        {/* Render the line chart here */}
                        <LineChart
                            data={lineChartData}
                            width={320} // from react-native
                            height={220}
                            yAxisLabel={'$'}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </Card>
                    <H6 bmargin='5px'>Username</H6>
                    <H3>@{userInfo.username}</H3>
                    <H6 bmargin='5px'>Name</H6>
                    <H3>{userInfo.full_name}</H3>
                    <Card>
                        <CardTitle>Total Budget Breakdown</CardTitle>
                        {/* Render the pie chart here */}
                        <PieChart
                            data={pieChartData}
                            width={320}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#022173',
                                backgroundGradientFrom: '#022173',
                                backgroundGradientTo: '#1b3fa0',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            accessor={'amount'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                            center={[10, 10]}
                            absolute
                        />
                        <BudgetText>£40/£60</BudgetText>
                    </Card>
                </DashboardContainer>
            </Wrapper>
        </Main>
    );
};

export default DashboardScreen;