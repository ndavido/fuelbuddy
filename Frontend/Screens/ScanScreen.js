import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Modal, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Camera, CameraType} from 'expo-camera';

import MainLogo from '../styles/mainLogo';
import {AccountContainer, Content, InputTxt, Main, TextWrapper, Wrapper} from '../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H3, H5, H6} from "../styles/text";

const apiKey = process.env.REACT_NATIVE_API_KEY;

const ScanScreen = () => {
    const [imageUri, setImageUri] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [cameraModalVisible, setCameraModalVisible] = useState(false);

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
        try {
            console.log('Uploading image:', imageUri);

        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Main>
            <MainLogo/>
            <Wrapper>
                <AccountContainer style={{minHeight: 800}}>
                    <Content>
                        {/*<Button title="Pick Image" onPress={pickImage}/>*/}
                        <Button title="Take Picture" onPress={() => setCameraModalVisible(true)}/>
                        <Button title="Confirm Image" onPress={sendImageToBackend} disabled={!imageUri}/>
                        {imageUri && <Image source={{uri: imageUri}} style={{width: 200, height: 200}}/>}
                    </Content>
                </AccountContainer>
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
});

export default ScanScreen;