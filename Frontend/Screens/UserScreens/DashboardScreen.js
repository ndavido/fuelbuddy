import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Image, Text, RefreshControl, Button, TextInput, Modal, StyleSheet} from 'react-native';
import ScrollPicker from "react-native-wheel-scrollview-picker";
import {BarChart, LineChart, PieChart} from "react-native-gifted-charts"
import {jwtDecode} from "jwt-decode";
import {useCombinedContext} from "../../CombinedContext";

//Styling
import {
    Main,
    WrapperScroll,
    DashboardContainer,
    TitleContainer,
    CardOverlap, CardContainer, ButtonContainer, Card, ModalContent, InputTxt, CardMini, Container
} from '../../styles/styles.js';
import MainLogo from '../../styles/mainLogo';
import {H2, H3, H4, H5, H6, H7, H8} from "../../styles/text";
import {ButtonButton} from "../../styles/buttons";
import {useNavigation} from "@react-navigation/native";


const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const DashboardScreen = () => {
    const navigate = useNavigation();
    const [userVehicle, setUserVehicle] = useState({});
    const [loading, setLoading] = useState(true);
    const [friendActivity, setFriendActivity] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [chartParentWidth, setChartParentWidth] = useState(0);

    const [barParentWidth, setBarParentWidth] = useState(0);

    const [newWeeklyBudgetInput, setNewWeeklyBudgetInput] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeductionModalVisible, setIsDeductionModalVisible] = useState(false);
    const [selectedDeduction, setSelectedDeduction] = useState(0);

    const [weeklyBudget, setWeeklyBudget] = useState(false);

    const [lineData, setLineData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);

    const [userDeductions, setUserDeductions] = useState([]);
    const [startOfWeek, setStartOfWeek] = useState(new Date());
    const [endOfWeek, setEndOfWeek] = useState(new Date());

    const [cumulativeValue, setCumulativeValue] = useState(0);

    const labels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

    const deductionValues = Array.from({length: 500}, (_, i) => (i + 1).toString());

    const getMondayLabel = (offset) => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysToSubtract);

        const targetDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (offset * 7)));
        const month = targetDate.toLocaleString('default', {month: 'short'});
        const day = targetDate.getDate().toString().padStart(2, '0');
        return `${month} ${day}`;
    };

    const barLabels = [
        getMondayLabel(-2),
        getMondayLabel(-1),
        getMondayLabel(0),
    ];

    const {token, userData, updateUserFromBackend, setUser} = useCombinedContext();


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                await collectDashboardInfo();
                //await collectSuggestedBudget();

            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const collectSuggestedBudget = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${url}/user_suggested_budget`,
                {username: "ndavido"},
                config
            );

            console.error("Suggested Weekly Budget", response.data)

        } catch (error) {
            console.error('Error fetching Suggested Weekly Budget:', error);
        }
    };

    const collectFriendActivity = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${url}/friend_activity_dashboard`,
                {id: user_id},
                config
            );

            if (response.data && response.data.activities) {
                setFriendActivity(response.data.activities);
            }

        } catch (error) {
            console.error('Error fetching friends activity:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);

        await collectUserInfo();
        //await collectSuggestedBudget();

        setRefreshing(false);
    };

    const silentRefresh = async () => {
        await collectUserInfo();
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

            let deductions = [];

            try {
                const deductionsResponse = await axios.post(`${url}/get_deductions`, {id: userData.username}, {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`
                    },
                });
                deductions = deductionsResponse.data.deductions || [];
                console.log("Deductions", deductions);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No deductions found for this user");
                } else {
                    console.error('Error fetching deductions:', error);
                }
            }

            const deductionsByDate = deductions.reduce((acc, deduction) => {
                const dateKey = new Date(deduction.updated_at).toDateString();
                acc[dateKey] = (acc[dateKey] || 0) + parseFloat(deduction.amount);
                return acc;
            }, {});

            const today = new Date();
            const dayOfWeek = today.getDay();

            const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysToSubtract);

            const targetDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (0 * 7)));
            const year = targetDate.getFullYear();
            const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
            const day = targetDate.getDate().toString().padStart(2, '0');
            const startOfWeek = `${year}-${month}-${day}`;

            console.log("Start of Week Label", startOfWeek);

            const startDate = new Date(startOfWeek);

            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999)

            let cumulativeValue = 0;
            const dailyData = [];

            for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                const dateKey = currentDate.toDateString();
                const deductionValue = deductionsByDate[dateKey] || 0;
                cumulativeValue = Math.max(0, cumulativeValue + deductionValue);
                dailyData.push({date: dateKey, value: cumulativeValue});
            }

            await setLineData(dailyData);
            await setCumulativeValue(cumulativeValue);
            console.log(dailyData);

            console.log(weeklyBudget);

            console.log("Start Date", startDate)
            setStartOfWeek(startDate);
            console.log("End Date", endDate)
            setEndOfWeek(endDate);

            const filteredDeductions = deductions.filter(deduction => {
                const deductionDate = new Date(deduction.updated_at);
                const WeekStart = new Date(startDate);
                return deductionDate >= WeekStart && deductionDate <= endOfWeek;
            });

            if (filteredDeductions.length === 0) {
                console.log("No deductions found for this week");
            }

            filteredDeductions.reverse().slice(0, 4);

            await setUserDeductions(filteredDeductions);
            console.log("List Deductions", userDeductions);

            try {
                const weeklyBudgetsResponse = await axios.post(`${url}/get_weekly_budgets`, {id: userData.username}, {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log("Weekly Budgets", weeklyBudgetsResponse.data);

                const weeklyBudgets = weeklyBudgetsResponse.data.past_budgets || [];

                const plottingData = barLabels.map((label) => {
                    const matchingWeek = weeklyBudgets.find((week) => week.date_of_week === label);
                    console.log("Matching Week", matchingWeek)
                    return {
                        value: matchingWeek ? parseFloat(matchingWeek.amount) : 0
                    };
                });

                console.log("Plotting Data", plottingData)
                setBarData(plottingData);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No Past Weekly Budgets found for this user");
                } else {
                    console.error('Error fetching Past Weekly Budgets:', error);
                }
            }

            if (typeof userData.weekly_budget !== 'number') {
                const pieData = [
                    {value: 0, color: '#6BFF91'},
                    {value: 1, color: '#F7F7F7'}
                ];

                const modifiedPieData = [{value: 0}, ...pieData];
                setPieData(modifiedPieData);

            } else {
                if (cumulativeValue > userData.weekly_budget) {
                    const pieData = [
                        {value: userData.weekly_budget, color: '#FF6B6B'},
                        {value: cumulativeValue - userData.weekly_budget, color: '#FF6B6B'}
                    ];

                    const modifiedPieData = [{value: 0}, ...pieData];
                    setPieData(modifiedPieData);
                } else {
                    const pieData = [
                        {value: cumulativeValue, color: '#6BFF91'},
                        {value: userData.weekly_budget - cumulativeValue, color: '#F7F7F7'}
                    ];

                    const modifiedPieData = [{value: 0}, ...pieData];
                    setPieData(modifiedPieData);
                }
            }
            collectFriendActivity();
            collectVehicleInfo();
        } catch (error) {
            console.error('Error collecting dashboard information:', error);
        }
    };

    const collectVehicleInfo = async () => {
        try {
            const jwt_user = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(jwt_user).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${jwt_user}`,
                },
            };
            const response = await axios.post(`${url}/get_user_vehicle`, {id: user_id}, config);

            console.log(response.data)
            if (response.data) {
                setUserVehicle(response.data);
                console.log(userVehicle);
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No vehicle found');
                setUserVehicle(null);
            } else {
                console.error('Error fetching User Vehicle:', error);
            }
        }
    }

    const handleAddDeductionPress = () => {
        setIsDeductionModalVisible(true);
    };

    const handleDeductionModalSubmit = () => {
        const deductionAmount = selectedDeduction;
        if (deductionAmount < 1 || deductionAmount > 500) {
            console.error('Please select a deduction amount between 1 and 500');
            return;
        }

        addDeduction(deductionAmount);

        setSelectedDeduction(0)
        setIsDeductionModalVisible(false);
    };

    const handleDeductionModalCancel = () => {
        setIsDeductionModalVisible(false);
        setSelectedDeduction(0)
    };

    const addDeduction = async (newDeduction) => {
        try {

            const apiUrl = `${url}/update_user_deduction`;

            const requestBody = {
                new_amount: newDeduction,
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.data.message) {
                console.log(response.data.message);
                await silentRefresh();
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
                date_of_week: startOfWeek.toISOString().split('T')[0],
                weekly_budget: newWeeklyBudget,
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            const updatedUserData = {
                ...userData,
                weekly_budget: newWeeklyBudget,
            }

            if (response.data.message) {
                setUser({...updatedUserData});
                console.log(response.data.message);
                await silentRefresh();
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
        const deductionAmount = selectedDeduction;
        if (deductionAmount < 1 || deductionAmount > 500) {
            console.error('Please select a deduction amount between 1 and 500');
            return;
        }

        updateWeeklyBudget(deductionAmount);

        setSelectedDeduction(0)
        setIsModalVisible(false);

    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedDeduction(0)
    };

    const handleVehicle = async () => {
        try {
            navigate.navigate('Account', {screen: 'Vehicle'});

        } catch (error) {
            console.error('Error Loading Vehicle Information:', error);
        }
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
                    <H3 weight='500' tmargin='30px' lmargin='20px' bmargin='10px'>Hey, {userData.first_name}</H3>
                </TitleContainer>
                <DashboardContainer>
                    <CardOverlap>
                        <CardContainer>
                            <Card>
                                <H8 style={{opacity: 0.4}}>Total Budget</H8>
                                <H5>Spending</H5>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: -15,
                                    marginTop: 5
                                }}
                                      onLayout={({nativeEvent}) => setChartParentWidth(nativeEvent.layout.width)}>
                                    <H3 style={{
                                        opacity: 0.4,
                                        zIndex: 999,
                                        position: "absolute",
                                        top: 10,
                                        left: 15
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
                                        xAxisLabelTextStyle={{fontSize: 8, opacity: 0.5, left: -6, bottom: -5}}
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
                                <H8 style={{opacity: 0.4}}>Total Budget</H8>
                                <H5>Past Budgets</H5>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: -18,
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
                                        xAxisLabelTextStyle={{fontSize: 8, opacity: 0.5, left: 0, bottom: -5}}
                                        height={100}
                                        width={chartParentWidth}
                                        hideDataPoints={true}
                                    />
                                </View>
                            </Card>
                        </CardContainer>
                        <Card>
                            <H8 style={{opacity: 0.4}}>Total Budget</H8>
                            <H5>Breakdown</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 10, marginLeft: 10}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    {userData.weekly_budget ? (
                                        <ButtonButton color='#6BFF91' text='Deduct'
                                                      accessibilityLabel="Add Deduction Button" accessible={true}
                                                      onPress={handleAddDeductionPress}/>
                                    ) : (
                                        <ButtonButton icon='plus' text='Add' accessibilityLabel="Add Budget Button"
                                                      accessible={true} onPress={handleUpdateButtonPress}/>
                                    )}
                                </View>
                            </ButtonContainer>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: 10,
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
                                                <Text><H5>€</H5><H2>{cumulativeValue}/</H2><H5>€</H5><H2>{userData.weekly_budget > 0 ? userData.weekly_budget : 0}</H2></Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                            <View style={{marginBottom: 10, marginTop: 20}}>
                                <H6>This Week</H6>
                                {userDeductions.length > 0 ? (
                                    userDeductions.map((deduction, index) => {
                                        const activityDate = new Date(deduction.updated_at);
                                        const today = new Date();
                                        const isToday = activityDate.getDate() === today.getDate() &&
                                            activityDate.getMonth() === today.getMonth() &&
                                            activityDate.getFullYear() === today.getFullYear();
                                        return (
                                            <CardMini key={index} style={{paddingBottom: 10}}>
                                                <H6 style={{paddingTop: 5}}>Deduction</H6>
                                                <H6 width="100%" tmargin="15px" lmargin="10px" position="absolute"
                                                    style={{textAlign: "right"}}>€{deduction.amount}</H6>
                                                <H7 style={{opacity: 0.3, paddingBottom: 5}}>
                                                    {isToday ? 'Today · ' + activityDate.toLocaleTimeString() : activityDate.toLocaleString()}
                                                </H7>
                                            </CardMini>
                                        );
                                    })
                                ) : (
                                    <H6 style={{paddingTop: 10, paddingBottom: 10}}>No Budget activity for this
                                        week!</H6>
                                )}
                            </View>
                        </Card>
                        <Card>
                            <H8 style={{opacity: 0.5}}>Vehicle</H8>
                            <H5>My Car</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 10, marginLeft: 10}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    {userVehicle ? (
                                        <ButtonButton text='View'
                                                      accessibilityLabel="Add Deduction Button" accessible={true}
                                                      onPress={handleVehicle}/>
                                    ) : (
                                        <ButtonButton icon='plus' text='Add' accessibilityLabel="Add Budget Button"
                                                      accessible={true} onPress={handleVehicle}/>
                                    )}
                                </View>
                            </ButtonContainer>
                            <>
                                {userVehicle ? (
                                    <>
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 0,
                                            top: -10,
                                        }}>
                                            <Image source={require('../../assets/appAssets/car.png')}
                                                   style={{height: 150, width: 200}}/>
                                        </View>
                                        <View style={{top: -10}}>
                                            <H5>{userVehicle.make} {userVehicle.model}</H5>
                                            <H6 style={{opacity: 0.5}}>100km/{userVehicle.city_fuel_per_100km_l}l ·
                                                Average</H6>
                                        </View>
                                    </>
                                ) : (
                                    <H6 style={{paddingTop: 10, paddingBottom: 10}}>No Vehicle Set!</H6>
                                )}
                            </>
                        </Card>
                        <Card>
                            <H8 style={{opacity: 0.5}}>Friends</H8>
                            <H5>Recent Activity</H5>
                            <View style={{marginBottom: 10}}>
                                {friendActivity.length > 0 ? (
                                    friendActivity.slice(0, 4).map((activity, index) => {
                                        const activityDate = new Date(activity.timestamp);
                                        const today = new Date();
                                        const isToday = activityDate.getDate() === today.getDate() &&
                                            activityDate.getMonth() === today.getMonth() &&
                                            activityDate.getFullYear() === today.getFullYear();
                                        return (
                                            <CardMini key={index} style={{paddingBottom: 10}}>
                                                <H6 style={{paddingTop: 5}}>@{activity.username}</H6>
                                                <H7 style={{opacity: 0.5}}>{activity.activity}</H7>
                                                <H7 style={{opacity: 0.3, paddingBottom: 5}}>
                                                    {isToday ? 'Today · ' + activityDate.toLocaleTimeString() : activityDate.toLocaleString()}
                                                </H7>
                                            </CardMini>
                                        );
                                    })
                                ) : (
                                    <H6 style={{paddingTop: 10, paddingBottom: 10}}>No friend activity yet!</H6>
                                )}
                            </View>
                        </Card>
                    </CardOverlap>
                </DashboardContainer>
                <Modal
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <ModalContent>
                            <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Add Budget</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    <ButtonButton icon="cross" color="#eaedea" iconColor="#b8bec2" accessible={true}
                                                  accessibilityLabel="Close Budget Model"
                                                  onPress={handleModalCancel}/>
                                </View>
                            </ButtonContainer>
                            <Container style={{height: 160, width: 200}}>
                                <ScrollPicker
                                    dataSource={deductionValues}
                                    onValueChange={(data, selectedIndex) => {
                                        setSelectedDeduction(selectedIndex + 1)
                                    }}
                                    itemTextStyle={{fontFamily: 'Poppins_500Medium'}}
                                    wrapperHeight={120}
                                    wrapperWidth={200}
                                    wrapperBackground={'#FFFFFF'}
                                    itemHeight={40}
                                    highlightColor={'#d8d8d8'}
                                    highlightBorderWidth={2}
                                    activeItemColor={'#222121'}
                                    itemColor={'#B4B4B4'}
                                />
                            </Container>
                            <ButtonContainer style={{width: "auto", position: "relative"}}>
                                <ButtonButton
                                    color="#6BFF91"
                                    txtWidth="100%"
                                    text="Add Budget"
                                    accessibilityLabel="Add Budget Button 2"
                                    accessible={true}
                                    onPress={handleModalSubmit}
                                />
                            </ButtonContainer>
                        </ModalContent>
                    </View>
                </Modal>
                <Modal
                    visible={isDeductionModalVisible}
                    onRequestClose={() => setIsDeductionModalVisible(false)}
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <ModalContent>
                            <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Deduct From Budget</H5>
                            <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                                <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                    <ButtonButton icon="cross" color="#eaedea" iconColor="#b8bec2" accessible={true}
                                                  accessibilityLabel="Close Deduction Model"
                                                  onPress={handleDeductionModalCancel}/>
                                </View>
                            </ButtonContainer>
                            <Container style={{height: 160, width: 200}}>
                                <ScrollPicker
                                    dataSource={deductionValues}
                                    onValueChange={(data, selectedIndex) => {
                                        setSelectedDeduction(selectedIndex + 1)
                                    }}
                                    wrapperHeight={120}
                                    wrapperWidth={200}
                                    wrapperBackground={'#FFFFFF'}
                                    itemHeight={40}
                                    highlightColor={'#d8d8d8'}
                                    highlightBorderWidth={2}
                                    activeItemColor={'#222121'}
                                    itemColor={'#B4B4B4'}
                                />
                            </Container>
                            <ButtonContainer style={{width: "auto", position: "relative"}}>
                                <ButtonButton
                                    color="#6BFF91"
                                    txtWidth="100%"
                                    text="Deduct"
                                    accessibilityLabel="Add Deduction Button 2"
                                    accessible={true}
                                    onPress={() => handleDeductionModalSubmit()}
                                />
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});

export default DashboardScreen;