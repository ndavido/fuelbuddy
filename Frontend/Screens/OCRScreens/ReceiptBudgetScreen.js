import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Image, Platform, View, StyleSheet} from "react-native";
import {useCombinedContext} from '../../CombinedContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Updates from 'expo-updates';

// Styling
import {H3, H4, H5, H6} from "../../styles/text";
import {
    AccountContainer,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main,
    TextContainer,
    WelcomeMain, Wrapper,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton} from "../../styles/buttons";


const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY

const ReceiptBudgetScreen = () => {
    const route = useRoute();
    const {receipt, receiptImage} = route.params;

    console.log(receipt)

    console.log("Receipt On Budget Screen", receiptImage)

    const [editedReceiptTotal, setEditedReceiptTotal] = useState((receipt.total || 0).toString());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /* TODO Remove DEV ONLY!! */
        console.log("Reloaded")
    }

    /* TODO Add Alt if Budget is not set!!! */
    const handleUpdateBudget = async () => {
        try {
            const apiUrl = `${url}/update_user_deduction`;

            const requestBody = {
                new_amount: editedReceiptTotal,
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.data.message) {
                const updatedData = {
                    ...receipt,
                    total: editedReceiptTotal,
                    date: selectedDate,
                }
                console.log(response.data.message);
                navigation.navigate('StationReceipt', {receipt: updatedData, receiptImage: receiptImage});
            } else {
                console.error('Failed to add deduction:', response.data.error);
            }
        } catch (error) {
            console.error('Error adding deduction:', error);
        }
    };

    const handleSkip = async () => {
        navigation.navigate('StationReceipt', {receipt: receipt});
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    useEffect(() => {
        updateUserFromBackend();

        setEditedReceiptTotal((receipt.total || 0).toString());
    }, []);

    return (
        <WelcomeMain>
            <Wrapper>
                <Content>
                    <Container>
                        <H3 bmargin="10px">Update Budget</H3>
                        <>
                            <H6>Current Budget</H6>
                            <TextContainer bgColor='grey'>€{userData.weekly_budget}</TextContainer>
                            <H6 bmargin='5px'>Receipt Total (€)</H6>
                            <InputTxt value={editedReceiptTotal} onChangeText={setEditedReceiptTotal}
                                      placeholder="Total Spent"/>
                            <H6>Date </H6>
                            <View style={styles.container}>
                                <DateTimePicker
                                    style={{left: -10}}
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            </View>

                        </>
                        <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Continue" onPress={handleUpdateBudget}/>
                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black" text="Skip" onPress={handleSkip}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

const styles = StyleSheet.create({
  container: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default ReceiptBudgetScreen;