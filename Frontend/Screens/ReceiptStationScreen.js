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

const url = process.env.REACT_APP_BACKEND_URL

const ReceiptStationScreen = () => {
    const route = useRoute();
    const { receipt } = route.params;

    console.log("Receipt On Station Screen", receipt)

    const [editedFuelType, setEditedFuelType] = useState(receipt.fuel_type);
    const [editedFuelAmount, setEditedFuelAmount] = useState((receipt.volume || 0).toString());
    const [editedPricePerLitre, setEditedPricePerLitre] = useState((receipt.price_per_litre || 0).toString());
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleSave = async () => {
        try {

        } catch (error) {
            console.error('Error updating account:', error);
            setMessage("Error updating account");
        }
    };

    const handleSkip = async () => {
        navigation.navigate('ConfirmReceipt');
    }

    useEffect(() => {
        updateUserFromBackend();

    }, []);

    return (
        <WelcomeMain>
            <WrapperScroll>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Update Station Price</H3>
                        <>
                            <H6 bmargin='5px'>Fuel Type</H6>
                            <InputTxt placeholder="Fuel Type" value={editedFuelType} onChangeText={setEditedFuelType}/>
                            <H6 bmargin='5px'>Fuel Amount</H6>
                            <InputTxt placeholder="Fuel Amount" value={editedFuelAmount} onChangeText={setEditedFuelAmount}/>
                            <H6 bmargin='5px'>Price Per Litre</H6>
                            <InputTxt placeholder="Price Per Litre" value={editedPricePerLitre} onChangeText={setEditedPricePerLitre}/>

                        </>
                        <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Continue" onPress={handleSave}/>
                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black" text="Skip" onPress={handleSkip}/>
                    </LRButtonDiv>
                </Content>
            </WrapperScroll>
        </WelcomeMain>
    );
};

export default ReceiptStationScreen;