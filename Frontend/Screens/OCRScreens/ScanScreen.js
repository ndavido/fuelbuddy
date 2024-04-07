import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Modal, Image, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Camera, CameraType} from 'expo-camera';
import * as FileSystem from 'expo-file-system';

// Styling
import MainLogo from '../../styles/mainLogo';
import {
    AccountContainer, BottomBar, bottomBar,
    Container,
    Content,
    InputTxt,
    Main, ReceiptContainer,
    TextWrapper,
    Wrapper,
    WrapperScroll
} from '../../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H2, H3, H4, H5, H6} from "../../styles/text";
import {useCombinedContext} from "../../CombinedContext";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import {CenterButton, CenterButtonContainer, SideButton} from "../../styles/buttons";
import {FontAwesome} from "@expo/vector-icons";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL;

const ScanScreen = () => {
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();
    const [imageUri, setImageUri] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [cameraModalVisible, setCameraModalVisible] = useState(false);
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
            navigation.navigate('ReceiptConfirm', {image: result.assets[0].uri})
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
                navigation.navigate('ReceiptConfirm', {image: result.uri})
            }
        }
    };

    return (
        <Main>
            <MainLogo PageTxt="Receipt Scanner"/>
            <Wrapper>
                <Content style={{backgroundColor: "#F7F7F7"}}>
                    <Container style={{height: '100%'}}>
                        <H3>Past Receipts</H3>
                        <ReceiptContainer>

                        </ReceiptContainer>
                        <BottomBar>
                            {userData && userData.roles && userData.roles.includes("Developer") && (
                                <SideButton onPress={pickImage}>
                                    <FontAwesome name="image" size={25} color="#b8bec2"/>
                                </SideButton>
                            )}
                            <CenterButtonContainer>
                                <CenterButton onPress={() => setCameraModalVisible(true)}>
                                    <FontAwesome name="plus" size={25} color="white"/>
                                </CenterButton>
                            </CenterButtonContainer>
                            {userData && userData.roles && userData.roles.includes("Developer") && (
                                <SideButton>

                                </SideButton>
                            )}

                        </BottomBar>

                        {/*<BottomBar>*/}
                        {/*    {imageUri ? (<Button title="Retake Picture" onPress={() => setCameraModalVisible(true)}/>) :*/}
                        {/*    (<Button title="Take Picture" onPress={() => setCameraModalVisible(true)}/>)}*/}
                        {/*<Button title="Confirm Image" onPress={sendImageToBackend} disabled={!imageUri}/>*/}
                        {/*</BottomBar>*/}
                    </Container>
                </Content>
            </Wrapper>

            <Modal visible={cameraModalVisible} onRequestClose={() => setCameraModalVisible(false)}>
                <View style={styles.cameraContainer}>
                    <Camera
                        style={styles.camera}
                        type={type}
                        ref={cameraRef}
                        onCameraReady={() => console.log('Camera ready')}
                    >
                        <View style={styles.buttonContainer}>
                            <SideButton>

                            </SideButton>
                            <CenterButtonContainer>
                                <CenterButton onPress={takePicture}>
                                    <FontAwesome name="camera" size={25} color="white"/>
                                </CenterButton>
                            </CenterButtonContainer>
                            <SideButton onPress={() => setCameraModalVisible(false)}>
                                <FontAwesome name="times" size={25} color="#b8bec2"/>
                            </SideButton>

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
        bottom: 10,
        position: 'absolute',
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
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