import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, TextInput, RefreshControl, Image, Modal, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../../styles/mainLogo';
import {H3, H4, H5, H6} from "../../styles/text";
import {
    AccountContainer, BottomBar,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main,
    TextContainer,
    WelcomeMain, Wrapper,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton, CenterButton, CenterButtonContainer, SideButton} from "../../styles/buttons";
import {Logo} from "../../styles/images";
import {FontAwesome} from "@expo/vector-icons";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const ReceiptConfirmScreen = () => {
    const navigation = useNavigation();
    const {token} = useCombinedContext();
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState(null);
    const route = useRoute();
    const { image } = route.params;

    useEffect(() => {
        setImageUri(image)
    }, []);

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const sendImageToBackend = async () => {
        if (!imageUri) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result.replace(/^data:image\/\w+;base64,/, "");

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({image: base64data})
                };

                console.log('requestOptions:', requestOptions);
                const backendResponse = await fetch(`${url}/ocr_reciept_image_upload`, requestOptions);

                if (!backendResponse.ok) {
                    console.error('Error sending image to backend:', await backendResponse.text());
                    return;
                } else {
                    const responseData = await backendResponse.json();
                    console.log('Response:', responseData);
                    console.log('Extracted Info:', responseData.extracted_info);
                    setJsonResponse(responseData.extracted_info);
                    console.log('Image (Base64):', responseData.receipt_image_base64);
                    navigation.navigate('BudgetReceipt', {receipt: responseData.extracted_info, receiptImage: base64data})
                    setImageUri(null);
                }
            }
        } catch (error) {
            console.error('Error sending image to backend:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Main>
            <MainLogo/>
            <Wrapper>
                <Content style={{height: '70%', backgroundColor: "#F7F7F7"}}>
                    {isLoading && (
                        <Modal visible={isLoading} transparent={true}>
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large"/>
                            </View>
                        </Modal>
                    )}
                    <Container style={{height: '70%'}}>
                        <H3>Confirm Receipt</H3>
                        {imageUri && <Image source={{uri: imageUri}} style={{
                            flex: 1,
                            width: null,
                            height: null,
                            resizeMode: 'contain'
                        }}/>}

                    </Container>

                    <BottomBar>
                                <SideButton >
                                    <FontAwesome name="arrow-left" size={20} color="#b8bec2" onPress={() => navigation.goBack()}/>
                                </SideButton>

                            <CenterButtonContainer>
                                <CenterButton onPress={sendImageToBackend}>
                                    <FontAwesome name="check" size={25} color="white" />
                                </CenterButton>
                            </CenterButtonContainer>
                                <SideButton>
                                    <FontAwesome name="undo" size={20} color="#b8bec2" />
                                </SideButton>

                    </BottomBar>
                </Content>
            </Wrapper>
        </Main>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    }
});

export default ReceiptConfirmScreen;