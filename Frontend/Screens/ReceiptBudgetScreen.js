import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCombinedContext} from '../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import {H3, H4, H5, H6} from "../styles/text";
import {
    AccountContainer,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main,
    TextContainer,
    WelcomeMain,
    WrapperScroll
} from "../styles/styles";
import {ButtonButton} from "../styles/buttons";
import {Image} from "react-native";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY

const ReceiptBudgetScreen = () => {
    const route = useRoute();
    const { receipt } = route.params;

    console.log(receipt)

    const [editedReceiptTotal, setEditedReceiptTotal] = useState((receipt.total || 0).toString());
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
            const apiUrl = `${url}/update_budget`;

            const requestBody = {
                id: userData.username,
                deductions: editedReceiptTotal,
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
                navigation.navigate('StationReceipt', {receipt: receipt});
            } else {
                console.error('Failed to add deduction:', response.data.error);
            }
        } catch (error) {
            console.error('Error adding deduction:', error);
        }
    };

    const handleSkip = async () => {
        navigation.navigate('StationReceipt');
    }

    useEffect(() => {
        updateUserFromBackend();

        setEditedReceiptTotal((receipt.total || 0).toString());
    }, []);

    return (
        <WelcomeMain>
            <WrapperScroll>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Update Budget</H3>
                        <>
                            <H6>Current Budget</H6>
                            <TextContainer bgColor='grey'>€{userData.weekly_budget}</TextContainer>
                            <H6 bmargin='5px'>Receipt Total (€)</H6>
                            <InputTxt bcolor='white' value={editedReceiptTotal} onChangeText={setEditedReceiptTotal}
                                      placeholder="Total Spent"/>
                            <H6>Time</H6>
                            <TextContainer bgColor='grey'>DATE</TextContainer>
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
            </WrapperScroll>
        </WelcomeMain>
    );
};

export default ReceiptBudgetScreen;