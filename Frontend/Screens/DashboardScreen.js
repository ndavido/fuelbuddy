import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {View, Image, Text, RefreshControl, Button, TextInput, Modal, StyleSheet} from 'react-native';
import {BarChart, LineChart, PieChart} from "react-native-gifted-charts"
import {jwtDecode} from "jwt-decode";

//Styling
import {
    Main,
    WrapperScroll,
    Content,
    DashboardContainer,
    TitleContainer, Cardsml, Cardlrg,
    CardOverlap, DashboardLegal, CardContainer, ButtonContainer
} from '../styles/styles.js';
import MainLogo from '../styles/mainLogo';
import {H2, H3, H4, H5, H6, H7, H8} from "../styles/text";
import {AnimatedGenericButton, AnimatedHeartButton, TAnimatedGenericButton} from "../styles/AnimatedIconButton";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const DashboardScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const [newsData, setNewsData] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [chartParentWidth, setChartParentWidth] = useState(0);

    const [barParentWidth, setBarParentWidth] = useState(0);

    const [newWeeklyBudgetInput, setNewWeeklyBudgetInput] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                if (userDataJson) {
                    const userData = JSON.parse(userDataJson);
                    setUserInfo(userData);

                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

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

    const onRefresh = async () => {
        setRefreshing(true);

        await collectUserInfo();

        setRefreshing(false);
    };

    // TODO How to Quickly reload info on the dashboard
    const collectUserInfo = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                if (userDataJson) {
                    const userData = JSON.parse(userDataJson);
                    setUserInfo(userData);

                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

    const weekly_budget = userInfo.weekly_budget - 0;

    const lineData = [
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
        {value: 0},
    ];

    const labels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

    console.log(weekly_budget)

    const barData = [
        {value: 0},
        {value: 0},
        {value: 2},
    ];

    const barLabels = ["Nov", "Dec", "Jan"];

    const pieData = [
        {value: 0, color: '#6BFF91'},
        {value: weekly_budget, color: '#F7F7F7'}
    ];

    const updateWeeklyBudget = async (newWeeklyBudget) => {
        try {
            const userDataJson = await AsyncStorage.getItem('userData');
            const userInfo = JSON.parse(userDataJson);

            const apiUrl = `${url}/update_budget`;

            const requestBody = {
                username: userInfo.username,
                weekly_budget: newWeeklyBudget,
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
            });

            if (response.data.message) {
                console.log(response.data.message);
                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    weekly_budget: newWeeklyBudget,
                  }));
                await onRefresh();
            } else {
                console.error('Failed to update weekly budget:', response.data.error);
            }
        } catch (error) {
            console.error('Error updating weekly budget:', error);
        }
    };

    const handleUpdateButtonPress = () => {
        setIsModalVisible(true);
    };

    const handleModalSubmit = () => {
        if (!newWeeklyBudgetInput.trim()) {
            console.error('Please enter a valid weekly budget');
            return;
        }

        updateWeeklyBudget(parseFloat(newWeeklyBudgetInput));

        setIsModalVisible(false);
        setNewWeeklyBudgetInput('');
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setNewWeeklyBudgetInput('');
    };

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
                    <H3 weight='500' tmargin='110px' lmargin='20px' bmargin='10px'>Hey, {userInfo.username}</H3>
                </TitleContainer>
                <DashboardContainer>
                    <CardOverlap>
                        <CardContainer>
                            <Cardsml>
                                <H8 style={{opacity: 0.5}}>Total Budget</H8>
                                <H5>Spending</H5>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: -20,
                                    marginTop: 5
                                }}
                                      onLayout={({nativeEvent}) => setChartParentWidth(nativeEvent.layout.width)}>
                                    <H3 style={{opacity: 0.5, position: "absolute", top: 10, left: 20}}>€0</H3>
                                    <LineChart
                                        data={lineData}
                                        adjustToWidth={true}
                                        thickness={5}
                                        hideRules
                                        disableScroll={true}
                                        endSpacing={0}
                                        hideYAxisText
                                        xAxisColor={"transparent"}
                                        yAxisColor={"transparent"}
                                        xAxisLabelTexts={labels}
                                        xAxisLabelTextStyle={{fontSize: 7, opacity: 0.5, left: -4, bottom: -5}}
                                        height={100}
                                        isAnimated={true}
                                        width={chartParentWidth}
                                        hideDataPoints={true}
                                        verticalLinesColor="rgba(14,164,164,0.5)"
                                        color="#6BFF91"
                                    />
                                </View>
                            </Cardsml>
                            <Cardsml>
                                <H8 style={{opacity: 0.5}}>Total Budget</H8>
                                <H5>Past Budgets</H5>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: -20,
                                    marginTop: 5
                                }}>
                                    <BarChart
                                        data={barData}
                                        adjustToWidth={true}
                                        thickness={5}
                                        hideRules
                                        disableScroll={true}
                                        barBorderRadius={5}
                                        isAnimated={true}
                                        renderTooltip={(item, index) => {
                                            return (
                                                <View
                                                    style={{
                                                        marginBottom: 2,
                                                        backgroundColor: 'transparent',
                                                        paddingHorizontal: 7,
                                                        paddingVertical: 4,
                                                        borderRadius: 4,
                                                    }}>
                                                    <H7 style={{opacity: 0.5}}>{item.value}</H7>
                                                </View>
                                            );
                                        }}
                                        frontColor="#6BFF91"
                                        barWidth={chartParentWidth / 5 - 1}
                                        endSpacing={0}
                                        hideYAxisText
                                        xAxisColor={"transparent"}
                                        yAxisColor={"transparent"}
                                        xAxisLabelTexts={barLabels}
                                        xAxisLabelTextStyle={{fontSize: 7, opacity: 0.5, left: -4, bottom: -5}}
                                        height={100}
                                        width={chartParentWidth}
                                        hideDataPoints={true}
                                    />
                                </View>
                            </Cardsml>
                        </CardContainer>
                        <Cardlrg>
                            <H8 style={{opacity: 0.5}}>Total Budget</H8>
                            <H5>Breakdown</H5>
                            <ButtonContainer style={{position: 'absolute'}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    <AnimatedGenericButton onPress={handleUpdateButtonPress}/>
                                </View>
                            </ButtonContainer>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: -20,
                                zIndex: 0
                            }}
                                  onLayout={({nativeEvent}) => setBarParentWidth(nativeEvent.layout.width)}>
                                <PieChart
                                    donut
                                    innerRadius={75}
                                    radius={90}
                                    data={pieData}
                                    centerLabelComponent={() => {
                                        return (
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <H8 style={{opacity: 0.5}}>Spent</H8>
                                                <Text><H5>€</H5><H2>0/</H2><H5>€</H5><H2>{userInfo.weekly_budget}</H2></Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </Cardlrg>
                        <Cardlrg>
                            <H8 style={{opacity: 0.5}}>Vehicle</H8>
                            <H5>My Car</H5>

                        </Cardlrg>
                        <Cardlrg>
                            <H8 style={{opacity: 0.5}}>News</H8>
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
                <Modal
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Enter new weekly budget:</Text>
                            <TextInput
                                value={newWeeklyBudgetInput}
                                onChangeText={(text) => setNewWeeklyBudgetInput(text)}
                                keyboardType="numeric"
                                placeholder="Enter amount"
                            />
                            <Button title="Update" onPress={handleModalSubmit}/>
                            <Button title="Cancel" onPress={handleModalCancel}/>
                        </View>
                    </View>
                </Modal>
            </WrapperScroll>
        </Main>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        height: 400,
        width: 250,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default DashboardScreen;