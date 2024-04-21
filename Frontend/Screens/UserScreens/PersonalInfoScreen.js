import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, TextInput, RefreshControl, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../../styles/mainLogo';
import {H3, H4, H5, H6} from "../../styles/text";
import {
    AccountContainer,
    ButtonContainer,
    Container, Content,
    InputTxt,
    Main,
    TextContainer,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton} from "../../styles/buttons";
import {AccountImg} from "../../styles/images";
import {Camera} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "@gorhom/bottom-sheet";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const AccountScreen = () => {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedSurname, setEditedSurname] = useState('');
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [message, setMessage] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    const handleEditToggle = () => {
        setEditMode(!editMode);

        if (!editMode) {
            setEditedFirstName(userData.first_name);
            setEditedSurname(userData.surname);
            setEditedPhoneNumber(userData.phone_number);
            setEditedEmail(userData.email);
        }
    };

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const onRefresh = async () => {
        setRefreshing(true);

        await updateUserFromBackend();
        await fetchProfilePicture();

        setRefreshing(false);
    };

    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(`${url}/load_profile_picture`, {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(response.data)
            if (response.data.profile_picture) setProfilePicture(response.data.profile_picture);

        } catch (error) {
            console.error(error);
        }
    };

    const requestPermissions = async () => {
        const {cameraStatus} = await Camera.requestCameraPermissionsAsync();
        const {mediaLibraryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    };

    const openImageSheet = () => {
        bottomSheetRef.current.expand();
    };

    const closeImageSheet = () => {
        bottomSheetRef.current.close();
    };

    const pickImage = async () => {
        try {
            const hasPermissions = requestPermissions();
            if (!hasPermissions) {
                console.error('Permissions not granted');
            } else {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 4],
                    quality: 1,
                });

                if (!result.canceled) {
                    setLoading(true)
                    await setImageUri(result.assets[0].uri);
                    console.log('imageUri:', imageUri);
                    setLoading(false);
                    openImageSheet();
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const uploadProfilePicture = async () => {
        if (!imageUri) {
            return;
        }

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
                    body: JSON.stringify({profile_picture: base64data})
                };

                console.log('requestOptions:', requestOptions);
                const backendResponse = await fetch(`${url}/upload_profile_picture`, requestOptions);

                if (!backendResponse.ok) {
                    console.error('Error sending image to backend:', await backendResponse.text());
                    return;
                } else {
                    const responseData = await backendResponse.json();
                    silentRefresh();
                    updateUserFromBackend();
                    console.log('Response:', responseData);
                    setImageUri(null);

                }
            }
        } catch (error) {
            console.error('Error sending image to backend:', error);
        } finally {
            closeImageSheet();
        }
    };

    const handleSave = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            };

            const updatedUserData = {
                ...userData,
                first_name: editedFirstName,
                surname: editedSurname,
                phone_number: editedPhoneNumber,
                email: editedEmail
            };

            const response = await axios.patch(`${url}/edit_account`, updatedUserData, config);

            if (response.data && response.data.message === 'Account updated successfully') {
                setUser({...updatedUserData});
                setEditMode(false);

            } else {
                console.log("Update unsuccessful");
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
    };

    useEffect(() => {
        updateUserFromBackend();
        fetchProfilePicture();
    }, []);

    const silentRefresh = async () => {
        await updateUserFromBackend();
        await fetchProfilePicture();
    };

    return (
        <Main>
            <MainLogo bButton={true} PageTxt='Account'/>
            <WrapperScroll refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <AccountContainer style={{minHeight: 800}}>
                    <H3 tmargin='20px' bmargin='20px'>my Info</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>
                        <View style={{zIndex: 1, marginLeft: 'auto', flexDirection: "row"}}>
                            {editMode ? (<ButtonButton text={"Save"} color={"#6BFF91"} onPress={handleSave}/>) : null}
                            <ButtonButton color={editMode ? "red" : "#3891FA"} text={editMode ? "Cancel" : "Edit"}
                                          onPress={handleEditToggle}/>
                        </View>
                    </ButtonContainer>

                    {editMode ? (
                        <>
                            {profilePicture ? (
                                    <AccountImg uri={`data:image/png;base64,${profilePicture}`}/>
                                ) :
                                    <AccountImg/>
                            }
                            <H6 bmargin='5px'>Username</H6>
                            <TextContainer bcolor="#a1a1a1">@{userData.username}</TextContainer>
                            <H6 bmargin='5px'>Phone Number</H6>
                            <TextContainer bcolor="#a1a1a1">{userData.phone_number}</TextContainer>
                            <H6 bmargin='5px'>First Name</H6>
                            <InputTxt bcolor='white' value={editedFirstName} onChangeText={setEditedFirstName}
                                      placeholder="First Name"/>
                            <H6 bmargin='5px'>Surname</H6>
                            <InputTxt bcolor='white' value={editedSurname} onChangeText={setEditedSurname}
                                      placeholder="Surname"/>
                            <H6 bmargin='5px'>Email</H6>
                            <InputTxt bcolor='white' value={editedEmail} onChangeText={setEditedEmail}
                                      placeholder="Email"/>
                        </>
                    ) : (
                        <>
                            {profilePicture ? (
                                <TouchableOpacity onPress={pickImage}>
                                    <AccountImg uri={`data:image/png;base64,${profilePicture}`}/>
                                </TouchableOpacity>
                            ) : <TouchableOpacity onPress={pickImage}>
                                <AccountImg/>
                            </TouchableOpacity>}
                            <H6 bmargin='5px'>Username</H6>
                            <TextContainer bcolor="#FFFFFF">@{userData.username}</TextContainer>
                            <H6 bmargin='5px'>First Name</H6>
                            <TextContainer bcolor="#FFFFFF">{userData.first_name}</TextContainer>
                            <H6 bmargin='5px'>Surname</H6>
                            <TextContainer bcolor="#FFFFFF">{userData.surname}</TextContainer>

                            <H6 bmargin='5px'>Phone Number</H6>
                            <TextContainer bcolor="#FFFFFF">{userData.phone_number}</TextContainer>
                            <H6 bmargin='5px'>Email</H6>
                            <TextContainer bcolor="#FFFFFF">{userData.email}</TextContainer>
                            <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                            <H5 tmargin='40px' bmargin='5px'>Delete Account</H5>
                            <H6 style={{opacity: 0.6}} bmargin='20px' weight='400'>Not comfortable? Deleting your
                                account will
                                remove all data from our servers</H6>
                            <ButtonButton pos="single" iconColor="white" icon="cross" color="red"
                                          txtColor="black" txtMargin="15px" text="Delete Account"
                                          onPress={handleDelete}/>
                        </>
                    )}
                </AccountContainer>
                <BottomSheet snapPoints={['99%', '99%']}
                             enablePanDownToClose={true}
                             index={-1}
                             ref={bottomSheetRef}
                             backgroundStyle={{
                                 backgroundColor: '#FFFFFF',
                             }}>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Confirm Profile Picture</H3>
                        <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                            <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                <ButtonButton icon="check" color="#6BFF91" iconColor="#FFFFFF" text="Confirm"
                                              accessible={true}
                                              accessibilityLabel="Confirm PP Button"
                                              onPress={uploadProfilePicture} disabled={!imageUri}/>
                            </View>
                        </ButtonContainer>
                        <Content>
                            {imageUri && <Image source={{uri: imageUri}} style={{
                                flex: 1,
                                width: 300,
                                height: 300,
                                resizeMode: 'contain',
                                position: 'absolute',
                            }}/>}
                        </Content>
                    </Container>
                </BottomSheet>
            </WrapperScroll>
        </Main>
    );
};

export default AccountScreen;