import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Modal, Image, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Camera, CameraType} from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import MainLogo from '../styles/mainLogo';
import {AccountContainer, Content, InputTxt, Main, TextWrapper, Wrapper, WrapperScroll} from '../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H3, H5, H6} from "../styles/text";
import {useCombinedContext} from "../CombinedContext";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL;

const ScanScreen = () => {
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();
    const [imageUri, setImageUri] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [cameraModalVisible, setCameraModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState(null);

    const navigation = useNavigation();

    const cameraRef = useRef(null);

    const requestPermissions = async () => {
        const {cameraStatus} = await Camera.requestCameraPermissionsAsync();
        const {mediaLibraryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    };

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    useEffect(() => {
        const hasPermissions = requestPermissions();
        if (!hasPermissions) {
            console.error('Permissions not granted');
        }
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            console.log('imageUri:', result.assets[0].uri);
            setImageUri(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            let result = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                aspect: [4, 3],
                allowsEditing: true,
            });

            if (!result.cancelled) {
                setImageUri(result.uri);
                setCameraModalVisible(false);
            }
        }
    };

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
                    console.error('Error sending image to backend:', backendResponse);
                    return;
                } else {
                    const responseData = await backendResponse.json();
                    console.log('Response:', responseData);
                    console.log('Extracted Info:', responseData.extracted_info);
                    setJsonResponse(responseData.extracted_info);
                    setImageUri(null);
                    console.log('Image (Base64):', responseData.receipt_image_base64);
                    navigation.navigate('BudgetReceipt', {receipt: responseData.extracted_info})
                }
            }
        } catch (error) {
            console.error('Error sending image to backend:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearJson = async () => {
        setJsonResponse(null);
    };

    return (
        <Main>
            <MainLogo/>
            <WrapperScroll>
                <AccountContainer style={{minHeight: 800}}>
                    {isLoading && (
                        <Modal visible={isLoading} transparent={true}>
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large"/>
                            </View>
                        </Modal>
                    )}
                    <Content>
                        {imageUri ? (<Button title="Retake Picture" onPress={() => setCameraModalVisible(true)}/>) :
                            (<Button title="Take Picture" onPress={() => setCameraModalVisible(true)}/>)}
                        <Button title="Confirm Image" onPress={sendImageToBackend} disabled={!imageUri}/>
                        {userData.roles && userData.roles.includes("Developer") &&
                            <>
                                <H6 weight="400" style={{textAlign: 'center'}}>Developer Features</H6>
                                <Button title="Pick Image" onPress={pickImage}/>
                                <Button title="Clear JSON" onPress={clearJson} disabled={!jsonResponse} />
                                {jsonResponse && (<H5>JSON Response: {JSON.stringify(jsonResponse)}</H5>)}
                            </>}
                        {imageUri && <Image source={{uri: imageUri}} style={{
                            flex: 1,
                            width: null,
                            height: null,
                            resizeMode: 'contain'
                        }}/>}
                    </Content>
                </AccountContainer>
            </WrapperScroll>

            <Modal visible={cameraModalVisible} onRequestClose={() => setCameraModalVisible(false)}>
                <View style={styles.cameraContainer}>
                    <Camera
                        style={styles.camera}
                        type={type}
                        ref={cameraRef}
                        onCameraReady={() => console.log('Camera ready')}
                    >
                        <View style={styles.buttonContainer}>
                            <Button title="Take Picture" onPress={takePicture}/>
                            <Button title="Exit" onPress={() => setCameraModalVisible(false)}/>
                        </View>
                    </Camera>
                </View>
            </Modal>
        </Main>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    }
});

export default ScanScreen;