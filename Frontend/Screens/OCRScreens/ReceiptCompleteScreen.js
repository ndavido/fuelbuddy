import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, RefreshControl} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../../styles/mainLogo';
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
import {Logo} from "../../styles/images";
import {FontAwesome5} from "@expo/vector-icons";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const ReceiptCompleteScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {receipt, receiptImage} = route.params;

    console.log("Receipt On Complete: ",receipt)
    console.log("Receipt Image On Complete: ",receiptImage)
    const {userData, setUser, updateUserFromBackend, token} = useCombinedContext();

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleFinish = async () => {
        setIsSaving(true);
        setSaveError('');

        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const receiptData = {
                receipt_image_base64: receiptImage,
                fuel_type: receipt.fuel_type,
                volume: receipt.volume,
                price_per_litre: receipt.price_per_litre,
                total: receipt.total
            };

            const response = await axios.post(`${url}/ocr_reciept_image_save`, receiptData, {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('Receipt saved:', response.data);
            navigation.navigate('OCR');

        } catch (error) {
            console.error('Error saving receipt:', error);
            setSaveError('Error saving receipt. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinishWithout = async () => {
        try {
            navigation.navigate('OCR');
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    useEffect(() => {
        updateUserFromBackend();
    }, []);

    return (
        <WelcomeMain>
            <Wrapper>
                <Content>
                    <Container>
                        <View style={{alignItems: 'center', marginTop: '40%'}}>
                            <FontAwesome5 name="check-circle" size={120} color="#6bff91"/>
                            {saveError &&  <H6 style={{ marginTop: 20,color: 'red' }}>{saveError}</H6>}
                        </View>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Finish & Save Receipt" onPress={handleFinish} disabled={isSaving}/>

                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black"  text="Finish Without" onPress={handleFinishWithout} disabled={isSaving}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default ReceiptCompleteScreen;