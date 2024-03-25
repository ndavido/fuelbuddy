import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../CombinedContext';
import * as Updates from 'expo-updates';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    Modal,
    RefreshControl
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
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

const CompleteProfileScreen = () => {
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedSurname, setEditedSurname] = useState('')
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();
    const [profilePicture, setProfilePicture] = useState(null);
    const selectProfilePicture = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel) {
                setProfilePicture(response);
            }
        });
    };
    const uploadProfilePicture = async () => {
        try {
            if (!profilePicture) {
                Alert.alert('Error', 'Please select a profile picture');
                return;
            }

            const formData = new FormData();
            formData.append('profile_picture', {
                uri: profilePicture.uri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });

            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const url = process.env.REACT_APP_BACKEND_URL;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${url}/upload_profile_picture`, formData, config);

            Alert.alert('Success', response.data.message);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
        }
    };

    

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }


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
                email: editedEmail,
            };

            const response = await axios.patch(`${url}/edit_account`, updatedUserData, config);

            if (response.data && response.data.message === 'Account updated successfully') {
                setUser({ ...updatedUserData });
                navigation.navigate('CompleteVehicle');
            } else {
                setMessage("Update unsuccessful");
            }
        } catch (error) {
            console.error('Error updating account:', error);
            setMessage("Error updating account");
        }
    };

    const handleSkip = async () => {
        navigation.navigate('CompleteVehicle');
    }

    useEffect(() => {
        updateUserFromBackend();

        setEditedFirstName(userData.first_name || '');
        setEditedSurname(userData.surname || '')
        setEditedPhoneNumber(userData.phone_number || '');
        setEditedEmail(userData.email || '');
    }, []);

    return (
        <WelcomeMain>
            <WrapperScroll>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Complete Registration</H3>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <TouchableOpacity onPress={selectProfilePicture}>
                                {profilePicture ? (
                                    <Image source={{ uri: profilePicture.uri }} style={{ width: 200, height: 200 }} />
                                ) : (
                                    <Text>Select Profile Picture</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <>
                            <H6 bmargin='5px'>Username</H6>
                            <TextContainer bgColor='grey'>@{userData.username}</TextContainer>
                            <H6 bmargin='5px'>Phone Number</H6>
                            <TextContainer bgColor='grey'>{userData.phone_number}</TextContainer>
                            <H6 bmargin='5px'>First Name</H6>
                            <InputTxt bcolor='white' value={editedFirstName} onChangeText={setEditedFirstName}
                                      placeholder="First Name"/>
                            <H6 bmargin='5px'>Last Name</H6>
                            <InputTxt bcolor='white' value={editedSurname} onChangeText={setEditedSurname}
                                      placeholder="Last Name"/>
                            <H6 bmargin='5px'>Email</H6>
                            <InputTxt bcolor='white' value={editedEmail} onChangeText={setEditedEmail}
                                      placeholder="Email"/>
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

export default CompleteProfileScreen;