import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Image, Text, RefreshControl, Button, TextInput, Modal, StyleSheet} from 'react-native';
import {BarChart, LineChart, PieChart} from "react-native-gifted-charts"
import {jwtDecode} from "jwt-decode";
import {useCombinedContext} from "../CombinedContext";

//Styling
import {
    Main,
    WrapperScroll,
    DashboardContainer,
    TitleContainer,
    CardOverlap, CardContainer, ButtonContainer, Card, ModalContent, InputTxt
} from '../styles/styles.js';
import MainLogo from '../styles/mainLogo';
import {H2, H3, H4, H5, H6, H7, H8} from "../styles/text";
import {ButtonButton} from "../styles/buttons";

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
    const [isDeductionModalVisible, setIsDeductionModalVisible] = useState(false);

    const [weeklyBudget, setWeeklyBudget] = useState(false);

    const [lineData, setLineData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);

    const [newDeductionInput, setNewDeductionInput] = useState('');

    const [cumulativeValue, setCumulativeValue] = useState(0);

    const labels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

    const barLabels = ["Nov", "Dec", "Jan"];

    const {userData, updateUserFromBackend} = useCombinedContext();


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                await collectDashboardInfo();
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    /*const fetchNews = async () => {
        try {
            const apiKey = process.env.NEWSAPI_KEY;
            const newsApiUrl = 'https://newsapi.org/v2/everything';
            const carResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'car fuel',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50,
                },
            });

            const petrolResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'petrol',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50,
                },
            });

            const dieselResponse = await axios.get(newsApiUrl, {
                params: {
                    apiKey,
                    q: 'road',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 50,
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
    };*/

    /*const filterRemovedArticles = (articles) => {
        return articles.filter(article => !article.title.includes('[Removed]') && !article.description.includes('[Removed]'));
    };

    const containsUKOrIreland = (article) => {
        const content = `${article.title} ${article.description}`;
        return content.toLowerCase().includes('uk ') || content.toLowerCase().includes('ireland');
    };*/

    const onRefresh = async () => {
        setRefreshing(true);

        await collectUserInfo();

        setRefreshing(false);
    };

    // TODO How to Quickly reload info on the dashboard
    const collectUserInfo = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');

            console.log("Testing")

            if (storedToken) {

                await updateUserFromBackend();

                collectDashboardInfo();

            }
        } catch (error) {
            console.error('Error fetching user account information:', error);
        }
    };

    const collectDashboardInfo = async () => {
        try {
            const weeklyBudget = typeof userData.weekly_budget === 'number' ? userData.weekly_budget : 0;
            setWeeklyBudget(weeklyBudget);
            console.log('Weekly budget:', weeklyBudget);

            let deductions = [];

            try {
                const deductionsResponse = await axios.post(`${url}/get_deductions`, {username: userData.username}, {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                });
                deductions = deductionsResponse.data.deductions || [];
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No deductions found for this user");
                } else {
                    console.error('Error fetching deductions:', error);
                }
            }

            console.log('Deductions:', deductions);

            let cumulativeValue = 0;

            const lineData = new Array(7).fill(0).map((_, index) => {
                if (index < deductions.length) {
                    cumulativeValue += parseFloat(deductions[index].amount);
                }
                return {value: cumulativeValue};
            });

            setLineData(lineData);
            setCumulativeValue(cumulativeValue);

            console.log(lineData);

            console.log(weeklyBudget);

            if (typeof userData.weekly_budget !== 'number') {
                const pieData = [
                    {value: 0, color: '#6BFF91'},
                    {value: 1, color: '#F7F7F7'}
                ];
                const barData = [
                    {value: 0},
                    {value: 0},
                    {value: 0},
                ];
                setBarData(barData);
                setPieData(pieData);
            } else {
                if (cumulativeValue >= userData.weekly_budget) {
                    const pieData = [
                        {value: userData.weekly_budget, color: '#FF6B6B'},
                        {value: cumulativeValue - userData.weekly_budget, color: '#FF6B6B'}
                    ];
                    const barData = [
                        {value: 0},
                        {value: 0},
                        {value: userData.weekly_budget},
                    ];
                    setBarData(barData);
                    setPieData(pieData);
                } else {
                    const pieData = [
                        {value: cumulativeValue, color: '#6BFF91'},
                        {value: userData.weekly_budget - cumulativeValue, color: '#F7F7F7'}
                    ];
                    const barData = [
                        {value: 0},
                        {value: 0},
                        {value: userData.weekly_budget},
                    ];
                    setBarData(barData);
                    setPieData(pieData);
                }
            }
        } catch (error) {
            console.error('Error collecting dashboard information:', error);
        }
    };

    const handleAddDeductionPress = () => {
        setIsDeductionModalVisible(true);
    };

    const handleDeductionModalSubmit = () => {
        if (!newDeductionInput.trim()) {
            console.error('Please enter a valid deduction amount');
            return;
        }

        addDeduction(parseFloat(newDeductionInput));

        setIsDeductionModalVisible(false);
        setNewDeductionInput('');
    };

    const handleDeductionModalCancel = () => {
        setIsDeductionModalVisible(false);
        setNewDeductionInput('');
    };

    const addDeduction = async (newDeduction) => {
        try {

            const apiUrl = `${url}/update_budget`;

            const requestBody = {
                username: userData.username,
                deductions: newDeduction,
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
            });

            if (response.data.message) {
                console.log(response.data.message);
                await onRefresh();
            } else {
                console.error('Failed to add deduction:', response.data.error);
            }
        } catch (error) {
            console.error('Error adding deduction:', error);
        }
    };

    const updateWeeklyBudget = async (newWeeklyBudget) => {
        try {
            const apiUrl = `${url}/update_budget`;

            const requestBody = {
                username: userData.username,
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
                updateUserFromBackend();
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
                    <H3 weight='500' tmargin='30px' lmargin='20px' bmargin='10px'>Hey, {userData.full_name}</H3>
                </TitleContainer>
                <DashboardContainer>
                    <CardOverlap>
                        <CardContainer>
                            <Card>
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
                                    <H3 style={{
                                        opacity: 0.5,
                                        position: "absolute",
                                        top: 10,
                                        left: 20
                                    }}>€{cumulativeValue}</H3>
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
                            </Card>
                            <Card>
                                <H8 style={{opacity: 0.5}}>Total Budget</H8>
                                <H5>Past Budgets</H5>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: -15,
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
                            </Card>
                        </CardContainer>
                        <Card>
                            <H8 style={{opacity: 0.5}}>Total Budget</H8>
                            <H5>Breakdown</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 10, marginLeft: 10}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    {userData.weekly_budget ? (
                                        <ButtonButton icon='plus' color='#6BFF91' onPress={handleAddDeductionPress}/>
                                    ) : (
                                        <ButtonButton icon='plus' text='add' onPress={handleUpdateButtonPress}/>
                                    )}
                                </View>
                            </ButtonContainer>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: -10,
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
                                                <Text><H5>€</H5><H2>{cumulativeValue}/</H2><H5>€</H5><H2>{userData.weekly_budget}</H2></Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                            <View>
                                <H6>This Week</H6>
                            </View>
                        </Card>
                        <Card>
                            <H8 style={{opacity: 0.5}}>Activity</H8>
                            <H5>My Friends</H5>


                        </Card>
                        <Card>
                            <H8 style={{opacity: 0.5}}>Vehicle</H8>
                            <H5>My Car</H5>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 0,
                                top: -20,
                            }}>
                                <Image source={require('../assets/car.png')} style={{height: 200, width: 250}}/>
                            </View>
                            <View style={{top: -10}}>
                                <H5>Volkswagen Polo</H5>
                                <H6 style={{opacity: 0.5}}>18Km/l Average</H6>
                            </View>
                        </Card>
                        {/*<Card>
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
                        </Card>*/}
                    </CardOverlap>
                </DashboardContainer>
                <Modal
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <ModalContent>
                            <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Add Budget</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    <ButtonButton icon="cross" color="#eaedea" iconColor="#b8bec2"
                                                  onPress={handleModalCancel}/>
                                </View>
                            </ButtonContainer>
                            <InputTxt
                                value={newWeeklyBudgetInput}
                                onChangeText={(text) => setNewWeeklyBudgetInput(text)}
                                keyboardType="numeric"
                                placeholder="Enter amount"
                            />
                            <ButtonContainer style={{width: "auto", position: "relative"}}>
                                <ButtonButton icon="plus" color="#6BFF91" text="Add Budget"
                                              onPress={handleModalSubmit}/>
                            </ButtonContainer>
                        </ModalContent>
                    </View>
                </Modal>
                <Modal
                    visible={isDeductionModalVisible}
                    onRequestClose={() => setIsDeductionModalVisible(false)}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <ModalContent>
                            <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Add Deduction</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    <ButtonButton icon="cross" color="#eaedea" iconColor="#b8bec2"
                                                  onPress={handleDeductionModalCancel}/>
                                </View>
                            </ButtonContainer>
                            <InputTxt
                                value={newDeductionInput}
                                onChangeText={(text) => setNewDeductionInput(text)}
                                keyboardType="numeric"
                                placeholder="Enter deduction amount"
                            />
                            <ButtonContainer style={{width: "auto", position: "relative"}}>
                                <ButtonButton icon="plus" color="#6BFF91" text="Add Deduction"
                                              onPress={handleDeductionModalSubmit}/>
                            </ButtonContainer>
                        </ModalContent>
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
});

export default DashboardScreen;