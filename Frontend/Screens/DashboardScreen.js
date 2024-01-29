import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {View, Image, Text, RefreshControl} from 'react-native';
import styled from 'styled-components/native';
import {LineChart, PieChart} from 'react-native-chart-kit'; // Assuming you're using chart-kit for charts
import {jwtDecode} from "jwt-decode";

//Styling
import {
    Main,
    WrapperScroll,
    Content,
    DashboardContainer,
    TitleContainer, Cardsml, Cardlrg,
    CardOverlap, DashboardLegal, CardContainer
} from '../styles/styles.js';
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6, H7} from "../styles/text";

// Your dashboard component
const DashboardScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const [newsData, setNewsData] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const fetchNews = async () => {
        try {
            const apiKey = process.env.NEWSAPI_KEY; // Replace with your actual API key
            const newsApiUrl = 'https://newsapi.org/v2/everything';
            const carResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'car fuel', // Add keywords related to petrol
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50, // Adjust the number of articles as needed
                },
            });

            const petrolResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'petrol', // Add keywords related to petrol
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50, // Adjust the number of articles as needed
                },
            });

            const dieselResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'road', // Add keywords related to petrol
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50, // Adjust the number of articles as needed
                },
            });


            // Combine the results from all categories
            const combinedNews = [
                ...filterRemovedArticles(carResponse.data.articles),
                ...filterRemovedArticles(petrolResponse.data.articles),
                ...filterRemovedArticles(dieselResponse.data.articles),
            ].filter(article => containsUKOrIreland(article));

            setNewsData(combinedNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoadingNews(false);
        }
    };

    const filterRemovedArticles = (articles) => {
        return articles.filter(article => !article.title.includes('[Removed]') && !article.description.includes('[Removed]'));
    };

    const containsUKOrIreland = (article) => {
        const content = `${article.title} ${article.description}`; // Add other fields as needed
        return content.toLowerCase().includes('uk ') || content.toLowerCase().includes('ireland');
    };

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

    const onRefresh = async () => {
        setRefreshing(true);

        await fetchUserInfo();
        await fetchNews();
        setRefreshing(false);
    };

    const pieChartData = [
        {name: '', amount: 40, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15},
        {name: '', amount: 20, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15},
    ];

    // TODO How to Quickly reload info on the dashboard
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
            fetchNews();
            // Return a cleanup function if needed
            return () => {
                // Cleanup code goes here
            };
        }, [])
    );

    return (
        <Main>
            <MainLogo PageTxt='Dashboard'/>
            <WrapperScroll refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <TitleContainer>
                    <H3 weight='600' tmargin='100px' lmargin='20px' bmargin='10px'>Hey, {userInfo.username}</H3>
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
                            {loadingNews ? (
                                <H4>Loading news...</H4>
                            ) : (
                                <View>
                                    {newsData.map((article, index) => (
                                        <View key={index}>
                                            {article.urlToImage && (
                                                <Image
                                                    source={{uri: article.urlToImage}}
                                                    style={{width: 200, height: 150, resizeMode: 'cover'}}
                                                />
                                            )}
                                            <H5>{article.title}</H5>
                                            <H6 style={{opacity: 0.5}}>{article.description}</H6>
                                            <H7 style={{opacity: 0.3}}>{article.source?.name} - {new Date(article.publishedAt).toLocaleString('en-GB', {
                                                timeZone: 'GMT',
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            })}</H7>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Cardlrg>
                    </CardOverlap>
                </DashboardContainer>
                <DashboardLegal>
                    <H6 bmargin='5px' width='100%' style={{textAlign: 'center'}}>Made with 💖 by Team fuelbuddy</H6>
                </DashboardLegal>
            </WrapperScroll>
        </Main>
    );
};

export default DashboardScreen;